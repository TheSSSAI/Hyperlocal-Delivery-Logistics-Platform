import styled, { css } from 'styled-components';
import { TextInputProps } from './TextInput.types';

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input<TextInputProps>`
  width: 100%;
  height: 48px;
  padding: ${({ theme }) =>
    `${theme.spacing.space2} ${theme.spacing.space3}`};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}80;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.background.paper};
    opacity: 0.7;
  }

  ${({ error, theme }) =>
    error &&
    css`
      border-color: ${theme.colors.error.main};
      &:focus {
        border-color: ${theme.colors.error.main};
        box-shadow: 0 0 0 3px ${theme.colors.error.light}80;
      }
    `}
`;