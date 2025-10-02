sequenceDiagram
    actor "Admin Web Dashboard" as AdminWebDashboard
    participant "Vendor & Catalog Service" as VendorCatalogService

    activate VendorCatalogService
    AdminWebDashboard->>VendorCatalogService: 1. 1. Request Migration Batch Details for Validation
    VendorCatalogService-->>AdminWebDashboard: 2. Return Batch Details, Product Sample, and Pre-signed URLs
    VendorCatalogService->>VendorCatalogService: 2. 1a. Authorize Admin User (RBAC Check)
    VendorCatalogService->>VendorCatalogService: 3. 1b. Query Database for Migration Batch and Product Sample (AC-001)
    VendorCatalogService->>VendorCatalogService: 4. 1c. Generate S3 Pre-signed URLs for source and error files (AC-005, AC-006)
    AdminWebDashboard->>VendorCatalogService: 5. 3. [ALT: Approve Flow] Submit Migration Approval (AC-002)
    VendorCatalogService-->>AdminWebDashboard: 4. Confirm Approval Success
    VendorCatalogService->>VendorCatalogService: 6. 3a. [DB Transaction Start] Update Migration Batch Status
    VendorCatalogService->>VendorCatalogService: 7. 3b. Record Approval Action to Immutable Audit Trail (REQ-NFR-008)
    VendorCatalogService->>VendorCatalogService: 8. 3c. [DB Transaction Commit]
    AdminWebDashboard->>VendorCatalogService: 9. 5. [ALT: Reject Flow] Submit Migration Rejection with Reason (AC-004)
    VendorCatalogService-->>AdminWebDashboard: 6. Confirm Rejection Success
    VendorCatalogService->>VendorCatalogService: 10. 5a. [DB Transaction Start] Update Migration Batch Status
    VendorCatalogService->>VendorCatalogService: 11. 5b. Record Rejection Action to Immutable Audit Trail (REQ-NFR-008)
    VendorCatalogService->>VendorCatalogService: 12. 5c. [DB Transaction Commit]

    note over VendorCatalogService: Business Rule (BR-TRN-001): The Vendor & Catalog Service must prevent a vendor's primary status f...
    note over AdminWebDashboard: UI Flow: Upon fetching data in Step 2, the frontend renders the validation view. The user then pe...

    deactivate VendorCatalogService
