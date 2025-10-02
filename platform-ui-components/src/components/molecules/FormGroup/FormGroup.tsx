import React, { useId, Children, cloneElement, isValidElement } from 'react';
import { Label } from '../Label';
import { FormGroupProps } from './FormGroup.types';
import { FormGroupWrapper, ErrorText } from './FormGroup.styles';

/**
 * FormGroup is a molecule component that composes a Label, a form control (like TextInput),
 * and an optional error message. It ensures consistent layout, spacing, and accessibility
 * by programmatically linking the label and error message to the form control.
 *
 * This component is critical for building accessible forms as required by REQ-1-086.
 */
export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  error,
  children,
  id: providedId,
  className,
  style,
}) => {
  const fallbackId = useId();
  const id = providedId || fallbackId;
  const errorId = error ? `${id}-error` : undefined;

  // We expect a single React element as a child to inject props into.
  const child = Children.only(children);

  if (!isValidElement(child)) {
    // In a real-world scenario, you might want to throw an error
    // or handle this more gracefully, but for most form cases,
    // a single valid element is a safe assumption.
    return null;
  }

  // Clone the child element (e.g., TextInput) to inject accessibility props.
  // This is a powerful pattern that allows FormGroup to be highly reusable
  // with any form input component that accepts these standard props.
  const inputElement = cloneElement(child, {
    id: id,
    'aria-describedby': errorId,
    'aria-invalid': !!error,
    ...child.props, // Ensure original props are preserved
  });

  return (
    <FormGroupWrapper className={className} style={style}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {inputElement}
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
    </FormGroupWrapper>
  );
};