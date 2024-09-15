import hre, { ethers } from 'hardhat';

export const deployMulticall = async () => {
  const multicall = await (
    await ethers.getContractFactory('Multicall2')
  ).deploy();
  console.log('Multicall2', await multicall.getAddress());

  return { multicall };
};

if (require.main === module) {
  deployMulticall().catch(console.error);
}
