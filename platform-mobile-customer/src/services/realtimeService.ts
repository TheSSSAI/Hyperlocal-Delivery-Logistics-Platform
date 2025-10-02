import { io, Socket } from 'socket.io-client';
import { environment } from '../config/environment';
import { storageService } from './storageService';

type EventHandler = (data: any) => void;

class RealtimeService {
  private socket: Socket | null = null;

  /**
   * Establishes a WebSocket connection to the real-time service.
   * It retrieves the authentication token from secure storage to authenticate the connection.
   * If a connection already exists, it disconnects the old one before creating a new one.
   *
   * @returns {Promise<void>} A promise that resolves when the connection is attempted.
   */
  public async connect(): Promise<void> {
    if (this.socket) {
      this.disconnect();
    }

    const tokens = await storageService.getTokens();
    if (!tokens?.accessToken) {
      console.warn('[RealtimeService] No access token found. Cannot connect.');
      return;
    }

    this.socket = io(environment.api.websocketUrl, {
      auth: {
        token: tokens.accessToken,
      },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[RealtimeService] Connected with socket ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[RealtimeService] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[RealtimeService] Connection Error:', error.message);
    });

    this.socket.on('exception', (error) => {
        console.error('[RealtimeService] Server Exception:', error);
    });
  }

  /**
   * Disconnects the WebSocket connection if it exists.
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('[RealtimeService] Disconnected.');
    }
  }

  /**
   * Subscribes to a specific event from the server.
   * @param {string} event - The name of the event to listen for.
   * @param {EventHandler} handler - The callback function to execute when the event is received.
   */
  public subscribe(event: string, handler: EventHandler): void {
    if (!this.socket) {
      console.warn(`[RealtimeService] Cannot subscribe to "${event}". Socket not connected.`);
      return;
    }
    this.socket.on(event, handler);
  }

  /**
   * Unsubscribes from a specific event.
   * @param {string} event - The name of the event to stop listening to.
   * @param {EventHandler} [handler] - The specific handler to remove. If not provided, all handlers for the event are removed.
   */
  public unsubscribe(event: string, handler?: EventHandler): void {
    if (!this.socket) {
      console.warn(`[RealtimeService] Cannot unsubscribe from "${event}". Socket not connected.`);
      return;
    }
    this.socket.off(event, handler);
  }

  /**
   * Emits an event to the server.
   * @param {string} event - The name of the event to emit.
   * @param {any} data - The payload to send with the event.
   */
  public emit(event: string, data: any): void {
    if (!this.socket) {
      console.warn(`[RealtimeService] Cannot emit "${event}". Socket not connected.`);
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Checks if the WebSocket is currently connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const realtimeService = new RealtimeService();