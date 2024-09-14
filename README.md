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
WETH 0xdeC9F9F51f886Efc1032f5F6472D159dD951A259
UniswapV3Factory 0x0a707f8E245772a3eDB30B6C9C02F26dC43Fcb5c
SwapRouter 0xEEDf468F8cc80BcaF7a22d400BE416CF6AF22fe5
NFTDescriptor 0xe234395b2E0317C169024bE43eFCb3bF4A41D57E
NonfungibleTokenPositionDescriptor 0x1b71634fbE0d9C706daf7EeE8f5eb5f7271CF1C3
NonfungiblePositionManager 0x0f7F9402c26b45134953eCfB55B5082A4C643ee0
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
┌─────────┬─────────────┬──────────────────────────────────────────────┬─────┐
│ (index) │ name        │ address                                      │ fee │
├─────────┼─────────────┼──────────────────────────────────────────────┼─────┤
│ 0       │ 'BTC-ETH'   │ '0xfd3dFCa1CfC4CA38D096A8A509597C0144f3ca36' │ 500 │
│ 1       │ 'USDT-USDC' │ '0x3Eb41EcCC7Dc80dF57A35af685df1aeCdCBf057B' │ 500 │
└─────────┴─────────────┴──────────────────────────────────────────────┴─────┘
```
