# 1 Title

Identity & Access Service DB

# 2 Name

identity_db

# 3 Db Type

- relational

# 4 Db Technology

PostgreSQL

# 5 Entities

## 5.1 User

### 5.1.1 Name

User

### 5.1.2 Description

Central entity for all user types (Customers, Vendors, Riders, Administrators) handling authentication and core identification. Owned by the Identity & Access Service.

### 5.1.3 Attributes

#### 5.1.3.1 userId

##### 5.1.3.1.1 Name

userId

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

#### 5.1.3.2.0 mobileNumber

##### 5.1.3.2.1 Name

mobileNumber

##### 5.1.3.2.2 Type

🔹 VARCHAR

##### 5.1.3.2.3 Is Required

✅ Yes

##### 5.1.3.2.4 Is Primary Key

❌ No

##### 5.1.3.2.5 Size

15

##### 5.1.3.2.6 Is Unique

✅ Yes

##### 5.1.3.2.7 Constraints

- INDIAN_MOBILE_FORMAT

##### 5.1.3.2.8 Precision

0

##### 5.1.3.2.9 Scale

0

##### 5.1.3.2.10 Is Foreign Key

❌ No

#### 5.1.3.3.0 email

##### 5.1.3.3.1 Name

email

##### 5.1.3.3.2 Type

🔹 VARCHAR

##### 5.1.3.3.3 Is Required

❌ No

##### 5.1.3.3.4 Is Primary Key

❌ No

##### 5.1.3.3.5 Size

255

##### 5.1.3.3.6 Is Unique

✅ Yes

##### 5.1.3.3.7 Constraints

- EMAIL_FORMAT

##### 5.1.3.3.8 Precision

0

##### 5.1.3.3.9 Scale

0

##### 5.1.3.3.10 Is Foreign Key

❌ No

#### 5.1.3.4.0 userType

##### 5.1.3.4.1 Name

userType

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

- ENUM('CUSTOMER', 'VENDOR', 'RIDER', 'ADMINISTRATOR')

##### 5.1.3.4.8 Precision

0

##### 5.1.3.4.9 Scale

0

##### 5.1.3.4.10 Is Foreign Key

❌ No

#### 5.1.3.5.0 status

##### 5.1.3.5.1 Name

status

##### 5.1.3.5.2 Type

🔹 VARCHAR

##### 5.1.3.5.3 Is Required

✅ Yes

##### 5.1.3.5.4 Is Primary Key

❌ No

##### 5.1.3.5.5 Size

25

##### 5.1.3.5.6 Is Unique

❌ No

##### 5.1.3.5.7 Constraints

- ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED')

##### 5.1.3.5.8 Precision

0

##### 5.1.3.5.9 Scale

0

##### 5.1.3.5.10 Is Foreign Key

❌ No

#### 5.1.3.6.0 cognitoSub

##### 5.1.3.6.1 Name

cognitoSub

##### 5.1.3.6.2 Type

🔹 VARCHAR

##### 5.1.3.6.3 Is Required

✅ Yes

##### 5.1.3.6.4 Is Primary Key

❌ No

##### 5.1.3.6.5 Size

255

##### 5.1.3.6.6 Is Unique

✅ Yes

##### 5.1.3.6.7 Constraints

*No items available*

##### 5.1.3.6.8 Precision

0

##### 5.1.3.6.9 Scale

0

##### 5.1.3.6.10 Is Foreign Key

❌ No

#### 5.1.3.7.0 isDeleted

##### 5.1.3.7.1 Name

isDeleted

##### 5.1.3.7.2 Type

🔹 BOOLEAN

##### 5.1.3.7.3 Is Required

✅ Yes

##### 5.1.3.7.4 Is Primary Key

❌ No

##### 5.1.3.7.5 Size

0

##### 5.1.3.7.6 Is Unique

❌ No

##### 5.1.3.7.7 Constraints

- DEFAULT false

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

#### 5.1.3.9.0 updatedAt

##### 5.1.3.9.1 Name

updatedAt

##### 5.1.3.9.2 Type

🔹 DateTimeOffset

##### 5.1.3.9.3 Is Required

✅ Yes

##### 5.1.3.9.4 Is Primary Key

❌ No

##### 5.1.3.9.5 Size

0

##### 5.1.3.9.6 Is Unique

❌ No

##### 5.1.3.9.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.9.8 Precision

0

##### 5.1.3.9.9 Scale

0

##### 5.1.3.9.10 Is Foreign Key

❌ No

### 5.1.4.0.0 Primary Keys

- userId

### 5.1.5.0.0 Unique Constraints

#### 5.1.5.1.0 UC_User_MobileNumber

##### 5.1.5.1.1 Name

UC_User_MobileNumber

##### 5.1.5.1.2 Columns

- mobileNumber

#### 5.1.5.2.0 UC_User_Email

##### 5.1.5.2.1 Name

UC_User_Email

##### 5.1.5.2.2 Columns

- email

#### 5.1.5.3.0 UC_User_CognitoSub

##### 5.1.5.3.1 Name

UC_User_CognitoSub

##### 5.1.5.3.2 Columns

- cognitoSub

### 5.1.6.0.0 Indexes

#### 5.1.6.1.0 IX_User_UserType_Status

##### 5.1.6.1.1 Name

IX_User_UserType_Status

##### 5.1.6.1.2 Columns

- userType
- status

##### 5.1.6.1.3 Type

🔹 BTree

#### 5.1.6.2.0 IX_User_CreatedAt

##### 5.1.6.2.1 Name

IX_User_CreatedAt

##### 5.1.6.2.2 Columns

- createdAt

##### 5.1.6.2.3 Type

🔹 BTree

## 5.2.0.0.0 CustomerProfile

### 5.2.1.0.0 Name

CustomerProfile

### 5.2.2.0.0 Description

Stores profile information specific to Customers. Owned by the Identity & Access Service.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 customerProfileId

##### 5.2.3.1.1 Name

customerProfileId

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

✅ Yes

##### 5.2.3.2.7 Constraints

*No items available*

##### 5.2.3.2.8 Precision

0

##### 5.2.3.2.9 Scale

0

##### 5.2.3.2.10 Is Foreign Key

✅ Yes

#### 5.2.3.3.0 firstName

##### 5.2.3.3.1 Name

firstName

##### 5.2.3.3.2 Type

🔹 VARCHAR

##### 5.2.3.3.3 Is Required

✅ Yes

##### 5.2.3.3.4 Is Primary Key

❌ No

##### 5.2.3.3.5 Size

100

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

#### 5.2.3.4.0 lastName

##### 5.2.3.4.1 Name

lastName

##### 5.2.3.4.2 Type

🔹 VARCHAR

##### 5.2.3.4.3 Is Required

❌ No

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

#### 5.2.3.5.0 createdAt

##### 5.2.3.5.1 Name

createdAt

##### 5.2.3.5.2 Type

🔹 DateTimeOffset

##### 5.2.3.5.3 Is Required

✅ Yes

##### 5.2.3.5.4 Is Primary Key

❌ No

##### 5.2.3.5.5 Size

0

##### 5.2.3.5.6 Is Unique

❌ No

##### 5.2.3.5.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.2.3.5.8 Precision

0

##### 5.2.3.5.9 Scale

0

##### 5.2.3.5.10 Is Foreign Key

❌ No

#### 5.2.3.6.0 updatedAt

##### 5.2.3.6.1 Name

updatedAt

##### 5.2.3.6.2 Type

🔹 DateTimeOffset

##### 5.2.3.6.3 Is Required

✅ Yes

##### 5.2.3.6.4 Is Primary Key

❌ No

##### 5.2.3.6.5 Size

0

##### 5.2.3.6.6 Is Unique

❌ No

##### 5.2.3.6.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.2.3.6.8 Precision

0

##### 5.2.3.6.9 Scale

0

##### 5.2.3.6.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- customerProfileId

### 5.2.5.0.0 Unique Constraints

- {'name': 'UC_CustomerProfile_UserId', 'columns': ['userId']}

### 5.2.6.0.0 Indexes

*No items available*

## 5.3.0.0.0 Address

### 5.3.1.0.0 Name

Address

### 5.3.2.0.0 Description

Stores physical addresses for users (customers and vendors). Owned by the Identity & Access Service as it contains PII.

### 5.3.3.0.0 Attributes

#### 5.3.3.1.0 addressId

##### 5.3.3.1.1 Name

addressId

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

✅ Yes

#### 5.3.3.3.0 addressLine1

##### 5.3.3.3.1 Name

addressLine1

##### 5.3.3.3.2 Type

🔹 VARCHAR

##### 5.3.3.3.3 Is Required

✅ Yes

##### 5.3.3.3.4 Is Primary Key

❌ No

##### 5.3.3.3.5 Size

255

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

#### 5.3.3.4.0 addressLine2

##### 5.3.3.4.1 Name

addressLine2

##### 5.3.3.4.2 Type

🔹 VARCHAR

##### 5.3.3.4.3 Is Required

❌ No

##### 5.3.3.4.4 Is Primary Key

❌ No

##### 5.3.3.4.5 Size

255

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

#### 5.3.3.5.0 city

##### 5.3.3.5.1 Name

city

##### 5.3.3.5.2 Type

🔹 VARCHAR

##### 5.3.3.5.3 Is Required

✅ Yes

##### 5.3.3.5.4 Is Primary Key

❌ No

##### 5.3.3.5.5 Size

100

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

#### 5.3.3.6.0 postalCode

##### 5.3.3.6.1 Name

postalCode

##### 5.3.3.6.2 Type

🔹 VARCHAR

##### 5.3.3.6.3 Is Required

✅ Yes

##### 5.3.3.6.4 Is Primary Key

❌ No

##### 5.3.3.6.5 Size

10

##### 5.3.3.6.6 Is Unique

❌ No

##### 5.3.3.6.7 Constraints

*No items available*

##### 5.3.3.6.8 Precision

0

##### 5.3.3.6.9 Scale

0

##### 5.3.3.6.10 Is Foreign Key

❌ No

#### 5.3.3.7.0 state

##### 5.3.3.7.1 Name

state

##### 5.3.3.7.2 Type

🔹 VARCHAR

##### 5.3.3.7.3 Is Required

✅ Yes

##### 5.3.3.7.4 Is Primary Key

❌ No

##### 5.3.3.7.5 Size

100

##### 5.3.3.7.6 Is Unique

❌ No

##### 5.3.3.7.7 Constraints

*No items available*

##### 5.3.3.7.8 Precision

0

##### 5.3.3.7.9 Scale

0

##### 5.3.3.7.10 Is Foreign Key

❌ No

#### 5.3.3.8.0 location

##### 5.3.3.8.1 Name

location

##### 5.3.3.8.2 Type

🔹 GEOGRAPHY(Point, 4326)

##### 5.3.3.8.3 Is Required

✅ Yes

##### 5.3.3.8.4 Is Primary Key

❌ No

##### 5.3.3.8.5 Size

0

##### 5.3.3.8.6 Is Unique

❌ No

##### 5.3.3.8.7 Constraints

*No items available*

##### 5.3.3.8.8 Precision

0

##### 5.3.3.8.9 Scale

0

##### 5.3.3.8.10 Is Foreign Key

❌ No

#### 5.3.3.9.0 isDeleted

##### 5.3.3.9.1 Name

isDeleted

##### 5.3.3.9.2 Type

🔹 BOOLEAN

##### 5.3.3.9.3 Is Required

✅ Yes

##### 5.3.3.9.4 Is Primary Key

❌ No

##### 5.3.3.9.5 Size

0

##### 5.3.3.9.6 Is Unique

❌ No

##### 5.3.3.9.7 Constraints

- DEFAULT false

##### 5.3.3.9.8 Precision

0

##### 5.3.3.9.9 Scale

0

##### 5.3.3.9.10 Is Foreign Key

❌ No

#### 5.3.3.10.0 createdAt

##### 5.3.3.10.1 Name

createdAt

##### 5.3.3.10.2 Type

🔹 DateTimeOffset

##### 5.3.3.10.3 Is Required

✅ Yes

##### 5.3.3.10.4 Is Primary Key

❌ No

##### 5.3.3.10.5 Size

0

##### 5.3.3.10.6 Is Unique

❌ No

##### 5.3.3.10.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.3.3.10.8 Precision

0

##### 5.3.3.10.9 Scale

0

##### 5.3.3.10.10 Is Foreign Key

❌ No

#### 5.3.3.11.0 updatedAt

##### 5.3.3.11.1 Name

updatedAt

##### 5.3.3.11.2 Type

🔹 DateTimeOffset

##### 5.3.3.11.3 Is Required

✅ Yes

##### 5.3.3.11.4 Is Primary Key

❌ No

##### 5.3.3.11.5 Size

0

##### 5.3.3.11.6 Is Unique

❌ No

##### 5.3.3.11.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.3.3.11.8 Precision

0

##### 5.3.3.11.9 Scale

0

##### 5.3.3.11.10 Is Foreign Key

❌ No

### 5.3.4.0.0 Primary Keys

- addressId

### 5.3.5.0.0 Unique Constraints

*No items available*

### 5.3.6.0.0 Indexes

#### 5.3.6.1.0 IX_Address_UserId

##### 5.3.6.1.1 Name

IX_Address_UserId

##### 5.3.6.1.2 Columns

- userId

##### 5.3.6.1.3 Type

🔹 BTree

#### 5.3.6.2.0 IX_Address_Location_Spatial_GIST

##### 5.3.6.2.1 Name

IX_Address_Location_Spatial_GIST

##### 5.3.6.2.2 Columns

- location

##### 5.3.6.2.3 Type

🔹 Spatial_GIST

## 5.4.0.0.0 UserConsent

### 5.4.1.0.0 Name

UserConsent

### 5.4.2.0.0 Description

Tracks user consent for data processing activities as per DPDP Act. Owned by the Identity & Access Service.

### 5.4.3.0.0 Attributes

#### 5.4.3.1.0 userConsentId

##### 5.4.3.1.1 Name

userConsentId

##### 5.4.3.1.2 Type

🔹 Guid

##### 5.4.3.1.3 Is Required

✅ Yes

##### 5.4.3.1.4 Is Primary Key

✅ Yes

##### 5.4.3.1.5 Size

0

##### 5.4.3.1.6 Is Unique

✅ Yes

##### 5.4.3.1.7 Constraints

- DEFAULT GENERATE_UUID()

##### 5.4.3.1.8 Precision

0

##### 5.4.3.1.9 Scale

0

##### 5.4.3.1.10 Is Foreign Key

❌ No

#### 5.4.3.2.0 userId

##### 5.4.3.2.1 Name

userId

##### 5.4.3.2.2 Type

🔹 Guid

##### 5.4.3.2.3 Is Required

✅ Yes

##### 5.4.3.2.4 Is Primary Key

❌ No

##### 5.4.3.2.5 Size

0

##### 5.4.3.2.6 Is Unique

❌ No

##### 5.4.3.2.7 Constraints

*No items available*

##### 5.4.3.2.8 Precision

0

##### 5.4.3.2.9 Scale

0

##### 5.4.3.2.10 Is Foreign Key

✅ Yes

#### 5.4.3.3.0 consentType

##### 5.4.3.3.1 Name

consentType

##### 5.4.3.3.2 Type

🔹 VARCHAR

##### 5.4.3.3.3 Is Required

✅ Yes

##### 5.4.3.3.4 Is Primary Key

❌ No

##### 5.4.3.3.5 Size

100

##### 5.4.3.3.6 Is Unique

❌ No

##### 5.4.3.3.7 Constraints

*No items available*

##### 5.4.3.3.8 Precision

0

##### 5.4.3.3.9 Scale

0

##### 5.4.3.3.10 Is Foreign Key

❌ No

#### 5.4.3.4.0 isGranted

##### 5.4.3.4.1 Name

isGranted

##### 5.4.3.4.2 Type

🔹 BOOLEAN

##### 5.4.3.4.3 Is Required

✅ Yes

##### 5.4.3.4.4 Is Primary Key

❌ No

##### 5.4.3.4.5 Size

0

##### 5.4.3.4.6 Is Unique

❌ No

##### 5.4.3.4.7 Constraints

*No items available*

##### 5.4.3.4.8 Precision

0

##### 5.4.3.4.9 Scale

0

##### 5.4.3.4.10 Is Foreign Key

❌ No

#### 5.4.3.5.0 version

##### 5.4.3.5.1 Name

version

##### 5.4.3.5.2 Type

🔹 VARCHAR

##### 5.4.3.5.3 Is Required

✅ Yes

##### 5.4.3.5.4 Is Primary Key

❌ No

##### 5.4.3.5.5 Size

20

##### 5.4.3.5.6 Is Unique

❌ No

##### 5.4.3.5.7 Constraints

*No items available*

##### 5.4.3.5.8 Precision

0

##### 5.4.3.5.9 Scale

0

##### 5.4.3.5.10 Is Foreign Key

❌ No

#### 5.4.3.6.0 createdAt

##### 5.4.3.6.1 Name

createdAt

##### 5.4.3.6.2 Type

🔹 DateTimeOffset

##### 5.4.3.6.3 Is Required

✅ Yes

##### 5.4.3.6.4 Is Primary Key

❌ No

##### 5.4.3.6.5 Size

0

##### 5.4.3.6.6 Is Unique

❌ No

##### 5.4.3.6.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.4.3.6.8 Precision

0

##### 5.4.3.6.9 Scale

0

##### 5.4.3.6.10 Is Foreign Key

❌ No

#### 5.4.3.7.0 updatedAt

##### 5.4.3.7.1 Name

updatedAt

##### 5.4.3.7.2 Type

🔹 DateTimeOffset

##### 5.4.3.7.3 Is Required

✅ Yes

##### 5.4.3.7.4 Is Primary Key

❌ No

##### 5.4.3.7.5 Size

0

##### 5.4.3.7.6 Is Unique

❌ No

##### 5.4.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.4.3.7.8 Precision

0

##### 5.4.3.7.9 Scale

0

##### 5.4.3.7.10 Is Foreign Key

❌ No

### 5.4.4.0.0 Primary Keys

- userConsentId

### 5.4.5.0.0 Unique Constraints

- {'name': 'UC_UserConsent_User_Type_Version', 'columns': ['userId', 'consentType', 'version']}

### 5.4.6.0.0 Indexes

- {'name': 'IX_UserConsent_User_Type', 'columns': ['userId', 'consentType'], 'type': 'BTree'}

## 5.5.0.0.0 AuditLog

### 5.5.1.0.0 Name

AuditLog

### 5.5.2.0.0 Description

An immutable log of all critical actions performed by administrators. Owned by the Identity & Access Service.

### 5.5.3.0.0 Attributes

#### 5.5.3.1.0 auditLogId

##### 5.5.3.1.1 Name

auditLogId

##### 5.5.3.1.2 Type

🔹 BIGSERIAL

##### 5.5.3.1.3 Is Required

✅ Yes

##### 5.5.3.1.4 Is Primary Key

✅ Yes

##### 5.5.3.1.5 Size

0

##### 5.5.3.1.6 Is Unique

✅ Yes

##### 5.5.3.1.7 Constraints

*No items available*

##### 5.5.3.1.8 Precision

0

##### 5.5.3.1.9 Scale

0

##### 5.5.3.1.10 Is Foreign Key

❌ No

#### 5.5.3.2.0 adminId

##### 5.5.3.2.1 Name

adminId

##### 5.5.3.2.2 Type

🔹 Guid

##### 5.5.3.2.3 Is Required

✅ Yes

##### 5.5.3.2.4 Is Primary Key

❌ No

##### 5.5.3.2.5 Size

0

##### 5.5.3.2.6 Is Unique

❌ No

##### 5.5.3.2.7 Constraints

*No items available*

##### 5.5.3.2.8 Precision

0

##### 5.5.3.2.9 Scale

0

##### 5.5.3.2.10 Is Foreign Key

✅ Yes

#### 5.5.3.3.0 action

##### 5.5.3.3.1 Name

action

##### 5.5.3.3.2 Type

🔹 VARCHAR

##### 5.5.3.3.3 Is Required

✅ Yes

##### 5.5.3.3.4 Is Primary Key

❌ No

##### 5.5.3.3.5 Size

100

##### 5.5.3.3.6 Is Unique

❌ No

##### 5.5.3.3.7 Constraints

*No items available*

##### 5.5.3.3.8 Precision

0

##### 5.5.3.3.9 Scale

0

##### 5.5.3.3.10 Is Foreign Key

❌ No

#### 5.5.3.4.0 targetEntity

##### 5.5.3.4.1 Name

targetEntity

##### 5.5.3.4.2 Type

🔹 VARCHAR

##### 5.5.3.4.3 Is Required

❌ No

##### 5.5.3.4.4 Is Primary Key

❌ No

##### 5.5.3.4.5 Size

100

##### 5.5.3.4.6 Is Unique

❌ No

##### 5.5.3.4.7 Constraints

*No items available*

##### 5.5.3.4.8 Precision

0

##### 5.5.3.4.9 Scale

0

##### 5.5.3.4.10 Is Foreign Key

❌ No

#### 5.5.3.5.0 targetEntityId

##### 5.5.3.5.1 Name

targetEntityId

##### 5.5.3.5.2 Type

🔹 VARCHAR

##### 5.5.3.5.3 Is Required

❌ No

##### 5.5.3.5.4 Is Primary Key

❌ No

##### 5.5.3.5.5 Size

255

##### 5.5.3.5.6 Is Unique

❌ No

##### 5.5.3.5.7 Constraints

*No items available*

##### 5.5.3.5.8 Precision

0

##### 5.5.3.5.9 Scale

0

##### 5.5.3.5.10 Is Foreign Key

❌ No

#### 5.5.3.6.0 changedData

##### 5.5.3.6.1 Name

changedData

##### 5.5.3.6.2 Type

🔹 JSONB

##### 5.5.3.6.3 Is Required

❌ No

##### 5.5.3.6.4 Is Primary Key

❌ No

##### 5.5.3.6.5 Size

0

##### 5.5.3.6.6 Is Unique

❌ No

##### 5.5.3.6.7 Constraints

*No items available*

##### 5.5.3.6.8 Precision

0

##### 5.5.3.6.9 Scale

0

##### 5.5.3.6.10 Is Foreign Key

❌ No

#### 5.5.3.7.0 createdAt

##### 5.5.3.7.1 Name

createdAt

##### 5.5.3.7.2 Type

🔹 DateTimeOffset

##### 5.5.3.7.3 Is Required

✅ Yes

##### 5.5.3.7.4 Is Primary Key

❌ No

##### 5.5.3.7.5 Size

0

##### 5.5.3.7.6 Is Unique

❌ No

##### 5.5.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.5.3.7.8 Precision

0

##### 5.5.3.7.9 Scale

0

##### 5.5.3.7.10 Is Foreign Key

❌ No

### 5.5.4.0.0 Primary Keys

- auditLogId

### 5.5.5.0.0 Unique Constraints

*No items available*

### 5.5.6.0.0 Indexes

#### 5.5.6.1.0 IX_AuditLog_AdminId_Date

##### 5.5.6.1.1 Name

IX_AuditLog_AdminId_Date

##### 5.5.6.1.2 Columns

- adminId
- createdAt

##### 5.5.6.1.3 Type

🔹 BTree

#### 5.5.6.2.0 IX_AuditLog_Target

##### 5.5.6.2.1 Name

IX_AuditLog_Target

##### 5.5.6.2.2 Columns

- targetEntity
- targetEntityId

##### 5.5.6.2.3 Type

🔹 BTree

## 5.6.0.0.0 SystemConfiguration

### 5.6.1.0.0 Name

SystemConfiguration

### 5.6.2.0.0 Description

A key-value store for system-wide, admin-configurable settings. Owned by the Identity & Access Service.

### 5.6.3.0.0 Attributes

#### 5.6.3.1.0 configKey

##### 5.6.3.1.1 Name

configKey

##### 5.6.3.1.2 Type

🔹 VARCHAR

##### 5.6.3.1.3 Is Required

✅ Yes

##### 5.6.3.1.4 Is Primary Key

✅ Yes

##### 5.6.3.1.5 Size

100

##### 5.6.3.1.6 Is Unique

✅ Yes

##### 5.6.3.1.7 Constraints

*No items available*

##### 5.6.3.1.8 Precision

0

##### 5.6.3.1.9 Scale

0

##### 5.6.3.1.10 Is Foreign Key

❌ No

#### 5.6.3.2.0 configValue

##### 5.6.3.2.1 Name

configValue

##### 5.6.3.2.2 Type

🔹 TEXT

##### 5.6.3.2.3 Is Required

✅ Yes

##### 5.6.3.2.4 Is Primary Key

❌ No

##### 5.6.3.2.5 Size

0

##### 5.6.3.2.6 Is Unique

❌ No

##### 5.6.3.2.7 Constraints

*No items available*

##### 5.6.3.2.8 Precision

0

##### 5.6.3.2.9 Scale

0

##### 5.6.3.2.10 Is Foreign Key

❌ No

#### 5.6.3.3.0 description

##### 5.6.3.3.1 Name

description

##### 5.6.3.3.2 Type

🔹 TEXT

##### 5.6.3.3.3 Is Required

❌ No

##### 5.6.3.3.4 Is Primary Key

❌ No

##### 5.6.3.3.5 Size

0

##### 5.6.3.3.6 Is Unique

❌ No

##### 5.6.3.3.7 Constraints

*No items available*

##### 5.6.3.3.8 Precision

0

##### 5.6.3.3.9 Scale

0

##### 5.6.3.3.10 Is Foreign Key

❌ No

#### 5.6.3.4.0 updatedAt

##### 5.6.3.4.1 Name

updatedAt

##### 5.6.3.4.2 Type

🔹 DateTimeOffset

##### 5.6.3.4.3 Is Required

✅ Yes

##### 5.6.3.4.4 Is Primary Key

❌ No

##### 5.6.3.4.5 Size

0

##### 5.6.3.4.6 Is Unique

❌ No

##### 5.6.3.4.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.6.3.4.8 Precision

0

##### 5.6.3.4.9 Scale

0

##### 5.6.3.4.10 Is Foreign Key

❌ No

#### 5.6.3.5.0 updatedBy

##### 5.6.3.5.1 Name

updatedBy

##### 5.6.3.5.2 Type

🔹 Guid

##### 5.6.3.5.3 Is Required

✅ Yes

##### 5.6.3.5.4 Is Primary Key

❌ No

##### 5.6.3.5.5 Size

0

##### 5.6.3.5.6 Is Unique

❌ No

##### 5.6.3.5.7 Constraints

*No items available*

##### 5.6.3.5.8 Precision

0

##### 5.6.3.5.9 Scale

0

##### 5.6.3.5.10 Is Foreign Key

✅ Yes

### 5.6.4.0.0 Primary Keys

- configKey

### 5.6.5.0.0 Unique Constraints

*No items available*

### 5.6.6.0.0 Indexes

*No items available*

