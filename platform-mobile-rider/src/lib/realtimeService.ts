import { io, Socket } from 'socket.io-client';
import { environment } from '../config/environment';
import { retrieveToken } from './secureStorage';
import { Dispatch } from '@reduxjs/toolkit';
import { taskSlice } from '../features/task/taskSlice';
import { TaskOfferPayload } from '../features/task/task.types';

class RealtimeService {
  private static instance: RealtimeService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  public async connect(dispatch: Dispatch): Promise<void> {
    if (this.socket && this.socket.connected) {
      console.log('RealtimeService: Already connected.');
      return;
    }

    const token = await retrieveToken('accessToken');
    if (!token) {
      console.error('RealtimeService: No access token found. Cannot connect.');
      return;
    }

    console.log('RealtimeService: Attempting to connect...');
    this.socket = io(environment.api.webSocketUrl, {
      auth: {
        token: `${token}`,
      },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupListeners(dispatch);
  }

  public disconnect(): void {
    if (this.socket) {
      console.log('RealtimeService: Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public emit<T>(event: string, data: T): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`RealtimeService: Cannot emit event "${event}". Socket not connected.`);
      // TODO: Implement an offline queue for critical emit events if necessary
    }
  }

  private setupListeners(dispatch: Dispatch): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('RealtimeService: Connected successfully with ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason: Socket.DisconnectReason) => {
      console.log('RealtimeService: Disconnected. Reason:', reason);
      if (reason === 'io server disconnect') {
        // The server forcefully disconnected the socket; we may need to reconnect manually
        this.socket?.connect();
      }
      // The socket will automatically try to reconnect for other reasons
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('RealtimeService: Connection Error.', error.message);
    });

    // --- Application-specific event listeners ---

    // Listener for new task offers
    this.socket.on('newTaskOffer', (payload: TaskOfferPayload) => {
      console.log('RealtimeService: Received newTaskOffer', payload);
      dispatch(taskSlice.actions.setTaskOffer(payload));
    });

    // Listener for when an offered or active task is cancelled
    this.socket.on('orderCancelled', (payload: { orderId: string, taskId: string }) => {
      console.log('RealtimeService: Received orderCancelled', payload);
      dispatch(taskSlice.actions.handleTaskCancellation(payload));
    });

    // Listener for new chat messages
    this.socket.on('newChatMessage', (payload: { orderId: string, message: any }) => {
      console.log('RealtimeService: Received newChatMessage', payload);
      // Assuming a chat slice exists and has an action to handle this
      // dispatch(chatSlice.actions.addMessage(payload));
    });
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const realtimeService = RealtimeService.getInstance();