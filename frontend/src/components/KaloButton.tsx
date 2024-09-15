import styled from '@emotion/styled';

export const KaloButton = styled.button`
  display: flex;
  height: 36px;
  padding: 3px 11px;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  background: #ddd;
  color: rgba(126, 126, 126, 0.88);

  font-size: 16px;
  font-weight: 700;
  line-height: 105%; /* 16.8px */
  letter-spacing: -0.65px;

  &.primary {
    background: #5d00ff;
    color: #ffffff;
  }

  &.shadow {
    box-shadow: 0px 4px 12px 0px rgba(93, 0, 255, 0.58);
  }

  transition: opacity 0.16s;

  &:hover {
    opacity: 0.8;
  }
`;
