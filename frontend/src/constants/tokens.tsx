import Image from 'next/image';
import { defineChain } from 'viem';

import skiiImage from '@/assets/skii.png';

export const kiichainTestnet = defineChain({
  id: 123454321,
  name: 'Kiichain Tesnet',
  nativeCurrency: {
    name: 'kii',
    symbol: 'kii',
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
  contracts: {},
});

export const sKII = {
  name: 'sKII',
  symbol: 'sKII',
  decimals: 6,
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
