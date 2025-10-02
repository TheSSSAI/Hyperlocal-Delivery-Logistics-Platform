import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// This file defines the type contracts for react-navigation, ensuring type-safe
// navigation and route parameter access throughout the application.

// --- Parameter Lists for Navigators ---

/**
 * Defines the screens and their parameters for the authentication stack.
 * This is used before a rider is successfully logged in.
 * Based on user stories RDR-004 and RDR-001.
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OtpVerification: { mobileNumber: string; isRegistering: boolean };
};

/**
 * Defines the screens and their parameters for the main task-related stack.
 * This is nested within the MainTabsNavigator.
 * Based on requirements REQ-1-071, REQ-1-072 and user stories RDR-010, RDR-011, RDR-012, etc.
 */
export type TaskStackParamList = {
  Dashboard: undefined;
  TaskOffer: { taskId: string }; // Assuming task details are fetched based on ID
  ActiveTask: { taskId: string };
};

/**
 * Defines the screens available in the main bottom tab navigator.
 * Based on requirement REQ-1-011.
 */
export type MainTabsParamList = {
  Home: NavigatorScreenParams<TaskStackParamList>;
  Earnings: undefined;
  Profile: undefined;
};

/**
 * The root navigator that decides between showing the Auth stack or the Main stack.
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
  SplashScreen: undefined;
};

// --- Screen Props ---
// These composite types provide type safety for the `navigation` and `route` props
// in each screen component, especially in nested navigators.

// Props for screens in the Root Stack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

// Props for screens in the Auth Stack, providing access to root navigation actions
export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    StackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Props for screens in the Main Tab Navigator
export type MainTabsScreenProps<T extends keyof MainTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Props for screens within the nested Task Stack
export type TaskStackScreenProps<T extends keyof TaskStackParamList> =
  CompositeScreenProps<
    StackScreenProps<TaskStackParamList, T>,
    MainTabsScreenProps<keyof MainTabsParamList>
  >;

// --- Global Navigation Prop Type ---
// This allows components outside of screens to use the navigation prop safely.
// For example, in custom hooks or components.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}