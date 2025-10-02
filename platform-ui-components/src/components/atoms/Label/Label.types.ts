import type { LabelHTMLAttributes, ReactNode } from 'react';
import type { TextProps } from 'react-native';

/**
 * Base props for the Label component, shared between web and native.
 */
interface LabelBaseProps {
  /**
   * The content to be displayed within the label.
   */
  children: ReactNode;
  /**
   * If `true`, an asterisk will be displayed to indicate the field is required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, applies disabled styling.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for the web implementation of the Label component.
 * It extends standard HTML label attributes.
 * The `htmlFor` prop is critical for accessibility on the web.
 */
export type LabelPropsWeb = LabelBaseProps & LabelHTMLAttributes<HTMLLabelElement>;

/**

 * Props for the native implementation of the Label component.
 * It extends standard React Native Text props.
 * The `nativeID` prop is used to associate the label with an input.
 */
export type LabelPropsNative = LabelBaseProps & TextProps;

/**
 * The final, cross-platform LabelProps type.
 */
export type LabelProps = LabelPropsWeb | LabelPropsNative;