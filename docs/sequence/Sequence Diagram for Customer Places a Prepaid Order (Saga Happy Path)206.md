sequenceDiagram
    actor "Customer App" as CustomerApp
    participant "Order Service" as OrderService
    participant "Catalog Service" as CatalogService
    participant "Payments Service" as PaymentsService
    participant "Notifications Service" as NotificationsService
    actor "Vendor Dashboard" as VendorDashboard

    activate OrderService
    CustomerApp->>OrderService: 1. 1. POST /api/v1/orders/checkout
    OrderService-->>CustomerApp: 8. 200 OK with Payment Intent
    activate CatalogService
    OrderService->>CatalogService: 2. 2. POST /api/v1/internal/products/check-availability
    CatalogService-->>OrderService: 3. 200 OK { isAvailable: true }
    activate PaymentsService
    OrderService->>PaymentsService: 4. 4. POST /api/v1/internal/payments/create-intent
    PaymentsService-->>OrderService: 7. 200 OK { clientSecret, paymentProviderOrderId }
    PaymentsService->>PaymentsService: 10. 10. Validate signature and capture payment
    OrderService->>OrderService: 13. 13. Finalize order and persist to DB
    activate VendorDashboard
    NotificationsService->>VendorDashboard: 16. 16. (WebSocket) emit('new_order', { orderDetails })

    note over OrderService: State Management: The Order Service maintains the authoritative state of the order. It transition...
    note over CatalogService: Business Rule: The inventory check in Step 2 is a critical business rule (REQ-FUN-007) that acts ...

    deactivate VendorDashboard
    deactivate PaymentsService
    deactivate CatalogService
    deactivate OrderService
