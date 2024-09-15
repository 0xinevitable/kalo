import styled from '@emotion/styled';
import { formatUnits } from 'viem';

export type BalanceItemProps = {
  image?: React.ReactNode;
  name: string;
  symbol: string;
  balance: bigint;
  decimals: number;
  valuation: number;
  priceDiff24h?: number;
};

export const BalanceItem: React.FC<BalanceItemProps> = ({
  image,
  name,
  symbol,
  balance,
  decimals,
  valuation,
  priceDiff24h,
}) => {
  const formattedBalance = parseFloat(
    formatUnits(balance, decimals),
  ).toLocaleString(undefined, {
    maximumSignificantDigits: 6,
  });

  return (
    <Container className={symbol}>
      {image ? image : null}
      <div className="flex flex-col flex-1">
        <span className="name">{name}</span>
        <span className="balance">
          {formattedBalance} {symbol}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <Valuation>{`$${valuation.toLocaleString()}`}</Valuation>
        {typeof priceDiff24h === 'undefined' ? null : priceDiff24h > 0 ? (
          <span className="text-green-500">{`+${priceDiff24h}%`}</span>
        ) : priceDiff24h < 0 ? (
          <span className="text-red-500">{`${priceDiff24h}%`}</span>
        ) : (
          <span className="text-slate-400"></span>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
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
