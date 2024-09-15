import styled from '@emotion/styled';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { TokenInfo } from '@/constants/tokens';

export type PositionItemProps = {
  // image?: React.ReactNode;
  // name: string;
  // symbol: string;
  // balance: bigint;
  // decimals: number;
  // valuation: number;
  token0: TokenInfo;
  token1: TokenInfo;
  amount0: bigint;
  amount1: bigint;
};

export const PositionItem: React.FC<PositionItemProps> = ({
  // image,
  // name,
  // symbol,
  // balance,
  // decimals,
  // valuation,
  token0,
  token1,
  amount0,
  amount1,
}) => {
  const formattedBalance = useMemo(() => {
    const t0 = parseFloat(formatUnits(amount0, token0.decimals)).toLocaleString(
      undefined,
      {
        maximumSignificantDigits: 6,
      },
    );
    const t1 = parseFloat(formatUnits(amount1, token1.decimals)).toLocaleString(
      undefined,
      {
        maximumSignificantDigits: 6,
      },
    );
    return `${t0} ${token0.symbol} + ${t1} ${token1.symbol}`;
  }, [amount0, amount1, token0.decimals, token1.decimals]);

  return (
    <Container>
      <div className="flex items-center w-fit h-fit">
        {token0.image}
        <span className="ml-[-10px]">{token1.image}</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="name">{`${token0.symbol}-${token1.symbol} LP`}</span>
        <span className="balance">{formattedBalance}</span>
      </div>
      {/* <div className="flex flex-col items-center">
        <Valuation>{`$${valuation.toLocaleString()}`}</Valuation>
      </div> */}
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
