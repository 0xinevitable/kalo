import styled from '@emotion/styled';
import Image from 'next/image';

import { KII, TokenInfo } from '@/constants/tokens';

type StakeTokenInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: 'Buy' | 'Sell';
  token: TokenInfo;
};
export const StakeTokenInput: React.FC<StakeTokenInputProps> = ({
  label,
  token,
  ...inputProps
}) => {
  return (
    <Container>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <Label>{label}</Label>
            <Input {...inputProps} />
          </div>

          {/* token indicator */}
          <TokenContainer>
            <Image
              src={token.logoURL}
              alt=""
              width={72}
              height={72}
              style={{ width: 36, height: 36 }}
            />
            <TokenSymbol>{token.symbol}</TokenSymbol>
          </TokenContainer>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <Balance>
          Balance: <span className="underline">132,064.34</span>
        </Balance>
        <Valuation>≈ $0.00</Valuation>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  border-radius: 12px;
  background: #f6f0ff;

  position: relative;
`;
const Label = styled.label`
  color: #5d00ff;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.48px;
`;
const Input = styled.input`
  color: #1d004f;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.4px;
  flex: 1;
`;
const TokenContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 16px;

  display: flex;
  padding: 10px;
  padding-right: 12px;
  align-items: center;
  gap: 8px;

  border-radius: 55px;
  background: #fff;
  box-shadow: 0px 6px 18px 0px rgba(108, 80, 150, 0.4);
`;
const TokenSymbol = styled.span`
  color: #000;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.094px;
`;

const Balance = styled.span`
  color: rgba(107, 107, 107, 0.88);
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.48px;
`;
const Valuation = styled.span`
  color: rgba(107, 107, 107, 0.88);
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.48px;
  text-align: right;
`;
