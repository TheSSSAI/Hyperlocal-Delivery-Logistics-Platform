import React, { forwardRef } from 'react';
import {
  StyledInputContainer,
  StyledTextInput,
  IconContainer,
} from './TextInput.styles';
import { TextInputProps } from './TextInput.types';

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, leftIcon, rightIcon, ...rest }, ref) => {
    const hasError = !!error;

    return (
      <StyledInputContainer hasError={hasError} disabled={rest.disabled}>
        {leftIcon && <IconContainer position="left">{leftIcon}</IconContainer>}
        <StyledTextInput ref={ref} hasError={hasError} {...rest} />
        {rightIcon && <IconContainer position="right">{rightIcon}</IconContainer>}
      </StyledInputContainer>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;