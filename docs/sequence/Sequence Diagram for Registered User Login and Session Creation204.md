sequenceDiagram
    participant "Onboarding Specialist" as OnboardingSpecialist
    participant "Admin Web Dashboard" as AdminWebDashboard
    participant "API Gateway" as APIGateway
    participant "Vendor & Catalog Service" as VendorCatalogService
    participant "Persistence Layer" as PersistenceLayer
    participant "Object Storage" as ObjectStorage
    participant "Audit Log Service" as AuditLogService

    activate AdminWebDashboard
    OnboardingSpecialist->>AdminWebDashboard: 1. 1. Navigates to Vendor Management and selects a vendor with a 'Pending Validation' migration batch.
    activate APIGateway
    AdminWebDashboard->>APIGateway: 2. 2. Requests migration validation data for the vendor's latest batch.
    APIGateway-->>AdminWebDashboard: Returns JSON with migration batch details, product sample, and file URLs.
    activate VendorCatalogService
    APIGateway->>VendorCatalogService: 3. 3. Forwards authenticated request.
    VendorCatalogService-->>APIGateway: Returns migration validation data.
    VendorCatalogService->>PersistenceLayer: 4. 3a. Fetches migration batch record and a sample of associated products.
    PersistenceLayer-->>VendorCatalogService: Returns batch metadata and product rows.
    VendorCatalogService->>ObjectStorage: 5. 3b. Generates pre-signed URLs for source and error report files.
    ObjectStorage-->>VendorCatalogService: Returns temporary, secure download URLs.
    AdminWebDashboard->>OnboardingSpecialist: 6. 4. Renders 'Migration Validation' view with data and download links. Displays a warning if import had errors.
    OnboardingSpecialist->>AdminWebDashboard: 7. 5. ALT[Approve Path]: Reviews data, confirms accuracy, and clicks 'Approve Migration'.
    AdminWebDashboard->>APIGateway: 8. 6. Submits approval action for the migration batch.
    APIGateway-->>AdminWebDashboard: 200 OK on success.
    APIGateway->>VendorCatalogService: 9. 7. Forwards approval request.
    VendorCatalogService-->>APIGateway: 200 OK.
    VendorCatalogService->>PersistenceLayer: 10. 7a. Updates migration batch status to 'Approved' and records approver ID and timestamp.
    PersistenceLayer-->>VendorCatalogService: Success confirmation.
    activate AuditLogService
    VendorCatalogService->>AuditLogService: 11. 7b. Publishes 'MigrationBatchApproved' event.
    OnboardingSpecialist->>AdminWebDashboard: 12. 8. ALT[Reject Path]: Finds discrepancy, clicks 'Reject Migration', enters reason in modal and submits.
    AdminWebDashboard->>APIGateway: 13. 9. Submits rejection action with reason.
    APIGateway-->>AdminWebDashboard: 200 OK on success.
    APIGateway->>VendorCatalogService: 14. 10. Forwards rejection request.
    VendorCatalogService-->>APIGateway: 200 OK.
    VendorCatalogService->>PersistenceLayer: 15. 10a. Updates batch status to 'Rejected' and stores reason, actor ID, and timestamp.
    PersistenceLayer-->>VendorCatalogService: Success confirmation.
    VendorCatalogService->>AuditLogService: 16. 10b. Publishes 'MigrationBatchRejected' event.

    note over ObjectStorage: File downloads are handled via pre-signed S3 URLs to ensure secure, direct access for the user wi...
    note over AuditLogService: Auditing is handled asynchronously via an event-driven pattern. This decouples the core business ...

    deactivate AuditLogService
    deactivate VendorCatalogService
    deactivate APIGateway
    deactivate AdminWebDashboard
