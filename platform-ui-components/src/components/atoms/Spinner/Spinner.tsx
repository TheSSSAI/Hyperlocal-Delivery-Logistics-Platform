import React from 'react';
import { SpinnerContainer } from './Spinner.styles';
import { SpinnerProps } from './Spinner.types';

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  ...rest
}) => {
  return (
    <div role="status" aria-live="polite" {...rest}>
      <SpinnerContainer size={size} color={color} />
      <span style={{ display: 'none' }}>Loading...</span>
    </div>
  );
};

export default React.memo(Spinner);