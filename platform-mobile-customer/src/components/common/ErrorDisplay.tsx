import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../config/constants';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

/**
 * @component ErrorDisplay
 * @description A reusable component to display an error message with an optional retry button.
 * Essential for handling API errors gracefully across the application.
 * @param {ErrorDisplayProps} props
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} color={COLORS.primary} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.background,
  },
  messageText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
});

export default ErrorDisplay;