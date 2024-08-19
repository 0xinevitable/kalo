import { AppProps } from 'next/app';
import React from 'react';

import { SpaceGroteskFont } from '@/styles/fonts';
import '@/styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Component {...pageProps} />

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
