sequenceDiagram
    actor "Customer Mobile App" as CustomerMobileApp
    participant "Amazon API Gateway" as AmazonAPIGateway
    participant "AWS Cognito" as AWSCognito
    participant "Order Service" as OrderService
    participant "Order Database" as OrderDatabase

    activate AmazonAPIGateway
    CustomerMobileApp->>AmazonAPIGateway: 1. 1. Request Order Details
    AmazonAPIGateway-->>CustomerMobileApp: 16. Returns 200 OK with Order Data
    activate AWSCognito
    AmazonAPIGateway->>AWSCognito: 2. 2. Validate JWT (Cognito Authorizer)
    AWSCognito-->>AmazonAPIGateway: 3. Returns JWT claims on success
    activate OrderService
    AmazonAPIGateway->>OrderService: 4. 4. Forward Authorized Request
    OrderService-->>AmazonAPIGateway: 15. Returns 200 OK with Order Data
    OrderService->>OrderService: 5. 5. [AuthGuard] Intercept & Extract Claims
    OrderService->>OrderService: 6. 6. [RolesGuard] Perform Role-Level Check
    activate OrderDatabase
    OrderService->>OrderDatabase: 7. 7. Fetch Order for Ownership Verification
    OrderDatabase-->>OrderService: 8. Returns Order Record
    OrderService->>OrderService: 9. 9. [OwnershipGuard] Perform Record-Level Check
    OrderService->>OrderService: 10. 10. Authorization successful, proceed to Controller
    OrderService->>OrderService: 11. 11. [OrderController] Execute Business Logic
    OrderService-->>OrderService: 14. Returns prepared Order DTO
    OrderService->>OrderDatabase: 12. 12. Fetch additional related data (e.g., items)
    OrderDatabase-->>OrderService: 13. Returns Order Items

    note over AmazonAPIGateway: Failure Case 1: If JWT validation fails (step 2), the API Gateway immediately responds with '401 ...
    note over OrderService: Failure Case 2: If the Role-Level Check fails (step 6), the Order Service responds with '403 Forb...
    note over OrderService: Failure Case 3: If the Record-Level Check fails (step 9), the Order Service responds with '404 No...

    deactivate OrderDatabase
    deactivate OrderService
    deactivate AWSCognito
    deactivate AmazonAPIGateway
