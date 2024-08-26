import axios from 'axios';
import { BigNumber, Contract, ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  price: number;
}

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

function calculateLiquidityAmount(price: number, decimals: number): BigNumber {
  // Base liquidity in USD
  const baseLiquidityUSD = 10_000_000; // $10 million
  const tokenAmount = baseLiquidityUSD / price;
  return ethers.utils.parseUnits(tokenAmount.toFixed(decimals), decimals);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const exchangeRates = await getExchangeRates();
  console.log('Fetched exchange rates:', exchangeRates);

  // Deploy mock tokens
  const MockERC20: ContractFactory =
    await ethers.getContractFactory('MockERC20');
  const tokens: TokenInfo[] = [
    { symbol: 'BTC', address: '', decimals: 8, price: exchangeRates.BTC },
    { symbol: 'ETH', address: '', decimals: 18, price: exchangeRates.ETH },
    { symbol: 'USDT', address: '', decimals: 6, price: exchangeRates.USDT },
    { symbol: 'USDC', address: '', decimals: 6, price: exchangeRates.USDC },
  ];

  for (const token of tokens) {
    const mockToken: Contract = await MockERC20.deploy(
      `Mock ${token.symbol}`,
      `m${token.symbol}`,
      token.decimals,
    );
    await mockToken.deployed();
    token.address = mockToken.address;
    console.log(`Mock ${token.symbol} deployed to:`, mockToken.address);
  }

  // Deploy UniswapV2Factory
  const UniswapV2Factory: ContractFactory =
    await ethers.getContractFactory('UniswapV2Factory');
  const uniswapFactory: Contract = await UniswapV2Factory.deploy(
    deployer.address,
  );
  await uniswapFactory.deployed();
  console.log('UniswapV2Factory deployed to:', uniswapFactory.address);

  // Deploy WETH
  const WETH: ContractFactory = await ethers.getContractFactory('WETH9');
  const weth: Contract = await WETH.deploy();
  await weth.deployed();
  console.log('WETH deployed to:', weth.address);

  // Deploy UniswapV2Router02
  const UniswapV2Router02: ContractFactory =
    await ethers.getContractFactory('UniswapV2Router02');
  const uniswapRouter: Contract = await UniswapV2Router02.deploy(
    uniswapFactory.address,
    weth.address,
  );
  await uniswapRouter.deployed();
  console.log('UniswapV2Router02 deployed to:', uniswapRouter.address);

  // Create pairs and add liquidity
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      await uniswapFactory.createPair(tokens[i].address, tokens[j].address);
      console.log(`Created pair: ${tokens[i].symbol} - ${tokens[j].symbol}`);

      const token1Amount = calculateLiquidityAmount(
        tokens[i].price,
        tokens[i].decimals,
      );
      const token2Amount = calculateLiquidityAmount(
        tokens[j].price,
        tokens[j].decimals,
      );

      const token1: Contract = await ethers.getContractAt(
        'MockERC20',
        tokens[i].address,
      );
      const token2: Contract = await ethers.getContractAt(
        'MockERC20',
        tokens[j].address,
      );

      // Mint tokens to the deployer
      await token1.mint(deployer.address, token1Amount);
      await token2.mint(deployer.address, token2Amount);

      // Approve router to spend tokens
      await token1.approve(uniswapRouter.address, token1Amount);
      await token2.approve(uniswapRouter.address, token2Amount);

      // Add liquidity
      await uniswapRouter.addLiquidity(
        tokens[i].address,
        tokens[j].address,
        token1Amount,
        token2Amount,
        0,
        0,
        deployer.address,
        Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
      );

      console.log(
        `Added liquidity for ${tokens[i].symbol} - ${tokens[j].symbol} pair`,
      );
      console.log(
        `  ${tokens[i].symbol}: ${ethers.utils.formatUnits(token1Amount, tokens[i].decimals)}`,
      );
      console.log(
        `  ${tokens[j].symbol}: ${ethers.utils.formatUnits(token2Amount, tokens[j].decimals)}`,
      );
    }
  }

  console.log('Deployment and liquidity addition completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
