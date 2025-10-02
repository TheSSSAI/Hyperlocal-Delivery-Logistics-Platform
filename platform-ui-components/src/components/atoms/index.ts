/**
 * @file Barrel file for all atomic components.
 *
 * This file re-exports all atomic components from a single entry point,
 * simplifying imports for consumers of the component library. Instead of
 * importing from individual component folders, consumers can import multiple
 * atoms from '@platform/ui-components/atoms'.
 *
 * This pattern aligns with the Atomic Design methodology and improves
 * the maintainability and usability of the design system.
 *
 * @package platform-ui-components
 */

export * from './Button';
export * from './Label';
export * from './Spinner';
export * from './TextInput';