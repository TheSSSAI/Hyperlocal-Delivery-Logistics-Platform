sequenceDiagram
    participant "Onboarding Specialist" as OnboardingSpecialist
    actor "Admin Web Dashboard" as AdminWebDashboard
    participant "API Gateway" as APIGateway
    participant "Vendor & Catalog Service" as VendorCatalogService
    participant "PostgreSQL Database" as PostgreSQLDatabase
    participant "Audit Log Service" as AuditLogService

    activate AdminWebDashboard
    OnboardingSpecialist->>AdminWebDashboard: 1. 1. Navigates to the 'Migration Validation' view for a specific vendor's import batch.
    activate APIGateway
    AdminWebDashboard->>APIGateway: 2. 2. GET /api/v1/migration-batches/{batchId}
    APIGateway-->>AdminWebDashboard: 200 OK: MigrationBatchDetailsDTO
    activate VendorCatalogService
    APIGateway->>VendorCatalogService: 3. 3. [Proxy] GET /migration-batches/{batchId}
    VendorCatalogService-->>APIGateway: MigrationBatchDetails
    AdminWebDashboard->>OnboardingSpecialist: 5. 5. Renders validation view with profile data, product sample table, and download links.
    OnboardingSpecialist->>AdminWebDashboard: 6. 6. Reviews data and clicks 'Approve Migration'.
    AdminWebDashboard->>APIGateway: 7. 7. POST /api/v1/migration-batches/{batchId}/approve
    APIGateway-->>AdminWebDashboard: 200 OK: { status: 'Approved' }
    APIGateway->>VendorCatalogService: 8. 8. [Proxy] POST /migration-batches/{batchId}/approve
    VendorCatalogService-->>APIGateway: { status: 'Approved' }
    AdminWebDashboard->>OnboardingSpecialist: 11. 11. Displays 'Migration Approved' success notification.

    note over AdminWebDashboard: ALTERNATIVE FLOW: Rejecting Migration Step 6a: User clicks 'Reject Migration', UI displays modal....
    note over VendorCatalogService: BUSINESS RULE: A vendor's status cannot be changed to 'Active' unless their latest migration_batc...
    note over VendorCatalogService: SECURITY: Download links for source/error files must be pre-signed S3 URLs generated on-demand by...

    deactivate VendorCatalogService
    deactivate APIGateway
    deactivate AdminWebDashboard
