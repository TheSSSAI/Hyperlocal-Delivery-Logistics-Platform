sequenceDiagram
    participant "Order Management Service" as OrderManagementService
    participant "Messaging Bus" as MessagingBus
    participant "Chat Service" as ChatService
    actor "Customer Client App" as CustomerClientApp
    participant "Vendor Web Dashboard" as VendorWebDashboard
    actor "Rider Client App" as RiderClientApp

    activate MessagingBus
    OrderManagementService->>MessagingBus: 1. Publishes order.accepted event to 'order-events' SNS Topic
    activate ChatService
    MessagingBus->>ChatService: 2. Consumes order.accepted event from its dedicated SQS queue
    ChatService->>ChatService: 2.1. Creates chat room record in DB (orderId, participants=[customerId, vendorId], is_readonly=false)
    ChatService-->>ChatService: Success or DB Error
    CustomerClientApp->>ChatService: 3. Establishes WebSocket connection to /chat?orderId=... with JWT
    ChatService-->>CustomerClientApp: Connection Acknowledged or Error
    VendorWebDashboard->>ChatService: 4. Establishes WebSocket connection with JWT for the same order
    ChatService-->>VendorWebDashboard: Connection Acknowledged or Error
    CustomerClientApp->>ChatService: 5. Emits 'sendMessage' event with message payload
    ChatService->>ChatService: 6. Persists message to chat_messages table
    ChatService-->>ChatService: Success
    ChatService->>VendorWebDashboard: 7. Broadcasts 'newMessage' event to other room participants
    OrderManagementService->>MessagingBus: 8. Publishes order.rider_assigned event
    MessagingBus->>ChatService: 9. Consumes order.rider_assigned event
    ChatService->>ChatService: 9.1. Updates chat room record in DB, adding riderId to participants array
    ChatService-->>ChatService: Success
    RiderClientApp->>ChatService: 10. Establishes WebSocket connection with JWT for the order
    ChatService-->>RiderClientApp: Connection Acknowledged or Error
    OrderManagementService->>MessagingBus: 11. Publishes order.delivered event
    MessagingBus->>ChatService: 12. Consumes order.delivered event
    ChatService->>ChatService: 13. Updates chat room record in DB, setting is_readonly to true
    ChatService-->>ChatService: Success

    note over ChatService: A Redis Pub/Sub adapter must be used with the NestJS WebSocket gateway to enable message broadcas...
    note over ChatService: All event consumer logic within the Chat Service must be designed to be idempotent to safely hand...
    note over CustomerClientApp: Client applications should implement exponential backoff and retry logic for re-establishing WebS...

    deactivate ChatService
    deactivate MessagingBus
