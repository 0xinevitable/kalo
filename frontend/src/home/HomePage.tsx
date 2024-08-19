import styled from '@emotion/styled';
import React from 'react';

import { Notification } from '@/components/Notification';
import { usePassportScore } from '@/hooks/usePassportScore';

declare global {
  interface Window {
    keplr: any;
  }
}

const HomePage = () => {
  const { score, loading, error } = usePassportScore(
    '7865',
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  );

  return (
    <>
      <Notification />

      <div className="mt-[100px]">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {score !== null && <p>Score: {score}</p>}
      </div>
    </>
  );
};

export default HomePage;

const Container = styled.main`
  padding: 42px 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
