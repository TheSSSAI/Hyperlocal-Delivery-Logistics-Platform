import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './navigation.types';

// Assuming these screens are created in their respective feature folders
// This adheres to the feature-sliced architecture.
import LoginScreen from '../features/auth/screens/LoginScreen';
import OtpScreen from '../features/auth/screens/OtpScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * @name AuthNavigator
 * @description Manages the navigation stack for the authentication flow.
 * It includes screens for login and OTP verification. This navigator is
 * intended for users who are not yet authenticated.
 *
 * @returns {React.ReactElement} The rendered stack navigator for authentication.
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false, // Headers are managed by individual screens
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{
          title: 'Verify OTP',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;