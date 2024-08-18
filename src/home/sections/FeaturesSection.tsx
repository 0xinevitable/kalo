import styled from '@emotion/styled';
import Image from 'next/image';

import featureBondingCurve from '@/assets/feature-bonding-curve.png';
import featureDashboard from '@/assets/feature-dashboard.png';
import featureSynth from '@/assets/feature-synth.png';

export const FeaturesSection: React.FC = () => {
  return (
    <Section>
      <CardList>
        <FeatureCard
          title={<>See all of your assets on KiiChain</>}
          // FIXME:
          description="KiiChain is a layer 1 blockchain built with the Cosmos SDK"
        >
          <FeatureImage alt="" src={featureDashboard} />
        </FeatureCard>
        <FeatureCard
          title={<>Launch Tokens on the Bonding Curve</>}
          // FIXME:
          description="KiiChain is a layer 1 blockchain built with the Cosmos SDK"
        >
          <FeatureImage alt="" src={featureBondingCurve} />
        </FeatureCard>
        <FeatureCard
          title={<>Mint Synthetic Assets with RWAs/xTokens</>}
          // FIXME:
          description="KiiChain is a layer 1 blockchain built with the Cosmos SDK"
        >
          <FeatureImage alt="" src={featureSynth} />
        </FeatureCard>
      </CardList>
    </Section>
  );
};

const Section = styled.section`
  padding: 120px 24px 0;
  max-width: 1000px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 700px) {
    padding: 120px 12px 0;
  }
`;

const CardList = styled.ul`
  margin-top: 28px;
  width: 100%;

  display: flex;
  gap: 8px;

  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;

type FeatureCardProps = {
  children?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
};
export const FeatureCard: React.FC<FeatureCardProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <CardContainer>
      {children}

      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </CardContainer>
  );
};
const CardContainer = styled.li`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;

  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #d3dae4;

  border-radius: 12px;
  border: 1px solid #7628ff;
  background: linear-gradient(
    180deg,
    #9f69ff 31%,
    rgba(255, 255, 255, 0.57) 100%
  );
  box-shadow: 0px 12px 24px 0px rgba(93, 0, 255, 0.26);
`;
const CardContent = styled.div`
  display: flex;
  padding: 0px 18px 24px 18px;
  flex-direction: column;
  gap: 12px;
  flex: 1;

  @media screen and (max-width: 1000px) {
    min-height: unset;
  }
`;
const CardTitle = styled.h3`
  color: #1d004f;
  font-family: 'Space Grotesk';
  font-size: 28px;
  font-weight: 700;
  line-height: 103%; /* 28.84px */
  letter-spacing: -1.4px;
`;
const CardDescription = styled.p`
  flex: 1;

  color: #7628ff;
  font-family: 'Space Grotesk';
  font-size: 16px;
  font-weight: 500;
  line-height: 120%; /* 19.2px */
`;

const FeatureImage = styled(Image)`
  width: 100%;
  height: auto;
  object-fit: cover;
  background: linear-gradient(180deg, #b388ff 0%, #ffc2a1 100%);
`;
