import { encodeBytes32String } from 'ethers';
import { ethers } from 'hardhat';

export const deployV3 = async () => {
  const weth = await (await ethers.getContractFactory('WETH9')).deploy();
  console.log('WETH', await weth.getAddress());

  const factory = await (
    await ethers.getContractFactory('UniswapV3Factory')
  ).deploy();
  console.log('UniswapV3Factory', await factory.getAddress());
  // const hash = await factory.initCodeHash();
  // console.log('initCodeHash', hash);

  const router = await (
    await ethers.getContractFactory('SwapRouter')
  ).deploy(factory, weth);
  console.log('SwapRouter', await router.getAddress());

  const nftDescriptor = await (
    await ethers.getContractFactory('NFTDescriptor')
  ).deploy();
  console.log('NFTDescriptor', await nftDescriptor.getAddress());

  const tokenDescriptor = await (
    await ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
      libraries: {
        NFTDescriptor: nftDescriptor,
      },
    })
  ).deploy(weth, encodeBytes32String('KII'));
  console.log(
    'NonfungibleTokenPositionDescriptor',
    await tokenDescriptor.getAddress(),
  );

  const nfPositionManager = await (
    await ethers.getContractFactory('NonfungiblePositionManager')
  ).deploy(factory, weth, tokenDescriptor);
  console.log(
    'NonfungiblePositionManager',
    await nfPositionManager.getAddress(),
  );

  return {
    weth,
    factory,
    router,
    tokenDescriptor,
    nfPositionManager,
  };
};

if (require.main === module) {
  deployV3().catch(console.error);
}
