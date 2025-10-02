import type { TextInputProps } from '../TextInput/TextInput.types';
import type { LabelProps } from '../Label/Label.types';

/**
 * Props for the FormGroup component.
 * This component composes a Label, a form control (like TextInput),
 * an optional help text, and an optional error message.
 */
export interface FormGroupProps {
  /**
   * The unique identifier for the form group, used to link the label and input.
   */
  id: string;

  /**
   * The text to be displayed in the label.
   */
  label: string;

  /**
   * Optional props to pass directly to the Label component.
   */
  labelProps?: Omit<LabelProps, 'children'>;

  /**
   * Optional help text to display below the input field.
   */
  helpText?: string;

  /**
   * Optional error message to display below the input field.
   * If provided, it will override the help text and apply error styling.
   */
  error?: string;

  /**
   * All props for the underlying TextInput component will be passed through.
   * This makes the FormGroup a flexible wrapper around TextInput.
   */
  textInputProps: Omit<TextInputProps, 'id' | 'error'>;

  /**
   * Custom class name for styling from the parent.
   */
  className?: string;
}