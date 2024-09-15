import { FullMath, SqrtPriceMath, TickMath } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
import React, { useState } from 'react';
import { Address, createPublicClient, formatUnits, http, parseAbi } from 'viem';

import { getToken, kiichainTestnet } from '@/constants/tokens';

// Uniswap V3 NonfungiblePositionManager ABI (only the functions we need)
const positionManagerAbi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
]);

const POSITION_MANAGER_ADDRESS =
  '0x0f7F9402c26b45134953eCfB55B5082A4C643ee0' as const;

const client = createPublicClient({
  chain: kiichainTestnet,
  transport: http(),
});

interface Position {
  tokenId: bigint;
  token0: Address;
  token1: Address;
  pool: Address;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  amount0: string;
  amount1: string;
}

function getTokenAmounts(
  sqrtPriceX96: JSBI,
  tickLower: number,
  tickUpper: number,
  liquidity: JSBI,
): { amount0: string; amount1: string } {
  const sqrtRatioA = TickMath.getSqrtRatioAtTick(tickLower);
  const sqrtRatioB = TickMath.getSqrtRatioAtTick(tickUpper);

  const amount0 = SqrtPriceMath.getAmount0Delta(
    sqrtRatioA,
    sqrtRatioB,
    liquidity,
    false,
  );
  const amount1 = SqrtPriceMath.getAmount1Delta(
    sqrtRatioA,
    sqrtRatioB,
    liquidity,
    false,
  );

  return {
    amount0: amount0.toString(),
    amount1: amount1.toString(),
  };
}

const UniswapV3PositionsList: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async (address: Address) => {
    setIsLoading(true);
    setError(null);
    try {
      const balanceResult = await client.readContract({
        address: POSITION_MANAGER_ADDRESS,
        abi: positionManagerAbi,
        functionName: 'balanceOf',
        args: [address],
      });

      const balance = Number(balanceResult);

      if (balance === 0) {
        setPositions([]);
        setIsLoading(false);
        return;
      }

      const tokenIdCalls = Array.from({ length: balance }, (_, i) => ({
        address: POSITION_MANAGER_ADDRESS,
        abi: positionManagerAbi,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, BigInt(i)],
      }));

      const tokenIdsResults = await client.multicall({
        contracts: tokenIdCalls,
      });

      // @ts-ignore
      const tokenIds = tokenIdsResults.map((result) => result.result as bigint);

      const positionCalls = tokenIds.map((tokenId) => ({
        address: POSITION_MANAGER_ADDRESS,
        abi: positionManagerAbi,
        functionName: 'positions',
        args: [tokenId],
      }));

      const positionsResults = await client.multicall({
        contracts: positionCalls,
      });

      const formattedPositions = await Promise.all(
        positionsResults.map(async (result, index) => {
          // @ts-ignore
          const position = result.result as any[];
          const tokenId = tokenIds[index];
          const tickLower = position[5];
          const tickUpper = position[6];
          const liquidity = JSBI.BigInt(position[7].toString());

          let amount0 = '0';
          let amount1 = '0';
          let poolAddress: Address =
            '0x0000000000000000000000000000000000000000';

          try {
            // Fetch current sqrtPriceX96 for the pool
            poolAddress = await client.readContract({
              address: '0x0a707f8E245772a3eDB30B6C9C02F26dC43Fcb5c',
              abi: parseAbi([
                'function getPool(address,address,uint24) view returns (address)',
              ]),
              functionName: 'getPool',
              args: [position[2], position[3], position[4]],
            });

            if (poolAddress !== '0x0000000000000000000000000000000000000000') {
              // @ts-ignore
              const [sqrtPriceX96] = await client.readContract({
                address: poolAddress as Address,
                abi: parseAbi([
                  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
                ]),
                functionName: 'slot0',
              });
              console.log(sqrtPriceX96);

              const tokenAmounts = getTokenAmounts(
                JSBI.BigInt(sqrtPriceX96.toString()),
                tickLower,
                tickUpper,
                liquidity,
              );
              amount0 = tokenAmounts.amount0;
              amount1 = tokenAmounts.amount1;
            } else {
              console.log(`Pool does not exist for tokenId: ${tokenId}`);
            }
          } catch (error) {
            console.error(
              `Error fetching pool data for tokenId: ${tokenId}`,
              error,
            );
          }

          return {
            tokenId,
            token0: position[2],
            token1: position[3],
            pool: poolAddress,
            fee: position[4],
            tickLower,
            tickUpper,
            liquidity: BigInt(position[7].toString()),
            amount0,
            amount1,
          };
        }),
      );

      setPositions(formattedPositions);
    } catch (err) {
      setError('Failed to fetch positions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress) {
      fetchPositions(walletAddress as Address);
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Uniswap V3 Positions</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address"
          className="p-2 mr-2 border"
        />
        <button type="submit" className="p-2 text-white bg-blue-500 rounded">
          Fetch Positions
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {positions.length > 0 && (
        <table className="w-full border border-collapse">
          <thead>
            <tr>
              <th className="p-2 border">Token ID</th>
              <th className="p-2 border">Token0</th>
              <th className="p-2 border">Token1</th>
              <th className="p-2 border">Fee</th>
              <th className="p-2 border">Tick Range</th>
              <th className="p-2 border">Liquidity</th>
              <th className="p-2 border">Amount0</th>
              <th className="p-2 border">Amount1</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => {
              const token0 = getToken(position.token0)!;
              const token1 = getToken(position.token1)!;

              return (
                <tr key={position.tokenId.toString()}>
                  <td className="p-2 border">{position.tokenId.toString()}</td>
                  <td className="p-2 border">
                    <img src={token0.logoURL} alt={token0.symbol} />
                  </td>
                  <td className="p-2 border">
                    <img src={token1.logoURL} alt={token1.symbol} />
                  </td>
                  <td className="p-2 border">{position.fee}</td>
                  <td className="p-2 border">{`${position.tickLower} - ${position.tickUpper}`}</td>
                  <td className="p-2 border">
                    {position.liquidity.toString()}
                  </td>
                  <td className="p-2 border">
                    {formatUnits(BigInt(position.amount0), token0.decimals)}{' '}
                    {token0.symbol}
                  </td>
                  <td className="p-2 border">
                    {formatUnits(BigInt(position.amount1), token1.decimals)}{' '}
                    {token1.symbol}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UniswapV3PositionsList;
