import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

/**
 * @module NotificationsModule
 * @description This module encapsulates real-time communication logic using WebSockets.
 * It provides a gateway for other services to send notifications to connected clients.
 */
@Module({
  providers: [
    // Registers the WebSocket gateway which handles connection, disconnection,
    // and message broadcasting logic.
    NotificationsGateway,
  ],
  exports: [
    // Exporting the NotificationsGateway allows it to be injected into other services
    // (e.g., BulkImportService) to send real-time updates to vendors.
    NotificationsGateway,
  ],
})
export class NotificationsModule {}