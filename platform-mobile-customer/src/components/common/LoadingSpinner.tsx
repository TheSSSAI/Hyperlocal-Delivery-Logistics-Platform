import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../../config/constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullscreen?: boolean;
}

/**
 * @component LoadingSpinner
 * @description A reusable, styled loading indicator. Can be used inline or as a fullscreen overlay.
 * @param {LoadingSpinnerProps} props
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = COLORS.primary,
  style,
  fullscreen = false,
}) => {
  if (fullscreen) {
    return (
      <View style={styles.fullscreenContainer}>
        <ActivityIndicator size={size} color={color} style={style} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={color} style={style} />;
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 999,
  },
});

export default LoadingSpinner;