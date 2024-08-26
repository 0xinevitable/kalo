export const BANK_ABI = [
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

export const SWAP_ABI = [
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
