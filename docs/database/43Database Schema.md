# 1 Title

Chat Service DB

# 2 Name

chat_db

# 3 Db Type

- document

# 4 Db Technology

Amazon DocumentDB

# 5 Entities

- {'name': 'ChatMessage', 'description': 'Stores messages for the in-app chat related to an active order. A document model is chosen for scalability and flexible schema for chat features.', 'attributes': [{'name': '_id', 'type': 'ObjectId', 'isRequired': True, 'isPrimaryKey': True, 'size': 0, 'isUnique': True, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'orderId', 'type': 'Guid', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'conversationId', 'type': 'String', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ['Typically a composite key like customerId-vendorId-orderId'], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'senderId', 'type': 'Guid', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'messageText', 'type': 'String', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': [], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'isRead', 'type': 'Boolean', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ['DEFAULT false'], 'precision': 0, 'scale': 0, 'isForeignKey': False}, {'name': 'createdAt', 'type': 'ISODate', 'isRequired': True, 'isPrimaryKey': False, 'size': 0, 'isUnique': False, 'constraints': ['DEFAULT new Date()'], 'precision': 0, 'scale': 0, 'isForeignKey': False}], 'primaryKeys': ['_id'], 'uniqueConstraints': [], 'indexes': [{'name': 'IX_ChatMessage_Conversation_CreatedAt', 'columns': ['conversationId', 'createdAt'], 'type': 'Compound'}]}

