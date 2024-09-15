import { Token } from '@uniswap/sdk-core';
import { FeeAmount, Pool, Tick } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Contract, createPublicClient, formatUnits, http } from 'viem';
import { mainnet } from 'viem/chains';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UNISWAP_V3_POOL_ABI = [
  /* ... */
]; // Include the full ABI here

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const tickToWord = (tick: number, tickSpacing: number): number => {
  let compressed = Math.floor(tick / tickSpacing);
  if (tick < 0 && tick % tickSpacing !== 0) compressed -= 1;
  return compressed >> 8;
};

export const UniswapV3LiquidityVisualizer = ({
  poolAddress,
  token0,
  token1,
  fee,
}) => {
  const [liquidityData, setLiquidityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiquidityData = async () => {
      setIsLoading(true);
      try {
        const poolContract = new Contract(poolAddress, UNISWAP_V3_POOL_ABI);

        const [liquidity, slot0, tickSpacing] = await Promise.all([
          publicClient.readContract({
            ...poolContract,
            functionName: 'liquidity',
          }),
          publicClient.readContract({ ...poolContract, functionName: 'slot0' }),
          publicClient.readContract({
            ...poolContract,
            functionName: 'tickSpacing',
          }),
        ]);

        const minWord = tickToWord(-887272, tickSpacing);
        const maxWord = tickToWord(887272, tickSpacing);

        const bitmapCalls = [];
        for (let i = minWord; i <= maxWord; i++) {
          bitmapCalls.push(
            publicClient.readContract({
              ...poolContract,
              functionName: 'tickBitmap',
              args: [i],
            }),
          );
        }
        const bitmaps = await Promise.all(bitmapCalls);

        const initializedTicks = [];
        bitmaps.forEach((bitmap, wordIndex) => {
          for (let bitIndex = 0; bitIndex < 256; bitIndex++) {
            if ((bitmap & (1n << BigInt(bitIndex))) !== 0n) {
              const tickIndex =
                ((minWord + wordIndex) * 256 + bitIndex) * tickSpacing;
              initializedTicks.push(tickIndex);
            }
          }
        });

        const tickCalls = initializedTicks.map((tick) =>
          publicClient.readContract({
            ...poolContract,
            functionName: 'ticks',
            args: [tick],
          }),
        );
        const ticksData = await Promise.all(tickCalls);

        const allTicks = ticksData.map(
          (data, index) =>
            new Tick({
              index: initializedTicks[index],
              liquidityGross: JSBI.BigInt(data.liquidityGross.toString()),
              liquidityNet: JSBI.BigInt(data.liquidityNet.toString()),
            }),
        );

        const pool = new Pool(
          new Token(1, token0, 18), // Assuming 18 decimals, adjust if needed
          new Token(1, token1, 18),
          fee as FeeAmount,
          slot0.sqrtPriceX96.toString(),
          liquidity.toString(),
          slot0.tick,
        );

        const tickLiquidityData = allTicks.map((tick) => ({
          tick: tick.index,
          liquidity: parseFloat(
            formatUnits(tick.liquidityGross.toString(), 18),
          ),
        }));

        setLiquidityData(tickLiquidityData);
      } catch (error) {
        console.error('Error fetching liquidity data:', error);
      }
      setIsLoading(false);
    };

    if (poolAddress && token0 && token1 && fee) {
      fetchLiquidityData();
    }
  }, [poolAddress, token0, token1, fee]);

  if (isLoading) {
    return <div>Loading liquidity data...</div>;
  }

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Uniswap V3 Liquidity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={liquidityData}>
            <XAxis dataKey="tick" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="liquidity"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
