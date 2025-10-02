/**
 * Defines the size of the spinner.
 * @default 'medium'
 */
export type SpinnerSize = 'small' | 'medium' | 'large';

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps {
  /**
   * The size of the spinner.
   * @default 'medium'
   */
  size?: SpinnerSize;

  /**
   * The color of the spinner. If not provided, it will inherit from the theme's primary color.
   */
  color?: string;

  /**
   * Accessibility label for screen readers.
   * It's important for non-visual users to know that content is loading.
   * @default 'Loading...'
   */
  accessibilityLabel?: string;
}