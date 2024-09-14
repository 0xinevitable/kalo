# Kalo

```bash
# frontend
yarn dev

# contracts
cd contracts
yarn workspace @kalo/contracts hardhat run scripts/deploy-univ3.ts
```

## V3

```
WETH 0xa72B26b9463bB1f787d9B3220A493b4d6346D108
UniswapV3Factory 0xFf75ba159ab763a467638F95fC7447523222BB01
SwapRouter 0x384F2b96a335543da03Ec49AC6B8D34AC98Cf326
NFTDescriptor 0x7a5Bae75B593D6Dc599F8F417Aba57BA6a1e7eba
NonfungibleTokenPositionDescriptor 0xa28E46cc546a3146e7346AE05085629F2bee57C6
NonfungiblePositionManager 0x060ac14b8CAE7059D6dD713992c6E637371ecaF0
```

## Mocked ERC20s

```js
┌─────────┬────────────┬────────┬──────────┬──────────────────────────────────────────────┐
│ (index) │ name       │ symbol │ decimals │ address                                      │
├─────────┼────────────┼────────┼──────────┼──────────────────────────────────────────────┤
│ 0       │ 'Bitcoin'  │ 'BTC'  │ 8        │ '0x0b65426e7595758Fc6cc64F926e56C8f5382E778' │
│ 1       │ 'Ethereum' │ 'ETH'  │ 18       │ '0xdc0234f76B29b3920fD55bB4322676678FEED5a0' │
│ 2       │ 'Tether'   │ 'USDT' │ 6        │ '0xf506817d2db2FE531b7Ad2B3DFB3173665C4959C' │
│ 3       │ 'USD Coin' │ 'USDC' │ 6        │ '0xc68326408D812507D34eF4b1583cAe2F62953afE' │
│ 4       │ 'Dai'      │ 'DAI'  │ 18       │ '0x3a83359aFCF4eD34Ee76620944a791d6DE910979' │
│ 5       │ 'RWA Gold' │ 'GOLD' │ 18       │ '0xf70893DAf9DeAF1f25C0c67760d6e16A46a19232' │
└─────────┴────────────┴────────┴──────────┴──────────────────────────────────────────────┘
```

## Pools

```js
┌─────────┬─────────────┬──────────────────────────────────────────────┬────────────────────┬─────┐
│ (index) │ name        │ address                                      │ price              │ fee │
├─────────┼─────────────┼──────────────────────────────────────────────┼────────────────────┼─────┤
│ 0       │ 'BTC-ETH'   │ '0xC8716Cfa59c6EB3A038815A6334EE046C3e9Fd9E' │ 24.832454280248488 │ 500 │
│ 1       │ 'USDT-USDC' │ '0x4BB2fc3eC7d661912fb0639e3b47Dd1EA004BCCc' │ 1                  │ 500 │
└─────────┴─────────────┴──────────────────────────────────────────────┴────────────────────┴─────┘
```
