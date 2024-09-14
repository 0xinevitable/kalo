import styled from '@emotion/styled';
import Image from 'next/image';

import diagramImage from '@/assets/diagram.png';
import { JostFont } from '@/styles/fonts';

export const DiagramSection: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Title>
          WE PLACE LIQUIDITY <br />
          & ONCHAIN INFO <br />
          WHERE NEEDED
        </Title>
        <DiagramImage alt="" src={diagramImage} />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 160px 20px;
  width: 100%;
  display: flex;
`;
const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
`;
const Title = styled.h2`
  color: #1d004f;
  font-family: ${JostFont.style.fontFamily};
  font-size: 46px;
  font-weight: 700;
  line-height: 105%; /* 48.3px */
  letter-spacing: -3.22px;
  text-transform: uppercase;
`;
const DiagramImage = styled(Image)`
  margin-right: auto;
  width: 100%;
  max-width: 844px;
`;
