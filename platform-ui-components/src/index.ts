/**
 * Main entry point for the platform-ui-components library.
 * This file exports all the public-facing components, hooks, and theme utilities
 * that will be consumed by the client applications.
 *
 * By exporting from the individual barrels (index.ts files in subdirectories),
 * we ensure that the library is tree-shakeable and that consumers can import
 * only the components they need.
 */

// Export all components (atoms, molecules, organisms)
export * from './components';

// Export all reusable hooks
export * from './hooks';

// Export theme-related utilities and types
export * from './theme';

// Export specific type definitions that are part of the public API
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from './components/atoms/Button/Button.types';
export type { SpinnerProps } from './components/atoms/Spinner/Spinner.types';
export type {
  TextInputProps,
  TextInputType,
} from './components/atoms/TextInput/TextInput.types';
export type { LabelProps } from './components/atoms/Label/Label.types';
export type { FormGroupProps } from './components/molecules/FormGroup/FormGroup.types';
export type { ModalProps } from './components/organisms/Modal/Modal.types';

export type {
  Theme,
  ColorPalette,
  TypographyScale,
  SpacingScale,
} from './theme/theme.types';