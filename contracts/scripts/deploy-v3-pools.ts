import { TICK_SPACINGS, TickMath, nearestUsableTick } from '@uniswap/v3-sdk';
import axios from 'axios';
import { Contract, parseUnits } from 'ethers';
import hre, { ethers } from 'hardhat';
import JSBI from 'jsbi';

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
let FACTORY_ADDRESS = '0xd6C1958586b7A6d84be7AF977BA79cFe97483AB3';
let NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  '0xaA35Cc7bda4Df3D7c001cf5aE35EbA5aEdD2e439';

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

function encodePriceSqrt(
  reserve1: number,
  reserve0: number,
  decimals1: number,
  decimals0: number,
): bigint {
  // Adjust for decimals
  const adjustedReserve1 = BigInt(
    Math.floor(reserve1 * 10 ** (18 - decimals1)),
  );
  const adjustedReserve0 = BigInt(
    Math.floor(reserve0 * 10 ** (18 - decimals0)),
  );

  const numerator = adjustedReserve1 * (BigInt(1) << BigInt(192));
  const denominator = adjustedReserve0;

  const ratioX192 = numerator / denominator;

  // Calculate square root using BigInt
  let y = ratioX192;
  let z = (y + BigInt(1)) >> BigInt(1);
  while (z < y) {
    y = z;
    z = (ratioX192 / z + z) >> BigInt(1);
  }

  return y;
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
  try {
    await (await factoryContract.createPool(token0, token1, fee)).wait();
  } catch (err) {
    console.log(err);
    // throw new Error('Error creating pool');
  }
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

  // Calculate the desired price based on the provided amounts
  const desiredPrice = Number(amount1) / Number(amount0);

  const desiredTick = TickMath.getTickAtSqrtRatio(
    JSBI.BigInt(parseUnits(Math.sqrt(desiredPrice).toString(), 18).toString()),
  );

  const tickSpacing = TICK_SPACINGS[fee as keyof typeof TICK_SPACINGS];
  const currentTick = TickMath.getTickAtSqrtRatio(
    JSBI.BigInt(sqrtPriceX96.toString()),
  );
  const tickLower = nearestUsableTick(
    currentTick - tickSpacing * 10,
    tickSpacing,
  );
  const tickUpper = nearestUsableTick(
    currentTick + tickSpacing * 10,
    tickSpacing,
  );

  const mintParams = {
    token0: tokenA,
    token1: tokenB,
    fee: fee,
    tickLower: tickLower,
    tickUpper: tickUpper,
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
  // const btcEthPrice = exchangeRates.BTC / exchangeRates.ETH;
  // console.log({ btcEthPrice });
  const btcEthSqrtPriceX96 = encodePriceSqrt(
    exchangeRates.BTC,
    exchangeRates.ETH,
    8,
    18,
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
    // price: btcEthPrice,
    price: 0,
    fee: 500,
  });

  // Create USDT-USDC pool
  const usdtUsdcPrice = exchangeRates.USDT / exchangeRates.USDC;
  console.log({ usdtUsdcPrice });
  const usdtUsdcSqrtPriceX96 = encodePriceSqrt(
    exchangeRates.USDT,
    exchangeRates.USDC,
    6,
    6,
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

  const btcAmount = ethers.parseUnits('10', 8); // 10 BTC (8 decimals)

  // 10 BTC에 해당하는 ETH 양 계산
  const ethAmount = ethers.parseUnits(
    ((10 * exchangeRates.BTC) / exchangeRates.ETH).toFixed(18),
    18,
  );

  console.log('BTC amount:', ethers.formatUnits(btcAmount, 8));
  console.log('ETH amount:', ethers.formatUnits(ethAmount, 18));

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

// https://blog.uniswap.org/uniswap-v3-math-primer#how-do-i-calculate-the-current-exchange-rate
function GetPrice(PoolInfo: {
  SqrtX96: number;
  Decimal0: number;
  Decimal1: number;
}) {
  let sqrtPriceX96 = PoolInfo.SqrtX96;
  let Decimal0 = PoolInfo.Decimal0;
  let Decimal1 = PoolInfo.Decimal1;

  const buyOneOfToken0 = parseFloat(
    ((sqrtPriceX96 / 2 ** 96) ** 2 / (10 ** Decimal1 / 10 ** Decimal0)).toFixed(
      Decimal1,
    ),
  );

  const buyOneOfToken1 = parseFloat((1 / buyOneOfToken0).toFixed(Decimal0));
  console.log(
    'price of token0 in value of token1 : ' + buyOneOfToken0.toString(),
  );
  console.log(
    'price of token1 in value of token0 : ' + buyOneOfToken1.toString(),
  );
  console.log('');
  // Convert to wei
  const buyOneOfToken0Wei = Math.floor(
    buyOneOfToken0 * 10 ** Decimal1,
  ).toLocaleString('fullwide', { useGrouping: false });
  const buyOneOfToken1Wei = Math.floor(
    buyOneOfToken1 * 10 ** Decimal0,
  ).toLocaleString('fullwide', { useGrouping: false });
  console.log(
    'price of token0 in value of token1 in lowest decimal : ' +
      buyOneOfToken0Wei,
  );
  console.log(
    'price of token1 in value of token1 in lowest decimal : ' +
      buyOneOfToken1Wei,
  );
  console.log('');
}

// fetch exchange rates for each pool
const getPrices = async () => {
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
    // console.log('BTC-ETH Pool Price:');

    const [tokenA, tokenB] =
      BTC_ADDRESS.toLowerCase() < ETH_ADDRESS.toLowerCase()
        ? [BTC_ADDRESS, ETH_ADDRESS]
        : [ETH_ADDRESS, BTC_ADDRESS];
    GetPrice({
      SqrtX96: parseInt(sqrtPriceX96.toString()),
      Decimal0: tokenA === BTC_ADDRESS ? 8 : 18,
      Decimal1: tokenB === ETH_ADDRESS ? 18 : 8,
    });

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
    // const price = sqrtPriceX96 ** 2n;
    // console.log('USDT-USDC Pool Price:', price);

    GetPrice({
      SqrtX96: parseInt(sqrtPriceX96.toString()),
      Decimal0: 6,
      Decimal1: 6,
    });

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
// getPrices().catch(console.error);
