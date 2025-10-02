sequenceDiagram
    participant "Onboarding Specialist" as OnboardingSpecialist
    actor "Admin Web Dashboard" as AdminWebDashboard
    participant "API Gateway" as APIGateway
    participant "Vendor & Catalog Service" as VendorCatalogService
    participant "File Storage (S3)" as FileStorageS3
    participant "Audit Log Service" as AuditLogService

    activate AdminWebDashboard
    OnboardingSpecialist->>AdminWebDashboard: 1. 1. Navigates to Vendor Migration Validation page for a specific vendor batch.
    activate APIGateway
    AdminWebDashboard->>APIGateway: 2. 2. GET /api/v1/migrations/{batchId}/validation
    APIGateway-->>AdminWebDashboard: 200 OK with ValidationDataDTO
    activate VendorCatalogService
    APIGateway->>VendorCatalogService: 3. 3. Forwards GET request after auth check.
    VendorCatalogService-->>APIGateway: Returns service response.
    VendorCatalogService->>VendorCatalogService: 4. 4. Retrieves migration batch details and product sample from database.
    VendorCatalogService-->>VendorCatalogService: Returns migration batch and product data.
    VendorCatalogService->>APIGateway: 5. 5. Returns ValidationDataDTO (vendor info, product sample, file URLs).
    APIGateway->>AdminWebDashboard: 6. 6. Relays success response.
    OnboardingSpecialist->>AdminWebDashboard: 7. 7. Reviews data and clicks 'Approve Migration'.
    AdminWebDashboard->>APIGateway: 8. 8. POST /api/v1/migrations/{batchId}/approve
    APIGateway-->>AdminWebDashboard: 200 OK
    APIGateway->>VendorCatalogService: 9. 9. Forwards POST request after auth check.
    VendorCatalogService-->>APIGateway: Returns service response.
    VendorCatalogService->>VendorCatalogService: 10. 10. Updates migration batch status to 'Approved' in database transaction.
    VendorCatalogService-->>VendorCatalogService: Transaction committed successfully.
    activate AuditLogService
    VendorCatalogService->>AuditLogService: 10.1. 10.1. Logs approval event to immutable audit trail.
    VendorCatalogService->>APIGateway: 11. 11. Returns 200 OK success response.
    APIGateway->>AdminWebDashboard: 12. 12. Relays 200 OK.

    note over AuditLogService: Audit Trail (REQ-NFR-008): The approval action (Step 10.1) must be logged in a dedicated, immutab...
    note over FileStorageS3: File Download (AC-005): The frontend should provide links to download the source and error (if an...

    deactivate AuditLogService
    deactivate VendorCatalogService
    deactivate APIGateway
    deactivate AdminWebDashboard
