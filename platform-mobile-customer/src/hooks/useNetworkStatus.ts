import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

/**
 * @interface NetworkStatus
 * @description Provides detailed network status information.
 */
export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}

/**
 * @hook useNetworkStatus
 * @description A custom hook that subscribes to the device's network status and provides real-time updates.
 * This is crucial for implementing offline support as per REQ-1-087.
 * @returns {NetworkStatus} An object containing the current network status.
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
  });

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable ?? false,
      });
    });

    // Unsubscribe on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return status;
};