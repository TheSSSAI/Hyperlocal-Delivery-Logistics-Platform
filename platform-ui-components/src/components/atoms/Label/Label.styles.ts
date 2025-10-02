import styled, { css } from 'styled-components';
import { LabelProps } from './Label.types';

/**
 * Styled label component for use in forms.
 * It renders a native `<label>` element for web accessibility, ensuring that it can be
 * programmatically associated with a form input.
 *
 * Styles are derived from the theme for typography and colors.
 * It also supports `disabled` and `error` states, which alter its color to provide
 * clear visual feedback to the user, in compliance with REQ-1-086.
 */
export const StyledLabel = styled.label<LabelProps>`
  display: block;
  font-family: ${({ theme }) => theme.typography.label.fontFamily};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.typography.label.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.space2};
  transition: color 0.2s ease-in-out;

  ${({ theme, error }) =>
    error &&
    css`
      color: ${theme.colors.danger.main};
    `}

  ${({ theme, disabled }) =>
    disabled &&
    css`
      color: ${theme.colors.text.disabled};
      cursor: not-allowed;
    `}
`;