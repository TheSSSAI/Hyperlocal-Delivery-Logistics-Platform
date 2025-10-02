sequenceDiagram
    participant "Onboarding Specialist" as OnboardingSpecialist
    participant "Admin Web Dashboard" as AdminWebDashboard
    participant "API Gateway" as APIGateway
    participant "Vendor & Catalog Service" as VendorCatalogService
    participant "Audit Log Service" as AuditLogService
    participant "File Storage (S3)" as FileStorageS3

    activate AdminWebDashboard
    OnboardingSpecialist->>AdminWebDashboard: 1. 1. Navigates to Vendor Profile and clicks 'Validate Migration' for the latest data import batch.
    AdminWebDashboard->>APIGateway: 2. 2. GET /v1/vendors/{vendorId}/migrations/latest
    APIGateway-->>AdminWebDashboard: 7. 200 OK with MigrationBatchDetailsDTO
    APIGateway->>VendorCatalogService: 3. 3. Forward validated GET request.
    VendorCatalogService-->>APIGateway: 6. Return MigrationBatchDetailsDTO
    VendorCatalogService->>VendorCatalogService: 4. 4. Retrieve Migration Batch details and a sample of associated products from PostgreSQL database.
    VendorCatalogService->>FileStorageS3: 5. 5. Generate pre-signed URLs for source and error report files using AWS SDK.
    FileStorageS3-->>VendorCatalogService: Pre-signed URLs with short TTL (e.g., 15 mins)
    AdminWebDashboard->>OnboardingSpecialist: 8. 8. Renders 'Migration Validation' view with data, sample products, and download links.
    OnboardingSpecialist->>AdminWebDashboard: 9. 9. Reviews data, confirms accuracy, and clicks 'Approve Migration'.
    AdminWebDashboard->>APIGateway: 10. 10. PUT /v1/migrations/{batchId}/approve
    APIGateway-->>AdminWebDashboard: 15. 200 OK
    APIGateway->>VendorCatalogService: 11. 11. Forward validated PUT request.
    VendorCatalogService-->>APIGateway: 14. Return 200 OK
    VendorCatalogService->>VendorCatalogService: 12. 12. Update migration batch status to 'Approved' in PostgreSQL.
    VendorCatalogService->>AuditLogService: 13. 13. POST /v1/logs (Async)
    AdminWebDashboard->>OnboardingSpecialist: 16. 16. Displays 'Migration Approved' success notification.

    note over FileStorageS3: File Download: The user's browser directly downloads the file from S3 using the pre-signed URL pr...
    note over AdminWebDashboard: Rejection Flow (Alternative): If specialist clicks 'Reject', the UI presents a modal for a mandat...
    note over APIGateway: RBAC Enforcement: The API Gateway and Vendor Service must validate that the JWT belongs to a user...

    deactivate AdminWebDashboard
