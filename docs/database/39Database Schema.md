# 1 Title

Order Management Service DB

# 2 Name

order_db

# 3 Db Type

- relational

# 4 Db Technology

PostgreSQL

# 5 Entities

## 5.1 Order

### 5.1.1 Name

Order

### 5.1.2 Description

The central transactional entity representing a customer's purchase. Owned by the Order Management Service.

### 5.1.3 Attributes

#### 5.1.3.1 orderId

##### 5.1.3.1.1 Name

orderId

##### 5.1.3.1.2 Type

🔹 Guid

##### 5.1.3.1.3 Is Required

✅ Yes

##### 5.1.3.1.4 Is Primary Key

✅ Yes

##### 5.1.3.1.5 Size

0

##### 5.1.3.1.6 Is Unique

✅ Yes

##### 5.1.3.1.7 Constraints

- DEFAULT GENERATE_UUID()

##### 5.1.3.1.8 Precision

0

##### 5.1.3.1.9 Scale

0

##### 5.1.3.1.10 Is Foreign Key

❌ No

#### 5.1.3.2.0 customerId

##### 5.1.3.2.1 Name

customerId

##### 5.1.3.2.2 Type

🔹 Guid

##### 5.1.3.2.3 Is Required

✅ Yes

##### 5.1.3.2.4 Is Primary Key

❌ No

##### 5.1.3.2.5 Size

0

##### 5.1.3.2.6 Is Unique

❌ No

##### 5.1.3.2.7 Constraints

*No items available*

##### 5.1.3.2.8 Precision

0

##### 5.1.3.2.9 Scale

0

##### 5.1.3.2.10 Is Foreign Key

❌ No

#### 5.1.3.3.0 vendorId

##### 5.1.3.3.1 Name

vendorId

##### 5.1.3.3.2 Type

🔹 Guid

##### 5.1.3.3.3 Is Required

✅ Yes

##### 5.1.3.3.4 Is Primary Key

❌ No

##### 5.1.3.3.5 Size

0

##### 5.1.3.3.6 Is Unique

❌ No

##### 5.1.3.3.7 Constraints

*No items available*

##### 5.1.3.3.8 Precision

0

##### 5.1.3.3.9 Scale

0

##### 5.1.3.3.10 Is Foreign Key

❌ No

#### 5.1.3.4.0 deliveryAddressId

##### 5.1.3.4.1 Name

deliveryAddressId

##### 5.1.3.4.2 Type

🔹 Guid

##### 5.1.3.4.3 Is Required

✅ Yes

##### 5.1.3.4.4 Is Primary Key

❌ No

##### 5.1.3.4.5 Size

0

##### 5.1.3.4.6 Is Unique

❌ No

##### 5.1.3.4.7 Constraints

*No items available*

##### 5.1.3.4.8 Precision

0

##### 5.1.3.4.9 Scale

0

##### 5.1.3.4.10 Is Foreign Key

❌ No

#### 5.1.3.5.0 customerName

##### 5.1.3.5.1 Name

customerName

##### 5.1.3.5.2 Type

🔹 VARCHAR

##### 5.1.3.5.3 Is Required

❌ No

##### 5.1.3.5.4 Is Primary Key

❌ No

##### 5.1.3.5.5 Size

201

##### 5.1.3.5.6 Is Unique

❌ No

##### 5.1.3.5.7 Constraints

*No items available*

##### 5.1.3.5.8 Precision

0

##### 5.1.3.5.9 Scale

0

##### 5.1.3.5.10 Is Foreign Key

❌ No

#### 5.1.3.6.0 vendorStoreName

##### 5.1.3.6.1 Name

vendorStoreName

##### 5.1.3.6.2 Type

🔹 VARCHAR

##### 5.1.3.6.3 Is Required

❌ No

##### 5.1.3.6.4 Is Primary Key

❌ No

##### 5.1.3.6.5 Size

255

##### 5.1.3.6.6 Is Unique

❌ No

##### 5.1.3.6.7 Constraints

*No items available*

##### 5.1.3.6.8 Precision

0

##### 5.1.3.6.9 Scale

0

##### 5.1.3.6.10 Is Foreign Key

❌ No

#### 5.1.3.7.0 subtotal

##### 5.1.3.7.1 Name

subtotal

##### 5.1.3.7.2 Type

🔹 DECIMAL

##### 5.1.3.7.3 Is Required

✅ Yes

##### 5.1.3.7.4 Is Primary Key

❌ No

##### 5.1.3.7.5 Size

0

##### 5.1.3.7.6 Is Unique

❌ No

##### 5.1.3.7.7 Constraints

*No items available*

##### 5.1.3.7.8 Precision

10

##### 5.1.3.7.9 Scale

2

##### 5.1.3.7.10 Is Foreign Key

❌ No

#### 5.1.3.8.0 taxes

##### 5.1.3.8.1 Name

taxes

##### 5.1.3.8.2 Type

🔹 DECIMAL

##### 5.1.3.8.3 Is Required

✅ Yes

##### 5.1.3.8.4 Is Primary Key

❌ No

##### 5.1.3.8.5 Size

0

##### 5.1.3.8.6 Is Unique

❌ No

##### 5.1.3.8.7 Constraints

*No items available*

##### 5.1.3.8.8 Precision

10

##### 5.1.3.8.9 Scale

2

##### 5.1.3.8.10 Is Foreign Key

❌ No

#### 5.1.3.9.0 deliveryFee

##### 5.1.3.9.1 Name

deliveryFee

##### 5.1.3.9.2 Type

🔹 DECIMAL

##### 5.1.3.9.3 Is Required

✅ Yes

##### 5.1.3.9.4 Is Primary Key

❌ No

##### 5.1.3.9.5 Size

0

##### 5.1.3.9.6 Is Unique

❌ No

##### 5.1.3.9.7 Constraints

*No items available*

##### 5.1.3.9.8 Precision

10

##### 5.1.3.9.9 Scale

2

##### 5.1.3.9.10 Is Foreign Key

❌ No

#### 5.1.3.10.0 totalAmount

##### 5.1.3.10.1 Name

totalAmount

##### 5.1.3.10.2 Type

🔹 DECIMAL

##### 5.1.3.10.3 Is Required

✅ Yes

##### 5.1.3.10.4 Is Primary Key

❌ No

##### 5.1.3.10.5 Size

0

##### 5.1.3.10.6 Is Unique

❌ No

##### 5.1.3.10.7 Constraints

*No items available*

##### 5.1.3.10.8 Precision

10

##### 5.1.3.10.9 Scale

2

##### 5.1.3.10.10 Is Foreign Key

❌ No

#### 5.1.3.11.0 status

##### 5.1.3.11.1 Name

status

##### 5.1.3.11.2 Type

🔹 VARCHAR

##### 5.1.3.11.3 Is Required

✅ Yes

##### 5.1.3.11.4 Is Primary Key

❌ No

##### 5.1.3.11.5 Size

30

##### 5.1.3.11.6 Is Unique

❌ No

##### 5.1.3.11.7 Constraints

- ENUM('PAYMENT_PENDING', 'PAYMENT_PENDING_CONFIRMATION', 'PENDING_VENDOR_ACCEPTANCE', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'ALLOCATION_FAILED')

##### 5.1.3.11.8 Precision

0

##### 5.1.3.11.9 Scale

0

##### 5.1.3.11.10 Is Foreign Key

❌ No

#### 5.1.3.12.0 paymentMethod

##### 5.1.3.12.1 Name

paymentMethod

##### 5.1.3.12.2 Type

🔹 VARCHAR

##### 5.1.3.12.3 Is Required

✅ Yes

##### 5.1.3.12.4 Is Primary Key

❌ No

##### 5.1.3.12.5 Size

20

##### 5.1.3.12.6 Is Unique

❌ No

##### 5.1.3.12.7 Constraints

- ENUM('UPI', 'CREDIT_DEBIT_CARD', 'COD')

##### 5.1.3.12.8 Precision

0

##### 5.1.3.12.9 Scale

0

##### 5.1.3.12.10 Is Foreign Key

❌ No

#### 5.1.3.13.0 vendorInstructions

##### 5.1.3.13.1 Name

vendorInstructions

##### 5.1.3.13.2 Type

🔹 TEXT

##### 5.1.3.13.3 Is Required

❌ No

##### 5.1.3.13.4 Is Primary Key

❌ No

##### 5.1.3.13.5 Size

0

##### 5.1.3.13.6 Is Unique

❌ No

##### 5.1.3.13.7 Constraints

*No items available*

##### 5.1.3.13.8 Precision

0

##### 5.1.3.13.9 Scale

0

##### 5.1.3.13.10 Is Foreign Key

❌ No

#### 5.1.3.14.0 riderInstructions

##### 5.1.3.14.1 Name

riderInstructions

##### 5.1.3.14.2 Type

🔹 TEXT

##### 5.1.3.14.3 Is Required

❌ No

##### 5.1.3.14.4 Is Primary Key

❌ No

##### 5.1.3.14.5 Size

0

##### 5.1.3.14.6 Is Unique

❌ No

##### 5.1.3.14.7 Constraints

*No items available*

##### 5.1.3.14.8 Precision

0

##### 5.1.3.14.9 Scale

0

##### 5.1.3.14.10 Is Foreign Key

❌ No

#### 5.1.3.15.0 placedAt

##### 5.1.3.15.1 Name

placedAt

##### 5.1.3.15.2 Type

🔹 DateTimeOffset

##### 5.1.3.15.3 Is Required

✅ Yes

##### 5.1.3.15.4 Is Primary Key

❌ No

##### 5.1.3.15.5 Size

0

##### 5.1.3.15.6 Is Unique

❌ No

##### 5.1.3.15.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.15.8 Precision

0

##### 5.1.3.15.9 Scale

0

##### 5.1.3.15.10 Is Foreign Key

❌ No

#### 5.1.3.16.0 createdAt

##### 5.1.3.16.1 Name

createdAt

##### 5.1.3.16.2 Type

🔹 DateTimeOffset

##### 5.1.3.16.3 Is Required

✅ Yes

##### 5.1.3.16.4 Is Primary Key

❌ No

##### 5.1.3.16.5 Size

0

##### 5.1.3.16.6 Is Unique

❌ No

##### 5.1.3.16.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.16.8 Precision

0

##### 5.1.3.16.9 Scale

0

##### 5.1.3.16.10 Is Foreign Key

❌ No

#### 5.1.3.17.0 updatedAt

##### 5.1.3.17.1 Name

updatedAt

##### 5.1.3.17.2 Type

🔹 DateTimeOffset

##### 5.1.3.17.3 Is Required

✅ Yes

##### 5.1.3.17.4 Is Primary Key

❌ No

##### 5.1.3.17.5 Size

0

##### 5.1.3.17.6 Is Unique

❌ No

##### 5.1.3.17.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.17.8 Precision

0

##### 5.1.3.17.9 Scale

0

##### 5.1.3.17.10 Is Foreign Key

❌ No

### 5.1.4.0.0 Primary Keys

- orderId

### 5.1.5.0.0 Unique Constraints

*No items available*

### 5.1.6.0.0 Indexes

#### 5.1.6.1.0 IX_Order_CustomerId_Status

##### 5.1.6.1.1 Name

IX_Order_CustomerId_Status

##### 5.1.6.1.2 Columns

- customerId
- status

##### 5.1.6.1.3 Type

🔹 BTree

#### 5.1.6.2.0 IX_Order_VendorId_Status

##### 5.1.6.2.1 Name

IX_Order_VendorId_Status

##### 5.1.6.2.2 Columns

- vendorId
- status

##### 5.1.6.2.3 Type

🔹 BTree

#### 5.1.6.3.0 IX_Order_Status_PlacedAt

##### 5.1.6.3.1 Name

IX_Order_Status_PlacedAt

##### 5.1.6.3.2 Columns

- status
- placedAt

##### 5.1.6.3.3 Type

🔹 BTree

## 5.2.0.0.0 OrderItem

### 5.2.1.0.0 Name

OrderItem

### 5.2.2.0.0 Description

Details items in a specific order. Owned by the Order Management Service.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 orderItemId

##### 5.2.3.1.1 Name

orderItemId

##### 5.2.3.1.2 Type

🔹 Guid

##### 5.2.3.1.3 Is Required

✅ Yes

##### 5.2.3.1.4 Is Primary Key

✅ Yes

##### 5.2.3.1.5 Size

0

##### 5.2.3.1.6 Is Unique

✅ Yes

##### 5.2.3.1.7 Constraints

- DEFAULT GENERATE_UUID()

##### 5.2.3.1.8 Precision

0

##### 5.2.3.1.9 Scale

0

##### 5.2.3.1.10 Is Foreign Key

❌ No

#### 5.2.3.2.0 orderId

##### 5.2.3.2.1 Name

orderId

##### 5.2.3.2.2 Type

🔹 Guid

##### 5.2.3.2.3 Is Required

✅ Yes

##### 5.2.3.2.4 Is Primary Key

❌ No

##### 5.2.3.2.5 Size

0

##### 5.2.3.2.6 Is Unique

❌ No

##### 5.2.3.2.7 Constraints

*No items available*

##### 5.2.3.2.8 Precision

0

##### 5.2.3.2.9 Scale

0

##### 5.2.3.2.10 Is Foreign Key

✅ Yes

#### 5.2.3.3.0 productId

##### 5.2.3.3.1 Name

productId

##### 5.2.3.3.2 Type

🔹 Guid

##### 5.2.3.3.3 Is Required

✅ Yes

##### 5.2.3.3.4 Is Primary Key

❌ No

##### 5.2.3.3.5 Size

0

##### 5.2.3.3.6 Is Unique

❌ No

##### 5.2.3.3.7 Constraints

*No items available*

##### 5.2.3.3.8 Precision

0

##### 5.2.3.3.9 Scale

0

##### 5.2.3.3.10 Is Foreign Key

❌ No

#### 5.2.3.4.0 quantity

##### 5.2.3.4.1 Name

quantity

##### 5.2.3.4.2 Type

🔹 INT

##### 5.2.3.4.3 Is Required

✅ Yes

##### 5.2.3.4.4 Is Primary Key

❌ No

##### 5.2.3.4.5 Size

0

##### 5.2.3.4.6 Is Unique

❌ No

##### 5.2.3.4.7 Constraints

- POSITIVE_VALUE

##### 5.2.3.4.8 Precision

0

##### 5.2.3.4.9 Scale

0

##### 5.2.3.4.10 Is Foreign Key

❌ No

#### 5.2.3.5.0 priceAtTimeOfOrder

##### 5.2.3.5.1 Name

priceAtTimeOfOrder

##### 5.2.3.5.2 Type

🔹 DECIMAL

##### 5.2.3.5.3 Is Required

✅ Yes

##### 5.2.3.5.4 Is Primary Key

❌ No

##### 5.2.3.5.5 Size

0

##### 5.2.3.5.6 Is Unique

❌ No

##### 5.2.3.5.7 Constraints

*No items available*

##### 5.2.3.5.8 Precision

10

##### 5.2.3.5.9 Scale

2

##### 5.2.3.5.10 Is Foreign Key

❌ No

#### 5.2.3.6.0 productName

##### 5.2.3.6.1 Name

productName

##### 5.2.3.6.2 Type

🔹 VARCHAR

##### 5.2.3.6.3 Is Required

✅ Yes

##### 5.2.3.6.4 Is Primary Key

❌ No

##### 5.2.3.6.5 Size

255

##### 5.2.3.6.6 Is Unique

❌ No

##### 5.2.3.6.7 Constraints

*No items available*

##### 5.2.3.6.8 Precision

0

##### 5.2.3.6.9 Scale

0

##### 5.2.3.6.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- orderItemId

### 5.2.5.0.0 Unique Constraints

- {'name': 'UC_OrderItem_Order_Product', 'columns': ['orderId', 'productId']}

### 5.2.6.0.0 Indexes

*No items available*

## 5.3.0.0.0 OrderStatusHistory

### 5.3.1.0.0 Name

OrderStatusHistory

### 5.3.2.0.0 Description

An immutable log of all status transitions for an order. Owned by the Order Management Service.

### 5.3.3.0.0 Attributes

#### 5.3.3.1.0 orderStatusHistoryId

##### 5.3.3.1.1 Name

orderStatusHistoryId

##### 5.3.3.1.2 Type

🔹 Guid

##### 5.3.3.1.3 Is Required

✅ Yes

##### 5.3.3.1.4 Is Primary Key

✅ Yes

##### 5.3.3.1.5 Size

0

##### 5.3.3.1.6 Is Unique

✅ Yes

##### 5.3.3.1.7 Constraints

- DEFAULT GENERATE_UUID()

##### 5.3.3.1.8 Precision

0

##### 5.3.3.1.9 Scale

0

##### 5.3.3.1.10 Is Foreign Key

❌ No

#### 5.3.3.2.0 orderId

##### 5.3.3.2.1 Name

orderId

##### 5.3.3.2.2 Type

🔹 Guid

##### 5.3.3.2.3 Is Required

✅ Yes

##### 5.3.3.2.4 Is Primary Key

❌ No

##### 5.3.3.2.5 Size

0

##### 5.3.3.2.6 Is Unique

❌ No

##### 5.3.3.2.7 Constraints

*No items available*

##### 5.3.3.2.8 Precision

0

##### 5.3.3.2.9 Scale

0

##### 5.3.3.2.10 Is Foreign Key

✅ Yes

#### 5.3.3.3.0 status

##### 5.3.3.3.1 Name

status

##### 5.3.3.3.2 Type

🔹 VARCHAR

##### 5.3.3.3.3 Is Required

✅ Yes

##### 5.3.3.3.4 Is Primary Key

❌ No

##### 5.3.3.3.5 Size

30

##### 5.3.3.3.6 Is Unique

❌ No

##### 5.3.3.3.7 Constraints

*No items available*

##### 5.3.3.3.8 Precision

0

##### 5.3.3.3.9 Scale

0

##### 5.3.3.3.10 Is Foreign Key

❌ No

#### 5.3.3.4.0 actor

##### 5.3.3.4.1 Name

actor

##### 5.3.3.4.2 Type

🔹 VARCHAR

##### 5.3.3.4.3 Is Required

✅ Yes

##### 5.3.3.4.4 Is Primary Key

❌ No

##### 5.3.3.4.5 Size

50

##### 5.3.3.4.6 Is Unique

❌ No

##### 5.3.3.4.7 Constraints

*No items available*

##### 5.3.3.4.8 Precision

0

##### 5.3.3.4.9 Scale

0

##### 5.3.3.4.10 Is Foreign Key

❌ No

#### 5.3.3.5.0 notes

##### 5.3.3.5.1 Name

notes

##### 5.3.3.5.2 Type

🔹 TEXT

##### 5.3.3.5.3 Is Required

❌ No

##### 5.3.3.5.4 Is Primary Key

❌ No

##### 5.3.3.5.5 Size

0

##### 5.3.3.5.6 Is Unique

❌ No

##### 5.3.3.5.7 Constraints

*No items available*

##### 5.3.3.5.8 Precision

0

##### 5.3.3.5.9 Scale

0

##### 5.3.3.5.10 Is Foreign Key

❌ No

#### 5.3.3.6.0 createdAt

##### 5.3.3.6.1 Name

createdAt

##### 5.3.3.6.2 Type

🔹 DateTimeOffset

##### 5.3.3.6.3 Is Required

✅ Yes

##### 5.3.3.6.4 Is Primary Key

❌ No

##### 5.3.3.6.5 Size

0

##### 5.3.3.6.6 Is Unique

❌ No

##### 5.3.3.6.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.3.3.6.8 Precision

0

##### 5.3.3.6.9 Scale

0

##### 5.3.3.6.10 Is Foreign Key

❌ No

### 5.3.4.0.0 Primary Keys

- orderStatusHistoryId

### 5.3.5.0.0 Unique Constraints

*No items available*

### 5.3.6.0.0 Indexes

- {'name': 'IX_OrderStatusHistory_OrderId_CreatedAt', 'columns': ['orderId', 'createdAt'], 'type': 'BTree'}

