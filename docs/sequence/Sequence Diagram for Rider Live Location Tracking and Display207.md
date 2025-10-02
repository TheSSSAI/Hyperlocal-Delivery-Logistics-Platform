sequenceDiagram
    participant "Admin Dashboard" as AdminDashboard
    participant "API Gateway" as APIGateway
    participant "Vendor & Catalog Service" as VendorCatalogService
    participant "PostgreSQL DB" as PostgreSQLDB
    participant "Message Bus" as MessageBus
    participant "Audit Log Service" as AuditLogService

    activate APIGateway
    AdminDashboard->>APIGateway: 1. 1. GET /api/v1/admin/vendors/{vendorId}/migration-batches/latest
    APIGateway-->>AdminDashboard: 200 OK with MigrationBatchDetailsDTO
    activate VendorCatalogService
    APIGateway->>VendorCatalogService: 2. 2. Forwards authorized request: getLatestMigrationBatch(vendorId)
    VendorCatalogService-->>APIGateway: Returns MigrationBatchDetailsDTO
    AdminDashboard->>APIGateway: 5. 5. POST /api/v1/admin/migration-batches/{batchId}/approve
    APIGateway-->>AdminDashboard: 204 No Content
    APIGateway->>VendorCatalogService: 6. 6. Forwards authorized request: approveMigration(batchId, userContext)
    VendorCatalogService-->>APIGateway: Returns success confirmation.
    activate AuditLogService
    MessageBus->>AuditLogService: 9. 9. Consumes AdminActionOccurred Event via SQS queue
    AuditLogService->>AuditLogService: 10. 10. Persist immutable audit log entry

    note over VendorCatalogService: The system must prevent a vendor from being activated if their latest migration batch is not in a...

    deactivate AuditLogService
    deactivate VendorCatalogService
    deactivate APIGateway
