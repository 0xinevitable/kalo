import styled from '@emotion/styled';
import Image from 'next/image';
import { useState } from 'react';

import kiiToSkiiImage from '@/assets/kii-to-skii.png';

export const StakeCard: React.FC = () => {
  const [stage, setStage] = useState<'main' | 'stake' | 'unstake'>('main');

  return (
    <Container>
      <StakeImageWrapper>
        <StakeImage src={kiiToSkiiImage} alt="" />
        <AbsoluteStakeImage src={kiiToSkiiImage} alt="" />
      </StakeImageWrapper>
      {stage === 'main' ? (
        <>
          <StakeTitle>Stake KII and receive sKII</StakeTitle>
          <div className="mt-[10px] flex items-center w-full gap-[6px]">
            <Button
              className="flex-1 primary"
              onClick={() => setStage('stake')}
            >
              Stake
            </Button>
            <Button className="flex-1" onClick={() => setStage('unstake')}>
              Unstake
            </Button>
          </div>
        </>
      ) : (
        <>
          <InteractionTitleContainer>
            <InteractionTitle>
              {stage === 'stake' ? 'Stake KII' : 'Unstake sKII'}
            </InteractionTitle>
            <Chavron
              className="transition-opacity cursor-pointer hover:opacity-65"
              onClick={() => setStage('main')}
            />
          </InteractionTitleContainer>
          <div className="mt-[10px] flex items-center w-full gap-[6px]"></div>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  padding: 12px;
  border-radius: 16px;
  /* background: #fff; */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 5%, #fff 100%);

  box-shadow: 0px 16px 32px 0px rgba(29, 0, 79, 0.06);
`;
const StakeImageWrapper = styled.div`
  margin: 0 auto;
  position: relative;
  display: flex;

  width: 116px;
  height: 132px;
  z-index: 0;
`;
const StakeImage = styled(Image)`
  width: 100%;
  height: 100%;
`;
const AbsoluteStakeImage = styled(StakeImage)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 18px;
  right: 36px;
  z-index: -1;
  filter: blur(23px);
  opacity: 0.65;
`;
const StakeTitle = styled.h2`
  margin-top: 10px;

  color: #1d004f;
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.88px;
`;

const Button = styled.button`
  display: flex;
  height: 36px;
  padding: 3px 11px;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  background: #ddd;
  color: rgba(126, 126, 126, 0.88);

  font-size: 16px;
  font-weight: 700;
  line-height: 105%; /* 16.8px */
  letter-spacing: -0.65px;

  &.primary {
    background: #5d00ff;
    color: #ffffff;
  }

  transition: opacity 0.16s;

  &:hover {
    opacity: 0.8;
  }
`;

const InteractionTitleContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const InteractionTitle = styled.h2`
  color: #1d004f;
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.88px;
`;

const Chavron: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clip-path="url(#clip0_8_93)">
      <rect
        x="0.5"
        y="0.651001"
        width="27"
        height="27"
        rx="13.5"
        fill="#C9AAFF"
        fillOpacity="0.19"
      />
      <g clip-path="url(#clip1_8_93)">
        <path
          d="M8 15.651L14 9.651L20 15.651"
          stroke="#5D00FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_8_93">
        <rect
          x="0.5"
          y="0.651001"
          width="27"
          height="27"
          rx="13.5"
          fill="white"
        />
      </clipPath>
      <clipPath id="clip1_8_93">
        <rect
          width="27"
          height="27"
          fill="white"
          transform="matrix(1 0 0 -1 0.5 27.651)"
        />
      </clipPath>
    </defs>
  </svg>
);
