import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
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
          <RainbowKitProvider
            locale="en-US"
            theme={lightTheme({
              accentColor: '#5D00FF',
              accentColorForeground: 'white',
              borderRadius: 'medium',
              overlayBlur: 'small',
            })}
          >
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

        *[data-testid='rk-connect-button'],
        *[data-testid='rk-account-button'],
        *[data-testid='rk-account-button'] *,
        *[role='dialog'],
        *[role='dialog'] * {
          /* word-spacing: normal !important; */
          font-family: ${SpaceGroteskFont.style.fontFamily} !important;
          border-radius: 12px !important;
        }

        *[data-testid='rk-connect-button'] {
          box-shadow: 0px 4px 12px 0px rgba(93, 0, 255, 0.58) !important;
        }

        *[data-testid='rk-account-button'] *,
        *[data-testid='rk-connect-button'] * {
          font-size: 16px !important;
        }

        *[data-testid='rk-account-button'],
        *[data-testid='rk-connect-button'] {
          width: max-content;
          font-size: 16px !important;
        }
      `}</style>
    </React.Fragment>
  );
}

export default MyApp;
