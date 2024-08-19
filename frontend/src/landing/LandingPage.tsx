import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import { Notification } from '@/components/Notification';

import { FeaturesSection } from './sections/FeaturesSection';
import { HeroSection } from './sections/HeroSection';

declare global {
  interface Window {
    keplr: any;
  }
}

const HomePage = () => {
  const [account, setAccount] = useState<string>('');

  return (
    <>
      <Notification />
      <Container>
        <HeroSection />
        <FeaturesSection />
      </Container>
      <style jsx global>{`
        body {
          background-color: #a977ff;
        }
      `}</style>
    </>
  );
};

export default HomePage;

const Container = styled.main`
  padding: 42px 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
