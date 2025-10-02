sequenceDiagram
    participant "Scheduler (K8s CronJob)" as SchedulerK8sCronJob
    participant "Payments & Settlements Service" as PaymentsSettlementsService
    participant "Order Management Service" as OrderManagementService
    participant "Razorpay API" as RazorpayAPI
    participant "Message Broker" as MessageBroker

    activate PaymentsSettlementsService
    SchedulerK8sCronJob->>PaymentsSettlementsService: 1. 1. Trigger Reconciliation Job
    PaymentsSettlementsService-->>SchedulerK8sCronJob: HTTP 202 Accepted
    activate OrderManagementService
    PaymentsSettlementsService->>OrderManagementService: 2. 2. Fetch Orders in 'payment_pending_confirmation' state
    OrderManagementService-->>PaymentsSettlementsService: 200 OK with Order[]
    PaymentsSettlementsService->>PaymentsSettlementsService: 3. 3. FOR EACH order in pending state:
    activate RazorpayAPI
    PaymentsSettlementsService->>RazorpayAPI: 4. 3.1. Query Definitive Payment Status
    RazorpayAPI-->>PaymentsSettlementsService: 200 OK with Payment Entity
    activate MessageBroker
    PaymentsSettlementsService->>MessageBroker: 5. 3.2. [IF status is 'captured'] Publish PaymentConfirmedEvent
    PaymentsSettlementsService->>MessageBroker: 6. 3.3. [ELSE IF status is 'failed'] Publish PaymentFailedEvent
    MessageBroker->>OrderManagementService: 7. 4. Consume Payment Event
    OrderManagementService->>OrderManagementService: 8. 5. Update Order Status in Database
    OrderManagementService-->>OrderManagementService: Commit

    note over PaymentsSettlementsService: Idempotency is CRITICAL for the reconciliation job. If the job is re-run on already processed ord...
    note over OrderManagementService: The SQS event consumer in the Order Management Service must also be idempotent. It should check t...

    deactivate MessageBroker
    deactivate RazorpayAPI
    deactivate OrderManagementService
    deactivate PaymentsSettlementsService
