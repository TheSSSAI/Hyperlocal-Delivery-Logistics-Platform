sequenceDiagram
    participant "Onboarding Specialist" as OnboardingSpecialist
    participant "Admin Dashboard" as AdminDashboard
    participant "Vendor & Catalog Service" as VendorCatalogService

    activate AdminDashboard
    OnboardingSpecialist->>AdminDashboard: 1. 1. Navigates to Vendor Profile -> 'Migration Validation' view for a specific batch.
    activate VendorCatalogService
    AdminDashboard->>VendorCatalogService: 2. 2. [useEffect/useQuery] GET /api/v1/migrations/:batchId/validation-details
    VendorCatalogService-->>AdminDashboard: 3. 200 OK with ValidationDetailsDTO
    OnboardingSpecialist->>AdminDashboard: 4. 4. Clicks 'Download Source File' link.
    AdminDashboard->>VendorCatalogService: 5. 5. GET /api/v1/migrations/:batchId/source-file-url
    VendorCatalogService-->>AdminDashboard: 6. 200 OK with { presignedUrl: '...' }
    AdminDashboard->>OnboardingSpecialist: 7. 7. Initiates browser download from the received pre-signed S3 URL.
    OnboardingSpecialist->>AdminDashboard: 8. 8. After reviewing, clicks 'Approve Migration' button.
    AdminDashboard->>VendorCatalogService: 9. 9. PUT /api/v1/migrations/:batchId/approve
    VendorCatalogService-->>AdminDashboard: 12. 200 OK
    VendorCatalogService->>VendorCatalogService: 10. 10. Updates migration batch status to 'Approved' in PostgreSQL within a transaction.
    VendorCatalogService->>VendorCatalogService: 11. 11. Publishes 'MigrationApproved' event to Audit Log Service (fire-and-forget).
    AdminDashboard->>OnboardingSpecialist: 13. 13. Displays 'Migration Approved' success notification.

    note over AdminDashboard: Rejection Flow: If the specialist clicks 'Reject', the UI shows a modal. The subsequent PUT reque...
    note over AdminDashboard: Partial Failure Display: If the GET request in step 2 returns 'hasErrors: true' and an 'errorRepo...
    note over VendorCatalogService: Audit Trail: As per REQ-NFR-008, all state-changing actions (approve/reject) MUST be recorded in ...

    deactivate VendorCatalogService
    deactivate AdminDashboard
