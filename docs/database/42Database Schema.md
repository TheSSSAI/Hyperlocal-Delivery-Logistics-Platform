# 1 Title

Ratings & Communication Service DB

# 2 Name

communication_db

# 3 Db Type

- relational

# 4 Db Technology

PostgreSQL

# 5 Entities

## 5.1 RatingReview

### 5.1.1 Name

RatingReview

### 5.1.2 Description

Stores customer feedback for vendors and riders. Owned by the Ratings & Communication Service.

### 5.1.3 Attributes

#### 5.1.3.1 ratingReviewId

##### 5.1.3.1.1 Name

ratingReviewId

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

#### 5.1.3.3.0 reviewerId

##### 5.1.3.3.1 Name

reviewerId

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

#### 5.1.3.4.0 revieweeId

##### 5.1.3.4.1 Name

revieweeId

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

#### 5.1.3.5.0 revieweeType

##### 5.1.3.5.1 Name

revieweeType

##### 5.1.3.5.2 Type

🔹 VARCHAR

##### 5.1.3.5.3 Is Required

✅ Yes

##### 5.1.3.5.4 Is Primary Key

❌ No

##### 5.1.3.5.5 Size

10

##### 5.1.3.5.6 Is Unique

❌ No

##### 5.1.3.5.7 Constraints

- ENUM('VENDOR', 'RIDER')

##### 5.1.3.5.8 Precision

0

##### 5.1.3.5.9 Scale

0

##### 5.1.3.5.10 Is Foreign Key

❌ No

#### 5.1.3.6.0 rating

##### 5.1.3.6.1 Name

rating

##### 5.1.3.6.2 Type

🔹 INT

##### 5.1.3.6.3 Is Required

✅ Yes

##### 5.1.3.6.4 Is Primary Key

❌ No

##### 5.1.3.6.5 Size

0

##### 5.1.3.6.6 Is Unique

❌ No

##### 5.1.3.6.7 Constraints

- RANGE(1, 5)

##### 5.1.3.6.8 Precision

0

##### 5.1.3.6.9 Scale

0

##### 5.1.3.6.10 Is Foreign Key

❌ No

#### 5.1.3.7.0 reviewText

##### 5.1.3.7.1 Name

reviewText

##### 5.1.3.7.2 Type

🔹 TEXT

##### 5.1.3.7.3 Is Required

❌ No

##### 5.1.3.7.4 Is Primary Key

❌ No

##### 5.1.3.7.5 Size

0

##### 5.1.3.7.6 Is Unique

❌ No

##### 5.1.3.7.7 Constraints

*No items available*

##### 5.1.3.7.8 Precision

0

##### 5.1.3.7.9 Scale

0

##### 5.1.3.7.10 Is Foreign Key

❌ No

#### 5.1.3.8.0 createdAt

##### 5.1.3.8.1 Name

createdAt

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

- ratingReviewId

### 5.1.5.0.0 Unique Constraints

- {'name': 'UC_RatingReview_Order_Reviewee', 'columns': ['orderId', 'revieweeId']}

### 5.1.6.0.0 Indexes

- {'name': 'IX_RatingReview_Reviewee', 'columns': ['revieweeId', 'revieweeType'], 'type': 'BTree'}

## 5.2.0.0.0 SupportTicket

### 5.2.1.0.0 Name

SupportTicket

### 5.2.2.0.0 Description

Represents a support request created by any user. Owned by the Ratings & Communication Service.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 supportTicketId

##### 5.2.3.1.1 Name

supportTicketId

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

#### 5.2.3.2.0 userId

##### 5.2.3.2.1 Name

userId

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

❌ No

#### 5.2.3.3.0 subject

##### 5.2.3.3.1 Name

subject

##### 5.2.3.3.2 Type

🔹 VARCHAR

##### 5.2.3.3.3 Is Required

✅ Yes

##### 5.2.3.3.4 Is Primary Key

❌ No

##### 5.2.3.3.5 Size

255

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

#### 5.2.3.4.0 description

##### 5.2.3.4.1 Name

description

##### 5.2.3.4.2 Type

🔹 TEXT

##### 5.2.3.4.3 Is Required

✅ Yes

##### 5.2.3.4.4 Is Primary Key

❌ No

##### 5.2.3.4.5 Size

0

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

#### 5.2.3.5.0 status

##### 5.2.3.5.1 Name

status

##### 5.2.3.5.2 Type

🔹 VARCHAR

##### 5.2.3.5.3 Is Required

✅ Yes

##### 5.2.3.5.4 Is Primary Key

❌ No

##### 5.2.3.5.5 Size

20

##### 5.2.3.5.6 Is Unique

❌ No

##### 5.2.3.5.7 Constraints

- ENUM('OPEN', 'IN_PROGRESS', 'CLOSED')
- DEFAULT 'OPEN'

##### 5.2.3.5.8 Precision

0

##### 5.2.3.5.9 Scale

0

##### 5.2.3.5.10 Is Foreign Key

❌ No

#### 5.2.3.6.0 assignedAdminId

##### 5.2.3.6.1 Name

assignedAdminId

##### 5.2.3.6.2 Type

🔹 Guid

##### 5.2.3.6.3 Is Required

❌ No

##### 5.2.3.6.4 Is Primary Key

❌ No

##### 5.2.3.6.5 Size

0

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

#### 5.2.3.7.0 createdAt

##### 5.2.3.7.1 Name

createdAt

##### 5.2.3.7.2 Type

🔹 DateTimeOffset

##### 5.2.3.7.3 Is Required

✅ Yes

##### 5.2.3.7.4 Is Primary Key

❌ No

##### 5.2.3.7.5 Size

0

##### 5.2.3.7.6 Is Unique

❌ No

##### 5.2.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.2.3.7.8 Precision

0

##### 5.2.3.7.9 Scale

0

##### 5.2.3.7.10 Is Foreign Key

❌ No

#### 5.2.3.8.0 updatedAt

##### 5.2.3.8.1 Name

updatedAt

##### 5.2.3.8.2 Type

🔹 DateTimeOffset

##### 5.2.3.8.3 Is Required

✅ Yes

##### 5.2.3.8.4 Is Primary Key

❌ No

##### 5.2.3.8.5 Size

0

##### 5.2.3.8.6 Is Unique

❌ No

##### 5.2.3.8.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.2.3.8.8 Precision

0

##### 5.2.3.8.9 Scale

0

##### 5.2.3.8.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- supportTicketId

### 5.2.5.0.0 Unique Constraints

*No items available*

### 5.2.6.0.0 Indexes

#### 5.2.6.1.0 IX_SupportTicket_Status_AssignedAdmin

##### 5.2.6.1.1 Name

IX_SupportTicket_Status_AssignedAdmin

##### 5.2.6.1.2 Columns

- status
- assignedAdminId

##### 5.2.6.1.3 Type

🔹 BTree

#### 5.2.6.2.0 IX_SupportTicket_UserId_Status

##### 5.2.6.2.1 Name

IX_SupportTicket_UserId_Status

##### 5.2.6.2.2 Columns

- userId
- status

##### 5.2.6.2.3 Type

🔹 BTree

