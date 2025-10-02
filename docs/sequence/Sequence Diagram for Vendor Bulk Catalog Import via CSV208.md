sequenceDiagram
    participant "Vendor Dashboard" as VendorDashboard
    participant "Vendor & Catalog Service" as VendorCatalogService
    participant "Amazon S3" as AmazonS3
    participant "Amazon SQS" as AmazonSQS
    participant "PostgreSQL DB" as PostgreSQLDB
    participant "Chat Service" as ChatService

    activate VendorCatalogService
    VendorDashboard->>VendorCatalogService: 1. 1. Request secure upload URL for catalog import
    VendorCatalogService-->>VendorDashboard: 2. Respond with pre-signed URL and a unique importJobId
    VendorCatalogService->>AmazonS3: 2. 1.1. Generate pre-signed PUT URL for temporary upload
    AmazonS3-->>VendorCatalogService: 1.2. Returns secure, time-limited URL
    VendorDashboard->>AmazonS3: 3. 3. Upload CSV file directly to S3 using pre-signed URL
    AmazonS3-->>VendorDashboard: 4. S3 confirms successful upload (HTTP 200 OK)
    VendorDashboard->>VendorCatalogService: 4. 5. Notify backend that upload is complete and start processing
    VendorCatalogService-->>VendorDashboard: 6. Acknowledge that job is queued for processing
    VendorCatalogService->>AmazonSQS: 5. 5.1. Enqueue job for asynchronous processing
    AmazonSQS-->>VendorCatalogService: 5.2. SQS confirms message received
    AmazonSQS->>VendorCatalogService: 6. 7. (Async) Delivers job message to a worker instance
    VendorCatalogService->>AmazonS3: 7. 8. Stream uploaded CSV file for processing
    AmazonS3-->>VendorCatalogService: 8.1. Returns readable stream of the file content
    VendorCatalogService->>VendorCatalogService: 8. 9. Loop: Process file stream row-by-row
    VendorCatalogService->>VendorCatalogService: 9. 9.1. Validate row (headers, required fields, data types per REQ-FUN-011)
    VendorCatalogService->>VendorCatalogService: 10. 9.2. If valid, transform row to Product entity
    activate PostgreSQLDB
    VendorCatalogService->>PostgreSQLDB: 11. 10. Begin Transaction
    VendorCatalogService->>PostgreSQLDB: 12. 11. Bulk insert/update valid Product entities
    PostgreSQLDB-->>VendorCatalogService: 11.1. Returns count of affected rows
    VendorCatalogService->>PostgreSQLDB: 13. 12. Commit Transaction
    VendorCatalogService->>AmazonS3: 14. 13. If errors occurred, upload generated error report CSV
    AmazonS3-->>VendorCatalogService: 13.1. S3 confirms successful upload
    VendorCatalogService->>PostgreSQLDB: 15. 14. Update job status with results
    activate ChatService
    VendorCatalogService->>ChatService: 16. 15. Publish completion event for vendor notification
    ChatService->>VendorDashboard: 17. 16. Push real-time notification to Vendor Dashboard

    note over AmazonS3: Security: Pre-signed URLs provide temporary, secure, direct-to-S3 upload access, preventing large...
    note over VendorCatalogService: Performance: The entire file is streamed from S3. This is crucial for performance and memory effi...
    note over PostgreSQLDB: Data Integrity: The bulk insert/update operation is wrapped in a single database transaction. If ...

    deactivate ChatService
    deactivate PostgreSQLDB
    deactivate VendorCatalogService
