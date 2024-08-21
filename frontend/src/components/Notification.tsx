import styled from '@emotion/styled';

export const Notification: React.FC = () => {
  return (
    <Container>
      <SymbolLogo />
      Kinetics is currently in testnet phase
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
  height: 42px;
  padding: 0px 45px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  background: #7d32ff;

  color: #c9aaff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.64px;
  text-transform: uppercase;
`;

const SymbolLogo: React.FC = () => (
  <svg
    width="17"
    height="14"
    viewBox="0 0 17 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.25036 4.24213C6.77654 5.60536 5.71829 6.60001 4.45307 7.04196C5.17891 8.17061 5.40011 9.60814 4.93184 10.9757L4.92668 10.9906C4.52092 12.1626 3.68348 13.0626 2.65368 13.5741L1.18368 10.421L3.95709 2.36642L7.05673 0.786724C7.55257 1.82227 7.65877 3.04503 7.25909 4.21675L7.25036 4.24213Z"
      fill="#C9AAFF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.6031 4.24374C11.129 5.60616 10.071 6.6002 8.8063 7.04198C9.5321 8.17057 9.75331 9.60802 9.28513 10.9755L9.27984 10.9908C8.87405 12.1627 8.03665 13.0627 7.00691 13.5741L5.53691 10.421L8.31033 2.36643L11.41 0.786728C11.9056 1.8218 12.0119 3.04392 11.6129 4.21515L11.6031 4.24374Z"
      fill="#C9AAFF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.7632 0.786723C16.2608 1.826 16.366 3.05386 15.9612 4.22943C15.4896 5.59917 14.4287 6.59862 13.1596 7.04194C13.8837 8.16787 14.1055 9.60122 13.6417 10.9658L13.6297 11.0005C13.2227 12.1676 12.3871 13.0641 11.3601 13.5742L9.89015 10.421L12.6636 2.36642L15.7632 0.786723Z"
      fill="#C9AAFF"
    />
  </svg>
);