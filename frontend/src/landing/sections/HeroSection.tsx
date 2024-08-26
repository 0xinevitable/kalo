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
            <BackgroundImage alt="" src={heroBackground} />
          </BackgroundImageContainer>
        </BackgroundImageWrapper>

        <HeroContent>
          <BrandLogo alt="" src="/assets/kinetics-logo.svg" />
          <span className="sr-only">Kinetics</span>
          <Title>
            The <br />
            Infra Hub
            <br /> for KiiChain
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
  height: 650px;
  background-color: #caa8fb;
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    width: 100%;
    min-width: 100px;
    max-width: 100px;
    height: 100%;
    background: linear-gradient(
      to right,
      #caa8fb 0%,
      rgba(202, 168, 251, 0) 100%
    );
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    width: 100%;
    min-width: 100px;
    max-width: 100px;
    height: 100%;
    background: linear-gradient(
      to left,
      #caa8fb 0%,
      rgba(202, 168, 251, 0) 100%
    );
  }
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
`;

const HeroContent = styled.div`
  margin: 0 auto;
  padding-top: 20px;
  width: 100%;
  max-width: 1000px;

  display: flex;
  flex-direction: column;
`;
const BrandLogo = styled.img`
  width: 169px; // 155 + 14
  height: 64px; // 36 + 14*2
  margin: -14px 0;
  margin-left: -14px;
`;
const Title = styled.h1`
  margin-top: 40px;
  margin-bottom: 20px;

  color: #1d004f;
  text-shadow: 0px 12px 49px #d4bcff;
  font-family: ${JostFont.style.fontFamily};
  font-size: 72px;
  font-style: normal;
  font-weight: 500;
  line-height: 105%; /* 75.6px */
  letter-spacing: -6px;
  text-transform: uppercase;
`;
const Button = styled.button`
  width: fit-content;
  padding: 8px 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  background: #fff;

  color: #1d004f;
  text-shadow: 0px 12px 49px #d4bcff;
  font-size: 24px;
  font-weight: 700;
  line-height: 105%; /* 25.2px */
  letter-spacing: -2.4px;
`;
