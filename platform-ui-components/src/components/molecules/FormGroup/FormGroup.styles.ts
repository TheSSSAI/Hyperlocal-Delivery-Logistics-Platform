import styled, { css } from 'styled-components';

export const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledErrorText = styled.p`
  ${({ theme }) => css`
    color: ${theme.colors.danger.main};
    font-size: ${theme.typography.caption.fontSize};
    font-weight: ${theme.typography.caption.fontWeight};
    margin-top: ${theme.spacing.space4};
    margin-bottom: 0;
    padding-left: ${theme.spacing.space2};
    min-height: calc(
      ${theme.typography.caption.fontSize} * 1.2
    ); // Reserve space to prevent layout shift
  `}
`;