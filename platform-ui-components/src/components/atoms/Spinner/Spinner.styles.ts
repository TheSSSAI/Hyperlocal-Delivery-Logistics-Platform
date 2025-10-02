import styled, { css, keyframes } from 'styled-components';
import { SpinnerProps } from './Spinner.types';

/**
 * Keyframe animation for the spinning effect of the spinner.
 * Uses a simple 360-degree rotation transform.
 */
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

/**
 * Helper function to determine the size styles for the spinner based on the `size` prop.
 * This keeps the main styled-component template literal clean.
 * @param size The size of the spinner ('small', 'medium', 'large').
 * @returns CSS block with width, height, and border-width.
 */
const getSizeStyles = (size: SpinnerProps['size']) => {
  switch (size) {
    case 'large':
      return css`
        width: 48px;
        height: 48px;
        border-width: 4px;
      `;
    case 'small':
      return css`
        width: 16px;
        height: 16px;
        border-width: 2px;
      `;
    case 'medium':
    default:
      return css`
        width: 24px;
        height: 24px;
        border-width: 3px;
      `;
  }
};

/**
 * Styled div for the Spinner component.
 * It applies the spinning animation and styles based on props.
 * The component is designed to be theme-aware, using colors from the theme object.
 */
export const StyledSpinner = styled.div<SpinnerProps>`
  display: inline-block;
  border-style: solid;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  ${({ size }) => getSizeStyles(size)};

  ${({ theme, variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          border-color: ${theme.colors.secondary.main};
          border-top-color: transparent;
        `;
      case 'light':
        return css`
          border-color: ${theme.colors.common.white};
          border-top-color: transparent;
        `;
      case 'primary':
      default:
        return css`
          border-color: ${theme.colors.primary.main};
          border-top-color: transparent;
        `;
    }
  }}
`;