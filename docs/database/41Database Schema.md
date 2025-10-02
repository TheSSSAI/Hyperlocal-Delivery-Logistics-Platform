# 1 Title

Payments & Settlements Service DB

# 2 Name

payments_db

# 3 Db Type

- relational

# 4 Db Technology

PostgreSQL

# 5 Entities

## 5.1 Payment

### 5.1.1 Name

Payment

### 5.1.2 Description

Records all payment transactions associated with orders. Owned by the Payments & Settlements Service.

### 5.1.3 Attributes

#### 5.1.3.1 paymentId

##### 5.1.3.1.1 Name

paymentId

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

#### 5.1.3.2.0 orderId

##### 5.1.3.2.1 Name

orderId

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

#### 5.1.3.3.0 amount

##### 5.1.3.3.1 Name

amount

##### 5.1.3.3.2 Type

🔹 DECIMAL

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

10

##### 5.1.3.3.9 Scale

2

##### 5.1.3.3.10 Is Foreign Key

❌ No

#### 5.1.3.4.0 status

##### 5.1.3.4.1 Name

status

##### 5.1.3.4.2 Type

🔹 VARCHAR

##### 5.1.3.4.3 Is Required

✅ Yes

##### 5.1.3.4.4 Is Primary Key

❌ No

##### 5.1.3.4.5 Size

20

##### 5.1.3.4.6 Is Unique

❌ No

##### 5.1.3.4.7 Constraints

- ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')

##### 5.1.3.4.8 Precision

0

##### 5.1.3.4.9 Scale

0

##### 5.1.3.4.10 Is Foreign Key

❌ No

#### 5.1.3.5.0 gatewayTransactionId

##### 5.1.3.5.1 Name

gatewayTransactionId

##### 5.1.3.5.2 Type

🔹 VARCHAR

##### 5.1.3.5.3 Is Required

✅ Yes

##### 5.1.3.5.4 Is Primary Key

❌ No

##### 5.1.3.5.5 Size

255

##### 5.1.3.5.6 Is Unique

✅ Yes

##### 5.1.3.5.7 Constraints

*No items available*

##### 5.1.3.5.8 Precision

0

##### 5.1.3.5.9 Scale

0

##### 5.1.3.5.10 Is Foreign Key

❌ No

#### 5.1.3.6.0 gatewayResponse

##### 5.1.3.6.1 Name

gatewayResponse

##### 5.1.3.6.2 Type

🔹 JSONB

##### 5.1.3.6.3 Is Required

❌ No

##### 5.1.3.6.4 Is Primary Key

❌ No

##### 5.1.3.6.5 Size

0

##### 5.1.3.6.6 Is Unique

❌ No

##### 5.1.3.6.7 Constraints

- DEFAULT '{}'

##### 5.1.3.6.8 Precision

0

##### 5.1.3.6.9 Scale

0

##### 5.1.3.6.10 Is Foreign Key

❌ No

#### 5.1.3.7.0 createdAt

##### 5.1.3.7.1 Name

createdAt

##### 5.1.3.7.2 Type

🔹 DateTimeOffset

##### 5.1.3.7.3 Is Required

✅ Yes

##### 5.1.3.7.4 Is Primary Key

❌ No

##### 5.1.3.7.5 Size

0

##### 5.1.3.7.6 Is Unique

❌ No

##### 5.1.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.7.8 Precision

0

##### 5.1.3.7.9 Scale

0

##### 5.1.3.7.10 Is Foreign Key

❌ No

#### 5.1.3.8.0 updatedAt

##### 5.1.3.8.1 Name

updatedAt

##### 5.1.3.8.2 Type

🔹 DateTimeOffset

##### 5.1.3.8.3 Is Required

✅ Yes

##### 5.1.3.8.4 Is Primary Key

❌ No

##### 5.1.3.8.5 Size

0

##### 5.1.3.8.6 Is Unique

❌ No

##### 5.1.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.8.8 Precision

0

##### 5.1.3.8.9 Scale

0

##### 5.1.3.8.10 Is Foreign Key

❌ No

### 5.1.4.0.0 Primary Keys

- paymentId

### 5.1.5.0.0 Unique Constraints

- {'name': 'UC_Payment_GatewayTransactionId', 'columns': ['gatewayTransactionId']}

### 5.1.6.0.0 Indexes

#### 5.1.6.1.0 IX_Payment_OrderId

##### 5.1.6.1.1 Name

IX_Payment_OrderId

##### 5.1.6.1.2 Columns

- orderId

##### 5.1.6.1.3 Type

🔹 BTree

#### 5.1.6.2.0 IX_Payment_Status_Created

##### 5.1.6.2.1 Name

IX_Payment_Status_Created

##### 5.1.6.2.2 Columns

- status
- createdAt

##### 5.1.6.2.3 Type

🔹 BTree

## 5.2.0.0.0 FinancialTransaction

### 5.2.1.0.0 Name

FinancialTransaction

### 5.2.2.0.0 Description

An immutable double-entry ledger for all monetary movements in the system. Owned by the Payments & Settlements Service.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 financialTransactionId

##### 5.2.3.1.1 Name

financialTransactionId

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

❌ No

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

❌ No

#### 5.2.3.3.0 payoutId

##### 5.2.3.3.1 Name

payoutId

##### 5.2.3.3.2 Type

🔹 Guid

##### 5.2.3.3.3 Is Required

❌ No

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

✅ Yes

#### 5.2.3.4.0 debitAccount

##### 5.2.3.4.1 Name

debitAccount

##### 5.2.3.4.2 Type

🔹 VARCHAR

##### 5.2.3.4.3 Is Required

✅ Yes

##### 5.2.3.4.4 Is Primary Key

❌ No

##### 5.2.3.4.5 Size

100

##### 5.2.3.4.6 Is Unique

❌ No

##### 5.2.3.4.7 Constraints

*No items available*

##### 5.2.3.4.8 Precision

0

##### 5.2.3.4.9 Scale

0

##### 5.2.3.4.10 Is Foreign Key

❌ No

#### 5.2.3.5.0 creditAccount

##### 5.2.3.5.1 Name

creditAccount

##### 5.2.3.5.2 Type

🔹 VARCHAR

##### 5.2.3.5.3 Is Required

✅ Yes

##### 5.2.3.5.4 Is Primary Key

❌ No

##### 5.2.3.5.5 Size

100

##### 5.2.3.5.6 Is Unique

❌ No

##### 5.2.3.5.7 Constraints

*No items available*

##### 5.2.3.5.8 Precision

0

##### 5.2.3.5.9 Scale

0

##### 5.2.3.5.10 Is Foreign Key

❌ No

#### 5.2.3.6.0 amount

##### 5.2.3.6.1 Name

amount

##### 5.2.3.6.2 Type

🔹 DECIMAL

##### 5.2.3.6.3 Is Required

✅ Yes

##### 5.2.3.6.4 Is Primary Key

❌ No

##### 5.2.3.6.5 Size

0

##### 5.2.3.6.6 Is Unique

❌ No

##### 5.2.3.6.7 Constraints

*No items available*

##### 5.2.3.6.8 Precision

10

##### 5.2.3.6.9 Scale

2

##### 5.2.3.6.10 Is Foreign Key

❌ No

#### 5.2.3.7.0 description

##### 5.2.3.7.1 Name

description

##### 5.2.3.7.2 Type

🔹 TEXT

##### 5.2.3.7.3 Is Required

❌ No

##### 5.2.3.7.4 Is Primary Key

❌ No

##### 5.2.3.7.5 Size

0

##### 5.2.3.7.6 Is Unique

❌ No

##### 5.2.3.7.7 Constraints

*No items available*

##### 5.2.3.7.8 Precision

0

##### 5.2.3.7.9 Scale

0

##### 5.2.3.7.10 Is Foreign Key

❌ No

#### 5.2.3.8.0 transactionType

##### 5.2.3.8.1 Name

transactionType

##### 5.2.3.8.2 Type

🔹 VARCHAR

##### 5.2.3.8.3 Is Required

✅ Yes

##### 5.2.3.8.4 Is Primary Key

❌ No

##### 5.2.3.8.5 Size

20

##### 5.2.3.8.6 Is Unique

❌ No

##### 5.2.3.8.7 Constraints

- ENUM('SALE', 'COMMISSION', 'PAYOUT', 'REFUND', 'CANCELLATION_FEE')

##### 5.2.3.8.8 Precision

0

##### 5.2.3.8.9 Scale

0

##### 5.2.3.8.10 Is Foreign Key

❌ No

#### 5.2.3.9.0 createdAt

##### 5.2.3.9.1 Name

createdAt

##### 5.2.3.9.2 Type

🔹 DateTimeOffset

##### 5.2.3.9.3 Is Required

✅ Yes

##### 5.2.3.9.4 Is Primary Key

❌ No

##### 5.2.3.9.5 Size

0

##### 5.2.3.9.6 Is Unique

❌ No

##### 5.2.3.9.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.2.3.9.8 Precision

0

##### 5.2.3.9.9 Scale

0

##### 5.2.3.9.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- financialTransactionId

### 5.2.5.0.0 Unique Constraints

*No items available*

### 5.2.6.0.0 Indexes

#### 5.2.6.1.0 IX_FinancialTransaction_DebitAccount_Date

##### 5.2.6.1.1 Name

IX_FinancialTransaction_DebitAccount_Date

##### 5.2.6.1.2 Columns

- debitAccount
- createdAt

##### 5.2.6.1.3 Type

🔹 BTree

#### 5.2.6.2.0 IX_FinancialTransaction_CreditAccount_Date

##### 5.2.6.2.1 Name

IX_FinancialTransaction_CreditAccount_Date

##### 5.2.6.2.2 Columns

- creditAccount
- createdAt

##### 5.2.6.2.3 Type

🔹 BTree

#### 5.2.6.3.0 IX_FinancialTransaction_OrderId

##### 5.2.6.3.1 Name

IX_FinancialTransaction_OrderId

##### 5.2.6.3.2 Columns

- orderId

##### 5.2.6.3.3 Type

🔹 BTree

## 5.3.0.0.0 Payout

### 5.3.1.0.0 Name

Payout

### 5.3.2.0.0 Description

Represents a settlement of funds to a vendor or rider. Owned by the Payments & Settlements Service.

### 5.3.3.0.0 Attributes

#### 5.3.3.1.0 payoutId

##### 5.3.3.1.1 Name

payoutId

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

#### 5.3.3.2.0 userId

##### 5.3.3.2.1 Name

userId

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

❌ No

#### 5.3.3.3.0 amount

##### 5.3.3.3.1 Name

amount

##### 5.3.3.3.2 Type

🔹 DECIMAL

##### 5.3.3.3.3 Is Required

✅ Yes

##### 5.3.3.3.4 Is Primary Key

❌ No

##### 5.3.3.3.5 Size

0

##### 5.3.3.3.6 Is Unique

❌ No

##### 5.3.3.3.7 Constraints

*No items available*

##### 5.3.3.3.8 Precision

10

##### 5.3.3.3.9 Scale

2

##### 5.3.3.3.10 Is Foreign Key

❌ No

#### 5.3.3.4.0 periodStartDate

##### 5.3.3.4.1 Name

periodStartDate

##### 5.3.3.4.2 Type

🔹 DATE

##### 5.3.3.4.3 Is Required

✅ Yes

##### 5.3.3.4.4 Is Primary Key

❌ No

##### 5.3.3.4.5 Size

0

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

#### 5.3.3.5.0 periodEndDate

##### 5.3.3.5.1 Name

periodEndDate

##### 5.3.3.5.2 Type

🔹 DATE

##### 5.3.3.5.3 Is Required

✅ Yes

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

#### 5.3.3.6.0 status

##### 5.3.3.6.1 Name

status

##### 5.3.3.6.2 Type

🔹 VARCHAR

##### 5.3.3.6.3 Is Required

✅ Yes

##### 5.3.3.6.4 Is Primary Key

❌ No

##### 5.3.3.6.5 Size

20

##### 5.3.3.6.6 Is Unique

❌ No

##### 5.3.3.6.7 Constraints

- ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')
- DEFAULT 'PENDING'

##### 5.3.3.6.8 Precision

0

##### 5.3.3.6.9 Scale

0

##### 5.3.3.6.10 Is Foreign Key

❌ No

#### 5.3.3.7.0 payoutGatewayTransactionId

##### 5.3.3.7.1 Name

payoutGatewayTransactionId

##### 5.3.3.7.2 Type

🔹 VARCHAR

##### 5.3.3.7.3 Is Required

❌ No

##### 5.3.3.7.4 Is Primary Key

❌ No

##### 5.3.3.7.5 Size

255

##### 5.3.3.7.6 Is Unique

✅ Yes

##### 5.3.3.7.7 Constraints

*No items available*

##### 5.3.3.7.8 Precision

0

##### 5.3.3.7.9 Scale

0

##### 5.3.3.7.10 Is Foreign Key

❌ No

#### 5.3.3.8.0 createdAt

##### 5.3.3.8.1 Name

createdAt

##### 5.3.3.8.2 Type

🔹 DateTimeOffset

##### 5.3.3.8.3 Is Required

✅ Yes

##### 5.3.3.8.4 Is Primary Key

❌ No

##### 5.3.3.8.5 Size

0

##### 5.3.3.8.6 Is Unique

❌ No

##### 5.3.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.3.3.8.8 Precision

0

##### 5.3.3.8.9 Scale

0

##### 5.3.3.8.10 Is Foreign Key

❌ No

#### 5.3.3.9.0 updatedAt

##### 5.3.3.9.1 Name

updatedAt

##### 5.3.3.9.2 Type

🔹 DateTimeOffset

##### 5.3.3.9.3 Is Required

✅ Yes

##### 5.3.3.9.4 Is Primary Key

❌ No

##### 5.3.3.9.5 Size

0

##### 5.3.3.9.6 Is Unique

❌ No

##### 5.3.3.9.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.3.3.9.8 Precision

0

##### 5.3.3.9.9 Scale

0

##### 5.3.3.9.10 Is Foreign Key

❌ No

### 5.3.4.0.0 Primary Keys

- payoutId

### 5.3.5.0.0 Unique Constraints

- {'name': 'UC_Payout_GatewayTransactionId', 'columns': ['payoutGatewayTransactionId']}

### 5.3.6.0.0 Indexes

#### 5.3.6.1.0 IX_Payout_User_Period

##### 5.3.6.1.1 Name

IX_Payout_User_Period

##### 5.3.6.1.2 Columns

- userId
- periodStartDate
- periodEndDate

##### 5.3.6.1.3 Type

🔹 BTree

#### 5.3.6.2.0 IX_Payout_Status_Date

##### 5.3.6.2.1 Name

IX_Payout_Status_Date

##### 5.3.6.2.2 Columns

- status
- createdAt

##### 5.3.6.2.3 Type

🔹 BTree

