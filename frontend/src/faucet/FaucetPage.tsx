import styled from '@emotion/styled';
import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

import kiiToSkiiImage from '@/assets/kii-to-skii.png';
import shieldImage from '@/assets/shield.png';
import { BalanceItem } from '@/components/BalanceItem';
import { Notification } from '@/components/Notification';
import { TOKENS, getToken, sKII } from '@/constants/tokens';
import { usePassportScore } from '@/hooks/usePassportScore';
import { useWalletTokens } from '@/hooks/useWalletTokens';

declare global {
  interface Window {
    keplr: any;
  }
}

const FaucetPage: NextPage = () => {
  return (
    <>
      <Notification />

      {/* main */}
      <main className="mt-[100px] flex flex-col w-full max-w-[1000px] mx-auto px-4"></main>

      <style global jsx>{`
        html {
          background: #f1eef4;
        }
      `}</style>
    </>
  );
};

export default FaucetPage;
