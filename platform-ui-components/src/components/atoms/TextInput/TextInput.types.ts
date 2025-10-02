import type { TextInputProps as RNTextInputProps } from 'react-native';
import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Base props for the TextInput component, shared between web and native.
 */
interface TextInputBaseProps {
  /**
   * The unique identifier for the input field.
   * Necessary for associating the label with the input for accessibility.
   */
  id: string;

  /**
   * The label text for the input field. While the Label is a separate component,
   * this can be used by composite components like FormGroup.
   */
  label?: string;

  /**
   * If provided, displays an error message below the input and applies error styling.
   */
  error?: string;

  /**
   * If `true`, the input is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional icon to display at the start of the input field.
   */
  leftIcon?: ReactNode;

  /**
   * Optional icon or component to display at the end of the input field.
   */
  rightIcon?: ReactNode;

  /**
   * If `true`, the input will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Props for the web implementation of the TextInput component.
 * It extends standard HTML input attributes.
 */
export type TextInputPropsWeb = TextInputBaseProps &
  InputHTMLAttributes<HTMLInputElement>;

/**
 * Props for the native implementation of the TextInput component.
 * It extends standard React Native TextInput props.
 */
export type TextInputPropsNative = TextInputBaseProps & RNTextInputProps;

/**
 * The final, cross-platform TextInputProps type.
 */
export type TextInputProps = TextInputPropsWeb | TextInputPropsNative;