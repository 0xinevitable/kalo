import * as dotenv from 'dotenv';
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

import { STAKING_ABIs } from './staking';

dotenv.config();

const PRECOMPILES = {
  Bank: '0x4381dC2aB14285160c808659aEe005D51255adD7',
  Staking: '0xd9A998CaC66092748FfEc7cFBD155Aae1737C2fF',
  Rewards: '0x55684E2CA2BACE0ADC512C1AFF880B15B8EA7214',

  // https://github.com/KiiChain/kii-solidity-contracts/blob/2932b6e50cde33f1bc9e7a82148e1b3aa3bc3c70/contracts/Swap.sol#L18
  Swap: '0xF948f57612E05320A6636a965cA4fbaed3147A0f',
} as const;
console.log(PRECOMPILES);

const SWAP_ABIs = [
  {
    inputs: [],
    name: 'bankContractAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buySkii',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'sellSkii',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const BANK_ABIs = [
  {
    inputs: [
      { internalType: 'address', name: 'toAddress', type: 'address' },
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'string', name: 'denom', type: 'string' },
        ],
        internalType: 'struct Cosmos.Coin[]',
        name: 'amount',
        type: 'tuple[]',
      },
    ],
    name: 'send',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'accountAddress', type: 'address' },
    ],
    name: 'getAllSpendableBalances',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'string', name: 'denom', type: 'string' },
        ],
        internalType: 'struct Cosmos.Coin[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'accountAddress', type: 'address' },
      { internalType: 'string', name: 'denom', type: 'string' },
    ],
    name: 'getBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },

  // getAllSupply
  //     function getAllSupply() external view returns (Cosmos.Coin[] memory);
  {
    inputs: [],
    name: 'getAllSupply',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'string', name: 'denom', type: 'string' },
        ],
        internalType: 'struct Cosmos.Coin[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'accountAddress', type: 'address' },
    ],
    name: 'getAllBalances',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'string', name: 'denom', type: 'string' },
        ],
        internalType: 'struct Cosmos.Coin[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const kiichain = defineChain({
  // https://docs.kiiglobal.io/docs/build-on-kiichain/developer-tools/deploy-a-smart-contract#chain-information
  id: 123454321,
  name: 'KiiChain',
  nativeCurrency: {
    decimals: 18,
    name: 'Kii',
    symbol: 'KII',
  },
  rpcUrls: {
    default: {
      http: ['https://a.sentry.testnet.kiivalidator.com:8645'],
    },
  },
  // blockExplorers: {
  //   default: { name: 'Explorer', url: 'https://explorer.zora.energy' },
  // },
  // contracts: {
  //   multicall3: {
  //     address: '0xcA11bde05977b3631167028862bE2a173976CA11',
  //     blockCreated: 5882,
  //   },
  // },
});

const client = createPublicClient({
  chain: kiichain,
  transport: http(),
});

const main = async () => {
  const account = privateKeyToAccount(
    (process.env.PRIVATE_KEY || '') as `0x${string}`,
  );
  const walletClient = createWalletClient({
    chain: kiichain,
    transport: http(),
    account,
  });

  console.log(await client.getBlockNumber());

  const balance = await client.getBalance({
    address: account.address,
  });
  console.log(balance);

  // Since this fails with `Execution reverted with reason: vm error [failed to delegate; 0tkii is smaller than 1000000000000000000tkii: insufficient funds [cosmos/cosmos-sdk@v0.50.4-0.20240126152601-c4a2fe2b8987/x/bank/keeper/keeper.go:139]] occurred during precompile execution of [delegate].`
  // We can assume that `tkii` === sKII
  // Now how do we get sKII?
  // const hash = await walletClient.writeContract({
  //   address: PRECOMPILES.Staking,
  //   abi: STAKING_ABIs,
  //   functionName: 'delegate',
  //   // validator
  //   args: ['0xb2c888b8008ce89d8e88909cabb1ef0dccaf5a7c', 10n ** 18n],
  // });

  // const bank = await client.readContract({
  //   address: PRECOMPILES.Swap,
  //   abi: SWAP_ABIs,
  //   functionName: 'bankContractAddress',
  // });

  // write contract
  // const hash = await walletClient.writeContract({
  //   address: PRECOMPILES.Swap,
  //   abi: SWAP_ABIs,
  //   functionName: 'buySkii',
  //   value: 1n * 10n ** 18n,
  // });
  // console.log(hash);

  // const receipt = await client.waitForTransactionReceipt({ hash });
  // console.log(receipt);

  // const availableDenoms = await client.readContract({
  //   address: PRECOMPILES.Bank,
  //   abi: BANK_ABIs,
  //   functionName: 'getAllSpendableBalances',
  //   // functionName: 'getAllSupply',
  //   args: [account.address],
  // });
  const availableDenoms = await client.readContract({
    address: PRECOMPILES.Bank,
    abi: BANK_ABIs,
    functionName: 'getAllSpendableBalances',
    // functionName: 'getAllSupply',
    args: [PRECOMPILES.Swap],
  });
  console.log({ availableDenoms });

  // for denom in availableDenoms, print balance
  // for (var i = 0; i < availableDenoms.length; i++) {
  //   const denom = availableDenoms[i];
  //   const balance = await client.readContract({
  //     address: PRECOMPILES.Bank,
  //     abi: BANK_ABIs,
  //     functionName: 'getBalance',
  //     args: [account.address, denom.denom],
  //   });
  //   console.log(denom.denom, balance);
  // }
};
main();
