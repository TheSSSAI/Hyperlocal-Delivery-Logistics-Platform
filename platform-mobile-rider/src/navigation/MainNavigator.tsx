import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MainStackParamList,
  MainTabParamList,
  HomeStackParamList,
  EarningsStackParamList,
  ProfileStackParamList,
} from './navigation.types';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- Screen Imports ---
// Level 9 Screens
import TaskOfferScreen from '../features/task/screens/TaskOfferScreen';
import ActiveTaskScreen from '../features/task/screens/ActiveTaskScreen';

// Assumed Screens (based on user stories and requirements)
import HomeScreen from '../features/dashboard/screens/HomeScreen';
import EarningsScreen from '../features/earnings/screens/EarningsScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

// --- Stack Navigator Definitions ---

const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const HomeStack = () => (
  <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNav.Screen name="Home" component={HomeScreen} />
    <HomeStackNav.Screen name="ActiveTask" component={ActiveTaskScreen} />
  </HomeStackNav.Navigator>
);

const EarningsStackNav = createNativeStackNavigator<EarningsStackParamList>();
const EarningsStack = () => (
  <EarningsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <EarningsStackNav.Screen name="Earnings" component={EarningsScreen} />
    {/* Add screens for statement details, etc. here in the future */}
  </EarningsStackNav.Navigator>
);

const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();
const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="Profile" component={ProfileScreen} />
    {/* Add screens for editing profile, vehicle details, etc. here in the future */}
  </ProfileStackNav.Navigator>
);

// --- Bottom Tab Navigator Definition ---

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'EarningsStack') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6347', // Example primary color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="EarningsStack"
        component={EarningsStack}
        options={{ title: 'Earnings' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// --- Main Stack Navigator (including Modals) ---

const MainStackNav = createNativeStackNavigator<MainStackParamList>();

/**
 * @name MainNavigator
 * @description Manages the navigation for the main application flow for an
 * authenticated user. It uses a nested structure: a root StackNavigator
 * that contains a BottomTabNavigator and any global modal screens. This
 * allows modals like the Task Offer screen to be presented over any tab.
 *
 * @returns {React.ReactElement} The rendered stack navigator for the main application.
 */
const MainNavigator = () => {
  return (
    <MainStackNav.Navigator screenOptions={{ headerShown: false }}>
      <MainStackNav.Screen name="MainTabs" component={TabNavigator} />
      {/* --- Global Modals --- */}
      {/* TaskOfferScreen is presented as a modal over the entire app */}
      <MainStackNav.Screen
        name="TaskOffer"
        component={TaskOfferScreen}
        options={{ presentation: 'modal', gestureEnabled: false }}
      />
    </MainStackNav.Navigator>
  );
};

export default MainNavigator;