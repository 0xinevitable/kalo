import styled from '@emotion/styled';
import { formatUnits } from 'viem';

import { KaloButton } from './KaloButton';

export type FaucetItemProps = {
  image?: React.ReactNode;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  onClick: (amountInUnits: bigint) => void;
};

export const FaucetItem: React.FC<FaucetItemProps> = ({
  image,
  name,
  symbol,
  decimals,
  amount,
  onClick,
}) => {
  return (
    <Container className={symbol}>
      {image ? image : null}
      <div className="flex flex-col flex-1">
        <span className="name">{name}</span>
        <span className="balance">
          {amount.toLocaleString()} {symbol}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <KaloButton
          className="shadow primary"
          onClick={() => onClick(BigInt(amount * 10 ** decimals))}
        >
          Claim
        </KaloButton>
      </div>
    </Container>
  );
};

const Container = styled.li`
  width: 100%;
  padding: 8px 10px 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;

  background: #fff;

  border-radius: 12px;

  &.sKII {
    box-shadow:
      0px -4px 8px 0px rgba(93, 0, 255, 0.11),
      0px 4px 6px 0px rgba(141, 175, 255, 0.4);

    border: 1px solid transparent;
    background:
      linear-gradient(white, white) padding-box,
      linear-gradient(
          144deg,
          rgba(174, 1, 227, 1) 20.77%,
          rgba(50, 27, 74, 1) 50.44%,
          rgba(0, 117, 255, 1) 79.52%
        )
        border-box;
  }

  & .name {
    color: #1d004f;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.8px;
    line-height: 100%;
  }

  & .balance {
    margin-top: 4px;

    color: #a09ca8;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.56px;
    line-height: 100%;
  }
`;

const Valuation = styled.span`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.64px;
`;
