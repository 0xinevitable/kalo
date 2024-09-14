import { encodeBytes32String, parseEther } from 'ethers';
import hre, { ethers } from 'hardhat';

import { WETH9 } from '../typechain-types';

const main = async () => {
  const provider = hre.ethers.provider;
  console.log((await provider.getNetwork()).chainId);

  const weth = (await hre.ethers.getContractFactory('WETH9')).attach(
    '0x6279e89D5f06E0CC6583c131E6F49E130bF336E9',
  ) as WETH9;
  console.log('WETH', await weth.getAddress());

  // query name and symbol
  console.log(await weth.name());
  console.log(await weth.symbol());

  // deposit 10 ETH
  const depositAmount = parseEther('10');
  await (await weth.deposit({ value: depositAmount })).wait();
  console.log('deposited', depositAmount.toString());

  // check supply
  console.log('supply', (await weth.totalSupply()).toString());

  // check balance of weth
  const [signer] = await ethers.getSigners();
  const balance = await weth.balanceOf(signer);
  console.log('balance', balance.toString());

  // withdraw all balance
  await (await weth.withdraw(balance)).wait();
  console.log('withdrawn', balance.toString());

  // check supply
  console.log('supply', (await weth.totalSupply()).toString());

  // check new balance
  const newBalance = await weth.balanceOf(signer);
  console.log('balance', newBalance.toString());
};

if (require.main === module) {
  main().catch(console.error);
}
