// import '@nomiclabs/hardhat-etherscan';
import '@nomicfoundation/hardhat-toolbox';
import '@typechain/hardhat';
import * as dotenv from 'dotenv';
import { formatUnits, parseUnits } from 'ethers';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'solidity-coverage';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 2 ** 32 - 1,
          },
          metadata: {
            // do not include the metadata hash, since this is machine dependent
            // and we want all generated code to be deterministic
            // https://docs.soliditylang.org/en/v0.7.6/metadata.html
            bytecodeHash: 'none',
          },
        },
      },
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 2 ** 32 - 1,
          },
          metadata: {
            // do not include the metadata hash, since this is machine dependent
            // and we want all generated code to be deterministic
            // https://docs.soliditylang.org/en/v0.7.6/metadata.html
            bytecodeHash: 'none',
          },
        },
      },
    ],
    overrides: {
      '@uniswap/v3-core/contracts/libraries/Position.sol': { version: '0.7.6' },
      '@uniswap/v3-core/contracts/libraries/SqrtPriceMath.sol': {
        version: '0.7.6',
      },
      '@uniswap/v3-core/contracts/libraries/SwapMath.sol': { version: '0.7.6' },
      '@uniswap/v3-core/contracts/libraries/FullMath.sol': { version: '0.7.6' },
      '@uniswap/v3-core/contracts/libraries/Oracle.sol': { version: '0.7.6' },
      '@uniswap/v3-core/contracts/libraries/Tick.sol': { version: '0.7.6' },
      '@uniswap/v3-core/contracts/libraries/TickMath.sol': { version: '0.7.6' },
      '@uniswap/v3-core/contracts/libraries/TickBitmap.sol': {
        version: '0.7.6',
      },
      '@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol': {
        version: '0.7.6',
      },
      '@uniswap/lib/contracts/libraries/AddressStringUtil.sol': {
        version: '0.7.6',
      },
      '@uniswap/lib/contracts/libraries/SafeERC20Namer.sol': {
        version: '0.7.6',
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      accounts: [
        {
          privateKey: process.env.PRIVATE_KEY!,
          balance: parseUnits('1000000000', 18).toString(),
        },
      ],
    },
    kii: {
      chainId: 11155111,
      url: process.env.SEPOLIA_URL || 'https://rpc.sepolia.org',
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  // @ts-ignore
  gasReporter: {
    enabled: true,
    currency: 'USD',
    // coinmarketcap: "COINMARKETCAP_API_KEY",
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

export default config;
