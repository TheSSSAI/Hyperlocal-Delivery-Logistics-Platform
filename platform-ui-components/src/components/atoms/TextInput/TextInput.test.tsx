import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../theme';
import { TextInput } from './TextInput';
import 'jest-styled-components';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('TextInput', () => {
  it('should render correctly with a placeholder', () => {
    renderWithTheme(<TextInput placeholder="Enter your name" />);
    const inputElement = screen.getByPlaceholderText('Enter your name');
    expect(inputElement).toBeInTheDocument();
  });

  it('should handle onChange events', async () => {
    const handleChange = jest.fn();
    renderWithTheme(<TextInput onChange={handleChange} placeholder="test" />);
    const inputElement = screen.getByPlaceholderText('test');
    await userEvent.type(inputElement, 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5);
    // userEvent triggers onChange for each character
    expect(handleChange).toHaveBeenLastCalledWith(expect.any(Object));
  });

  it('should be disabled when the disabled prop is true', () => {
    renderWithTheme(<TextInput disabled placeholder="disabled input" />);
    const inputElement = screen.getByPlaceholderText('disabled input');
    expect(inputElement).toBeDisabled();
  });

  it('should display an error state when the error prop is true', () => {
    renderWithTheme(<TextInput error placeholder="error input" />);
    const inputElement = screen.getByPlaceholderText('error input');
    expect(inputElement).toHaveStyleRule('border-color', theme.colors.danger.main);
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not display an error state when the error prop is false', () => {
    renderWithTheme(<TextInput error={false} placeholder="no error" />);
    const inputElement = screen.getByPlaceholderText('no error');
    expect(inputElement).not.toHaveStyleRule('border-color', theme.colors.danger.main);
    expect(inputElement).toHaveAttribute('aria-invalid', 'false');
  });

  it('should accept and forward a ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithTheme(<TextInput ref={ref} placeholder="ref input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should control the value of the input', () => {
    const ControllableInput = () => {
      const [value, setValue] = React.useState('');
      return (
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="controlled"
        />
      );
    };
    renderWithTheme(<ControllableInput />);
    const inputElement = screen.getByPlaceholderText('controlled');
    expect(inputElement).toHaveValue('');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(inputElement).toHaveValue('new value');
  });

  it('should pass through additional props like type', () => {
    renderWithTheme(<TextInput type="password" placeholder="password" />);
    const inputElement = screen.getByPlaceholderText('password');
    expect(inputElement).toHaveAttribute('type', 'password');
  });
});