import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme, View, ActivityIndicator } from 'react-native';

import { useAuth } from '../features/auth/useAuth';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { lightTheme, darkTheme } from '../theme';
import { navigationRef } from './navigationService';

/**
 * @description RootNavigator is the main navigator for the application.
 * It determines which navigator to display based on the user's authentication status.
 * It also handles the initial loading state while checking for a persisted user session.
 * This component is the composition root for the entire navigation structure.
 *
 * @returns {React.ReactElement} The rendered navigator.
 */
export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isAuthLoading, checkUserSession } = useAuth();
  const scheme = useColorScheme();
  const currentTheme = scheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    // On application startup, trigger the check for a persisted user session.
    // The useAuth hook and authSlice will handle the state transitions.
    checkUserSession();
  }, [checkUserSession]);

  // While the application is determining the authentication state (e.g., checking
  // for a refresh token in secure storage), display a global loading indicator.
  // This prevents a "flash" of the login screen for already authenticated users.
  if (isAuthLoading) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={currentTheme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} theme={currentTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};