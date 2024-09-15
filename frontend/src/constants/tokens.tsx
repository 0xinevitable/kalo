import Image from 'next/image';
import {
  Address,
  createPublicClient,
  defineChain,
  http,
  zeroAddress,
} from 'viem';

import skiiImage from '@/assets/skii.png';

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

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
  logoURL: string;
  image: React.ReactNode;
};

export const KII = {
  name: 'KII',
  symbol: 'KII',
  decimals: 18,
  address: zeroAddress,
  logoURL: '/assets/kii.png',
  image: (
    <Image
      src="/assets/kii.png"
      alt=""
      width={72}
      height={72}
      style={{ width: 36, height: 36 }}
    />
  ),
};

export const sKII = {
  name: 'sKII',
  symbol: 'sKII',
  decimals: 6,
  address: '0x8eB71002a452732E4D7DD399fe956a443717C903',
  image: (
    <div className="w-[36px] h-[36px] relative">
      <Image
        src={skiiImage}
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
      <Image
        className="absolute left-0 right-0 top-2"
        src={skiiImage}
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36, filter: 'blur(8px)' }}
      />
    </div>
  ),
};

export const TOKENS = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    address: '0x0b65426e7595758Fc6cc64F926e56C8f5382E778',
    logoURL: '/assets/btc.png',
    image: (
      <Image
        src="/assets/btc.png"
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
    ),
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '0xdc0234f76B29b3920fD55bB4322676678FEED5a0',
    logoURL: '/assets/eth.png',
    image: (
      <Image
        src="/assets/eth.png"
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
    ),
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
    address: '0xf506817d2db2FE531b7Ad2B3DFB3173665C4959C',
    logoURL: '/assets/usdt.png',
    image: (
      <Image
        src="/assets/usdt.png"
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
    ),
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0xc68326408D812507D34eF4b1583cAe2F62953afE',
    logoURL: '/assets/usdc.png',
    image: (
      <Image
        src="/assets/usdc.png"
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
    ),
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    address: '0x3a83359aFCF4eD34Ee76620944a791d6DE910979',
    logoURL: '/assets/dai.png',
    image: (
      <Image
        src="/assets/dai.png"
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
    ),
  },
  {
    name: 'RWA Gold',
    symbol: 'GOLD',
    decimals: 18,
    address: '0xf70893DAf9DeAF1f25C0c67760d6e16A46a19232',
    logoURL: '/assets/gold.png',
    image: (
      <Image
        src="/assets/gold.png"
        alt=""
        width={72}
        height={72}
        style={{ width: 36, height: 36 }}
      />
    ),
  },
] as const;

export const getToken = (addr: string) => {
  const lowercasedAddr = addr.toLowerCase();
  return (
    TOKENS.find((token) => token.address.toLowerCase() === lowercasedAddr) ||
    null
  );
};
