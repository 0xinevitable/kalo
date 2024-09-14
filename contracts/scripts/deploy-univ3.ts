import { encodeBytes32String } from 'ethers';
import hre, { ethers } from 'hardhat';

export const deployUniswapV3 = async () => {
  const weth = await (
    await ethers.getContractFactory('ERC20Mock')
  ).deploy('WETH', 'WETH', 10000000n); // TODO: Use WETH9?
  console.log('WETH', weth);
  const factory = await (
    await ethers.getContractFactory('UniswapV3Factory')
  ).deploy();
  console.log('UniswapV3Factory', factory);
  const router = await (
    await ethers.getContractFactory('SwapRouter')
  ).deploy(factory, weth);
  console.log('SwapRouter', router);
  const nftDescriptor = await (
    await ethers.getContractFactory('NFTDescriptor')
  ).deploy();
  console.log('NFTDescriptor', nftDescriptor);
  const tokenDescriptor = await (
    await ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
      libraries: {
        NFTDescriptor: nftDescriptor,
      },
    })
  ).deploy(weth, encodeBytes32String('ETH'));
  console.log('NonfungibleTokenPositionDescriptor', tokenDescriptor);
  const nfPositionManager = await (
    await ethers.getContractFactory('NonfungiblePositionManager')
  ).deploy(factory, weth, tokenDescriptor);
  console.log('NonfungiblePositionManager', nfPositionManager);

  return {
    weth,
    factory,
    router,
    tokenDescriptor,
    nfPositionManager,
  };
};
