import styled from '@emotion/styled';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { Address, formatUnits, zeroAddress } from 'viem';

import shieldImage from '@/assets/shield.png';
import { BalanceItem } from '@/components/BalanceItem';
import { Notification } from '@/components/Notification';
import { sKII } from '@/constants/tokens';
import { usePassportScore } from '@/hooks/usePassportScore';
import { useWalletTokens } from '@/hooks/useWalletTokens';
import { shortenAddress } from '@/utils/address';

import { StakeCard } from './components/StakeCard';
import { V3PositionList } from './components/V3PositionList';

const AddressDetailPage: NextPage = () => {
  // const { score, loading, error } = usePassportScore(
  //   '7865',
  //   '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  // );
  const loading = false;
  const error = '';
  const score = '32.95';

  const router = useRouter();
  console.log({ router: router.query });
  const address = router.query.address as Address;
  const tokenBalances = useWalletTokens(address);

  const sortedTokens = useMemo(
    () =>
      Object.values(tokenBalances)
        .map((token) => ({
          ...token,
          valuation:
            (token.price * parseInt((token.balance || 0n).toString())) /
            10 ** token.decimals,
        }))
        .sort(
          (a, b) =>
            // 1. valuation -> 2. amount
            b.valuation - a.valuation ||
            parseFloat(formatUnits(b.balance, b.decimals)) -
              parseFloat(formatUnits(a.balance, a.decimals)),
        ),
    [tokenBalances],
  );

  return (
    <>
      <Notification />

      {/* main */}
      <main className="mt-[100px] mb-[160px] flex flex-col w-full max-w-[1000px] mx-auto px-4">
        {/* top */}
        <div className="flex w-full gap-4">
          <div className="flex flex-col flex-1 gap-4">
            <SummaryContainer>
              <div className="flex flex-col">
                <SummaryField>Wallet</SummaryField>
                <SummaryValue>
                  {shortenAddress(address || zeroAddress)}
                </SummaryValue>
              </div>

              <div className="flex flex-col">
                <SummaryField>Total Value</SummaryField>
                <SummaryValue>$0</SummaryValue>
              </div>
            </SummaryContainer>

            <ScoreContainer>
              <ShieldImage src={shieldImage} alt="" />

              <div className="flex flex-col flex-1">
                <Field>Humanity Score</Field>
                <div className="flex items-center gap-[6px]">
                  <span>
                    {score !== null ? (
                      <Score>{score}</Score>
                    ) : loading ? (
                      <p>Loading...</p>
                    ) : error ? (
                      error
                    ) : null}
                  </span>
                  <Verified />
                </div>
                <Source>Powered by Gitcoin Passport</Source>
              </div>
            </ScoreContainer>
          </div>

          <div className="flex flex-col flex-1">
            <StakeContainer>
              <GovernanceTitle>Governance</GovernanceTitle>
              <div className="absolute top-0 left-0 right-0 h-[130px] flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="130"
                  viewBox="0 0 200 130"
                  fill="none"
                >
                  <circle
                    cx="100"
                    cy="30"
                    r="99.5"
                    stroke="#C9AAFF"
                    strokeOpacity="0.21"
                  />
                </svg>
              </div>

              <BalanceItem
                {...sKII}
                balance={tokenBalances[sKII.address]?.balance || 0n}
                valuation={
                  1.002 *
                  parseFloat(
                    formatUnits(
                      tokenBalances[sKII.address]?.balance || 0n,
                      sKII.decimals,
                    ),
                  )
                }
              />
              <StakeCard tokenBalances={tokenBalances} />
            </StakeContainer>
          </div>
        </div>

        {/* bottom */}
        <div className="flex flex-col w-full gap-4">
          <BalancesTitle>Balances</BalancesTitle>
          <div className="flex gap-4">
            <Card>
              <CardTitle>Assets</CardTitle>
              <BalanceList>
                {sortedTokens
                  .filter((v) => v.address !== sKII.address)
                  .map((token) => (
                    <BalanceItem
                      key={token.address}
                      {...token}
                      balance={token.balance}
                      valuation={
                        (token.price * parseInt(token.balance.toString())) /
                        10 ** token.decimals
                      }
                    />
                  ))}
              </BalanceList>
            </Card>
            <DefiCardList>
              <Card>
                <CardTitle>Providing Liquidity</CardTitle>
                <V3PositionList address={address} />
              </Card>
            </DefiCardList>
          </div>
        </div>
      </main>

      <style global jsx>{`
        html {
          background: #f1eef4;
        }
      `}</style>
    </>
  );
};

export default AddressDetailPage;

const Container = styled.main`
  padding: 42px 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SummaryContainer = styled.div`
  display: flex;
  /* FIXME: */
  padding: 22px;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;

  border-radius: 16px;
  background: linear-gradient(180deg, #c9aaff 0%, #fff 100%);
`;
const SummaryField = styled.span`
  color: #604294;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.64px;
`;
const SummaryValue = styled.span`
  margin-top: 4px;

  color: #1d004f;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.96px;
`;

const ScoreContainer = styled.div`
  display: flex;
  padding: 12px 22px 12px 12px;
  align-items: center;
  gap: 16px;

  border-radius: 16px;
  background: linear-gradient(90deg, #fff 0.01%, rgba(241, 238, 244, 0) 94.1%);
  box-shadow: 0px 16px 32px 0px rgba(29, 0, 79, 0.06);

  position: relative;
  overflow: hidden;

  &::before {
    content: '';

    display: block;
    width: 108px;
    height: 108px;
    background-color: rgba(93, 0, 255, 0.15);
    filter: blur(27px);

    position: absolute;
    top: 16px;
    left: 0;
  }
`;

const ShieldImage = styled(Image)`
  width: 63px;
  height: 67px;
  object-fit: contain;
`;
const Field = styled.span`
  color: #1d004f;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.64px;
`;
const Score = styled.span`
  color: #1d004f;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.96px;
`;

const Verified: React.FC = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.82462 20.5L6.09735 17.4524L2.82462 16.6905L3.1428 13.1667L0.915527 10.5L3.1428 7.83333L2.82462 4.30952L6.09735 3.54762L7.82462 0.5L10.9155 1.88095L14.0064 0.5L15.7337 3.54762L19.0064 4.30952L18.6883 7.83333L20.9155 10.5L18.6883 13.1667L19.0064 16.6905L15.7337 17.4524L14.0064 20.5L10.9155 19.119L7.82462 20.5ZM9.96098 13.881L15.0973 8.5L13.8246 7.11905L9.96098 11.1667L8.00644 9.16667L6.73371 10.5L9.96098 13.881Z"
      fill="#7628FF"
    />
  </svg>
);

const Source = styled.span`
  color: #1d004f;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.48px;
`;

const StakeContainer = styled.div`
  width: 100%;
  position: relative;

  display: flex;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  border-radius: 16px;
  border: 1px solid transparent;
  background:
    linear-gradient(#f1eef4, #f1eef4) padding-box,
    linear-gradient(
        144deg,
        rgba(174, 1, 227, 0.22) 20.77%,
        rgba(50, 27, 74, 0.22) 50.44%,
        rgba(0, 117, 255, 0.22) 79.52%
      )
      border-box;
`;

const GovernanceTitle = styled.h2`
  color: #1d004f;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.96px;
`;

const BalancesTitle = styled.h2`
  color: #1d004f;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.96px;
`;

const Card = styled.div`
  padding: 12px;

  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  border-radius: 16px;
  border: 1px solid #e0e0e0;
`;

const DefiCardList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const CardTitle = styled.h3`
  color: #1d004f;
  font-size: 24px;
  line-height: normal;
  letter-spacing: -0.96px;
`;

const BalanceList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
