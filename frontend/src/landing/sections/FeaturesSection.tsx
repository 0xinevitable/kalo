import styled from '@emotion/styled';
import Image from 'next/image';

import featureDashboard from '@/assets/feature-dashboard.png';
import featureLiquidity from '@/assets/feature-liquidity.png';
import featureStake from '@/assets/feature-stake.png';

export const FeaturesSection: React.FC = () => {
  return (
    <Section>
      <CardList>
        <PrimaryFeatureCard />
        <FeatureCard
          title={<>See all of your assets on KiiChain</>}
          description="Real-time overview of all tokenized assets and LP positions. Track performance and manage your portfolio easily."
        >
          <FeatureImage alt="" src={featureDashboard} placeholder="blur" />
        </FeatureCard>
        <FeatureCard
          title={<>Seamless KII Staking</>}
          description="Stake and unstake KII tokens within Kalo's dashboard. Earn rewards while supporting network security."
        >
          <FeatureImage alt="" src={featureStake} placeholder="blur" />
        </FeatureCard>
      </CardList>
    </Section>
  );
};

const Section = styled.section`
  margin-top: -170px;
  max-width: 1000px;
  width: 100%;
  padding-bottom: 64px;

  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const CardList = styled.ul`
  width: 100%;

  display: flex;
  gap: 8px;
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
  backdrop-filter: blur(4px);
  box-shadow: 0px 12px 24px 0px rgba(93, 0, 255, 0.26);
`;
const CardContent = styled.div`
  display: flex;
  padding: 0px 18px 20px;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  @media screen and (max-width: 1000px) {
    min-height: unset;
  }
`;
const CardTitle = styled.h3`
  color: #1d004f;
  font-size: 28px;
  font-weight: 700;
  line-height: 103%; /* 28.84px */
  letter-spacing: -1.4px;
  flex: 1;
`;
const CardDescription = styled.p`
  flex: 1;

  color: #7628ff;
  font-size: 16px;
  font-weight: 500;
  line-height: 110%; /* 19.8px */
  letter-spacing: -0.9px;
`;

const FeatureImage = styled(Image)`
  width: 100%;
  height: auto;
  object-fit: cover;
  background: linear-gradient(180deg, #b388ff 0%, #ffc2a1 100%);
`;

const PrimaryFeatureCard: React.FC = () => {
  return (
    <CardContainer>
      <PrimaryFeatureImage alt="" src={featureLiquidity} />

      <PrimaryFeatureTitle>
        Where <br />
        Liquidity <br />
        Flows
      </PrimaryFeatureTitle>
      <PrimaryFeatureDescription>
        {`Kalo's concentrated liquidity pools are permissionless, and highly capital efficient ⸺ for maximum returns.`}
      </PrimaryFeatureDescription>
    </CardContainer>
  );
};
const PrimaryFeatureImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #a46efd;
`;
const PrimaryFeatureTitle = styled.h3`
  color: #fff;
  font-size: 40px;
  font-weight: 700;
  line-height: 103%; /* 41.2px */
  letter-spacing: -2px;

  position: absolute;
  left: 18px;
  top: 20px;
`;
const PrimaryFeatureDescription = styled.p`
  color: #d0b6ff;
  font-size: 18px;
  font-weight: 500;
  line-height: 110%; /* 19.8px */
  letter-spacing: -0.9px;

  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 20px;
`;
