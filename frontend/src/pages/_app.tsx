import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import React from 'react';
import { WagmiProvider } from 'wagmi';

import { NavigationBar } from '@/components/NavigationBar';
import { config, queryClient } from '@/constants/config';
import { SpaceGroteskFont } from '@/styles/fonts';
import '@/styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <NavigationBar />

            <Component {...pageProps} />
          </RainbowKitProvider>
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
