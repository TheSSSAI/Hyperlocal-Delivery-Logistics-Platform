sequenceDiagram
    participant "Administrator" as Administrator
    actor "Admin Dashboard" as AdminDashboard
    participant "API Gateway" as APIGateway
    participant "Identity Service" as IdentityService
    participant "Primary Database" as PrimaryDatabase

    activate AdminDashboard
    Administrator->>AdminDashboard: 1. 1. Initiates user suspension for targetUserId and confirms via two-step confirmation modal (REQ-USR-001).
    activate APIGateway
    AdminDashboard->>APIGateway: 2. 2. Sends suspension request.
    APIGateway-->>AdminDashboard: HTTP 204 No Content on success, or 4xx/5xx error.
    activate IdentityService
    APIGateway->>IdentityService: 3. 3. [Security] Validates admin JWT and forwards authorized request.
    IdentityService-->>APIGateway: Propagates HTTP 204 or error status from service.
    IdentityService->>IdentityService: 4. 4. [Security Checkpoint] Enforces RBAC by verifying 'Administrator' role.
    activate PrimaryDatabase
    IdentityService->>PrimaryDatabase: 5. 5. Begins a database transaction.
    PrimaryDatabase-->>IdentityService: Transaction started.
    IdentityService->>PrimaryDatabase: 6. 6. Updates the user's status to 'suspended'.
    PrimaryDatabase-->>IdentityService: 1 row affected.
    IdentityService->>PrimaryDatabase: 7. 7. [Audit Requirement] Inserts an immutable record into the audit trail.
    PrimaryDatabase-->>IdentityService: 1 row affected.
    IdentityService->>PrimaryDatabase: 8. 8. Commits the atomic transaction.
    PrimaryDatabase-->>IdentityService: Transaction committed.
    IdentityService->>IdentityService: 9. 9. [Async] Publishes UserSuspended event to invalidate active sessions.

    note over AdminDashboard: The two-step confirmation UI flow (REQ-USR-001) is handled entirely within the Admin Dashboard be...
    note over IdentityService: Error Handling: If the INSERT into audit_log fails (Step 7), the Identity Service MUST issue a RO...

    deactivate PrimaryDatabase
    deactivate IdentityService
    deactivate APIGateway
    deactivate AdminDashboard
