import { EventLog } from 'ethers';
import { ethers } from 'hardhat';

import {
  ExponentialBondingCurveERC20__factory,
  ExponentialBondingCurveFactory__factory,
} from '../typechain-types';
import { BondingCurveCreatedEvent } from '../typechain-types/contracts/ExponentialBondingCurveFactory';

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();

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
    // Print current token price
    const supply = await token.totalSupply();
    const currentPrice = await token.currentPrice(supply);
    console.log(
      'Current token price:',
      ethers.formatUnits(currentPrice, 18),
      'ETH',
    );
    console.log('==========================');
  };

  // Perform some trades
  console.log('Performing trades...');

  let user1Balance = 0n;
  {
    await logCurrentPrice();

    // User1 buys tokens
    const buyAmount1 = ethers.parseEther('1'); // Buy with 1 ETH
    await token.connect(user1).buy({ value: buyAmount1 });
    console.log('User1 bought tokens with 1 ETH');

    // Check User1 balance
    user1Balance = await token.balanceOf(user1.address);
    console.log('User1 token balance:', ethers.formatUnits(user1Balance, 18));

    await logCurrentPrice();
  }

  {
    await logCurrentPrice();

    // User2 buys tokens
    const buyAmount2 = ethers.parseEther('0.5'); // Buy with 0.5 ETH
    await token.connect(user2).buy({ value: buyAmount2 });
    console.log('User2 bought tokens with 0.5 ETH');

    // Check User2 balance
    const user2Balance = await token.balanceOf(user2.address);
    console.log('User2 token balance:', ethers.formatUnits(user2Balance, 18));

    await logCurrentPrice();
  }

  {
    await logCurrentPrice();

    // User1 sells half of their tokens
    const sellAmount = user1Balance / 2n;
    await token.connect(user1).sell(sellAmount);
    console.log('User1 sold half of their tokens');

    // Check User1 new balance
    const user1NewBalance = await token.balanceOf(user1.address);
    console.log(
      'User1 new token balance:',
      ethers.formatUnits(user1NewBalance, 18),
    );

    await logCurrentPrice();
  }

  console.log('Deployment and trades completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
