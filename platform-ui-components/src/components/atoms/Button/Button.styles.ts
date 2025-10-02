import styled, { css, DefaultTheme } from 'styled-components';
import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

const getVariantStyles = (
  theme: DefaultTheme,
  variant: ButtonVariant = 'primary',
) => {
  switch (variant) {
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondary.main};
        color: ${theme.colors.secondary.contrastText};
        border: 1px solid ${theme.colors.secondary.main};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary.dark};
          border-color: ${theme.colors.secondary.dark};
        }
      `;
    case 'danger':
      return css`
        background-color: ${theme.colors.error.main};
        color: ${theme.colors.error.contrastText};
        border: 1px solid ${theme.colors.error.main};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.error.dark};
          border-color: ${theme.colors.error.dark};
        }
      `;
    case 'link':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary.main};
        border: none;
        padding: 0;
        height: auto;
        &:hover:not(:disabled) {
          color: ${theme.colors.primary.dark};
          text-decoration: underline;
        }
      `;
    case 'primary':
    default:
      return css`
        background-color: ${theme.colors.primary.main};
        color: ${theme.colors.primary.contrastText};
        border: 1px solid ${theme.colors.primary.main};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary.dark};
          border-color: ${theme.colors.primary.dark};
        }
      `;
  }
};

const getSizeStyles = (theme: DefaultTheme, size: ButtonSize = 'medium') => {
  switch (size) {
    case 'small':
      return css`
        font-size: ${theme.typography.buttonSmall.fontSize};
        padding: ${theme.spacing.space1} ${theme.spacing.space2};
        height: 32px;
      `;
    case 'large':
      return css`
        font-size: ${theme.typography.buttonLarge.fontSize};
        padding: ${theme.spacing.space3} ${theme.spacing.space6};
        height: 56px;
      `;
    case 'medium':
    default:
      return css`
        font-size: ${theme.typography.button.fontSize};
        padding: ${theme.spacing.space2} ${theme.spacing.space4};
        height: 44px;
      `;
  }
};

export const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.button.fontWeight};
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;

  ${({ theme, variant }) => getVariantStyles(theme, variant)};
  ${({ theme, size }) => getSizeStyles(theme, size)};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ButtonContent = styled.span<{ isLoading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ isLoading }) => (isLoading ? 0 : 1)};
`;

export const SpinnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;