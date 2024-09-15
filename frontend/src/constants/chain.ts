import { createPublicClient, defineChain, http } from 'viem';

export const kiichainTestnet = defineChain({
  id: 123454321,
  name: 'Kiichain Tesnet',
  nativeCurrency: {
    name: 'KII',
    symbol: 'KII',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://a.sentry.testnet.kiivalidator.com:8645'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Kiichain Testnet',
      url: 'https://app.kiiglobal.io/kiichain',
      apiUrl: '',
    },
  },
  contracts: {
    multicall3: {
      address: '0x032690D03EB035B8D1e43A57086ee5b829ebf316',
      // blockCreated: ?
    },
  },
});

export const client = createPublicClient({
  chain: kiichainTestnet,
  transport: http(),
});
