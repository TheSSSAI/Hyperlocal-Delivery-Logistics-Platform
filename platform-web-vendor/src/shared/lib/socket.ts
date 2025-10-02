import { io, Socket } from 'socket.io-client';

/**
 * Singleton instance of the Socket.IO client.
 * It's initialized here but not connected until explicitly told to do so.
 *
 * REQ-1-092: Real-time features like live tracking and chat must use the Secure WebSocket (WSS) protocol.
 * REQ-1-106: All communication must be routed through the central API Gateway.
 */
export const socket: Socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
  autoConnect: false, // Do not connect automatically on initialization.
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
});

/**
 * Connects the global socket instance.
 * This should be called from an authentication provider or context after a user successfully logs in.
 * It passes the JWT for server-side authentication of the WebSocket connection.
 *
 * @param {string} token The user's JWT access token.
 */
export const connectSocket = (token: string): void => {
  // If the socket is already connected, disconnect first to ensure a clean state,
  // especially if the user is logging in as someone else without a page refresh.
  if (socket.connected) {
    socket.disconnect();
  }

  // Set the authentication token for the connection handshake.
  // The backend will use this to associate the socket with the authenticated vendor.
  socket.auth = { token };

  // Establish the connection.
  socket.connect();
};

/**
 * Disconnects the global socket instance.
 * This should be called when the user logs out to terminate the real-time connection.
 */
export const disconnectSocket = (): void => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Optional: Add logging for connection lifecycle events for debugging purposes.
socket.on('connect', () => {
  console.log('WebSocket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('WebSocket disconnected:', reason);
});

socket.on('connect_error', (err) => {
  console.error('WebSocket connection error:', err.message);
});