import styled from '@emotion/styled';

export const Notification: React.FC = () => {
  return (
    <Container>
      <SymbolLogo />
      Kalo is currently in testnet phase
      <SymbolLogo />
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  display: flex;
  width: 100%;
  height: 24px;
  padding: 0px 45px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  background: #7d32ff;

  color: #c9aaff;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.64px;
  text-transform: uppercase;
`;

const SymbolLogo: React.FC = () => (
  <svg
    width="15"
    height="12"
    viewBox="0 0 15 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.63552 3.65769C6.22577 4.81515 5.32315 5.65958 4.2453 6.03604C4.86626 7.00158 5.05633 8.23087 4.65803 9.40099L4.64891 9.42747C4.30022 10.4287 3.58363 11.1977 2.7029 11.6351L1.44284 8.93229L3.82013 2.02812L6.47698 0.674095C6.89905 1.55539 6.99186 2.59493 6.65788 3.59277L6.63552 3.65769Z"
      fill="#C9AAFF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.367 3.65731C9.95726 4.8149 9.05459 5.65941 7.97666 6.03591C8.59996 7.00508 8.78911 8.24001 8.38484 9.41409C8.03789 10.4217 7.31893 11.1955 6.4344 11.6349L5.17435 8.9321L7.55158 2.02812L10.2084 0.674094C10.6305 1.55543 10.7232 2.595 10.3892 3.59287L10.367 3.65731Z"
      fill="#C9AAFF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9399 0.674093C14.3664 1.56492 14.4566 2.6174 14.1096 3.62506C13.7054 4.79914 12.796 5.65582 11.7082 6.0358C12.3315 7.00499 12.5207 8.23995 12.1164 9.41407C11.7694 10.4217 11.0504 11.1955 10.1659 11.6349L8.90581 8.93205L11.283 2.02812L13.9399 0.674093Z"
      fill="#C9AAFF"
    />
  </svg>
);
