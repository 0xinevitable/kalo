import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';

import { NavigationBar } from '@/components/NavigationBar';
import { kiichainTestnet } from '@/constants/tokens';
import { SpaceGroteskFont } from '@/styles/fonts';
import '@/styles/global.css';

const config = createConfig({
  chains: [kiichainTestnet],
  transports: {
    [kiichainTestnet.id]: http(),
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
