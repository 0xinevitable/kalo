import { useEffect, useState } from 'react';
import { Address, createPublicClient, erc20Abi, http, zeroAddress } from 'viem';
import { usePublicClient } from 'wagmi';

import { kiichainTestnet } from '@/constants/chain';
import { KII, TOKENS, TokenInfo } from '@/constants/tokens';

// 토큰 타입 정의
interface Token {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
}

// 토큰 데이터 타입 정의
type TokenData = TokenInfo & {
  balance: bigint;
  price: number;
  priceDiff24h: number;
};

// CoinGecko API 타입
interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

const client = createPublicClient({
  chain: kiichainTestnet,
  transport: http(),
});

// 커스텀 훅 정의
export function useWalletTokens(address: Address) {
  const publicClient = usePublicClient();
  const [tokenData, setTokenData] = useState<Record<string, TokenData>>({});

  useEffect(() => {
    if (!address) return;

    const fetchTokenData = async () => {
      try {
        // 멀티콜 계약 호출 준비
        const calls = TOKENS.flatMap((token) => [
          {
            address: token.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          },
        ]);

        // 멀티콜 실행
        const [results, kiiBalance] = await Promise.all([
          client.multicall({
            contracts: calls,
          }),
          publicClient?.getBalance({ address }).catch(() => 0n) || 0n,
        ]);

        // CoinGecko API에서 가격 정보 가져오기
        // const ids = tokens.map((token) => token.symbol.toLowerCase()).join(',');
        // const priceResponse = await fetch(
        //   `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        // );
        // const priceData: CoinGeckoPrice = await priceResponse.json();

        // 결과 처리
        const newTokenData: Record<string, TokenData> = {};
        TOKENS.forEach((token, index) => {
          // @ts-ignore
          const balance = results[index].result as bigint;
          // const priceInfo = priceData[token.symbol.toLowerCase()];
          if (balance === 0n) {
            return;
          }
          newTokenData[token.address] = {
            ...token,
            balance,
            price: 0,
            priceDiff24h: 0,
            // price: priceInfo?.usd || 0,
            // priceDiff24h: priceInfo?.usd_24h_change || 0,
          };
        });

        console.log(results);

        setTokenData({
          ...newTokenData,
          [zeroAddress]: {
            ...KII,
            balance: kiiBalance || 0n,
            // FIXME:
            price: 0,
            priceDiff24h: 0,
          },
        });
      } catch (error) {
        console.error('Failed to fetch token data:', error);
      }
    };

    fetchTokenData();
  }, [address, publicClient]);

  return tokenData;
}
