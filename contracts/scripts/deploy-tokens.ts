import { ethers } from 'hardhat';

import { MockERC20__factory } from '../typechain-types';

export async function deployTokens() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const tokenInfo = [
    { name: 'Bitcoin', symbol: 'BTC', decimals: 8 },
    { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    { name: 'Tether', symbol: 'USDT', decimals: 6 },
    { name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    { name: 'Dai', symbol: 'DAI', decimals: 18 },
    { name: 'RWA Gold', symbol: 'GOLD', decimals: 18 },
  ];

  const deployedTokens = [];

  for (const token of tokenInfo) {
    const MockERC20 = (await ethers.getContractFactory(
      'MockERC20',
    )) as MockERC20__factory;
    const mockToken = await MockERC20.deploy(
      token.name,
      token.symbol,
      token.decimals,
      deployer.address,
    );

    await mockToken.waitForDeployment();

    const deployedAddress = await mockToken.getAddress();
    console.log(
      `${token.name} (${token.symbol}) deployed to:`,
      deployedAddress,
    );

    deployedTokens.push({
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      address: deployedAddress,
    });
  }

  console.log('\nAll tokens deployed:');
  console.table(deployedTokens);

  return deployedTokens;
}

if (require.main === module) {
  deployTokens()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
