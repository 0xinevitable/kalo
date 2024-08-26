import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

import { NavigationBar } from '@/components/NavigationBar';
import { SpaceGroteskFont } from '@/styles/fonts';
import '@/styles/global.css';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <NavigationBar />

          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiProvider>

      <div id="portal" />

      <style jsx global>{`
        body {
          font-family: ${SpaceGroteskFont.style.fontFamily} !important;
        }
      `}</style>
    </React.Fragment>
  );
}

export default MyApp;
