import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import { FeaturesSection } from './sections/FeaturesSection';

declare global {
  interface Window {
    keplr: any;
  }
}

const HomePage = () => {
  const [account, setAccount] = useState<string>('');

  // useEffect(() => {
  //   window.onload = async () => {
  //     if (!window.keplr) {
  //       alert('Please install keplr extension');
  //     } else {
  //       const chainId = 'kiichain-1';

  //       await window.keplr.experimentalSuggestChain({
  //         chainId: 'kiichain-1',
  //         chainName: 'kiichain',
  //         rpc: 'https://a.sentry.testnet.kiivalidator.com:8645',
  //         rest: 'https://a.sentry.testnet.kiivalidator.com',
  //         bip44: {
  //           coinType: 118,
  //         },
  //         coinType: 118,
  //         bech32Config: {
  //           bech32PrefixAccAddr: 'kii',
  //           bech32PrefixAccPub: 'kiipub',
  //           bech32PrefixValAddr: 'kiivaloper',
  //           bech32PrefixValPub: 'kiivaloperpub',
  //           bech32PrefixConsAddr: 'kiivalcons',
  //           bech32PrefixConsPub: 'kiivalconspub',
  //         },
  //         currencies: [
  //           {
  //             coinDenom: 'KII',
  //             coinMinimalDenom: 'tkii',
  //             coinDecimals: 6,
  //             coinGeckoId: 'unknown',
  //           },
  //         ],
  //         feeCurrencies: [
  //           {
  //             coinDenom: 'KII',
  //             coinMinimalDenom: 'tkii',
  //             coinDecimals: 6,
  //             coinGeckoId: 'unknown',
  //             gasPriceStep: {
  //               low: 0.01,
  //               average: 0.025,
  //               high: 0.03,
  //             },
  //           },
  //         ],
  //         gasPriceStep: {
  //           low: 0.01,
  //           average: 0.025,
  //           high: 0.03,
  //         },
  //         stakeCurrency: {
  //           coinDenom: 'KII',
  //           coinMinimalDenom: 'tkii',
  //           coinDecimals: 6,
  //           coinGeckoId: 'unknown',
  //         },
  //         features: [],
  //       });

  //       // Enabling before using the Keplr is recommended.
  //       // This method will ask the user whether to allow access if they haven't visited this website.
  //       // Also, it will request that the user unlock the wallet if the wallet is locked.
  //       await window.keplr.enable(chainId);

  //       const offlineSigner = window.keplr.getOfflineSigner(chainId);

  //       // You can get the address/public keys by `getAccounts` method.
  //       // It can return the array of address/public key.
  //       // But, currently, Keplr extension manages only one address/public key pair.
  //       // XXX: This line is needed to set the sender address for SigningCosmosClient.
  //       const accounts = await offlineSigner.getAccounts();
  //       console.log(accounts);

  //       setAccount(accounts[0].address);

  //       // Initialize the gaia api with the offline signer that is injected by Keplr extension.
  //       // const cosmJS = new SigningCosmosClient(
  //       //   'https://lcd-cosmoshub.keplr.app',
  //       //   accounts[0].address,
  //       //   offlineSigner,
  //       // );
  //     }
  //   };
  // }, []);

  return (
    <Container>
      <Notification>Kinetics is currently in testnet phase</Notification>
      <BrandName>Kinetics</BrandName>
      <Title>
        The <br />
        Infra Hub
        <br /> for KiiChain
      </Title>
      <Button>Start Now</Button>
      <FeaturesSection />
    </Container>
  );
};

export default HomePage;

const Container = styled.div``;
const Notification = styled.div``;
const BrandName = styled.span``;
const Title = styled.h1`
  color: #1d004f;
  text-shadow: 0px 12px 49px #d4bcff;
  font-family: Futura;
  font-size: 72px;
  font-style: normal;
  font-weight: 500;
  line-height: 105%; /* 75.6px */
  letter-spacing: -7.2px;
  text-transform: uppercase;
`;
const Button = styled.button``;
