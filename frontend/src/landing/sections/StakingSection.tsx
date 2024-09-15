import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';

import componentsImage from '@/assets/components.png';
import { KaloButton } from '@/components/KaloButton';
import { JostFont } from '@/styles/fonts';

export const StakingSection: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Title>
          Complete <br />
          Management <br />
          of <strong>Staking</strong> <br />
          Products
        </Title>
        <Description>
          Manage assets, delegations, <br />
          and liquidity all in one place.
        </Description>

        <ButtonWrapper>
          <Link href="/account/0x56855Cc20f5A6745e88F5d357014a540AB081671">
            <KaloButton className="primary">Visit Demo Profile</KaloButton>
          </Link>
          <Badge>✨ Connect your wallet & See yours too!</Badge>
        </ButtonWrapper>

        <ComponentsImage src={componentsImage} alt="" placeholder="blur" />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 0 20px 160px;
  width: 100%;
  display: flex;
`;
const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  padding: 40px 40px 150px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 16px;
  background: linear-gradient(180deg, #fffdec 0%, #84f 100%);
  gap: 18px;

  position: relative;
  z-index: 0;
`;
const Title = styled.h2`
  color: #1d004f;
  text-shadow: 0px 7.644px 31.213px #d4bcff;
  font-family: ${JostFont.style.fontFamily};
  font-size: 45.864px;
  font-style: normal;
  font-weight: 500;
  line-height: 105%; /* 48.157px */
  letter-spacing: -3.21px;
  text-transform: uppercase;
`;
const Description = styled.p`
  color: #7628ff;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 19.2px */
`;
const ButtonWrapper = styled.div`
  display: flex;
  position: relative;
`;
const Badge = styled.span`
  display: inline-flex;
  padding: 6px;
  width: max-content;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 8px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(6px);

  color: #5d00ff;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -1.12px;

  position: absolute;
  bottom: -24px;
  left: 24px;
`;

const ComponentsImage = styled(Image)`
  width: 716px; // 652 + 32 * 2
  min-width: 716px;
  height: 587px; // 523 + 32 * 2

  position: absolute;
  right: -78px; // -46 - 32
  bottom: -96px; // -64 - 32

  z-index: -1;
`;
