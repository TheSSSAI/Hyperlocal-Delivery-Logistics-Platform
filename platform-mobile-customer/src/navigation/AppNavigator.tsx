import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './navigation.types';
import { ScreenNames } from '../config/constants';

// Import all main application screens
import HomeScreen from '../screens/Home/HomeScreen';
import VendorDetailScreen from '../screens/Products/VendorDetailScreen';
import SearchResultsScreen from '../screens/Products/SearchResultsScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import PaymentScreen from '../screens/Checkout/PaymentScreen';
import OrderTrackingScreen from '../screens/Orders/OrderTrackingScreen';
import OrderHistoryScreen from '../screens/Orders/OrderHistoryScreen';
import RatingScreen from '../screens/Orders/RatingScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AddressListScreen from '../screens/Profile/AddressListScreen';
import AddEditAddressScreen from '../screens/Profile/AddEditAddressScreen';
import PrivacySettingsScreen from '../screens/Profile/PrivacySettingsScreen';
import ChatScreen from '../screens/Shared/ChatScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * @namespace Platform.Mobile.Customer
 * @component AppNavigator
 * @description Manages the main application navigation stack for authenticated users.
 * This includes all screens accessible after a successful login, such as home,
 * product discovery, cart, checkout, order tracking, and profile management.
 */
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.Home}
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name={ScreenNames.Home}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenNames.VendorDetail}
        component={VendorDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenNames.SearchResults}
        component={SearchResultsScreen}
        options={{ title: 'Search Results' }}
      />
      <Stack.Screen
        name={ScreenNames.Cart}
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />
      <Stack.Screen
        name={ScreenNames.Checkout}
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen
        name={ScreenNames.Payment}
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />
      <Stack.Screen
        name={ScreenNames.OrderTracking}
        component={OrderTrackingScreen}
        options={{ title: 'Track Order' }}
      />
      <Stack.Screen
        name={ScreenNames.OrderHistory}
        component={OrderHistoryScreen}
        options={{ title: 'My Orders' }}
      />
      <Stack.Screen
        name={ScreenNames.Profile}
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen
        name={ScreenNames.AddressList}
        component={AddressListScreen}
        options={{ title: 'My Addresses' }}
      />
      <Stack.Screen
        name={ScreenNames.AddEditAddress}
        component={AddEditAddressScreen}
        options={({ route }) => ({
          title: route.params?.addressId ? 'Edit Address' : 'Add Address',
          presentation: 'modal',
        })}
      />
      <Stack.Screen
        name={ScreenNames.PrivacySettings}
        component={PrivacySettingsScreen}
        options={{ title: 'Data & Privacy' }}
      />
      
      {/* Screens presented as modals */}
      <Stack.Screen
        name={ScreenNames.Rating}
        component={RatingScreen}
        options={{
          presentation: 'modal',
          title: 'Rate Your Order',
        }}
      />
      <Stack.Screen
        name={ScreenNames.Chat}
        component={ChatScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;