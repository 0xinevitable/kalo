import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Notification } from '@/components/Notification';

import { DiagramSection } from './sections/DiagramSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { HeroSection } from './sections/HeroSection';

declare global {
  interface Window {
    keplr: any;
  }
}

const LandingPage = () => {
  const [account, setAccount] = useState<string>('');

  return (
    <>
      <Notification />
      <Container>
        <HeroSection />
        <FeaturesSection />
        <DiagramSection />
      </Container>
      <style jsx global>{`
        body {
          background-color: #a977ff;
        }
      `}</style>
    </>
  );
};

export default LandingPage;

const Container = styled.main`
  padding: 0 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
