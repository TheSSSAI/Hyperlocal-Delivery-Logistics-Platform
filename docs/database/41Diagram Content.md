erDiagram
    Payment {
        Guid paymentId PK
        Guid orderId
        DECIMAL amount
        VARCHAR status
        VARCHAR gatewayTransactionId UK
        DateTimeOffset createdAt
    }

    Payout {
        Guid payoutId PK
        Guid userId
        DECIMAL amount
        VARCHAR status
        VARCHAR payoutGatewayTransactionId UK
        DateTimeOffset createdAt
    }

    FinancialTransaction {
        Guid financialTransactionId PK
        Guid orderId
        Guid payoutId FK
        VARCHAR debitAccount
        VARCHAR creditAccount
        DECIMAL amount
        VARCHAR transactionType
        DateTimeOffset createdAt
    }

    Payout ||--o{ FinancialTransaction : "generates"