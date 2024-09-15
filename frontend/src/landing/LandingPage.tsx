import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Notification } from '@/components/Notification';

import { DiagramSection } from './sections/DiagramSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { HeroSection } from './sections/HeroSection';
import { StakingSection } from './sections/StakingSection';

declare global {
  interface Window {
    keplr: any;
  }
}

const LandingPage = () => {
  return (
    <>
      <Notification />
      <Container>
        <HeroSection />
        <FeaturesSection />
        <DiagramSection />
        <StakingSection />
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
  width: 100%;
  max-width: 100vw;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
