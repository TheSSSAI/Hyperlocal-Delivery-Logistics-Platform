import React from 'react';
import { StyledButton, StyledButtonText } from './Button.styles';
import { ButtonProps } from './Button.types';
import { Spinner } from '../Spinner';
import { useTheme } from 'styled-components';

const Button: React.FC<ButtonProps> = React.memo(
  ({
    variant = 'primary',
    size = 'medium',
    children,
    isLoading = false,
    disabled = false,
    onClick,
    ...rest
  }) => {
    const theme = useTheme();

    const getSpinnerColor = () => {
      if (variant === 'primary') {
        return theme.colors.background.main;
      }
      return theme.colors.primary.main;
    };

    const isButtonDisabled = disabled || isLoading;

    return (
      <StyledButton
        variant={variant}
        size={size}
        disabled={isButtonDisabled}
        isLoading={isLoading}
        onClick={onClick}
        accessibilityRole="button"
        accessibilityState={{ disabled: isButtonDisabled }}
        {...rest}
      >
        {isLoading ? (
          <Spinner size="small" color={getSpinnerColor()} />
        ) : (
          <StyledButtonText variant={variant} size={size}>
            {children}
          </StyledButtonText>
        )}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;