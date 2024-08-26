import { ethers } from 'hardhat';

import { UniswapV2CalHash__factory } from '../typechain-types';

const main = async () => {
  const [deployer] = await ethers.getSigners();
  const FactoryFactory = new UniswapV2CalHash__factory(deployer);
  const factory = await (await FactoryFactory.deploy()).waitForDeployment();
  const initHash = await factory.getInitHash();
  console.log({ initHash });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
