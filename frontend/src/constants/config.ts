import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient } from '@tanstack/react-query';
import { createConfig, createStorage, http, noopStorage } from 'wagmi';

import { kiichainTestnet } from './chain';

export const queryClient = new QueryClient();
export const chains = [kiichainTestnet];

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, coinbaseWallet],
    },
  ],
  {
    appName: 'Kalo',
    projectId: 'a566406bcd93912cd0874d710743fdf9',
  },
);

export const config = createConfig({
  appName: 'Kalo',
  // projectId: 'YOUR_PROJECT_ID',
  ssr: true,
  // @ts-ignore
  chains,
  connectors,
  storage: createStorage({
    key: 'wagmi__bump2',
    storage:
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : noopStorage,
  }),
  transports: {
    [kiichainTestnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
