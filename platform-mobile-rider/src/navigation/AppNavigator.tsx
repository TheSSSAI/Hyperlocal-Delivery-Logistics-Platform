import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthStatus, selectAuth } from '../features/auth/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { theme } from '../shared/styles/theme';

/**
 * A simple splash screen component to show while checking authentication status.
 */
const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

/**
 * The root navigator for the application.
 *
 * This component is responsible for determining the user's authentication state
 * and conditionally rendering the appropriate navigation stack:
 * - `AuthNavigator` for unauthenticated users (login, registration).
 * - `MainNavigator` for authenticated users (main app features).
 *
 * It also displays a splash screen during the initial authentication check on app startup.
 */
export const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accessToken, status: authStatus } = useAppSelector(selectAuth);

  useEffect(() => {
    // On application start, dispatch an action to check for a persisted session token.
    // This thunk will handle reading from secure storage and updating the auth state.
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Render a splash screen while the initial authentication check is in progress.
  // This prevents screen flickering between auth and main stacks on app launch.
  if (authStatus === 'loading' || authStatus === 'idle') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={accessToken ? 'light-content' : 'dark-content'}
        backgroundColor={accessToken ? theme.colors.background : theme.colors.white}
      />
      {accessToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});