import styled from '@emotion/styled';
import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Address, encodePacked, formatUnits, parseUnits } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

// import {
//   useAccount,
//   useContractRead,
//   useContractWrite,
//   useNetwork,
//   usePrepareContractWrite,
// } from 'wagmi';
import kiiToSkiiImage from '@/assets/kii-to-skii.png';
import shieldImage from '@/assets/shield.png';
import { BalanceItem } from '@/components/BalanceItem';
import { Notification } from '@/components/Notification';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  TOKENS,
  TokenInfo,
  client,
  getToken,
  kiichainTestnet,
} from '@/constants/tokens';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { usePassportScore } from '@/hooks/usePassportScore';
import { useWalletTokens } from '@/hooks/useWalletTokens';

const SWAP_ROUTER_ADDRESS = '0xEEDf468F8cc80BcaF7a22d400BE416CF6AF22fe5';
const QUOTER_ADDRESS = '0xD2dF0d33215bF8924Bebb3490494Af50Aa24b7F1'; // Replace with the actual Quoter contract address on Kiichain Testnet

const swapABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint24',
        name: 'fee',
        type: 'uint24',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMinimum',
        type: 'uint256',
      },
    ],
    name: 'exactInputSingle',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

const quoterABI = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'path',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    name: 'quoteExactInput',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        internalType: 'uint160[]',
        name: 'sqrtPriceX96AfterList',
        type: 'uint160[]',
      },
      {
        internalType: 'uint32[]',
        name: 'initializedTicksCrossedList',
        type: 'uint32[]',
      },
      {
        internalType: 'uint256',
        name: 'gasEstimate',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

declare global {
  interface Window {
    keplr: any;
  }
}

const SwapPage: NextPage = () => {
  const [tokenIn, setTokenIn] = useState<TokenInfo>(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<TokenInfo>(TOKENS[1]);
  const [draft, setDraft] = useState<string>('');
  const [estimation, setEstimation] = useState<string>('');

  const { address } = useAccount();

  useEffect(() => {
    const fetch = async () => {
      try {
        const encodedPath = encodePacked(
          ['address', 'uint24', 'address'],
          [tokenIn.address, 500, tokenOut.address],
        );
        const out = await client.readContract({
          address: QUOTER_ADDRESS,
          abi: quoterABI,
          functionName: 'quoteExactInput',
          args: [encodedPath, parseUnits(draft || '0', tokenIn.decimals)],
        });
        console.log(out);
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, [draft, tokenIn, tokenOut]);

  // const { data: quoteData } = useReadContract({
  //   address: QUOTER_ADDRESS,
  //   abi: quoterABI,
  //   functionName: 'quoteExactInput',
  //   args: [encodedPath, parseUnits(amountIn || '0', tokenIn.decimals)],
  //   // enabled: Boolean(amountIn) && amountIn !== '0',
  //   query: {
  //     enabled: Boolean(amountIn) && amountIn !== '0',
  //   },
  // });

  // useEffect(() => {
  //   if (quoteData && quoteData[0]) {
  //     setAmountOut(formatUnits(quoteData[0], tokenOut.decimals));
  //   }
  // }, [quoteData, tokenOut.decimals]);

  // const { config } = usePrepareContractWrite({
  //   address: SWAP_ROUTER_ADDRESS,
  //   abi: swapABI,
  //   functionName: 'exactInputSingle',
  //   args: [
  //     tokenIn.address,
  //     tokenOut.address,
  //     3000, // 0.3% fee tier
  //     parseUnits(amountIn || '0', tokenIn.decimals),
  //     parseUnits(amountOut || '0', tokenOut.decimals),
  //   ],
  //   enabled: Boolean(amountIn) && Boolean(amountOut),
  // });

  // const { write: swap, isLoading, isSuccess } = useContractWrite(config);

  const handleSwap = () => {
    // if (swap) {
    //   swap();
    // }
  };

  return (
    <>
      <Notification />

      {/* main */}
      <main className="mt-[100px] flex flex-col w-full max-w-[1000px] mx-auto px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Swap Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="tokenIn"
                  className="block text-sm font-medium text-gray-700"
                >
                  From
                </label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  {/* <Select
                    onValueChange={(value) =>
                      setTokenIn(getToken(value) || TOKENS[0])
                    }
                  >
                    <SelectTrigger id="tokenIn">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          <div className="flex items-center">
                            {token.image}
                            <span className="ml-2">{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <Input
                    type="number"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="flex-1 rounded-none rounded-r-md"
                    placeholder="0.0"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="tokenOut"
                  className="block text-sm font-medium text-gray-700"
                >
                  To
                </label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  {/* <Select
                    onValueChange={(value) =>
                      setTokenOut(getToken(value) || TOKENS[1])
                    }
                  >
                    <SelectTrigger id="tokenOut">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          <div className="flex items-center">
                            {token.image}
                            <span className="ml-2">{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <Input
                    type="number"
                    value={estimation}
                    readOnly
                    disabled
                    className="flex-1 rounded-none rounded-r-md"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSwap}
              // disabled={!swap || isLoading || !amountIn || !amountOut}
              className="w-full"
            >
              {/* {isLoading ? 'Swapping...' : 'Swap'} */}
              Swap
            </Button>
          </CardFooter>
        </Card>
      </main>

      <style global jsx>{`
        html {
          background: #f1eef4;
        }
      `}</style>
    </>
  );
};

export default SwapPage;
