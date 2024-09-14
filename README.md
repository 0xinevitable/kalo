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
WETH 0xce1E977512c8E80E5791f67B8cCf931f9AF5ec7b
UniswapV3Factory 0xd6C1958586b7A6d84be7AF977BA79cFe97483AB3
SwapRouter 0xA47220DC4C6019331A77Dbf31f88547337f6DE11
NFTDescriptor 0x1f758Fe965a6e03cAaeA6D30F5b221b86B67c7a9
NonfungibleTokenPositionDescriptor 0x45A7D717F68C00B7Ba419fBD349a344097005A0F
NonfungiblePositionManager 0xaA35Cc7bda4Df3D7c001cf5aE35EbA5aEdD2e439
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
