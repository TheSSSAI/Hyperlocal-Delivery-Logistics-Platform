import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../config/constants';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withScrollView?: boolean;
  withKeyboardAvoidingView?: boolean;
}

/**
 * @component ScreenWrapper
 * @description A reusable wrapper component for all screens.
 * It applies safe area insets, a consistent background color, and optional
 * scroll view and keyboard avoiding view capabilities.
 * @param {ScreenWrapperProps} props
 */
const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  withScrollView = true,
  withKeyboardAvoidingView = true,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + SPACING.medium,
      paddingRight: insets.right + SPACING.medium,
    },
    style,
  ];

  const content = withScrollView ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={styles.flexOne}>{children}</View>
  );

  if (withKeyboardAvoidingView) {
    return (
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={containerStyle}>{content}</View>
      </KeyboardAvoidingView>
    );
  }

  return <View style={containerStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default ScreenWrapper;