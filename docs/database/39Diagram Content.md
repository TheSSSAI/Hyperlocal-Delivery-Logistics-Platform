erDiagram
    Order {
        Guid orderId PK
        Guid customerId
        Guid vendorId
        Guid deliveryAddressId
        VARCHAR customerName
        VARCHAR vendorStoreName
        DECIMAL subtotal
        DECIMAL taxes
        DECIMAL deliveryFee
        DECIMAL totalAmount
        VARCHAR status
        VARCHAR paymentMethod
        TEXT vendorInstructions
        TEXT riderInstructions
        DateTimeOffset placedAt
        DateTimeOffset createdAt
        DateTimeOffset updatedAt
    }

    OrderItem {
        Guid orderItemId PK
        Guid orderId FK
        Guid productId
        INT quantity
        DECIMAL priceAtTimeOfOrder
        VARCHAR productName
    }

    OrderStatusHistory {
        Guid orderStatusHistoryId PK
        Guid orderId FK
        VARCHAR status
        VARCHAR actor
        TEXT notes
        DateTimeOffset createdAt
    }

    Order ||--|{ OrderItem : "contains"
    Order ||--|{ OrderStatusHistory : "tracks"