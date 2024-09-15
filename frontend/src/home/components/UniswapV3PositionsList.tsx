import React, { useEffect, useState } from 'react';
import { Address, createPublicClient, http, parseAbi } from 'viem';

import { kiichainTestnet } from '@/constants/tokens';

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
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
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
      const balance = await client.readContract({
        address: POSITION_MANAGER_ADDRESS,
        abi: positionManagerAbi,
        functionName: 'balanceOf',
        args: [address],
      });

      const positionPromises = Array.from({ length: Number(balance) }, (_, i) =>
        client.readContract({
          address: POSITION_MANAGER_ADDRESS,
          abi: positionManagerAbi,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, BigInt(i)],
        }),
      );

      const tokenIds = await Promise.all(positionPromises);

      const positionDetailsPromises = tokenIds.map((tokenId) =>
        client.readContract({
          address: POSITION_MANAGER_ADDRESS,
          abi: positionManagerAbi,
          functionName: 'positions',
          args: [tokenId],
        }),
      );

      const positionDetails = await Promise.all(positionDetailsPromises);

      const formattedPositions = positionDetails.map((details, index) => ({
        tokenId: tokenIds[index],
        token0: details[2],
        token1: details[3],
        fee: details[4],
        tickLower: details[5],
        tickUpper: details[6],
        liquidity: details[7],
      }));

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
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.tokenId.toString()}>
                <td className="p-2 border">{position.tokenId.toString()}</td>
                <td className="p-2 border">{position.token0}</td>
                <td className="p-2 border">{position.token1}</td>
                <td className="p-2 border">{position.fee}</td>
                <td className="p-2 border">{`${position.tickLower} - ${position.tickUpper}`}</td>
                <td className="p-2 border">{position.liquidity.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UniswapV3PositionsList;
