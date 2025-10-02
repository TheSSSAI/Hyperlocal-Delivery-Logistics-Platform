import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../theme';
import { Button } from './Button';
import 'jest-styled-components';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Button', () => {
  it('should render correctly with children', () => {
    renderWithTheme(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should handle onClick events', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply the primary variant by default', () => {
    renderWithTheme(<Button>Primary Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /primary button/i });
    expect(buttonElement).toHaveStyleRule('background-color', theme.colors.primary.main);
  });

  it('should apply the secondary variant when specified', () => {
    renderWithTheme(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /secondary button/i });
    expect(buttonElement).toHaveStyleRule('background-color', theme.colors.secondary.main);
  });

  it('should apply the danger variant when specified', () => {
    renderWithTheme(<Button variant="danger">Danger Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /danger button/i });
    expect(buttonElement).toHaveStyleRule('background-color', theme.colors.danger.main);
  });

  it('should render as a link variant', () => {
    renderWithTheme(<Button variant="link">Link Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /link button/i });
    expect(buttonElement).toHaveStyleRule('background-color', 'transparent');
    expect(buttonElement).toHaveStyleRule('color', theme.colors.primary.main);
  });

  it('should be disabled when the disabled prop is true', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const buttonElement = screen.getByRole('button', { name: /disabled/i });
    expect(buttonElement).toBeDisabled();
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show a spinner and be disabled when isLoading is true', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <Button isLoading onClick={handleClick}>
        Loading
      </Button>
    );
    const buttonElement = screen.getByRole('button', { name: /loading/i });
    const spinnerElement = screen.getByRole('progressbar');

    expect(buttonElement).toBeDisabled();
    expect(spinnerElement).toBeInTheDocument();
    
    // The text content might be visually hidden but still in the DOM
    expect(screen.getByText('Loading')).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not show a spinner when isLoading is false', () => {
    renderWithTheme(<Button isLoading={false}>Not Loading</Button>);
    const spinnerElement = screen.queryByRole('progressbar');
    expect(spinnerElement).not.toBeInTheDocument();
  });

  it('should apply different sizes', () => {
    const { rerender } = renderWithTheme(<Button size="small">Small</Button>);
    const smallButton = screen.getByRole('button', { name: /small/i });
    expect(smallButton).toHaveStyleRule('padding', '0.5rem 1rem'); // Example values

    rerender(<Button size="medium">Medium</Button>);
    const mediumButton = screen.getByRole('button', { name: /medium/i });
    expect(mediumButton).toHaveStyleRule('padding', '0.75rem 1.5rem'); // Example values

    rerender(<Button size="large">Large</Button>);
    const largeButton = screen.getByRole('button', { name: /large/i });
    expect(largeButton).toHaveStyleRule('padding', '1rem 2rem'); // Example values
  });

  it('should pass through additional props like aria-label', () => {
    renderWithTheme(<Button aria-label="Submit Form">Submit</Button>);
    expect(screen.getByLabelText('Submit Form')).toBeInTheDocument();
  });
});