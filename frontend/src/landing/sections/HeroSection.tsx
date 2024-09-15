import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';

import heroBackground from '@/assets/hero-background.jpg';
import { JostFont } from '@/styles/fonts';

export const HeroSection: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <BackgroundImageWrapper>
          <BackgroundImageContainer>
            <BackgroundImage alt="" src={heroBackground} placeholder="blur" />
          </BackgroundImageContainer>
        </BackgroundImageWrapper>

        <HeroContent>
          <span className="sr-only">Kalo</span>
          <Title>
            The DeFi Hub <br />
            for KiiChain
          </Title>
          <Link href="/home">
            <Button>Start Now</Button>
          </Link>
        </HeroContent>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
`;
const Container = styled.section`
  width: 100%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 0;
`;

const BackgroundImageWrapper = styled.div`
  width: 1728px;
  min-width: 1728px;
  height: 650px;

  /* center image -1 overlay */
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;
`;
const BackgroundImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`;
const BackgroundImage = styled(Image)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  object-fit: cover;
  filter: blur(2px);
`;

const HeroContent = styled.div`
  margin: 0 auto;
  padding-top: 20px;
  width: 100%;
  max-width: 1000px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h1`
  margin-top: 140px;
  margin-bottom: 20px;

  color: #1d004f;
  text-align: center;
  text-shadow: 0px 12px 49px #d4bcff;
  font-family: ${JostFont.style.fontFamily};
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 105%; /* 75.6px */
  letter-spacing: -5.04px;
  text-transform: uppercase;
`;
const Button = styled.button`
  width: fit-content;
  padding: 8px 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  background: #1d004f;
  box-shadow: 0px 12px 32px 0px rgba(37, 0, 101, 0.32);

  color: #fff;
  text-shadow: 0px 12px 49px #d4bcff;
  font-size: 24px;
  font-weight: 600;
  line-height: 105%; /* 25.2px */
  letter-spacing: -1.2px;
`;
