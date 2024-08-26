import axios from 'axios';
import { formatUnits, parseUnits } from 'ethers';
import { ethers } from 'hardhat';

import {
  MockERC20__factory,
  UniswapV2Factory__factory,
  UniswapV2Pair__factory,
  UniswapV2Router02__factory,
  WETH9__factory,
} from '../typechain-types';

type TokenInfo = {
  symbol: string;
  address: string;
  decimals: number;
  price: number;
};

type PairInfo = {
  name: string;
  token0: string;
  token1: string;
};

async function getExchangeRates(): Promise<{ [key: string]: number }> {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd',
  );
  return {
    BTC: response.data.bitcoin.usd,
    ETH: response.data.ethereum.usd,
    USDT: response.data.tether.usd,
    USDC: response.data['usd-coin'].usd,
  };
}

function calculateLiquidityAmount(price: number, decimals: number): bigint {
  // Base liquidity in USD
  const baseLiquidityUSD = 10_000_000; // $10 million
  const tokenAmount = baseLiquidityUSD / price;
  return parseUnits(tokenAmount.toFixed(decimals), decimals);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying contracts with the account:',
    await deployer.getAddress(),
  );

  const exchangeRates = await getExchangeRates();
  console.log('Fetched exchange rates:', exchangeRates);

  // Deploy mock tokens
  const tokens: TokenInfo[] = [
    { symbol: 'BTC', address: '', decimals: 8, price: exchangeRates.BTC },
    { symbol: 'ETH', address: '', decimals: 18, price: exchangeRates.ETH },
    { symbol: 'USDT', address: '', decimals: 6, price: exchangeRates.USDT },
    { symbol: 'USDC', address: '', decimals: 6, price: exchangeRates.USDC },
  ];

  for (const token of tokens) {
    const mockToken = await new MockERC20__factory(deployer).deploy(
      token.symbol,
      token.symbol,
      token.decimals,
      await deployer.getAddress(),
    );
    await mockToken.waitForDeployment();
    token.address = await mockToken.getAddress();
    console.log(`Mock ${token.symbol} deployed to:`, token.address);
  }

  // Deploy UniswapV2Factory
  const uniswapFactory = await new UniswapV2Factory__factory(deployer).deploy(
    await deployer.getAddress(),
  );
  await uniswapFactory.waitForDeployment();
  console.log(
    'UniswapV2Factory deployed to:',
    await uniswapFactory.getAddress(),
  );

  // Deploy WETH
  const weth = await new WETH9__factory(deployer).deploy();
  await weth.waitForDeployment();
  console.log('WETH deployed to:', await weth.getAddress());

  // Deploy UniswapV2Router02
  const uniswapRouter = await new UniswapV2Router02__factory(deployer).deploy(
    await uniswapFactory.getAddress(),
    await weth.getAddress(),
  );
  await uniswapRouter.waitForDeployment();
  console.log(
    'UniswapV2Router02 deployed to:',
    await uniswapRouter.getAddress(),
  );

  // Create pairs and add liquidity
  const pairInfoMap: { [pairAddress: string]: PairInfo } = {};

  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      await (
        await uniswapFactory.createPair(tokens[i].address, tokens[j].address)
      ).wait();
      console.log(`Created pair: ${tokens[i].symbol} - ${tokens[j].symbol}`);

      const pairAddress = await uniswapFactory.getPair(
        tokens[i].address,
        tokens[j].address,
      );
      const pair = UniswapV2Pair__factory.connect(pairAddress, deployer);
      const pairName = await pair.name();
      const token0Address = await pair.token0();
      const token1Address = await pair.token1();

      pairInfoMap[pairAddress] = {
        name: pairName,
        token0: token0Address,
        token1: token1Address,
      };

      const token1Amount = calculateLiquidityAmount(
        tokens[i].price,
        tokens[i].decimals,
      );
      const token2Amount = calculateLiquidityAmount(
        tokens[j].price,
        tokens[j].decimals,
      );

      const token1 = MockERC20__factory.connect(tokens[i].address, deployer);
      const token2 = MockERC20__factory.connect(tokens[j].address, deployer);

      // Mint tokens to the deployer
      await token1.mint(await deployer.getAddress(), token1Amount);
      await token2.mint(await deployer.getAddress(), token2Amount);

      // Approve router to spend tokens
      await token1.approve(await uniswapRouter.getAddress(), token1Amount);
      await token2.approve(await uniswapRouter.getAddress(), token2Amount);

      // Add liquidity
      await uniswapRouter.addLiquidity(
        tokens[i].address,
        tokens[j].address,
        token1Amount,
        token2Amount,
        0n,
        0n,
        await deployer.getAddress(),
        BigInt(Math.floor(Date.now() / 1000) + 60 * 10), // 10 minutes from now
      );

      console.log(
        `Added liquidity for ${tokens[i].symbol} - ${tokens[j].symbol} pair`,
      );
      console.log(
        `  ${tokens[i].symbol}: ${formatUnits(token1Amount, tokens[i].decimals)}`,
      );
      console.log(
        `  ${tokens[j].symbol}: ${formatUnits(token2Amount, tokens[j].decimals)}`,
      );
    }
  }

  console.log('Deployment and liquidity addition completed successfully!');
  console.log(JSON.stringify(pairInfoMap));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
