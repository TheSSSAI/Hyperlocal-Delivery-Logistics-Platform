import type { PressableProps } from 'react-native';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Defines the visual style of the button.
 * @default 'primary'
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

/**
 * Defines the size of the button, affecting padding and font size.
 * @default 'medium'
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Base props for the Button component, shared between web and native.
 */
interface ButtonBaseProps {
  /**
   * The content to be displayed inside the button.
   */
  children: ReactNode;

  /**
   * The visual style of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * The size of the button.
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * If `true`, the button will be disabled and non-interactive.
   * @default false
   */
  disabled?: boolean;

  /**
   * If `true`, a loading spinner will be displayed, and the button will be disabled.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Optional icon to display before the button text.
   */
  leftIcon?: ReactNode;

  /**
   * Optional icon to display after the button text.
   */
  rightIcon?: ReactNode;

  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Props for the web implementation of the Button component.
 * It extends standard HTML button attributes.
 */
export type ButtonPropsWeb = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    onPress?: () => void; // for compatibility with native
  };

/**
 * Props for the native implementation of the Button component.
 * It extends standard React Native Pressable props.
 */
export type ButtonPropsNative = ButtonBaseProps &
  PressableProps & {
    onClick?: () => void; // for compatibility with web
  };

/**
 * The final, cross-platform ButtonProps type.
 * In a platform-specific file (.web.ts or .native.ts), one of the above types will be exported as ButtonProps.
 * This union type is useful for shared logic if any.
 */
export type ButtonProps = ButtonPropsWeb | ButtonPropsNative;