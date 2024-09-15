import { Route, encodeRouteToPath } from '@uniswap/v3-sdk';
import { encodeBytes32String } from 'ethers';
import hre, { ethers } from 'hardhat';
import { parseUnits } from 'viem';

import { QuoterV2__factory } from '../typechain-types';

const TOKENS = {
  BTC: '0x0b65426e7595758Fc6cc64F926e56C8f5382E778',
  ETH: '0xdc0234f76B29b3920fD55bB4322676678FEED5a0',
  USDT: '0xf506817d2db2FE531b7Ad2B3DFB3173665C4959C',
  USDC: '0xc68326408D812507D34eF4b1583cAe2F62953afE',
};

export const deployV3Quoter = async () => {
  const WETH = '0xdeC9F9F51f886Efc1032f5F6472D159dD951A259';
  const UniswapV3Factory = '0x0a707f8E245772a3eDB30B6C9C02F26dC43Fcb5c';

  const Quoter = await (
    (await ethers.getContractFactory('QuoterV2')) as QuoterV2__factory
  ).deploy(UniswapV3Factory, WETH);
  await Quoter.waitForDeployment();
  console.log(await Quoter.getAddress());

  const res = await Quoter.quoteExactInputSingle.staticCall({
    tokenIn: TOKENS.BTC,
    tokenOut: TOKENS.ETH,
    fee: 500,
    amountIn: parseUnits('0.05', 18),
    sqrtPriceLimitX96: 0n,
  });
  console.log(res);
};

if (require.main === module) {
  deployV3Quoter().catch(console.error);
}
