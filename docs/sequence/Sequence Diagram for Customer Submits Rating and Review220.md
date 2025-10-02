sequenceDiagram
    actor "Customer Mobile App" as CustomerMobileApp
    participant "API Gateway" as APIGateway
    participant "Ratings & Communication Service" as RatingsCommunicationService
    participant "PostgreSQL Database" as PostgreSQLDatabase

    CustomerMobileApp->>CustomerMobileApp: 1. User is prompted to rate the delivered order upon opening the app or order details screen.
    activate APIGateway
    CustomerMobileApp->>APIGateway: 2. POST /api/v1/ratings
    APIGateway-->>CustomerMobileApp: 201 Created | 400 | 401 | 403 | 404 | 409
    activate RatingsCommunicationService
    APIGateway->>RatingsCommunicationService: 3. Forward POST /ratings request
    RatingsCommunicationService-->>APIGateway: Forwarded HTTP Response
    RatingsCommunicationService->>PostgreSQLDatabase: 4. SELECT * FROM orders WHERE id = :orderId AND customerId = :jwtCustomerId AND status = 'delivered'
    PostgreSQLDatabase-->>RatingsCommunicationService: Order Record | No Record Found
    RatingsCommunicationService->>PostgreSQLDatabase: 5. SELECT id FROM ratings WHERE orderId = :orderId
    PostgreSQLDatabase-->>RatingsCommunicationService: Existing Rating ID(s) | No Records Found
    RatingsCommunicationService->>PostgreSQLDatabase: 6. BEGIN TRANSACTION
    PostgreSQLDatabase-->>RatingsCommunicationService: OK
    RatingsCommunicationService->>PostgreSQLDatabase: 7. INSERT INTO ratings (...) VALUES (...); INSERT INTO ratings (...)
    PostgreSQLDatabase-->>RatingsCommunicationService: New Rating IDs
    RatingsCommunicationService->>PostgreSQLDatabase: 8. COMMIT TRANSACTION
    PostgreSQLDatabase-->>RatingsCommunicationService: OK
    RatingsCommunicationService->>RatingsCommunicationService: 9. [Async] Publish RatingSubmittedEvent

    note over RatingsCommunicationService: Updating average ratings for vendors and riders should be handled asynchronously by a separate co...
    note over CustomerMobileApp: The trigger for the UI prompt is based on the client app receiving a notification or polling for ...

    deactivate RatingsCommunicationService
    deactivate APIGateway
