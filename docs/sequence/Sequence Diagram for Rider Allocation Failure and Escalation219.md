sequenceDiagram
    participant "Rider Logistics Service" as RiderLogisticsService
    participant "Order Management Service" as OrderManagementService
    participant "Notifications Service" as NotificationsService
    participant "Admin Web Dashboard" as AdminWebDashboard

    activate RiderLogisticsService
    RiderLogisticsService->>RiderLogisticsService: 1. 1. Detect Allocation Failure (Internal Process)
    RiderLogisticsService->>OrderManagementService: 2. 2. Publish RiderAllocationFailed Event
    activate OrderManagementService
    OrderManagementService->>OrderManagementService: 3. 3. Consume Event & Update Order Status
    OrderManagementService->>OrderManagementService: 3a. 3a. [SQL] UPDATE orders SET status = 'Allocation Failed' WHERE id = :orderId
    OrderManagementService-->>OrderManagementService: Success/Failure
    OrderManagementService->>OrderManagementService: 3b. 3b. [SQL] INSERT INTO admin_alerts (type, priority, entityId, message)
    OrderManagementService-->>OrderManagementService: Success/Failure
    activate NotificationsService
    NotificationsService->>NotificationsService: 4. 4. Consume Event & Dispatch Notifications
    NotificationsService->>NotificationsService: 4a. 4a. Send Push Notification to Customer & Vendor
    OrderManagementService->>AdminWebDashboard: 5. 5. Push Real-time Alert to Admin Dashboard

    note over RiderLogisticsService: The failure reason in the event payload is crucial for root cause analysis and potential automati...
    note over AdminWebDashboard: The admin dashboard should provide a direct link from the alert to the order details page for imm...

    deactivate NotificationsService
    deactivate OrderManagementService
    deactivate RiderLogisticsService
