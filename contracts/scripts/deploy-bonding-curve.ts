import { EventLog } from 'ethers';
import { ethers } from 'hardhat';

import {
  ExponentialBondingCurveERC20__factory,
  ExponentialBondingCurveFactory__factory,
} from '../typechain-types';
import { BondingCurveCreatedEvent } from '../typechain-types/contracts/ExponentialBondingCurveFactory';

async function main() {
  const [deployer, user1, user2, user3, user4] = await ethers.getSigners();

  console.log(
    'Deploying contracts with the account:',
    await deployer.getAddress(),
  );

  // Deploy the ExponentialBondingCurveFactory
  const Factory = new ExponentialBondingCurveFactory__factory(deployer);
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  console.log(
    'ExponentialBondingCurveFactory deployed to:',
    await factory.getAddress(),
  );

  // Create a new token using the factory
  const tokenName = 'My Bonding Curve Token';
  const tokenSymbol = 'MBCT';
  const feePercentage = 100; // 1%
  const feeCollector = await deployer.getAddress();

  const createTx = await factory.createBondingCurve(
    tokenName,
    tokenSymbol,
    feePercentage,
    feeCollector,
  );
  const receipt = await createTx.wait();

  // Get the new token address from the event logs
  const event = receipt?.logs.find(
    (log) => (log as EventLog)?.fragment?.name === 'BondingCurveCreated',
  ) as any as BondingCurveCreatedEvent.Log;

  if (!event) throw new Error('BondingCurveCreated event not found');
  const tokenAddress = event.args.bondingCurveAddress;

  console.log('New token created at:', tokenAddress);

  // Connect to the new token contract
  const token = ExponentialBondingCurveERC20__factory.connect(
    tokenAddress,
    deployer,
  );

  const logCurrentPrice = async () => {
    const supply = await token.totalSupply();
    const currentPrice = await token.currentPrice(supply);
    console.log(
      'Current token price:',
      ethers.formatUnits(currentPrice, 18),
      'ETH',
    );
    console.log('Total supply:', ethers.formatUnits(supply, 18));
    console.log('==========================');
  };

  const buyTokens = async (user: any, amount: string) => {
    const buyAmount = ethers.parseEther(amount);
    await token.connect(user).buy({ value: buyAmount });
    const balance = await token.balanceOf(user.address);
    console.log(`${user.address} bought tokens with ${amount} ETH`);
    console.log(
      `${user.address} token balance:`,
      ethers.formatUnits(balance, 18),
    );
    await logCurrentPrice();
  };

  const sellTokens = async (user: any, percentage: number) => {
    const balance = await token.balanceOf(user.address);
    const sellAmount = (balance * BigInt(percentage)) / 100n;
    await token.connect(user).sell(sellAmount);
    const newBalance = await token.balanceOf(user.address);
    console.log(`${user.address} sold ${percentage}% of their tokens`);
    console.log(
      `${user.address} new token balance:`,
      ethers.formatUnits(newBalance, 18),
    );
    await logCurrentPrice();
  };

  // Perform trades
  console.log('Performing trades...');

  await logCurrentPrice();

  // Initial buys
  await buyTokens(user1, '1');
  await buyTokens(user2, '0.5');

  // Large buy
  await buyTokens(user3, '10');

  // Small buy
  await buyTokens(user4, '0.01');

  // Sells
  await sellTokens(user1, 50);
  await sellTokens(user3, 75);

  // Buy after sell
  await buyTokens(user2, '2');

  // Extreme cases
  // Very large buy
  await buyTokens(user4, '100');

  // Sell all
  await sellTokens(user4, 100);

  // Multiple transactions
  for (let i = 0; i < 5; i++) {
    await buyTokens(user1, '0.1');
    await sellTokens(user2, 10);
  }

  for (let i = 0; i < 100; i++) {
    await buyTokens(user2, '1');
  }

  console.log('Deployment and trades completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
