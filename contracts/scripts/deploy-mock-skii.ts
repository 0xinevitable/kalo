import { formatEther, parseEther } from 'ethers';
import { ethers } from 'hardhat';

import { StakedKII__factory } from '../typechain-types';

async function main() {
  const [deployer] = await ethers.getSigners();
  const StakedKII = (await ethers.getContractFactory(
    'StakedKII',
  )) as StakedKII__factory;
  const skii = await StakedKII.deploy();
  await skii.waitForDeployment();

  console.log('StakedKII (Mock)', await skii.getAddress());

  // Test staking and unstaking
  console.log('\nTesting staking and unstaking:');

  // Stake 100 ETH
  const estimation = await skii.estimateStakeOut(parseEther('100'));
  console.log('Estimation for staking 100 ETH:', formatEther(estimation));

  const stakeAmount = parseEther('100');
  await (await skii.stake({ value: stakeAmount })).wait();
  console.log('Staked 100 ETH');

  let balance = await skii.balanceOf(deployer.address);
  console.log('SKII balance after staking:', formatEther(balance));

  // Unstake 10 ETH worth of SKII
  const unstakeAmount = parseEther('9.85'); // 10 ETH * 0.985
  await (await skii.unstake(unstakeAmount)).wait();
  console.log('Unstaked SKII equivalent to 10 ETH');

  balance = await skii.balanceOf(deployer.address);
  console.log('SKII balance after unstaking:', formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
