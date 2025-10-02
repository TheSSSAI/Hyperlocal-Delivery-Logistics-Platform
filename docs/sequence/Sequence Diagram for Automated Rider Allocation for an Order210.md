sequenceDiagram
    participant "Onboarding Specialist" as OnboardingSpecialist
    actor "Administrator Web Dashboard" as AdministratorWebDashboard
    participant "API Gateway" as APIGateway
    participant "Vendor & Catalog Service" as VendorCatalogService
    participant "Audit Log Service" as AuditLogService
    participant "PostgreSQL Database" as PostgreSQLDatabase
    participant "File Storage (S3)" as FileStorageS3

    activate AdministratorWebDashboard
    OnboardingSpecialist->>AdministratorWebDashboard: 1. 1. Navigates to Vendor Profile and selects 'Migration Validation' for a specific batch.
    activate APIGateway
    AdministratorWebDashboard->>APIGateway: 2. 2. Requests migration batch details and product sample.
    APIGateway-->>AdministratorWebDashboard: 5. Returns migration batch DTO.
    activate VendorCatalogService
    APIGateway->>VendorCatalogService: 3. 3. Forwards validated request to fetch migration data.
    VendorCatalogService-->>APIGateway: 4. Returns migration batch details and product sample data.
    activate PostgreSQLDatabase
    VendorCatalogService->>PostgreSQLDatabase: 3.1. 3a. SELECT * FROM migration_batches WHERE id = {batchId}; SELECT * FROM products WHERE migration_batch_id = {batchId} LIMIT 20;
    PostgreSQLDatabase-->>VendorCatalogService: 3b. Returns batch metadata and a sample of associated products.
    AdministratorWebDashboard->>OnboardingSpecialist: 6. 6. Renders 'Migration Validation' page with data, file links, and Approve/Reject buttons.
    OnboardingSpecialist->>AdministratorWebDashboard: 7. 7. Reviews data and clicks 'Approve Migration'.
    AdministratorWebDashboard->>APIGateway: 8. 8. Submits approval action.
    APIGateway-->>AdministratorWebDashboard: 11. Returns 204 No Content.
    APIGateway->>VendorCatalogService: 9. 9. Forwards approval request.
    VendorCatalogService-->>APIGateway: 10. Returns success confirmation.
    VendorCatalogService->>PostgreSQLDatabase: 9.1. 9a. UPDATE migration_batches SET status = 'Approved', approved_by = {userId}, approved_at = NOW() WHERE id = {batchId};
    PostgreSQLDatabase-->>VendorCatalogService: 9b. Confirms successful update.
    activate AuditLogService
    VendorCatalogService->>AuditLogService: 9.2. 9c. Logs approval event.
    AdministratorWebDashboard->>OnboardingSpecialist: 12. 12. Displays 'Migration Approved' success notification.
    OnboardingSpecialist->>AdministratorWebDashboard: 13. 13. [Alt Flow] Clicks 'Reject Migration', enters reason in modal, and submits.
    AdministratorWebDashboard->>APIGateway: 14. 14. Submits rejection action with reason.
    APIGateway-->>AdministratorWebDashboard: 17. Returns 204 No Content.
    APIGateway->>VendorCatalogService: 15. 15. Forwards rejection request.
    VendorCatalogService-->>APIGateway: 16. Returns success confirmation.
    VendorCatalogService->>PostgreSQLDatabase: 15.1. 15a. UPDATE migration_batches SET status = 'Rejected', rejection_reason = {reason}, approved_by = {userId}, approved_at = NOW() WHERE id = {batchId};
    PostgreSQLDatabase-->>VendorCatalogService: 15b. Confirms successful update.
    VendorCatalogService->>AuditLogService: 15.2. 15c. Logs rejection event.
    OnboardingSpecialist->>AdministratorWebDashboard: 18. 18. [File Download] Clicks 'Download Source File'.
    AdministratorWebDashboard->>APIGateway: 19. 19. Requests a temporary download URL for the file.
    APIGateway-->>AdministratorWebDashboard: 22. Returns 302 Redirect to pre-signed S3 URL.
    APIGateway->>VendorCatalogService: 20. 20. Forwards request for file URL.
    VendorCatalogService-->>APIGateway: 21. Returns pre-signed S3 URL.
    VendorCatalogService->>PostgreSQLDatabase: 20.1. 20a. SELECT source_file_key FROM migration_batches WHERE id = {batchId};
    PostgreSQLDatabase-->>VendorCatalogService: 20b. Returns S3 object key.
    activate FileStorageS3
    VendorCatalogService->>FileStorageS3: 20.2. 20c. Generate pre-signed GET URL for object key.
    FileStorageS3-->>VendorCatalogService: 20d. Returns temporary, secure URL.
    AdministratorWebDashboard->>OnboardingSpecialist: 23. 23. Browser automatically follows redirect to download the file from S3.

    note over VendorCatalogService: Business Rule BR-TRN-001 Enforcement: The Vendor & Catalog Service API must prevent changing a ve...
    note over AuditLogService: Audit Trail (REQ-NFR-008): All approval and rejection actions are sent to a dedicated, immutable ...
    note over FileStorageS3: Error Report Download: The flow for downloading the error report (AC-006) is identical to the sou...

    deactivate FileStorageS3
    deactivate AuditLogService
    deactivate PostgreSQLDatabase
    deactivate VendorCatalogService
    deactivate APIGateway
    deactivate AdministratorWebDashboard
