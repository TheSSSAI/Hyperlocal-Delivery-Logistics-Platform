erDiagram
    ChatMessage {
        ObjectId _id PK
        Guid orderId
        String conversationId
        Guid senderId
        String messageText
        Boolean isRead
        ISODate createdAt
    }