import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, Message } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from '../../modules/payments/payments.service';
import { CommissionService } from '../../modules/settlements/commission.service';
import { OrderCancelledEvent, OrderDeliveredEvent } from '@platform-contracts/events';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EventConsumer implements OnModuleInit {
    private readonly logger = new Logger(EventConsumer.name);
    private readonly sqsClient: SQSClient;
    private readonly queueUrl: string;
    private isPolling = false;

    constructor(
        private readonly configService: ConfigService,
        private readonly paymentsService: PaymentsService,
        private readonly commissionService: CommissionService,
    ) {
        this.sqsClient = new SQSClient({
            region: this.configService.get<string>('aws.region'),
            credentials: { // In production, this should use IAM roles
                accessKeyId: this.configService.get<string>('aws.accessKeyId'),
                secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
            }
        });
        this.queueUrl = this.configService.get<string>('aws.sqsQueueUrl');
    }

    onModuleInit() {
        if (!this.queueUrl) {
            this.logger.warn('SQS_QUEUE_URL is not configured. Event consumer will not start.');
            return;
        }
        this.startPolling();
    }

    startPolling() {
        if (this.isPolling) {
            return;
        }
        this.isPolling = true;
        this.logger.log('Starting SQS polling...');
        this.poll();
    }

    stopPolling() {
        this.isPolling = false;
        this.logger.log('Stopping SQS polling...');
    }

    private async poll() {
        if (!this.isPolling) {
            return;
        }

        try {
            const receiveCommand = new ReceiveMessageCommand({
                QueueUrl: this.queueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 20,
                MessageAttributeNames: ['All'],
            });

            const { Messages } = await this.sqsClient.send(receiveCommand);

            if (Messages && Messages.length > 0) {
                this.logger.log(`Received ${Messages.length} messages from SQS.`);
                await Promise.all(Messages.map(message => this.processMessage(message)));
            }
        } catch (error) {
            this.logger.error('Error receiving messages from SQS:', error);
        } finally {
            // Recursive call to continue polling
            if (this.isPolling) {
                setTimeout(() => this.poll(), 1000); // 1-second delay before next poll
            }
        }
    }

    private async processMessage(message: Message): Promise<void> {
        try {
            const eventType = message.MessageAttributes?.['eventType']?.StringValue;
            if (!eventType) {
                this.logger.warn('Received message without eventType attribute. Deleting.');
                await this.deleteMessage(message.ReceiptHandle);
                return;
            }

            const body = JSON.parse(message.Body);
            // The actual message from SNS is nested inside the SQS message body
            const payload = JSON.parse(body.Message);

            this.logger.log(`Processing event: ${eventType} for orderId: ${payload?.orderId || 'N/A'}`);
            
            await this.routeMessage(eventType, payload);

            await this.deleteMessage(message.ReceiptHandle);
        } catch (error) {
            this.logger.error(`Error processing message ${message.MessageId}. It will be returned to the queue. Error: ${error.message}`, error.stack);
            // Do not delete the message, let SQS visibility timeout handle retry or DLQ
        }
    }
    
    private async routeMessage(eventType: string, payload: any): Promise<void> {
        switch (eventType) {
            case OrderDeliveredEvent.name:
                const orderDeliveredEvent = plainToInstance(OrderDeliveredEvent, payload);
                await this.commissionService.calculateAndRecordCommission(orderDeliveredEvent);
                break;
                
            case OrderCancelledEvent.name:
                const orderCancelledEvent = plainToInstance(OrderCancelledEvent, payload);
                // Business logic to decide if refund is needed and how much
                if (orderCancelledEvent.isRefundable && orderCancelledEvent.refundAmount > 0) {
                     await this.paymentsService.initiateRefund(
                        orderCancelledEvent.orderId,
                        orderCancelledEvent.refundAmount,
                        orderCancelledEvent.cancellationReason
                    );
                } else {
                    this.logger.log(`Skipping refund for order ${orderCancelledEvent.orderId} as it is not marked as refundable.`);
                }
                break;

            // Add other event handlers here
            // case 'OrderCreatedPendingPayment':
            // ...

            default:
                this.logger.warn(`Unhandled event type: ${eventType}`);
                break;
        }
    }

    private async deleteMessage(receiptHandle: string): Promise<void> {
        const deleteCommand = new DeleteMessageCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle,
        });
        await this.sqsClient.send(deleteCommand);
    }
}