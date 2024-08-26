import React, { useState } from 'react';
import { formatEther, parseEther } from 'viem';
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
} from 'wagmi';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ABI for the ExponentialBondingCurveFactory contract
const factoryABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'feePercentage', type: 'uint256' },
      { name: 'feeCollector', type: 'address' },
    ],
    name: 'createBondingCurve',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// ABI for the ExponentialBondingCurveERC20 contract
const bondingCurveABI = [
  {
    inputs: [],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenAmount', type: 'uint256' }],
    name: 'sell',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'supply', type: 'uint256' }],
    name: 'currentPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Replace with your actual factory contract address
const FACTORY_ADDRESS = '0x...';

const BondingCurveLaunchpad: React.FC = () => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [feePercentage, setFeePercentage] = useState('');
  const [feeCollector, setFeeCollector] = useState('');
  const [bondingCurveAddress, setBondingCurveAddress] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  const { address } = useAccount();
  const config = useConfig();

  // Create bonding curve
  const { writeContractAsync } = useWriteContract();

  // const { isLoading: isCreating, isSuccess: createSuccess } =
  //   useWaitForTransactionReceipt({
  //     hash: createData,
  //   });

  // // Buy tokens
  // const { writeContract: writeContractAsync, data: buyData } = useWriteContract({
  //   abi: bondingCurveABI,
  //   address: bondingCurveAddress as `0x${string}`,
  //   functionName: 'buy',
  // });

  // const { isLoading: isBuying, isSuccess: buySuccess } =
  //   useWaitForTransactionReceipt({
  //     hash: buyData,
  //   });

  // Sell tokens
  // const { writeContract: sellTokens, data: sellData } = useWriteContract({
  //   abi: bondingCurveABI,
  //   address: bondingCurveAddress as `0x${string}`,
  //   functionName: 'sell',
  // });

  // const { isLoading: isSelling, isSuccess: sellSuccess } =
  //   useWaitForTransactionReceipt({
  //     hash: sellData,
  //   });

  // Get balance

  const { data: balance } = useReadContract({
    abi: bondingCurveABI,
    address: bondingCurveAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [address!],
  });

  // Get current price
  const { data: currentPrice } = useReadContract({
    abi: bondingCurveABI,
    address: bondingCurveAddress as `0x${string}`,
    functionName: 'currentPrice',
    args: [balance ?? 0n],
  });

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const handleCreateBondingCurve = async () => {
    if (tokenName && tokenSymbol && feePercentage && feeCollector) {
      setIsCreating(true);
      await writeContractAsync({
        abi: factoryABI,
        address: FACTORY_ADDRESS as `0x${string}`,
        functionName: 'createBondingCurve',
        args: [
          tokenName,
          tokenSymbol,
          BigInt(feePercentage),
          feeCollector as `0x${string}`,
        ],
      });
      setIsCreating(false);
    }
  };

  const [isBuying, setIsBuying] = useState<boolean>(false);
  const handleBuy = async () => {
    if (buyAmount) {
      setIsBuying(true);
      await writeContractAsync({
        abi: bondingCurveABI,
        address: bondingCurveAddress as `0x${string}`,
        functionName: 'buy',
        value: parseEther(buyAmount),
      });
      setIsBuying(false);
    }
  };

  const [isSelling, setIsSelling] = useState<boolean>(false);
  const handleSell = () => {
    if (sellAmount) {
      setIsSelling(true);
      writeContractAsync({
        abi: bondingCurveABI,
        address: bondingCurveAddress as `0x${string}`,
        functionName: 'sell',
        args: [parseEther(sellAmount)],
      });
      setIsSelling(false);
    }
  };

  return (
    <div className="max-w-2xl p-4 mx-auto space-y-6">
      <h1 className="mb-4 text-2xl font-bold">Bonding Curve Launchpad</h1>

      {/* Create Bonding Curve */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Create Bonding Curve</h2>
        <Label htmlFor="tokenName">Token Name</Label>
        <Input
          id="tokenName"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
        />
        <Label htmlFor="tokenSymbol">Token Symbol</Label>
        <Input
          id="tokenSymbol"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
        />
        <Label htmlFor="feePercentage">Fee Percentage</Label>
        <Input
          id="feePercentage"
          type="number"
          value={feePercentage}
          onChange={(e) => setFeePercentage(e.target.value)}
        />
        <Label htmlFor="feeCollector">Fee Collector Address</Label>
        <Input
          id="feeCollector"
          value={feeCollector}
          onChange={(e) => setFeeCollector(e.target.value)}
        />
        <Button onClick={handleCreateBondingCurve} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Bonding Curve'}
        </Button>
      </div>

      {/* Interact with Bonding Curve */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Interact with Bonding Curve</h2>
        <Label htmlFor="bondingCurveAddress">Bonding Curve Address</Label>
        <Input
          id="bondingCurveAddress"
          value={bondingCurveAddress}
          onChange={(e) => setBondingCurveAddress(e.target.value)}
        />

        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="buyAmount">Buy Amount (ETH)</Label>
            <Input
              id="buyAmount"
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
            />
            <Button onClick={handleBuy} disabled={isBuying} className="mt-2">
              {isBuying ? 'Buying...' : 'Buy Tokens'}
            </Button>
          </div>
          <div className="flex-1">
            <Label htmlFor="sellAmount">Sell Amount (Tokens)</Label>
            <Input
              id="sellAmount"
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
            />
            <Button onClick={handleSell} disabled={isSelling} className="mt-2">
              {isSelling ? 'Selling...' : 'Sell Tokens'}
            </Button>
          </div>
        </div>
      </div>

      {/* Display Balance and Price */}
      {bondingCurveAddress && (
        <Alert>
          <AlertTitle>Token Information</AlertTitle>
          <AlertDescription>
            <p>
              Your Balance: {balance ? formatEther(balance) : 'Loading...'}{' '}
              tokens
            </p>
            <p>
              Current Price:{' '}
              {currentPrice ? formatEther(currentPrice) : 'Loading...'} ETH per
              token
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BondingCurveLaunchpad;
