import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../theme';
import { FormGroup } from './FormGroup';
import 'jest-styled-components';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('FormGroup', () => {
  it('should render a label and an input', () => {
    renderWithTheme(
      <FormGroup label="Username" id="username">
        <input id="username" />
      </FormGroup>,
    );
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument();
  });

  it('should correctly associate the label with the input using the id', () => {
    renderWithTheme(
      <FormGroup label="Email Address" id="email">
        <input id="email" type="email" />
      </FormGroup>,
    );
    const label = screen.getByText('Email Address');
    const input = screen.getByLabelText('Email Address');
    expect(label).toHaveAttribute('for', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('should display an error message when the error prop is provided', () => {
    const errorMessage = 'Email is required';
    renderWithTheme(
      <FormGroup label="Email" id="email" error={errorMessage}>
        <input id="email" type="email" />
      </FormGroup>,
    );
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveStyleRule('color', theme.colors.danger.main);
  });

  it('should not display an error message when the error prop is not provided', () => {
    const errorMessage = 'Email is required';
    renderWithTheme(
      <FormGroup label="Email" id="email">
        <input id="email" type="email" />
      </FormGroup>,
    );
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it('should associate the input with the error message for accessibility', () => {
    const errorMessage = 'This field is invalid';
    renderWithTheme(
      <FormGroup label="Test Input" id="test-input" error={errorMessage}>
        <input id="test-input" />
      </FormGroup>,
    );
    const input = screen.getByLabelText('Test Input');
    const error = screen.getByText(errorMessage);
    const errorId = error.getAttribute('id');

    expect(errorId).toBeTruthy();
    expect(input).toHaveAttribute('aria-describedby', errorId);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not have aria-describedby if there is no error', () => {
    renderWithTheme(
      <FormGroup label="Test Input" id="test-input">
        <input id="test-input" />
      </FormGroup>,
    );
    const input = screen.getByLabelText('Test Input');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
  });
});