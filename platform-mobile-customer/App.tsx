import React, { useEffect, useRef } from 'react';
import { StatusBar, AppState, Platform, Alert, Linking } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

import { store, persistor } from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef, navigate } from './src/navigation/navigation.utils';
import { environment } from './src/config/environment';
import { updateFcmToken } from './src/features/profile/profileService'; 

//
// --- Error Boundary ---
// A production-ready app should have a global error boundary to prevent
// a white screen of death on unexpected rendering errors.
//
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Log the error to an error reporting service in a real app
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // For simplicity, we are not creating a full screen here, but in a real app
      // this would be a dedicated component.
      return (
        <SafeAreaProvider>
          <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <h1>Something went wrong.</h1>
            <p>Please restart the application.</p>
          </div>
        </SafeAreaProvider>
      );
    }

    return this.props.children;
  }
}

//
// --- Push Notification Setup ---
// Centralized logic for handling Firebase Cloud Messaging (FCM).
//
const setupPushNotifications = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('User has not enabled push notifications');
      // Optionally guide user to settings
    }
  }

  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('FCM Token:', fcmToken);
    // In a real app, you would send this token to your backend
    // associated with the logged-in user. We'll simulate this.
    try {
      // This call should be made when the user is authenticated.
      // This is a placeholder for where that logic would live, likely
      // triggered by an auth state change.
      // await updateFcmToken(fcmToken);
    } catch (error) {
        console.error("Failed to update FCM token:", error);
    }
  }

  // Listener for token refresh
  messaging().onTokenRefresh(async (token) => {
    console.log('New FCM Token:', token);
    try {
        // As above, update the token on the backend
        // await updateFcmToken(token);
    } catch (error) {
        console.error("Failed to refresh FCM token:", error);
    }
  });

  // Listener for foreground messages
  messaging().onMessage(async (remoteMessage) => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // Display an in-app notification (e.g., a toast or a banner)
    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body,
    );
  });

  // Listener for when a user taps a notification that opened the app from a background state
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
    if (remoteMessage?.data?.screen && remoteMessage?.data?.params) {
      const params = JSON.parse(remoteMessage.data.params as string);
      navigate(remoteMessage.data.screen as any, params);
    } else if (remoteMessage?.data?.orderId) {
        // Deep link to order tracking screen, as per CUS-030
        navigate('OrderTracking', { orderId: remoteMessage.data.orderId });
    }
  });

  // Check if app was opened from a terminated state by a notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
         if (remoteMessage?.data?.screen && remoteMessage?.data?.params) {
            const params = JSON.parse(remoteMessage.data.params as string);
            // We need to wait for navigation to be ready
            setTimeout(() => navigate(remoteMessage.data.screen as any, params), 1000);
        } else if (remoteMessage?.data?.orderId) {
            setTimeout(() => navigate('OrderTracking', { orderId: remoteMessage.data.orderId }), 1000);
        }
      }
    });

  // Background message handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    // Here you can handle data-only messages for background tasks
  });
};

const App = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Setup push notifications on app start
    setupPushNotifications();

    // Handle deep linking from custom URL schemes
    const handleDeepLink = (event: { url: string | null }) => {
        if (event.url) {
            // e.g., myapp://order/123
            const url = new URL(event.url);
            const path = url.pathname.substring(1); // remove leading slash
            const [screen, paramValue] = path.split('/');
            
            if (screen === 'order' && paramValue) {
                navigate('OrderTracking', { orderId: paramValue });
            }
        }
    };
    
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
        if(url) handleDeepLink({url});
    });


    // Re-check permissions when app comes to foreground
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        // Potentially re-check permissions or refresh data here
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      linkingSubscription.remove();
    };
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
              />
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;