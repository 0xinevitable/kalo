import axios from 'axios';
import { Contract, parseUnits } from 'ethers';
import hre, { ethers } from 'hardhat';

import {
  INonfungiblePositionManager,
  INonfungiblePositionManager__factory,
  IUniswapV3Factory,
  IUniswapV3Factory__factory,
  IUniswapV3Pool,
  MockERC20__factory,
  UniswapV3Pool__factory,
} from '../typechain-types';
import { deployTokens } from './deploy-tokens';
import { deployUniswapV3 } from './deploy-v3';

// Uniswap V3 addresses
let FACTORY_ADDRESS = '0xFf75ba159ab763a467638F95fC7447523222BB01';
let NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  '0x060ac14b8CAE7059D6dD713992c6E637371ecaF0';

// Token addresses
let BTC_ADDRESS = '0x0b65426e7595758Fc6cc64F926e56C8f5382E778';
let ETH_ADDRESS = '0xdc0234f76B29b3920fD55bB4322676678FEED5a0';
let USDT_ADDRESS = '0xf506817d2db2FE531b7Ad2B3DFB3173665C4959C';
let USDC_ADDRESS = '0xc68326408D812507D34eF4b1583cAe2F62953afE';

type PoolInfo = {
  name: string;
  address: string;
  price: number;
  fee: number;
};

function encodePriceSqrt(reserve1: number, reserve0: number): bigint {
  const numerator = BigInt(Math.floor(reserve1 * 1e18));
  const denominator = BigInt(Math.floor(reserve0 * 1e18));
  const ratioX192 = (numerator * (BigInt(1) << BigInt(192))) / denominator;
  return BigInt(Math.floor(Math.sqrt(Number(ratioX192))));
}

async function getExchangeRates(): Promise<{ [key: string]: number }> {
  // const response = await axios.get(
  //   'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd',
  // );
  // const prices = {
  //   BTC: response.data.bitcoin.usd,
  //   ETH: response.data.ethereum.usd,
  //   USDT: response.data.tether.usd,
  //   USDC: response.data['usd-coin'].usd,
  // };
  // console.log(prices);
  // return prices;
  return { BTC: 59841, ETH: 2409.79, USDT: 1, USDC: 1 };
}

async function createPool(
  factoryContract: IUniswapV3Factory,
  token0: string,
  token1: string,
  fee: number,
  sqrtPriceX96: bigint,
): Promise<string> {
  // try {
  //   await (await factoryContract.createPool(token0, token1, fee)).wait();
  // } catch (err) {
  //   console.log(err);
  //   // throw new Error('Error creating pool');
  // }
  console.log({ token0, token1, fee });
  const poolAddress = await factoryContract.getPool(token0, token1, fee);
  console.log(`Pool created: ${poolAddress}`);
  return poolAddress;
}

async function addLiquidity(
  positionManagerContract: INonfungiblePositionManager,
  token0: string,
  token1: string,
  fee: number,
  amount0Desired: bigint,
  amount1Desired: bigint,
  sqrtPriceX96: bigint,
) {
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  // Ensure token0 < token1
  const [tokenA, tokenB] =
    token0.toLowerCase() < token1.toLowerCase()
      ? [token0, token1]
      : [token1, token0];
  const [amount0, amount1] =
    token0.toLowerCase() < token1.toLowerCase()
      ? [amount0Desired, amount1Desired]
      : [amount1Desired, amount0Desired];

  const mintParams = {
    token0: tokenA,
    token1: tokenB,
    fee: fee,
    tickLower: -887220, // Represents a price range of ±10%
    tickUpper: 887220,
    amount0Desired: amount0,
    amount1Desired: amount1,
    amount0Min: 0,
    amount1Min: 0,
    recipient: await (await ethers.provider.getSigner()).getAddress(),
    deadline: deadline,
  };

  console.log('Mint params:', mintParams);

  {
    try {
      await (
        await positionManagerContract.createAndInitializePoolIfNecessary(
          tokenA,
          tokenB,
          fee,
          sqrtPriceX96,
        )
      ).wait();
    } catch (err) {
      console.log(err);
    }
  }

  try {
    const tx = await positionManagerContract.mint(mintParams);
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt?.hash);
    console.log(`Liquidity added for ${tokenA}-${tokenB} pool`);
  } catch (error: any) {
    console.error('Error in addLiquidity:', error);
    if (error.reason) {
      console.error('Error reason:', error.reason);
    }
    if (error.data) {
      console.error('Error data:', error.data);
    }
    throw error;
  }
}

async function main() {
  const network = hre.network.name as 'kii' | 'hardhat';
  if (network === 'hardhat') {
    const v3 = await deployUniswapV3();
    FACTORY_ADDRESS = await v3.factory.getAddress();
    NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
      await v3.nfPositionManager.getAddress();

    const tokens = await deployTokens();
    BTC_ADDRESS =
      tokens.find((t) => t.symbol === 'BTC')?.address || BTC_ADDRESS;
    ETH_ADDRESS =
      tokens.find((t) => t.symbol === 'ETH')?.address || ETH_ADDRESS;
    USDT_ADDRESS =
      tokens.find((t) => t.symbol === 'USDT')?.address || USDT_ADDRESS;
    USDC_ADDRESS =
      tokens.find((t) => t.symbol === 'USDC')?.address || USDC_ADDRESS;
  }

  const [deployer] = await ethers.getSigners();
  console.log('Creating pools with the account:', await deployer.getAddress());

  const exchangeRates = await getExchangeRates();
  console.log('Fetched exchange rates:', exchangeRates);

  const factory = IUniswapV3Factory__factory.connect(FACTORY_ADDRESS, deployer);
  const positionManager = INonfungiblePositionManager__factory.connect(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
    deployer,
  );

  const poolInfo: PoolInfo[] = [];

  // Create BTC-ETH pool
  const btcEthPrice = exchangeRates.BTC / exchangeRates.ETH;
  console.log({ btcEthPrice });
  const btcEthSqrtPriceX96 = encodePriceSqrt(
    exchangeRates.BTC,
    exchangeRates.ETH,
  );
  const btcEthPoolAddress = await createPool(
    factory,
    BTC_ADDRESS,
    ETH_ADDRESS,
    500,
    btcEthSqrtPriceX96,
  );
  poolInfo.push({
    name: 'BTC-ETH',
    address: btcEthPoolAddress,
    price: btcEthPrice,
    fee: 500,
  });

  // Create USDT-USDC pool
  const usdtUsdcPrice = exchangeRates.USDT / exchangeRates.USDC;
  console.log({ usdtUsdcPrice });
  const usdtUsdcSqrtPriceX96 = encodePriceSqrt(
    exchangeRates.USDT,
    exchangeRates.USDC,
  );
  const usdtUsdcPoolAddress = await createPool(
    factory,
    USDT_ADDRESS,
    USDC_ADDRESS,
    500,
    usdtUsdcSqrtPriceX96,
  );
  poolInfo.push({
    name: 'USDT-USDC',
    address: usdtUsdcPoolAddress,
    price: usdtUsdcPrice,
    fee: 500,
  });

  // Add liquidity to BTC-ETH pool
  const btcToken = MockERC20__factory.connect(BTC_ADDRESS, deployer);
  const ethToken = MockERC20__factory.connect(ETH_ADDRESS, deployer);
  const btcAmount = ethers.parseUnits('10', 8); // 10 BTC
  const ethAmount = // use ratio of BTC and ETH to determine amount of ETH to add
    BigInt((10 / btcEthPrice) * 10 ** 18);
  await (await btcToken.mint(await deployer.getAddress(), btcAmount)).wait();
  await (await ethToken.mint(await deployer.getAddress(), ethAmount)).wait();
  await (
    await btcToken.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, btcAmount)
  ).wait();
  await (
    await ethToken.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, ethAmount)
  ).wait();
  console.log({ btcAmount, ethAmount, btcEthSqrtPriceX96 });
  await addLiquidity(
    positionManager,
    BTC_ADDRESS,
    ETH_ADDRESS,
    500,
    btcAmount,
    ethAmount,
    btcEthSqrtPriceX96,
  );

  // Add liquidity to USDT-USDC pool
  const usdtToken = MockERC20__factory.connect(USDT_ADDRESS, deployer);
  const usdcToken = MockERC20__factory.connect(USDC_ADDRESS, deployer);
  const usdtAmount = ethers.parseUnits('1000000', 6); // 1 million USDT
  const usdcAmount = ethers.parseUnits('1000000', 6); // 1 million USDC
  await (await usdtToken.mint(await deployer.getAddress(), usdtAmount)).wait();
  await (await usdcToken.mint(await deployer.getAddress(), usdcAmount)).wait();
  await (
    await usdtToken.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, usdtAmount)
  ).wait();
  await (
    await usdcToken.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, usdcAmount)
  ).wait();
  console.log({ usdtAmount, usdcAmount, usdtUsdcSqrtPriceX96 });
  await addLiquidity(
    positionManager,
    USDT_ADDRESS,
    USDC_ADDRESS,
    500,
    usdtAmount,
    usdcAmount,
    usdtUsdcSqrtPriceX96,
  );

  console.log('Pool creation and liquidity addition completed successfully!');
  console.log('\nCreated Pools:');
  console.table(poolInfo);
}

// fetch exchange rates for each pool
const getPrices = async () => {
  // only kii network
  const network = hre.network.name as 'kii' | 'hardhat';
  if (network !== 'kii') {
    throw new Error('This script is only for the kii network');
  }
  // const BTC_ETH = '0xC8716Cfa59c6EB3A038815A6334EE046C3e9Fd9E';
  // const USDT_USDC = '0x4BB2fc3eC7d661912fb0639e3b47Dd1EA004BCCc';

  const factory = IUniswapV3Factory__factory.connect(
    FACTORY_ADDRESS,
    ethers.provider,
  );
  const btcEthPool = await factory.getPool(BTC_ADDRESS, ETH_ADDRESS, 500);
  const usdtUsdcPool = await factory.getPool(USDT_ADDRESS, USDC_ADDRESS, 500);
  const btcEthPoolContract = (
    await hre.ethers.getContractFactory('UniswapV3Pool')
  ).attach(btcEthPool) as IUniswapV3Pool;
  const usdtUsdcPoolContract = (
    await hre.ethers.getContractFactory('UniswapV3Pool')
  ).attach(usdtUsdcPool) as IUniswapV3Pool;

  // check addrs match constants
  console.log('BTC-ETH Pool:', btcEthPool);
  console.log('USDT-USDC Pool:', usdtUsdcPool);

  // btc
  {
    const slot0 = await btcEthPoolContract.slot0();
    const sqrtPriceX96 = slot0.sqrtPriceX96;
    const price = sqrtPriceX96 ** 2n;
    console.log('BTC-ETH Pool Price:', price);

    // reserves
    const btc = MockERC20__factory.connect(BTC_ADDRESS, ethers.provider);
    const eth = MockERC20__factory.connect(ETH_ADDRESS, ethers.provider);
    console.log('BTC Reserve:', (await btc.balanceOf(btcEthPool)).toString());
    console.log('ETH Reserve:', (await eth.balanceOf(btcEthPool)).toString());
  }

  // usdt
  {
    const slot0 = await usdtUsdcPoolContract.slot0();
    const sqrtPriceX96 = slot0.sqrtPriceX96;
    const price = sqrtPriceX96 ** 2n;
    console.log('USDT-USDC Pool Price:', price);

    const USDT = MockERC20__factory.connect(USDT_ADDRESS, ethers.provider);
    const USDC = MockERC20__factory.connect(USDC_ADDRESS, ethers.provider);
    console.log(
      'USDT Reserve:',
      (await USDT.balanceOf(usdtUsdcPool)).toString(),
    );
    console.log(
      'USDC Reserve:',
      (await USDC.balanceOf(usdtUsdcPool)).toString(),
    );
  }
};

main()
  .then(async () => {
    await getPrices();
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
