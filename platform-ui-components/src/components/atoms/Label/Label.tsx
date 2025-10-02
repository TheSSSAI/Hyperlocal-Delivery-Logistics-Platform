import React from 'react';
import { StyledLabel } from './Label.styles';
import { LabelProps } from './Label.types';

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required,
  ...rest
}) => {
  return (
    <StyledLabel htmlFor={htmlFor} {...rest}>
      {children}
      {required && <span aria-hidden="true">*</span>}
    </StyledLabel>
  );
};

export default React.memo(Label);