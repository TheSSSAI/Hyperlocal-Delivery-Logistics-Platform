sequenceDiagram
    actor "Customer Mobile App" as CustomerMobileApp
    participant "Order Management Service" as OrderManagementService
    participant "Vendor & Catalog Service" as VendorCatalogService
    actor "Vendor Web Dashboard" as VendorWebDashboard
    actor "Rider Mobile App" as RiderMobileApp

    activate OrderManagementService
    CustomerMobileApp->>OrderManagementService: 1. 1. POST /api/v1/orders (Submit COD Order)
    OrderManagementService-->>CustomerMobileApp: 7a. 400 Bad Request (COD Limit Exceeded) OR 7b. 201 Created (Order Confirmed)
    activate VendorCatalogService
    OrderManagementService->>VendorCatalogService: 2. 2. POST /api/v1/internal/products/validate-cart (Real-time stock & price check)
    VendorCatalogService-->>OrderManagementService: 3. Validation Response { isValid: boolean, items: [...], total: number } or Error
    OrderManagementService->>OrderManagementService: 4. 4. Validate Business Rule: Order total <= Max COD Limit (REQ-BR-001)
    OrderManagementService->>OrderManagementService: 5. 5. Persist Order to Database
    OrderManagementService->>OrderManagementService: 6. 6. Publish OrderPlacedEvent to SNS Topic 'order-events'
    OrderManagementService->>VendorWebDashboard: 8. 8. [Async] WebSocket Push: new_order
    activate RiderMobileApp
    OrderManagementService->>RiderMobileApp: 9. 9. [Async] Assign Delivery Task with COD details
    RiderMobileApp->>RiderMobileApp: 10. 10. Display 'Cash to Collect: ₹X,XXX.XX' on delivery screen
    RiderMobileApp->>OrderManagementService: 11. 11. PATCH /api/v1/deliveries/{id}/complete (Mark Delivered)
    OrderManagementService-->>RiderMobileApp: 12. 200 OK
    OrderManagementService->>OrderManagementService: 13. 13. Publish OrderDeliveredEvent for COD order
    OrderManagementService->>RiderMobileApp: 14. 14. [Async] Update Rider's cashInHand total

    note over OrderManagementService: Step 4: The Maximum COD Limit is a system-wide configuration managed by Administrators. It should...
    note over OrderManagementService: Step 11: The endpoint for marking delivery complete might live in a dedicated Rider Logistics ser...

    deactivate RiderMobileApp
    deactivate VendorCatalogService
    deactivate OrderManagementService
