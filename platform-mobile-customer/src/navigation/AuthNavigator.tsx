import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './navigation.types';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import { ScreenNames } from '../config/constants';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * @namespace Platform.Mobile.Customer
 * @component AuthNavigator
 * @description Manages the navigation stack for the authentication flow.
 * This includes screens for login, registration, and OTP verification.
 * It is displayed to users who are not yet authenticated.
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.Login}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={ScreenNames.Login} component={LoginScreen} />
      <Stack.Screen name={ScreenNames.Register} component={RegisterScreen} />
      <Stack.Screen
        name={ScreenNames.Otp}
        component={OtpScreen}
        options={{
          animation: 'fade',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;