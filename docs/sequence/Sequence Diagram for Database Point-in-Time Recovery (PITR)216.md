sequenceDiagram
    participant "On-Call Engineer" as OnCallEngineer
    participant "Observability Stack" as ObservabilityStack
    participant "Amazon RDS (Primary DB)" as AmazonRDSPrimaryDB
    participant "Amazon RDS (Restored DB)" as AmazonRDSRestoredDB
    participant "AWS Secrets Manager" as AWSSecretsManager
    participant "Amazon EKS" as AmazonEKS
    participant "Application Services" as ApplicationServices

    activate OnCallEngineer
    ObservabilityStack->>OnCallEngineer: 1. 1. [Trigger] Receive Critical Data Corruption Alert
    OnCallEngineer->>OnCallEngineer: 2. 2. Investigate issue, consult runbook, and determine recoveryTimestamp
    activate AmazonRDSPrimaryDB
    OnCallEngineer->>AmazonRDSPrimaryDB: 3. 3. [Security] Initiate Point-in-Time Recovery
    AmazonRDSPrimaryDB-->>OnCallEngineer: Acknowledge request, return newDbClusterIdentifier
    activate AmazonRDSRestoredDB
    AmazonRDSPrimaryDB->>AmazonRDSRestoredDB: 4. 4. Provision new DB instance from snapshot and WAL logs
    OnCallEngineer->>AmazonRDSRestoredDB: 5. 5. Poll DB instance status until 'available'
    AmazonRDSRestoredDB-->>OnCallEngineer: status: 'available', endpoint: 'new-db-endpoint.rds.amazonaws.com'
    OnCallEngineer->>AmazonRDSRestoredDB: 6. 6. [Data Flow] Execute validation queries on restored data
    AmazonRDSRestoredDB-->>OnCallEngineer: Query results confirming data integrity
    activate AWSSecretsManager
    OnCallEngineer->>AWSSecretsManager: 7. 7. [Security] Update database connection secret
    AWSSecretsManager-->>OnCallEngineer: Confirmation of secret update
    activate AmazonEKS
    OnCallEngineer->>AmazonEKS: 8. 8. Trigger rolling restart of application deployments
    AmazonEKS-->>OnCallEngineer: Acknowledge restart command
    ApplicationServices->>AWSSecretsManager: 9. 9. [On Startup] Fetch updated DB connection secret
    AWSSecretsManager-->>ApplicationServices: Secret payload with new DB endpoint
    ApplicationServices->>AmazonRDSRestoredDB: 10. 10. Establish new database connections
    AmazonRDSRestoredDB-->>ApplicationServices: Connection successful
    OnCallEngineer->>ObservabilityStack: 11. 11. Monitor application health and confirm service restoration
    ObservabilityStack-->>OnCallEngineer: Dashboards show healthy status (2xx responses, low latency)

    note over AmazonRDSPrimaryDB: Decommissioning: The old, corrupted database instance (Primary DB) is retained for 72 hours for p...

    deactivate AmazonEKS
    deactivate AWSSecretsManager
    deactivate AmazonRDSRestoredDB
    deactivate AmazonRDSPrimaryDB
    deactivate OnCallEngineer
