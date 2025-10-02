import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Socket } from 'socket.io-client';
import { socket } from '@/shared/lib/socket';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

/**
 * Custom hook to access WebSocket context.
 * Provides the socket instance and connection status.
 * This is the primary interface for components to interact with real-time events.
 * e.g., useNotifications().socket?.on('new_order', handleNewOrder);
 */
export const useNotifications = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

/**
 * Provider component that manages the WebSocket connection lifecycle.
 * It connects when a user is authenticated and disconnects on logout.
 * This fulfills requirements for real-time order notifications (REQ-1-065, VND-016)
 * and chat (VND-024). It uses the WSS protocol as mandated by REQ-1-092.
 */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // This effect manages the socket connection based on authentication state.
    if (isAuthenticated) {
      // Connect the socket only when the user is authenticated.
      // The socket instance in `socket.ts` is configured to automatically
      // include the auth token via the useAuth hook's state.
      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => {
        console.log('WebSocket connected successfully.');
        setIsConnected(true);
      };

      const onDisconnect = (reason: Socket.DisconnectReason) => {
        console.log('WebSocket disconnected:', reason);
        setIsConnected(false);
        // The socket.io-client will attempt to reconnect automatically
        // with exponential backoff, which is desirable.
      };

      const onConnectError = (err: Error) => {
        console.error('WebSocket connection error:', err.message);
        // This can happen if the token is expired or invalid.
        // The auth hook's interceptor should handle token refresh,
        // but if that fails, the connection will fail.
        setIsConnected(false);
      };

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('connect_error', onConnectError);

      // Cleanup function to remove listeners when the component unmounts
      // or when the user is no longer authenticated.
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('connect_error', onConnectError);
        // Only disconnect if the intention is to logout (isAuthenticated becomes false)
        if (socket.connected) {
           socket.disconnect();
        }
      };
    } else {
      // If the user is not authenticated, ensure the socket is disconnected.
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [isAuthenticated]);

  const contextValue: WebSocketContextType = {
    socket,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};