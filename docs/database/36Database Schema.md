# 1 Entities

## 1.1 User

### 1.1.1 Name

User

### 1.1.2 Description

Central entity for all user types (Customers, Vendors, Riders, Administrators) handling authentication and core identification.

### 1.1.3 Attributes

#### 1.1.3.1 userId

##### 1.1.3.1.1 Name

userId

##### 1.1.3.1.2 Type

🔹 Guid

##### 1.1.3.1.3 Is Required

✅ Yes

##### 1.1.3.1.4 Is Primary Key

✅ Yes

##### 1.1.3.1.5 Is Unique

✅ Yes

##### 1.1.3.1.6 Index Type

UniqueIndex

##### 1.1.3.1.7 Size

0

##### 1.1.3.1.8 Constraints

*No items available*

##### 1.1.3.1.9 Default Value

GENERATE_UUID()

##### 1.1.3.1.10 Is Foreign Key

❌ No

##### 1.1.3.1.11 Precision

0

##### 1.1.3.1.12 Scale

0

#### 1.1.3.2.0 mobileNumber

##### 1.1.3.2.1 Name

mobileNumber

##### 1.1.3.2.2 Type

🔹 VARCHAR

##### 1.1.3.2.3 Is Required

✅ Yes

##### 1.1.3.2.4 Is Primary Key

❌ No

##### 1.1.3.2.5 Is Unique

✅ Yes

##### 1.1.3.2.6 Index Type

UniqueIndex

##### 1.1.3.2.7 Size

15

##### 1.1.3.2.8 Constraints

- INDIAN_MOBILE_FORMAT

##### 1.1.3.2.9 Default Value



##### 1.1.3.2.10 Is Foreign Key

❌ No

##### 1.1.3.2.11 Precision

0

##### 1.1.3.2.12 Scale

0

#### 1.1.3.3.0 email

##### 1.1.3.3.1 Name

email

##### 1.1.3.3.2 Type

🔹 VARCHAR

##### 1.1.3.3.3 Is Required

❌ No

##### 1.1.3.3.4 Is Primary Key

❌ No

##### 1.1.3.3.5 Is Unique

✅ Yes

##### 1.1.3.3.6 Index Type

UniqueIndex

##### 1.1.3.3.7 Size

255

##### 1.1.3.3.8 Constraints

- EMAIL_FORMAT

##### 1.1.3.3.9 Default Value



##### 1.1.3.3.10 Is Foreign Key

❌ No

##### 1.1.3.3.11 Precision

0

##### 1.1.3.3.12 Scale

0

#### 1.1.3.4.0 userType

##### 1.1.3.4.1 Name

userType

##### 1.1.3.4.2 Type

🔹 VARCHAR

##### 1.1.3.4.3 Is Required

✅ Yes

##### 1.1.3.4.4 Is Primary Key

❌ No

##### 1.1.3.4.5 Is Unique

❌ No

##### 1.1.3.4.6 Index Type

Index

##### 1.1.3.4.7 Size

20

##### 1.1.3.4.8 Constraints

- ENUM('CUSTOMER', 'VENDOR', 'RIDER', 'ADMINISTRATOR')

##### 1.1.3.4.9 Default Value



##### 1.1.3.4.10 Is Foreign Key

❌ No

##### 1.1.3.4.11 Precision

0

##### 1.1.3.4.12 Scale

0

#### 1.1.3.5.0 status

##### 1.1.3.5.1 Name

status

##### 1.1.3.5.2 Type

🔹 VARCHAR

##### 1.1.3.5.3 Is Required

✅ Yes

##### 1.1.3.5.4 Is Primary Key

❌ No

##### 1.1.3.5.5 Is Unique

❌ No

##### 1.1.3.5.6 Index Type

Index

##### 1.1.3.5.7 Size

25

##### 1.1.3.5.8 Constraints

- ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED')

##### 1.1.3.5.9 Default Value

PENDING_VERIFICATION

##### 1.1.3.5.10 Is Foreign Key

❌ No

##### 1.1.3.5.11 Precision

0

##### 1.1.3.5.12 Scale

0

#### 1.1.3.6.0 cognitoSub

##### 1.1.3.6.1 Name

cognitoSub

##### 1.1.3.6.2 Type

🔹 VARCHAR

##### 1.1.3.6.3 Is Required

✅ Yes

##### 1.1.3.6.4 Is Primary Key

❌ No

##### 1.1.3.6.5 Is Unique

✅ Yes

##### 1.1.3.6.6 Index Type

UniqueIndex

##### 1.1.3.6.7 Size

255

##### 1.1.3.6.8 Constraints

*No items available*

##### 1.1.3.6.9 Default Value



##### 1.1.3.6.10 Is Foreign Key

❌ No

##### 1.1.3.6.11 Precision

0

##### 1.1.3.6.12 Scale

0

#### 1.1.3.7.0 isDeleted

##### 1.1.3.7.1 Name

isDeleted

##### 1.1.3.7.2 Type

🔹 BOOLEAN

##### 1.1.3.7.3 Is Required

✅ Yes

##### 1.1.3.7.4 Is Primary Key

❌ No

##### 1.1.3.7.5 Is Unique

❌ No

##### 1.1.3.7.6 Index Type

Index

##### 1.1.3.7.7 Size

0

##### 1.1.3.7.8 Constraints

*No items available*

##### 1.1.3.7.9 Default Value

false

##### 1.1.3.7.10 Is Foreign Key

❌ No

##### 1.1.3.7.11 Precision

0

##### 1.1.3.7.12 Scale

0

#### 1.1.3.8.0 createdAt

##### 1.1.3.8.1 Name

createdAt

##### 1.1.3.8.2 Type

🔹 DateTimeOffset

##### 1.1.3.8.3 Is Required

✅ Yes

##### 1.1.3.8.4 Is Primary Key

❌ No

##### 1.1.3.8.5 Is Unique

❌ No

##### 1.1.3.8.6 Index Type

Index

##### 1.1.3.8.7 Size

0

##### 1.1.3.8.8 Constraints

*No items available*

##### 1.1.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.1.3.8.10 Is Foreign Key

❌ No

##### 1.1.3.8.11 Precision

0

##### 1.1.3.8.12 Scale

0

#### 1.1.3.9.0 updatedAt

##### 1.1.3.9.1 Name

updatedAt

##### 1.1.3.9.2 Type

🔹 DateTimeOffset

##### 1.1.3.9.3 Is Required

✅ Yes

##### 1.1.3.9.4 Is Primary Key

❌ No

##### 1.1.3.9.5 Is Unique

❌ No

##### 1.1.3.9.6 Index Type

None

##### 1.1.3.9.7 Size

0

##### 1.1.3.9.8 Constraints

*No items available*

##### 1.1.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.1.3.9.10 Is Foreign Key

❌ No

##### 1.1.3.9.11 Precision

0

##### 1.1.3.9.12 Scale

0

### 1.1.4.0.0 Primary Keys

- userId

### 1.1.5.0.0 Unique Constraints

#### 1.1.5.1.0 UC_User_MobileNumber

##### 1.1.5.1.1 Name

UC_User_MobileNumber

##### 1.1.5.1.2 Columns

- mobileNumber

#### 1.1.5.2.0 UC_User_Email

##### 1.1.5.2.1 Name

UC_User_Email

##### 1.1.5.2.2 Columns

- email

#### 1.1.5.3.0 UC_User_CognitoSub

##### 1.1.5.3.1 Name

UC_User_CognitoSub

##### 1.1.5.3.2 Columns

- cognitoSub

### 1.1.6.0.0 Indexes

#### 1.1.6.1.0 IX_User_UserType_Status

##### 1.1.6.1.1 Name

IX_User_UserType_Status

##### 1.1.6.1.2 Columns

- userType
- status

##### 1.1.6.1.3 Type

🔹 BTree

#### 1.1.6.2.0 IX_User_CreatedAt

##### 1.1.6.2.1 Name

IX_User_CreatedAt

##### 1.1.6.2.2 Columns

- createdAt

##### 1.1.6.2.3 Type

🔹 BTree

## 1.2.0.0.0 CustomerProfile

### 1.2.1.0.0 Name

CustomerProfile

### 1.2.2.0.0 Description

Stores profile information specific to Customers.

### 1.2.3.0.0 Attributes

#### 1.2.3.1.0 customerProfileId

##### 1.2.3.1.1 Name

customerProfileId

##### 1.2.3.1.2 Type

🔹 Guid

##### 1.2.3.1.3 Is Required

✅ Yes

##### 1.2.3.1.4 Is Primary Key

✅ Yes

##### 1.2.3.1.5 Is Unique

✅ Yes

##### 1.2.3.1.6 Index Type

UniqueIndex

##### 1.2.3.1.7 Size

0

##### 1.2.3.1.8 Constraints

*No items available*

##### 1.2.3.1.9 Default Value

GENERATE_UUID()

##### 1.2.3.1.10 Is Foreign Key

❌ No

##### 1.2.3.1.11 Precision

0

##### 1.2.3.1.12 Scale

0

#### 1.2.3.2.0 userId

##### 1.2.3.2.1 Name

userId

##### 1.2.3.2.2 Type

🔹 Guid

##### 1.2.3.2.3 Is Required

✅ Yes

##### 1.2.3.2.4 Is Primary Key

❌ No

##### 1.2.3.2.5 Is Unique

✅ Yes

##### 1.2.3.2.6 Index Type

UniqueIndex

##### 1.2.3.2.7 Size

0

##### 1.2.3.2.8 Constraints

*No items available*

##### 1.2.3.2.9 Default Value



##### 1.2.3.2.10 Is Foreign Key

✅ Yes

##### 1.2.3.2.11 Precision

0

##### 1.2.3.2.12 Scale

0

#### 1.2.3.3.0 firstName

##### 1.2.3.3.1 Name

firstName

##### 1.2.3.3.2 Type

🔹 VARCHAR

##### 1.2.3.3.3 Is Required

✅ Yes

##### 1.2.3.3.4 Is Primary Key

❌ No

##### 1.2.3.3.5 Is Unique

❌ No

##### 1.2.3.3.6 Index Type

Index

##### 1.2.3.3.7 Size

100

##### 1.2.3.3.8 Constraints

*No items available*

##### 1.2.3.3.9 Default Value



##### 1.2.3.3.10 Is Foreign Key

❌ No

##### 1.2.3.3.11 Precision

0

##### 1.2.3.3.12 Scale

0

#### 1.2.3.4.0 lastName

##### 1.2.3.4.1 Name

lastName

##### 1.2.3.4.2 Type

🔹 VARCHAR

##### 1.2.3.4.3 Is Required

❌ No

##### 1.2.3.4.4 Is Primary Key

❌ No

##### 1.2.3.4.5 Is Unique

❌ No

##### 1.2.3.4.6 Index Type

Index

##### 1.2.3.4.7 Size

100

##### 1.2.3.4.8 Constraints

*No items available*

##### 1.2.3.4.9 Default Value



##### 1.2.3.4.10 Is Foreign Key

❌ No

##### 1.2.3.4.11 Precision

0

##### 1.2.3.4.12 Scale

0

#### 1.2.3.5.0 createdAt

##### 1.2.3.5.1 Name

createdAt

##### 1.2.3.5.2 Type

🔹 DateTimeOffset

##### 1.2.3.5.3 Is Required

✅ Yes

##### 1.2.3.5.4 Is Primary Key

❌ No

##### 1.2.3.5.5 Is Unique

❌ No

##### 1.2.3.5.6 Index Type

None

##### 1.2.3.5.7 Size

0

##### 1.2.3.5.8 Constraints

*No items available*

##### 1.2.3.5.9 Default Value

CURRENT_TIMESTAMP

##### 1.2.3.5.10 Is Foreign Key

❌ No

##### 1.2.3.5.11 Precision

0

##### 1.2.3.5.12 Scale

0

#### 1.2.3.6.0 updatedAt

##### 1.2.3.6.1 Name

updatedAt

##### 1.2.3.6.2 Type

🔹 DateTimeOffset

##### 1.2.3.6.3 Is Required

✅ Yes

##### 1.2.3.6.4 Is Primary Key

❌ No

##### 1.2.3.6.5 Is Unique

❌ No

##### 1.2.3.6.6 Index Type

None

##### 1.2.3.6.7 Size

0

##### 1.2.3.6.8 Constraints

*No items available*

##### 1.2.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.2.3.6.10 Is Foreign Key

❌ No

##### 1.2.3.6.11 Precision

0

##### 1.2.3.6.12 Scale

0

### 1.2.4.0.0 Primary Keys

- customerProfileId

### 1.2.5.0.0 Unique Constraints

- {'name': 'UC_CustomerProfile_UserId', 'columns': ['userId']}

### 1.2.6.0.0 Indexes

*No items available*

## 1.3.0.0.0 VendorProfile

### 1.3.1.0.0 Name

VendorProfile

### 1.3.2.0.0 Description

Stores profile and operational information specific to Vendors.

### 1.3.3.0.0 Attributes

#### 1.3.3.1.0 vendorProfileId

##### 1.3.3.1.1 Name

vendorProfileId

##### 1.3.3.1.2 Type

🔹 Guid

##### 1.3.3.1.3 Is Required

✅ Yes

##### 1.3.3.1.4 Is Primary Key

✅ Yes

##### 1.3.3.1.5 Is Unique

✅ Yes

##### 1.3.3.1.6 Index Type

UniqueIndex

##### 1.3.3.1.7 Size

0

##### 1.3.3.1.8 Constraints

*No items available*

##### 1.3.3.1.9 Default Value

GENERATE_UUID()

##### 1.3.3.1.10 Is Foreign Key

❌ No

##### 1.3.3.1.11 Precision

0

##### 1.3.3.1.12 Scale

0

#### 1.3.3.2.0 userId

##### 1.3.3.2.1 Name

userId

##### 1.3.3.2.2 Type

🔹 Guid

##### 1.3.3.2.3 Is Required

✅ Yes

##### 1.3.3.2.4 Is Primary Key

❌ No

##### 1.3.3.2.5 Is Unique

✅ Yes

##### 1.3.3.2.6 Index Type

UniqueIndex

##### 1.3.3.2.7 Size

0

##### 1.3.3.2.8 Constraints

*No items available*

##### 1.3.3.2.9 Default Value



##### 1.3.3.2.10 Is Foreign Key

✅ Yes

##### 1.3.3.2.11 Precision

0

##### 1.3.3.2.12 Scale

0

#### 1.3.3.3.0 storeName

##### 1.3.3.3.1 Name

storeName

##### 1.3.3.3.2 Type

🔹 VARCHAR

##### 1.3.3.3.3 Is Required

✅ Yes

##### 1.3.3.3.4 Is Primary Key

❌ No

##### 1.3.3.3.5 Is Unique

❌ No

##### 1.3.3.3.6 Index Type

Index

##### 1.3.3.3.7 Size

255

##### 1.3.3.3.8 Constraints

*No items available*

##### 1.3.3.3.9 Default Value



##### 1.3.3.3.10 Is Foreign Key

❌ No

##### 1.3.3.3.11 Precision

0

##### 1.3.3.3.12 Scale

0

#### 1.3.3.4.0 description

##### 1.3.3.4.1 Name

description

##### 1.3.3.4.2 Type

🔹 TEXT

##### 1.3.3.4.3 Is Required

❌ No

##### 1.3.3.4.4 Is Primary Key

❌ No

##### 1.3.3.4.5 Is Unique

❌ No

##### 1.3.3.4.6 Index Type

FullText

##### 1.3.3.4.7 Size

0

##### 1.3.3.4.8 Constraints

*No items available*

##### 1.3.3.4.9 Default Value



##### 1.3.3.4.10 Is Foreign Key

❌ No

##### 1.3.3.4.11 Precision

0

##### 1.3.3.4.12 Scale

0

#### 1.3.3.5.0 addressId

##### 1.3.3.5.1 Name

addressId

##### 1.3.3.5.2 Type

🔹 Guid

##### 1.3.3.5.3 Is Required

✅ Yes

##### 1.3.3.5.4 Is Primary Key

❌ No

##### 1.3.3.5.5 Is Unique

❌ No

##### 1.3.3.5.6 Index Type

Index

##### 1.3.3.5.7 Size

0

##### 1.3.3.5.8 Constraints

*No items available*

##### 1.3.3.5.9 Default Value



##### 1.3.3.5.10 Is Foreign Key

✅ Yes

##### 1.3.3.5.11 Precision

0

##### 1.3.3.5.12 Scale

0

#### 1.3.3.6.0 latitude

##### 1.3.3.6.1 Name

latitude

##### 1.3.3.6.2 Type

🔹 DECIMAL

##### 1.3.3.6.3 Is Required

❌ No

##### 1.3.3.6.4 Is Primary Key

❌ No

##### 1.3.3.6.5 Is Unique

❌ No

##### 1.3.3.6.6 Index Type

Spatial

##### 1.3.3.6.7 Size

0

##### 1.3.3.6.8 Constraints

*No items available*

##### 1.3.3.6.9 Default Value



##### 1.3.3.6.10 Is Foreign Key

❌ No

##### 1.3.3.6.11 Precision

9

##### 1.3.3.6.12 Scale

6

#### 1.3.3.7.0 longitude

##### 1.3.3.7.1 Name

longitude

##### 1.3.3.7.2 Type

🔹 DECIMAL

##### 1.3.3.7.3 Is Required

❌ No

##### 1.3.3.7.4 Is Primary Key

❌ No

##### 1.3.3.7.5 Is Unique

❌ No

##### 1.3.3.7.6 Index Type

Spatial

##### 1.3.3.7.7 Size

0

##### 1.3.3.7.8 Constraints

*No items available*

##### 1.3.3.7.9 Default Value



##### 1.3.3.7.10 Is Foreign Key

❌ No

##### 1.3.3.7.11 Precision

9

##### 1.3.3.7.12 Scale

6

#### 1.3.3.8.0 averageRating

##### 1.3.3.8.1 Name

averageRating

##### 1.3.3.8.2 Type

🔹 DECIMAL

##### 1.3.3.8.3 Is Required

✅ Yes

##### 1.3.3.8.4 Is Primary Key

❌ No

##### 1.3.3.8.5 Is Unique

❌ No

##### 1.3.3.8.6 Index Type

Index

##### 1.3.3.8.7 Size

0

##### 1.3.3.8.8 Constraints

- RANGE(0, 5)

##### 1.3.3.8.9 Default Value

0.0

##### 1.3.3.8.10 Is Foreign Key

❌ No

##### 1.3.3.8.11 Precision

3

##### 1.3.3.8.12 Scale

2

#### 1.3.3.9.0 commissionRate

##### 1.3.3.9.1 Name

commissionRate

##### 1.3.3.9.2 Type

🔹 DECIMAL

##### 1.3.3.9.3 Is Required

✅ Yes

##### 1.3.3.9.4 Is Primary Key

❌ No

##### 1.3.3.9.5 Is Unique

❌ No

##### 1.3.3.9.6 Index Type

None

##### 1.3.3.9.7 Size

0

##### 1.3.3.9.8 Constraints

- RANGE(0, 100)

##### 1.3.3.9.9 Default Value

15.00

##### 1.3.3.9.10 Is Foreign Key

❌ No

##### 1.3.3.9.11 Precision

5

##### 1.3.3.9.12 Scale

2

#### 1.3.3.10.0 isOnline

##### 1.3.3.10.1 Name

isOnline

##### 1.3.3.10.2 Type

🔹 BOOLEAN

##### 1.3.3.10.3 Is Required

✅ Yes

##### 1.3.3.10.4 Is Primary Key

❌ No

##### 1.3.3.10.5 Is Unique

❌ No

##### 1.3.3.10.6 Index Type

Index

##### 1.3.3.10.7 Size

0

##### 1.3.3.10.8 Constraints

*No items available*

##### 1.3.3.10.9 Default Value

false

##### 1.3.3.10.10 Is Foreign Key

❌ No

##### 1.3.3.10.11 Precision

0

##### 1.3.3.10.12 Scale

0

#### 1.3.3.11.0 documentUrls

##### 1.3.3.11.1 Name

documentUrls

##### 1.3.3.11.2 Type

🔹 JSONB

##### 1.3.3.11.3 Is Required

❌ No

##### 1.3.3.11.4 Is Primary Key

❌ No

##### 1.3.3.11.5 Is Unique

❌ No

##### 1.3.3.11.6 Index Type

None

##### 1.3.3.11.7 Size

0

##### 1.3.3.11.8 Constraints

*No items available*

##### 1.3.3.11.9 Default Value

{}

##### 1.3.3.11.10 Is Foreign Key

❌ No

##### 1.3.3.11.11 Precision

0

##### 1.3.3.11.12 Scale

0

#### 1.3.3.12.0 createdAt

##### 1.3.3.12.1 Name

createdAt

##### 1.3.3.12.2 Type

🔹 DateTimeOffset

##### 1.3.3.12.3 Is Required

✅ Yes

##### 1.3.3.12.4 Is Primary Key

❌ No

##### 1.3.3.12.5 Is Unique

❌ No

##### 1.3.3.12.6 Index Type

None

##### 1.3.3.12.7 Size

0

##### 1.3.3.12.8 Constraints

*No items available*

##### 1.3.3.12.9 Default Value

CURRENT_TIMESTAMP

##### 1.3.3.12.10 Is Foreign Key

❌ No

##### 1.3.3.12.11 Precision

0

##### 1.3.3.12.12 Scale

0

#### 1.3.3.13.0 updatedAt

##### 1.3.3.13.1 Name

updatedAt

##### 1.3.3.13.2 Type

🔹 DateTimeOffset

##### 1.3.3.13.3 Is Required

✅ Yes

##### 1.3.3.13.4 Is Primary Key

❌ No

##### 1.3.3.13.5 Is Unique

❌ No

##### 1.3.3.13.6 Index Type

None

##### 1.3.3.13.7 Size

0

##### 1.3.3.13.8 Constraints

*No items available*

##### 1.3.3.13.9 Default Value

CURRENT_TIMESTAMP

##### 1.3.3.13.10 Is Foreign Key

❌ No

##### 1.3.3.13.11 Precision

0

##### 1.3.3.13.12 Scale

0

### 1.3.4.0.0 Primary Keys

- vendorProfileId

### 1.3.5.0.0 Unique Constraints

- {'name': 'UC_VendorProfile_UserId', 'columns': ['userId']}

### 1.3.6.0.0 Indexes

#### 1.3.6.1.0 IX_VendorProfile_StoreName

##### 1.3.6.1.1 Name

IX_VendorProfile_StoreName

##### 1.3.6.1.2 Columns

- storeName

##### 1.3.6.1.3 Type

🔹 BTree

#### 1.3.6.2.0 FT_VendorProfile_Description

##### 1.3.6.2.1 Name

FT_VendorProfile_Description

##### 1.3.6.2.2 Columns

- description

##### 1.3.6.2.3 Type

🔹 FullText

#### 1.3.6.3.0 IX_VendorProfile_Online_RatingDesc

##### 1.3.6.3.1 Name

IX_VendorProfile_Online_RatingDesc

##### 1.3.6.3.2 Columns

- isOnline
- averageRating

##### 1.3.6.3.3 Type

🔹 BTree

#### 1.3.6.4.0 IX_VendorProfile_Location_Spatial

##### 1.3.6.4.1 Name

IX_VendorProfile_Location_Spatial

##### 1.3.6.4.2 Columns

- latitude
- longitude

##### 1.3.6.4.3 Type

🔹 Spatial_GIST

## 1.4.0.0.0 RiderProfile

### 1.4.1.0.0 Name

RiderProfile

### 1.4.2.0.0 Description

Stores profile, vehicle, and financial information specific to Riders.

### 1.4.3.0.0 Attributes

#### 1.4.3.1.0 riderProfileId

##### 1.4.3.1.1 Name

riderProfileId

##### 1.4.3.1.2 Type

🔹 Guid

##### 1.4.3.1.3 Is Required

✅ Yes

##### 1.4.3.1.4 Is Primary Key

✅ Yes

##### 1.4.3.1.5 Is Unique

✅ Yes

##### 1.4.3.1.6 Index Type

UniqueIndex

##### 1.4.3.1.7 Size

0

##### 1.4.3.1.8 Constraints

*No items available*

##### 1.4.3.1.9 Default Value

GENERATE_UUID()

##### 1.4.3.1.10 Is Foreign Key

❌ No

##### 1.4.3.1.11 Precision

0

##### 1.4.3.1.12 Scale

0

#### 1.4.3.2.0 userId

##### 1.4.3.2.1 Name

userId

##### 1.4.3.2.2 Type

🔹 Guid

##### 1.4.3.2.3 Is Required

✅ Yes

##### 1.4.3.2.4 Is Primary Key

❌ No

##### 1.4.3.2.5 Is Unique

✅ Yes

##### 1.4.3.2.6 Index Type

UniqueIndex

##### 1.4.3.2.7 Size

0

##### 1.4.3.2.8 Constraints

*No items available*

##### 1.4.3.2.9 Default Value



##### 1.4.3.2.10 Is Foreign Key

✅ Yes

##### 1.4.3.2.11 Precision

0

##### 1.4.3.2.12 Scale

0

#### 1.4.3.3.0 firstName

##### 1.4.3.3.1 Name

firstName

##### 1.4.3.3.2 Type

🔹 VARCHAR

##### 1.4.3.3.3 Is Required

✅ Yes

##### 1.4.3.3.4 Is Primary Key

❌ No

##### 1.4.3.3.5 Is Unique

❌ No

##### 1.4.3.3.6 Index Type

Index

##### 1.4.3.3.7 Size

100

##### 1.4.3.3.8 Constraints

*No items available*

##### 1.4.3.3.9 Default Value



##### 1.4.3.3.10 Is Foreign Key

❌ No

##### 1.4.3.3.11 Precision

0

##### 1.4.3.3.12 Scale

0

#### 1.4.3.4.0 lastName

##### 1.4.3.4.1 Name

lastName

##### 1.4.3.4.2 Type

🔹 VARCHAR

##### 1.4.3.4.3 Is Required

✅ Yes

##### 1.4.3.4.4 Is Primary Key

❌ No

##### 1.4.3.4.5 Is Unique

❌ No

##### 1.4.3.4.6 Index Type

Index

##### 1.4.3.4.7 Size

100

##### 1.4.3.4.8 Constraints

*No items available*

##### 1.4.3.4.9 Default Value



##### 1.4.3.4.10 Is Foreign Key

❌ No

##### 1.4.3.4.11 Precision

0

##### 1.4.3.4.12 Scale

0

#### 1.4.3.5.0 vehicleDetails

##### 1.4.3.5.1 Name

vehicleDetails

##### 1.4.3.5.2 Type

🔹 JSONB

##### 1.4.3.5.3 Is Required

❌ No

##### 1.4.3.5.4 Is Primary Key

❌ No

##### 1.4.3.5.5 Is Unique

❌ No

##### 1.4.3.5.6 Index Type

None

##### 1.4.3.5.7 Size

0

##### 1.4.3.5.8 Constraints

*No items available*

##### 1.4.3.5.9 Default Value

{}

##### 1.4.3.5.10 Is Foreign Key

❌ No

##### 1.4.3.5.11 Precision

0

##### 1.4.3.5.12 Scale

0

#### 1.4.3.6.0 bankAccountDetails

##### 1.4.3.6.1 Name

bankAccountDetails

##### 1.4.3.6.2 Type

🔹 TEXT

##### 1.4.3.6.3 Is Required

❌ No

##### 1.4.3.6.4 Is Primary Key

❌ No

##### 1.4.3.6.5 Is Unique

❌ No

##### 1.4.3.6.6 Index Type

None

##### 1.4.3.6.7 Size

0

##### 1.4.3.6.8 Constraints

- ENCRYPTED

##### 1.4.3.6.9 Default Value



##### 1.4.3.6.10 Is Foreign Key

❌ No

##### 1.4.3.6.11 Precision

0

##### 1.4.3.6.12 Scale

0

#### 1.4.3.7.0 documentUrls

##### 1.4.3.7.1 Name

documentUrls

##### 1.4.3.7.2 Type

🔹 JSONB

##### 1.4.3.7.3 Is Required

❌ No

##### 1.4.3.7.4 Is Primary Key

❌ No

##### 1.4.3.7.5 Is Unique

❌ No

##### 1.4.3.7.6 Index Type

None

##### 1.4.3.7.7 Size

0

##### 1.4.3.7.8 Constraints

*No items available*

##### 1.4.3.7.9 Default Value

{}

##### 1.4.3.7.10 Is Foreign Key

❌ No

##### 1.4.3.7.11 Precision

0

##### 1.4.3.7.12 Scale

0

#### 1.4.3.8.0 averageRating

##### 1.4.3.8.1 Name

averageRating

##### 1.4.3.8.2 Type

🔹 DECIMAL

##### 1.4.3.8.3 Is Required

✅ Yes

##### 1.4.3.8.4 Is Primary Key

❌ No

##### 1.4.3.8.5 Is Unique

❌ No

##### 1.4.3.8.6 Index Type

Index

##### 1.4.3.8.7 Size

0

##### 1.4.3.8.8 Constraints

- RANGE(0, 5)

##### 1.4.3.8.9 Default Value

0.0

##### 1.4.3.8.10 Is Foreign Key

❌ No

##### 1.4.3.8.11 Precision

3

##### 1.4.3.8.12 Scale

2

#### 1.4.3.9.0 cashInHand

##### 1.4.3.9.1 Name

cashInHand

##### 1.4.3.9.2 Type

🔹 DECIMAL

##### 1.4.3.9.3 Is Required

✅ Yes

##### 1.4.3.9.4 Is Primary Key

❌ No

##### 1.4.3.9.5 Is Unique

❌ No

##### 1.4.3.9.6 Index Type

None

##### 1.4.3.9.7 Size

0

##### 1.4.3.9.8 Constraints

*No items available*

##### 1.4.3.9.9 Default Value

0.00

##### 1.4.3.9.10 Is Foreign Key

❌ No

##### 1.4.3.9.11 Precision

10

##### 1.4.3.9.12 Scale

2

#### 1.4.3.10.0 isOnline

##### 1.4.3.10.1 Name

isOnline

##### 1.4.3.10.2 Type

🔹 BOOLEAN

##### 1.4.3.10.3 Is Required

✅ Yes

##### 1.4.3.10.4 Is Primary Key

❌ No

##### 1.4.3.10.5 Is Unique

❌ No

##### 1.4.3.10.6 Index Type

Index

##### 1.4.3.10.7 Size

0

##### 1.4.3.10.8 Constraints

*No items available*

##### 1.4.3.10.9 Default Value

false

##### 1.4.3.10.10 Is Foreign Key

❌ No

##### 1.4.3.10.11 Precision

0

##### 1.4.3.10.12 Scale

0

#### 1.4.3.11.0 createdAt

##### 1.4.3.11.1 Name

createdAt

##### 1.4.3.11.2 Type

🔹 DateTimeOffset

##### 1.4.3.11.3 Is Required

✅ Yes

##### 1.4.3.11.4 Is Primary Key

❌ No

##### 1.4.3.11.5 Is Unique

❌ No

##### 1.4.3.11.6 Index Type

None

##### 1.4.3.11.7 Size

0

##### 1.4.3.11.8 Constraints

*No items available*

##### 1.4.3.11.9 Default Value

CURRENT_TIMESTAMP

##### 1.4.3.11.10 Is Foreign Key

❌ No

##### 1.4.3.11.11 Precision

0

##### 1.4.3.11.12 Scale

0

#### 1.4.3.12.0 updatedAt

##### 1.4.3.12.1 Name

updatedAt

##### 1.4.3.12.2 Type

🔹 DateTimeOffset

##### 1.4.3.12.3 Is Required

✅ Yes

##### 1.4.3.12.4 Is Primary Key

❌ No

##### 1.4.3.12.5 Is Unique

❌ No

##### 1.4.3.12.6 Index Type

None

##### 1.4.3.12.7 Size

0

##### 1.4.3.12.8 Constraints

*No items available*

##### 1.4.3.12.9 Default Value

CURRENT_TIMESTAMP

##### 1.4.3.12.10 Is Foreign Key

❌ No

##### 1.4.3.12.11 Precision

0

##### 1.4.3.12.12 Scale

0

### 1.4.4.0.0 Primary Keys

- riderProfileId

### 1.4.5.0.0 Unique Constraints

- {'name': 'UC_RiderProfile_UserId', 'columns': ['userId']}

### 1.4.6.0.0 Indexes

- {'name': 'IX_RiderProfile_FullName', 'columns': ['firstName', 'lastName'], 'type': 'BTree'}

## 1.5.0.0.0 Address

### 1.5.1.0.0 Name

Address

### 1.5.2.0.0 Description

Stores physical addresses for users (customers and vendors).

### 1.5.3.0.0 Attributes

#### 1.5.3.1.0 addressId

##### 1.5.3.1.1 Name

addressId

##### 1.5.3.1.2 Type

🔹 Guid

##### 1.5.3.1.3 Is Required

✅ Yes

##### 1.5.3.1.4 Is Primary Key

✅ Yes

##### 1.5.3.1.5 Is Unique

✅ Yes

##### 1.5.3.1.6 Index Type

UniqueIndex

##### 1.5.3.1.7 Size

0

##### 1.5.3.1.8 Constraints

*No items available*

##### 1.5.3.1.9 Default Value

GENERATE_UUID()

##### 1.5.3.1.10 Is Foreign Key

❌ No

##### 1.5.3.1.11 Precision

0

##### 1.5.3.1.12 Scale

0

#### 1.5.3.2.0 userId

##### 1.5.3.2.1 Name

userId

##### 1.5.3.2.2 Type

🔹 Guid

##### 1.5.3.2.3 Is Required

✅ Yes

##### 1.5.3.2.4 Is Primary Key

❌ No

##### 1.5.3.2.5 Is Unique

❌ No

##### 1.5.3.2.6 Index Type

Index

##### 1.5.3.2.7 Size

0

##### 1.5.3.2.8 Constraints

*No items available*

##### 1.5.3.2.9 Default Value



##### 1.5.3.2.10 Is Foreign Key

✅ Yes

##### 1.5.3.2.11 Precision

0

##### 1.5.3.2.12 Scale

0

#### 1.5.3.3.0 addressLine1

##### 1.5.3.3.1 Name

addressLine1

##### 1.5.3.3.2 Type

🔹 VARCHAR

##### 1.5.3.3.3 Is Required

✅ Yes

##### 1.5.3.3.4 Is Primary Key

❌ No

##### 1.5.3.3.5 Is Unique

❌ No

##### 1.5.3.3.6 Index Type

None

##### 1.5.3.3.7 Size

255

##### 1.5.3.3.8 Constraints

*No items available*

##### 1.5.3.3.9 Default Value



##### 1.5.3.3.10 Is Foreign Key

❌ No

##### 1.5.3.3.11 Precision

0

##### 1.5.3.3.12 Scale

0

#### 1.5.3.4.0 addressLine2

##### 1.5.3.4.1 Name

addressLine2

##### 1.5.3.4.2 Type

🔹 VARCHAR

##### 1.5.3.4.3 Is Required

❌ No

##### 1.5.3.4.4 Is Primary Key

❌ No

##### 1.5.3.4.5 Is Unique

❌ No

##### 1.5.3.4.6 Index Type

None

##### 1.5.3.4.7 Size

255

##### 1.5.3.4.8 Constraints

*No items available*

##### 1.5.3.4.9 Default Value



##### 1.5.3.4.10 Is Foreign Key

❌ No

##### 1.5.3.4.11 Precision

0

##### 1.5.3.4.12 Scale

0

#### 1.5.3.5.0 city

##### 1.5.3.5.1 Name

city

##### 1.5.3.5.2 Type

🔹 VARCHAR

##### 1.5.3.5.3 Is Required

✅ Yes

##### 1.5.3.5.4 Is Primary Key

❌ No

##### 1.5.3.5.5 Is Unique

❌ No

##### 1.5.3.5.6 Index Type

Index

##### 1.5.3.5.7 Size

100

##### 1.5.3.5.8 Constraints

*No items available*

##### 1.5.3.5.9 Default Value



##### 1.5.3.5.10 Is Foreign Key

❌ No

##### 1.5.3.5.11 Precision

0

##### 1.5.3.5.12 Scale

0

#### 1.5.3.6.0 postalCode

##### 1.5.3.6.1 Name

postalCode

##### 1.5.3.6.2 Type

🔹 VARCHAR

##### 1.5.3.6.3 Is Required

✅ Yes

##### 1.5.3.6.4 Is Primary Key

❌ No

##### 1.5.3.6.5 Is Unique

❌ No

##### 1.5.3.6.6 Index Type

Index

##### 1.5.3.6.7 Size

10

##### 1.5.3.6.8 Constraints

*No items available*

##### 1.5.3.6.9 Default Value



##### 1.5.3.6.10 Is Foreign Key

❌ No

##### 1.5.3.6.11 Precision

0

##### 1.5.3.6.12 Scale

0

#### 1.5.3.7.0 state

##### 1.5.3.7.1 Name

state

##### 1.5.3.7.2 Type

🔹 VARCHAR

##### 1.5.3.7.3 Is Required

✅ Yes

##### 1.5.3.7.4 Is Primary Key

❌ No

##### 1.5.3.7.5 Is Unique

❌ No

##### 1.5.3.7.6 Index Type

Index

##### 1.5.3.7.7 Size

100

##### 1.5.3.7.8 Constraints

*No items available*

##### 1.5.3.7.9 Default Value



##### 1.5.3.7.10 Is Foreign Key

❌ No

##### 1.5.3.7.11 Precision

0

##### 1.5.3.7.12 Scale

0

#### 1.5.3.8.0 location

##### 1.5.3.8.1 Name

location

##### 1.5.3.8.2 Type

🔹 GEOGRAPHY(Point, 4326)

##### 1.5.3.8.3 Is Required

✅ Yes

##### 1.5.3.8.4 Is Primary Key

❌ No

##### 1.5.3.8.5 Is Unique

❌ No

##### 1.5.3.8.6 Index Type

Spatial

##### 1.5.3.8.7 Size

0

##### 1.5.3.8.8 Constraints

*No items available*

##### 1.5.3.8.9 Default Value



##### 1.5.3.8.10 Is Foreign Key

❌ No

##### 1.5.3.8.11 Precision

0

##### 1.5.3.8.12 Scale

0

#### 1.5.3.9.0 isDeleted

##### 1.5.3.9.1 Name

isDeleted

##### 1.5.3.9.2 Type

🔹 BOOLEAN

##### 1.5.3.9.3 Is Required

✅ Yes

##### 1.5.3.9.4 Is Primary Key

❌ No

##### 1.5.3.9.5 Is Unique

❌ No

##### 1.5.3.9.6 Index Type

Index

##### 1.5.3.9.7 Size

0

##### 1.5.3.9.8 Constraints

*No items available*

##### 1.5.3.9.9 Default Value

false

##### 1.5.3.9.10 Is Foreign Key

❌ No

##### 1.5.3.9.11 Precision

0

##### 1.5.3.9.12 Scale

0

#### 1.5.3.10.0 createdAt

##### 1.5.3.10.1 Name

createdAt

##### 1.5.3.10.2 Type

🔹 DateTimeOffset

##### 1.5.3.10.3 Is Required

✅ Yes

##### 1.5.3.10.4 Is Primary Key

❌ No

##### 1.5.3.10.5 Is Unique

❌ No

##### 1.5.3.10.6 Index Type

None

##### 1.5.3.10.7 Size

0

##### 1.5.3.10.8 Constraints

*No items available*

##### 1.5.3.10.9 Default Value

CURRENT_TIMESTAMP

##### 1.5.3.10.10 Is Foreign Key

❌ No

##### 1.5.3.10.11 Precision

0

##### 1.5.3.10.12 Scale

0

#### 1.5.3.11.0 updatedAt

##### 1.5.3.11.1 Name

updatedAt

##### 1.5.3.11.2 Type

🔹 DateTimeOffset

##### 1.5.3.11.3 Is Required

✅ Yes

##### 1.5.3.11.4 Is Primary Key

❌ No

##### 1.5.3.11.5 Is Unique

❌ No

##### 1.5.3.11.6 Index Type

None

##### 1.5.3.11.7 Size

0

##### 1.5.3.11.8 Constraints

*No items available*

##### 1.5.3.11.9 Default Value

CURRENT_TIMESTAMP

##### 1.5.3.11.10 Is Foreign Key

❌ No

##### 1.5.3.11.11 Precision

0

##### 1.5.3.11.12 Scale

0

### 1.5.4.0.0 Primary Keys

- addressId

### 1.5.5.0.0 Unique Constraints

*No items available*

### 1.5.6.0.0 Indexes

#### 1.5.6.1.0 IX_Address_UserId

##### 1.5.6.1.1 Name

IX_Address_UserId

##### 1.5.6.1.2 Columns

- userId

##### 1.5.6.1.3 Type

🔹 BTree

#### 1.5.6.2.0 IX_Address_Location_Spatial_GIST

##### 1.5.6.2.1 Name

IX_Address_Location_Spatial_GIST

##### 1.5.6.2.2 Columns

- location

##### 1.5.6.2.3 Type

🔹 Spatial_GIST

## 1.6.0.0.0 OperationalZone

### 1.6.1.0.0 Name

OperationalZone

### 1.6.2.0.0 Description

Defines geofenced areas where the service is available.

### 1.6.3.0.0 Attributes

#### 1.6.3.1.0 zoneId

##### 1.6.3.1.1 Name

zoneId

##### 1.6.3.1.2 Type

🔹 Guid

##### 1.6.3.1.3 Is Required

✅ Yes

##### 1.6.3.1.4 Is Primary Key

✅ Yes

##### 1.6.3.1.5 Is Unique

✅ Yes

##### 1.6.3.1.6 Index Type

UniqueIndex

##### 1.6.3.1.7 Size

0

##### 1.6.3.1.8 Constraints

*No items available*

##### 1.6.3.1.9 Default Value

GENERATE_UUID()

##### 1.6.3.1.10 Is Foreign Key

❌ No

##### 1.6.3.1.11 Precision

0

##### 1.6.3.1.12 Scale

0

#### 1.6.3.2.0 name

##### 1.6.3.2.1 Name

name

##### 1.6.3.2.2 Type

🔹 VARCHAR

##### 1.6.3.2.3 Is Required

✅ Yes

##### 1.6.3.2.4 Is Primary Key

❌ No

##### 1.6.3.2.5 Is Unique

✅ Yes

##### 1.6.3.2.6 Index Type

UniqueIndex

##### 1.6.3.2.7 Size

100

##### 1.6.3.2.8 Constraints

*No items available*

##### 1.6.3.2.9 Default Value



##### 1.6.3.2.10 Is Foreign Key

❌ No

##### 1.6.3.2.11 Precision

0

##### 1.6.3.2.12 Scale

0

#### 1.6.3.3.0 geoPolygon

##### 1.6.3.3.1 Name

geoPolygon

##### 1.6.3.3.2 Type

🔹 GEOMETRY

##### 1.6.3.3.3 Is Required

✅ Yes

##### 1.6.3.3.4 Is Primary Key

❌ No

##### 1.6.3.3.5 Is Unique

❌ No

##### 1.6.3.3.6 Index Type

Spatial

##### 1.6.3.3.7 Size

0

##### 1.6.3.3.8 Constraints

*No items available*

##### 1.6.3.3.9 Default Value



##### 1.6.3.3.10 Is Foreign Key

❌ No

##### 1.6.3.3.11 Precision

0

##### 1.6.3.3.12 Scale

0

#### 1.6.3.4.0 deliveryRadiusKm

##### 1.6.3.4.1 Name

deliveryRadiusKm

##### 1.6.3.4.2 Type

🔹 DECIMAL

##### 1.6.3.4.3 Is Required

✅ Yes

##### 1.6.3.4.4 Is Primary Key

❌ No

##### 1.6.3.4.5 Is Unique

❌ No

##### 1.6.3.4.6 Index Type

None

##### 1.6.3.4.7 Size

0

##### 1.6.3.4.8 Constraints

*No items available*

##### 1.6.3.4.9 Default Value

7.0

##### 1.6.3.4.10 Is Foreign Key

❌ No

##### 1.6.3.4.11 Precision

5

##### 1.6.3.4.12 Scale

2

#### 1.6.3.5.0 isActive

##### 1.6.3.5.1 Name

isActive

##### 1.6.3.5.2 Type

🔹 BOOLEAN

##### 1.6.3.5.3 Is Required

✅ Yes

##### 1.6.3.5.4 Is Primary Key

❌ No

##### 1.6.3.5.5 Is Unique

❌ No

##### 1.6.3.5.6 Index Type

Index

##### 1.6.3.5.7 Size

0

##### 1.6.3.5.8 Constraints

*No items available*

##### 1.6.3.5.9 Default Value

true

##### 1.6.3.5.10 Is Foreign Key

❌ No

##### 1.6.3.5.11 Precision

0

##### 1.6.3.5.12 Scale

0

#### 1.6.3.6.0 createdAt

##### 1.6.3.6.1 Name

createdAt

##### 1.6.3.6.2 Type

🔹 DateTimeOffset

##### 1.6.3.6.3 Is Required

✅ Yes

##### 1.6.3.6.4 Is Primary Key

❌ No

##### 1.6.3.6.5 Is Unique

❌ No

##### 1.6.3.6.6 Index Type

None

##### 1.6.3.6.7 Size

0

##### 1.6.3.6.8 Constraints

*No items available*

##### 1.6.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.6.3.6.10 Is Foreign Key

❌ No

##### 1.6.3.6.11 Precision

0

##### 1.6.3.6.12 Scale

0

#### 1.6.3.7.0 updatedAt

##### 1.6.3.7.1 Name

updatedAt

##### 1.6.3.7.2 Type

🔹 DateTimeOffset

##### 1.6.3.7.3 Is Required

✅ Yes

##### 1.6.3.7.4 Is Primary Key

❌ No

##### 1.6.3.7.5 Is Unique

❌ No

##### 1.6.3.7.6 Index Type

None

##### 1.6.3.7.7 Size

0

##### 1.6.3.7.8 Constraints

*No items available*

##### 1.6.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.6.3.7.10 Is Foreign Key

❌ No

##### 1.6.3.7.11 Precision

0

##### 1.6.3.7.12 Scale

0

### 1.6.4.0.0 Primary Keys

- zoneId

### 1.6.5.0.0 Unique Constraints

- {'name': 'UC_OperationalZone_Name', 'columns': ['name']}

### 1.6.6.0.0 Indexes

- {'name': 'IX_OperationalZone_GeoPolygon', 'columns': ['geoPolygon'], 'type': 'Spatial'}

## 1.7.0.0.0 VendorBusinessHour

### 1.7.1.0.0 Name

VendorBusinessHour

### 1.7.2.0.0 Description

Stores the daily opening and closing times for a vendor.

### 1.7.3.0.0 Attributes

#### 1.7.3.1.0 businessHourId

##### 1.7.3.1.1 Name

businessHourId

##### 1.7.3.1.2 Type

🔹 Guid

##### 1.7.3.1.3 Is Required

✅ Yes

##### 1.7.3.1.4 Is Primary Key

✅ Yes

##### 1.7.3.1.5 Is Unique

✅ Yes

##### 1.7.3.1.6 Index Type

UniqueIndex

##### 1.7.3.1.7 Size

0

##### 1.7.3.1.8 Constraints

*No items available*

##### 1.7.3.1.9 Default Value

GENERATE_UUID()

##### 1.7.3.1.10 Is Foreign Key

❌ No

##### 1.7.3.1.11 Precision

0

##### 1.7.3.1.12 Scale

0

#### 1.7.3.2.0 vendorProfileId

##### 1.7.3.2.1 Name

vendorProfileId

##### 1.7.3.2.2 Type

🔹 Guid

##### 1.7.3.2.3 Is Required

✅ Yes

##### 1.7.3.2.4 Is Primary Key

❌ No

##### 1.7.3.2.5 Is Unique

❌ No

##### 1.7.3.2.6 Index Type

Index

##### 1.7.3.2.7 Size

0

##### 1.7.3.2.8 Constraints

*No items available*

##### 1.7.3.2.9 Default Value



##### 1.7.3.2.10 Is Foreign Key

✅ Yes

##### 1.7.3.2.11 Precision

0

##### 1.7.3.2.12 Scale

0

#### 1.7.3.3.0 dayOfWeek

##### 1.7.3.3.1 Name

dayOfWeek

##### 1.7.3.3.2 Type

🔹 INT

##### 1.7.3.3.3 Is Required

✅ Yes

##### 1.7.3.3.4 Is Primary Key

❌ No

##### 1.7.3.3.5 Is Unique

❌ No

##### 1.7.3.3.6 Index Type

Index

##### 1.7.3.3.7 Size

0

##### 1.7.3.3.8 Constraints

- RANGE(0, 6)

##### 1.7.3.3.9 Default Value



##### 1.7.3.3.10 Is Foreign Key

❌ No

##### 1.7.3.3.11 Precision

0

##### 1.7.3.3.12 Scale

0

#### 1.7.3.4.0 openTime

##### 1.7.3.4.1 Name

openTime

##### 1.7.3.4.2 Type

🔹 TIME

##### 1.7.3.4.3 Is Required

❌ No

##### 1.7.3.4.4 Is Primary Key

❌ No

##### 1.7.3.4.5 Is Unique

❌ No

##### 1.7.3.4.6 Index Type

None

##### 1.7.3.4.7 Size

0

##### 1.7.3.4.8 Constraints

*No items available*

##### 1.7.3.4.9 Default Value



##### 1.7.3.4.10 Is Foreign Key

❌ No

##### 1.7.3.4.11 Precision

0

##### 1.7.3.4.12 Scale

0

#### 1.7.3.5.0 closeTime

##### 1.7.3.5.1 Name

closeTime

##### 1.7.3.5.2 Type

🔹 TIME

##### 1.7.3.5.3 Is Required

❌ No

##### 1.7.3.5.4 Is Primary Key

❌ No

##### 1.7.3.5.5 Is Unique

❌ No

##### 1.7.3.5.6 Index Type

None

##### 1.7.3.5.7 Size

0

##### 1.7.3.5.8 Constraints

*No items available*

##### 1.7.3.5.9 Default Value



##### 1.7.3.5.10 Is Foreign Key

❌ No

##### 1.7.3.5.11 Precision

0

##### 1.7.3.5.12 Scale

0

#### 1.7.3.6.0 isClosed

##### 1.7.3.6.1 Name

isClosed

##### 1.7.3.6.2 Type

🔹 BOOLEAN

##### 1.7.3.6.3 Is Required

✅ Yes

##### 1.7.3.6.4 Is Primary Key

❌ No

##### 1.7.3.6.5 Is Unique

❌ No

##### 1.7.3.6.6 Index Type

None

##### 1.7.3.6.7 Size

0

##### 1.7.3.6.8 Constraints

*No items available*

##### 1.7.3.6.9 Default Value

false

##### 1.7.3.6.10 Is Foreign Key

❌ No

##### 1.7.3.6.11 Precision

0

##### 1.7.3.6.12 Scale

0

### 1.7.4.0.0 Primary Keys

- businessHourId

### 1.7.5.0.0 Unique Constraints

- {'name': 'UC_VendorBusinessHour_Vendor_Day', 'columns': ['vendorProfileId', 'dayOfWeek']}

### 1.7.6.0.0 Indexes

*No items available*

## 1.8.0.0.0 VendorLicense

### 1.8.1.0.0 Name

VendorLicense

### 1.8.2.0.0 Description

Stores mandatory license information for vendors in regulated categories.

### 1.8.3.0.0 Attributes

#### 1.8.3.1.0 licenseId

##### 1.8.3.1.1 Name

licenseId

##### 1.8.3.1.2 Type

🔹 Guid

##### 1.8.3.1.3 Is Required

✅ Yes

##### 1.8.3.1.4 Is Primary Key

✅ Yes

##### 1.8.3.1.5 Is Unique

✅ Yes

##### 1.8.3.1.6 Index Type

UniqueIndex

##### 1.8.3.1.7 Size

0

##### 1.8.3.1.8 Constraints

*No items available*

##### 1.8.3.1.9 Default Value

GENERATE_UUID()

##### 1.8.3.1.10 Is Foreign Key

❌ No

##### 1.8.3.1.11 Precision

0

##### 1.8.3.1.12 Scale

0

#### 1.8.3.2.0 vendorProfileId

##### 1.8.3.2.1 Name

vendorProfileId

##### 1.8.3.2.2 Type

🔹 Guid

##### 1.8.3.2.3 Is Required

✅ Yes

##### 1.8.3.2.4 Is Primary Key

❌ No

##### 1.8.3.2.5 Is Unique

❌ No

##### 1.8.3.2.6 Index Type

Index

##### 1.8.3.2.7 Size

0

##### 1.8.3.2.8 Constraints

*No items available*

##### 1.8.3.2.9 Default Value



##### 1.8.3.2.10 Is Foreign Key

✅ Yes

##### 1.8.3.2.11 Precision

0

##### 1.8.3.2.12 Scale

0

#### 1.8.3.3.0 licenseNumber

##### 1.8.3.3.1 Name

licenseNumber

##### 1.8.3.3.2 Type

🔹 VARCHAR

##### 1.8.3.3.3 Is Required

✅ Yes

##### 1.8.3.3.4 Is Primary Key

❌ No

##### 1.8.3.3.5 Is Unique

❌ No

##### 1.8.3.3.6 Index Type

None

##### 1.8.3.3.7 Size

100

##### 1.8.3.3.8 Constraints

*No items available*

##### 1.8.3.3.9 Default Value



##### 1.8.3.3.10 Is Foreign Key

❌ No

##### 1.8.3.3.11 Precision

0

##### 1.8.3.3.12 Scale

0

#### 1.8.3.4.0 expiryDate

##### 1.8.3.4.1 Name

expiryDate

##### 1.8.3.4.2 Type

🔹 DATE

##### 1.8.3.4.3 Is Required

✅ Yes

##### 1.8.3.4.4 Is Primary Key

❌ No

##### 1.8.3.4.5 Is Unique

❌ No

##### 1.8.3.4.6 Index Type

Index

##### 1.8.3.4.7 Size

0

##### 1.8.3.4.8 Constraints

*No items available*

##### 1.8.3.4.9 Default Value



##### 1.8.3.4.10 Is Foreign Key

❌ No

##### 1.8.3.4.11 Precision

0

##### 1.8.3.4.12 Scale

0

#### 1.8.3.5.0 licenseType

##### 1.8.3.5.1 Name

licenseType

##### 1.8.3.5.2 Type

🔹 VARCHAR

##### 1.8.3.5.3 Is Required

✅ Yes

##### 1.8.3.5.4 Is Primary Key

❌ No

##### 1.8.3.5.5 Is Unique

❌ No

##### 1.8.3.5.6 Index Type

Index

##### 1.8.3.5.7 Size

50

##### 1.8.3.5.8 Constraints

*No items available*

##### 1.8.3.5.9 Default Value



##### 1.8.3.5.10 Is Foreign Key

❌ No

##### 1.8.3.5.11 Precision

0

##### 1.8.3.5.12 Scale

0

#### 1.8.3.6.0 createdAt

##### 1.8.3.6.1 Name

createdAt

##### 1.8.3.6.2 Type

🔹 DateTimeOffset

##### 1.8.3.6.3 Is Required

✅ Yes

##### 1.8.3.6.4 Is Primary Key

❌ No

##### 1.8.3.6.5 Is Unique

❌ No

##### 1.8.3.6.6 Index Type

None

##### 1.8.3.6.7 Size

0

##### 1.8.3.6.8 Constraints

*No items available*

##### 1.8.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.8.3.6.10 Is Foreign Key

❌ No

##### 1.8.3.6.11 Precision

0

##### 1.8.3.6.12 Scale

0

#### 1.8.3.7.0 updatedAt

##### 1.8.3.7.1 Name

updatedAt

##### 1.8.3.7.2 Type

🔹 DateTimeOffset

##### 1.8.3.7.3 Is Required

✅ Yes

##### 1.8.3.7.4 Is Primary Key

❌ No

##### 1.8.3.7.5 Is Unique

❌ No

##### 1.8.3.7.6 Index Type

None

##### 1.8.3.7.7 Size

0

##### 1.8.3.7.8 Constraints

*No items available*

##### 1.8.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.8.3.7.10 Is Foreign Key

❌ No

##### 1.8.3.7.11 Precision

0

##### 1.8.3.7.12 Scale

0

### 1.8.4.0.0 Primary Keys

- licenseId

### 1.8.5.0.0 Unique Constraints

*No items available*

### 1.8.6.0.0 Indexes

- {'name': 'IX_VendorLicense_VendorProfileId', 'columns': ['vendorProfileId'], 'type': 'BTree'}

## 1.9.0.0.0 ProductCategory

### 1.9.1.0.0 Name

ProductCategory

### 1.9.2.0.0 Description

Represents categories for organizing a vendor's products.

### 1.9.3.0.0 Attributes

#### 1.9.3.1.0 productCategoryId

##### 1.9.3.1.1 Name

productCategoryId

##### 1.9.3.1.2 Type

🔹 Guid

##### 1.9.3.1.3 Is Required

✅ Yes

##### 1.9.3.1.4 Is Primary Key

✅ Yes

##### 1.9.3.1.5 Is Unique

✅ Yes

##### 1.9.3.1.6 Index Type

UniqueIndex

##### 1.9.3.1.7 Size

0

##### 1.9.3.1.8 Constraints

*No items available*

##### 1.9.3.1.9 Default Value

GENERATE_UUID()

##### 1.9.3.1.10 Is Foreign Key

❌ No

##### 1.9.3.1.11 Precision

0

##### 1.9.3.1.12 Scale

0

#### 1.9.3.2.0 vendorProfileId

##### 1.9.3.2.1 Name

vendorProfileId

##### 1.9.3.2.2 Type

🔹 Guid

##### 1.9.3.2.3 Is Required

✅ Yes

##### 1.9.3.2.4 Is Primary Key

❌ No

##### 1.9.3.2.5 Is Unique

❌ No

##### 1.9.3.2.6 Index Type

Index

##### 1.9.3.2.7 Size

0

##### 1.9.3.2.8 Constraints

*No items available*

##### 1.9.3.2.9 Default Value



##### 1.9.3.2.10 Is Foreign Key

✅ Yes

##### 1.9.3.2.11 Precision

0

##### 1.9.3.2.12 Scale

0

#### 1.9.3.3.0 name

##### 1.9.3.3.1 Name

name

##### 1.9.3.3.2 Type

🔹 VARCHAR

##### 1.9.3.3.3 Is Required

✅ Yes

##### 1.9.3.3.4 Is Primary Key

❌ No

##### 1.9.3.3.5 Is Unique

❌ No

##### 1.9.3.3.6 Index Type

Index

##### 1.9.3.3.7 Size

100

##### 1.9.3.3.8 Constraints

*No items available*

##### 1.9.3.3.9 Default Value



##### 1.9.3.3.10 Is Foreign Key

❌ No

##### 1.9.3.3.11 Precision

0

##### 1.9.3.3.12 Scale

0

#### 1.9.3.4.0 description

##### 1.9.3.4.1 Name

description

##### 1.9.3.4.2 Type

🔹 TEXT

##### 1.9.3.4.3 Is Required

❌ No

##### 1.9.3.4.4 Is Primary Key

❌ No

##### 1.9.3.4.5 Is Unique

❌ No

##### 1.9.3.4.6 Index Type

None

##### 1.9.3.4.7 Size

0

##### 1.9.3.4.8 Constraints

*No items available*

##### 1.9.3.4.9 Default Value



##### 1.9.3.4.10 Is Foreign Key

❌ No

##### 1.9.3.4.11 Precision

0

##### 1.9.3.4.12 Scale

0

#### 1.9.3.5.0 isDeleted

##### 1.9.3.5.1 Name

isDeleted

##### 1.9.3.5.2 Type

🔹 BOOLEAN

##### 1.9.3.5.3 Is Required

✅ Yes

##### 1.9.3.5.4 Is Primary Key

❌ No

##### 1.9.3.5.5 Is Unique

❌ No

##### 1.9.3.5.6 Index Type

Index

##### 1.9.3.5.7 Size

0

##### 1.9.3.5.8 Constraints

*No items available*

##### 1.9.3.5.9 Default Value

false

##### 1.9.3.5.10 Is Foreign Key

❌ No

##### 1.9.3.5.11 Precision

0

##### 1.9.3.5.12 Scale

0

#### 1.9.3.6.0 createdAt

##### 1.9.3.6.1 Name

createdAt

##### 1.9.3.6.2 Type

🔹 DateTimeOffset

##### 1.9.3.6.3 Is Required

✅ Yes

##### 1.9.3.6.4 Is Primary Key

❌ No

##### 1.9.3.6.5 Is Unique

❌ No

##### 1.9.3.6.6 Index Type

None

##### 1.9.3.6.7 Size

0

##### 1.9.3.6.8 Constraints

*No items available*

##### 1.9.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.9.3.6.10 Is Foreign Key

❌ No

##### 1.9.3.6.11 Precision

0

##### 1.9.3.6.12 Scale

0

#### 1.9.3.7.0 updatedAt

##### 1.9.3.7.1 Name

updatedAt

##### 1.9.3.7.2 Type

🔹 DateTimeOffset

##### 1.9.3.7.3 Is Required

✅ Yes

##### 1.9.3.7.4 Is Primary Key

❌ No

##### 1.9.3.7.5 Is Unique

❌ No

##### 1.9.3.7.6 Index Type

None

##### 1.9.3.7.7 Size

0

##### 1.9.3.7.8 Constraints

*No items available*

##### 1.9.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.9.3.7.10 Is Foreign Key

❌ No

##### 1.9.3.7.11 Precision

0

##### 1.9.3.7.12 Scale

0

### 1.9.4.0.0 Primary Keys

- productCategoryId

### 1.9.5.0.0 Unique Constraints

- {'name': 'UC_ProductCategory_Vendor_Name', 'columns': ['vendorProfileId', 'name']}

### 1.9.6.0.0 Indexes

*No items available*

## 1.10.0.0.0 Product

### 1.10.1.0.0 Name

Product

### 1.10.2.0.0 Description

Represents an individual item sold by a vendor.

### 1.10.3.0.0 Caching Strategy

| Property | Value |
|----------|-------|
| Type | Distributed |
| Tool | Redis |
| Key | product:{productId} |
| Invalidation | Write-through or cache-aside on vendor updates |
| Purpose | Accelerate product discovery and search queries. |

### 1.10.4.0.0 Attributes

#### 1.10.4.1.0 productId

##### 1.10.4.1.1 Name

productId

##### 1.10.4.1.2 Type

🔹 Guid

##### 1.10.4.1.3 Is Required

✅ Yes

##### 1.10.4.1.4 Is Primary Key

✅ Yes

##### 1.10.4.1.5 Is Unique

✅ Yes

##### 1.10.4.1.6 Index Type

UniqueIndex

##### 1.10.4.1.7 Size

0

##### 1.10.4.1.8 Constraints

*No items available*

##### 1.10.4.1.9 Default Value

GENERATE_UUID()

##### 1.10.4.1.10 Is Foreign Key

❌ No

##### 1.10.4.1.11 Precision

0

##### 1.10.4.1.12 Scale

0

#### 1.10.4.2.0 vendorProfileId

##### 1.10.4.2.1 Name

vendorProfileId

##### 1.10.4.2.2 Type

🔹 Guid

##### 1.10.4.2.3 Is Required

✅ Yes

##### 1.10.4.2.4 Is Primary Key

❌ No

##### 1.10.4.2.5 Is Unique

❌ No

##### 1.10.4.2.6 Index Type

Index

##### 1.10.4.2.7 Size

0

##### 1.10.4.2.8 Constraints

*No items available*

##### 1.10.4.2.9 Default Value



##### 1.10.4.2.10 Is Foreign Key

✅ Yes

##### 1.10.4.2.11 Precision

0

##### 1.10.4.2.12 Scale

0

#### 1.10.4.3.0 productCategoryId

##### 1.10.4.3.1 Name

productCategoryId

##### 1.10.4.3.2 Type

🔹 Guid

##### 1.10.4.3.3 Is Required

✅ Yes

##### 1.10.4.3.4 Is Primary Key

❌ No

##### 1.10.4.3.5 Is Unique

❌ No

##### 1.10.4.3.6 Index Type

Index

##### 1.10.4.3.7 Size

0

##### 1.10.4.3.8 Constraints

*No items available*

##### 1.10.4.3.9 Default Value



##### 1.10.4.3.10 Is Foreign Key

✅ Yes

##### 1.10.4.3.11 Precision

0

##### 1.10.4.3.12 Scale

0

#### 1.10.4.4.0 name

##### 1.10.4.4.1 Name

name

##### 1.10.4.4.2 Type

🔹 VARCHAR

##### 1.10.4.4.3 Is Required

✅ Yes

##### 1.10.4.4.4 Is Primary Key

❌ No

##### 1.10.4.4.5 Is Unique

❌ No

##### 1.10.4.4.6 Index Type

FullText

##### 1.10.4.4.7 Size

255

##### 1.10.4.4.8 Constraints

*No items available*

##### 1.10.4.4.9 Default Value



##### 1.10.4.4.10 Is Foreign Key

❌ No

##### 1.10.4.4.11 Precision

0

##### 1.10.4.4.12 Scale

0

#### 1.10.4.5.0 description

##### 1.10.4.5.1 Name

description

##### 1.10.4.5.2 Type

🔹 TEXT

##### 1.10.4.5.3 Is Required

❌ No

##### 1.10.4.5.4 Is Primary Key

❌ No

##### 1.10.4.5.5 Is Unique

❌ No

##### 1.10.4.5.6 Index Type

FullText

##### 1.10.4.5.7 Size

0

##### 1.10.4.5.8 Constraints

*No items available*

##### 1.10.4.5.9 Default Value



##### 1.10.4.5.10 Is Foreign Key

❌ No

##### 1.10.4.5.11 Precision

0

##### 1.10.4.5.12 Scale

0

#### 1.10.4.6.0 price

##### 1.10.4.6.1 Name

price

##### 1.10.4.6.2 Type

🔹 DECIMAL

##### 1.10.4.6.3 Is Required

✅ Yes

##### 1.10.4.6.4 Is Primary Key

❌ No

##### 1.10.4.6.5 Is Unique

❌ No

##### 1.10.4.6.6 Index Type

Index

##### 1.10.4.6.7 Size

0

##### 1.10.4.6.8 Constraints

- POSITIVE_VALUE

##### 1.10.4.6.9 Default Value



##### 1.10.4.6.10 Is Foreign Key

❌ No

##### 1.10.4.6.11 Precision

10

##### 1.10.4.6.12 Scale

2

#### 1.10.4.7.0 imageUrl

##### 1.10.4.7.1 Name

imageUrl

##### 1.10.4.7.2 Type

🔹 VARCHAR

##### 1.10.4.7.3 Is Required

❌ No

##### 1.10.4.7.4 Is Primary Key

❌ No

##### 1.10.4.7.5 Is Unique

❌ No

##### 1.10.4.7.6 Index Type

None

##### 1.10.4.7.7 Size

2,048

##### 1.10.4.7.8 Constraints

*No items available*

##### 1.10.4.7.9 Default Value



##### 1.10.4.7.10 Is Foreign Key

❌ No

##### 1.10.4.7.11 Precision

0

##### 1.10.4.7.12 Scale

0

#### 1.10.4.8.0 stockQuantity

##### 1.10.4.8.1 Name

stockQuantity

##### 1.10.4.8.2 Type

🔹 INT

##### 1.10.4.8.3 Is Required

✅ Yes

##### 1.10.4.8.4 Is Primary Key

❌ No

##### 1.10.4.8.5 Is Unique

❌ No

##### 1.10.4.8.6 Index Type

None

##### 1.10.4.8.7 Size

0

##### 1.10.4.8.8 Constraints

- NON_NEGATIVE

##### 1.10.4.8.9 Default Value

0

##### 1.10.4.8.10 Is Foreign Key

❌ No

##### 1.10.4.8.11 Precision

0

##### 1.10.4.8.12 Scale

0

#### 1.10.4.9.0 limitedStockThreshold

##### 1.10.4.9.1 Name

limitedStockThreshold

##### 1.10.4.9.2 Type

🔹 INT

##### 1.10.4.9.3 Is Required

❌ No

##### 1.10.4.9.4 Is Primary Key

❌ No

##### 1.10.4.9.5 Is Unique

❌ No

##### 1.10.4.9.6 Index Type

None

##### 1.10.4.9.7 Size

0

##### 1.10.4.9.8 Constraints

- NON_NEGATIVE

##### 1.10.4.9.9 Default Value

5

##### 1.10.4.9.10 Is Foreign Key

❌ No

##### 1.10.4.9.11 Precision

0

##### 1.10.4.9.12 Scale

0

#### 1.10.4.10.0 isAvailable

##### 1.10.4.10.1 Name

isAvailable

##### 1.10.4.10.2 Type

🔹 BOOLEAN

##### 1.10.4.10.3 Is Required

✅ Yes

##### 1.10.4.10.4 Is Primary Key

❌ No

##### 1.10.4.10.5 Is Unique

❌ No

##### 1.10.4.10.6 Index Type

Index

##### 1.10.4.10.7 Size

0

##### 1.10.4.10.8 Constraints

*No items available*

##### 1.10.4.10.9 Default Value

true

##### 1.10.4.10.10 Is Foreign Key

❌ No

##### 1.10.4.10.11 Precision

0

##### 1.10.4.10.12 Scale

0

#### 1.10.4.11.0 isDeleted

##### 1.10.4.11.1 Name

isDeleted

##### 1.10.4.11.2 Type

🔹 BOOLEAN

##### 1.10.4.11.3 Is Required

✅ Yes

##### 1.10.4.11.4 Is Primary Key

❌ No

##### 1.10.4.11.5 Is Unique

❌ No

##### 1.10.4.11.6 Index Type

Index

##### 1.10.4.11.7 Size

0

##### 1.10.4.11.8 Constraints

*No items available*

##### 1.10.4.11.9 Default Value

false

##### 1.10.4.11.10 Is Foreign Key

❌ No

##### 1.10.4.11.11 Precision

0

##### 1.10.4.11.12 Scale

0

#### 1.10.4.12.0 createdAt

##### 1.10.4.12.1 Name

createdAt

##### 1.10.4.12.2 Type

🔹 DateTimeOffset

##### 1.10.4.12.3 Is Required

✅ Yes

##### 1.10.4.12.4 Is Primary Key

❌ No

##### 1.10.4.12.5 Is Unique

❌ No

##### 1.10.4.12.6 Index Type

None

##### 1.10.4.12.7 Size

0

##### 1.10.4.12.8 Constraints

*No items available*

##### 1.10.4.12.9 Default Value

CURRENT_TIMESTAMP

##### 1.10.4.12.10 Is Foreign Key

❌ No

##### 1.10.4.12.11 Precision

0

##### 1.10.4.12.12 Scale

0

#### 1.10.4.13.0 updatedAt

##### 1.10.4.13.1 Name

updatedAt

##### 1.10.4.13.2 Type

🔹 DateTimeOffset

##### 1.10.4.13.3 Is Required

✅ Yes

##### 1.10.4.13.4 Is Primary Key

❌ No

##### 1.10.4.13.5 Is Unique

❌ No

##### 1.10.4.13.6 Index Type

None

##### 1.10.4.13.7 Size

0

##### 1.10.4.13.8 Constraints

*No items available*

##### 1.10.4.13.9 Default Value

CURRENT_TIMESTAMP

##### 1.10.4.13.10 Is Foreign Key

❌ No

##### 1.10.4.13.11 Precision

0

##### 1.10.4.13.12 Scale

0

### 1.10.5.0.0 Primary Keys

- productId

### 1.10.6.0.0 Unique Constraints

*No items available*

### 1.10.7.0.0 Indexes

#### 1.10.7.1.0 IX_Product_Vendor_Availability

##### 1.10.7.1.1 Name

IX_Product_Vendor_Availability

##### 1.10.7.1.2 Columns

- vendorProfileId
- isAvailable
- isDeleted

##### 1.10.7.1.3 Type

🔹 BTree

#### 1.10.7.2.0 FT_Product_Name_Description

##### 1.10.7.2.1 Name

FT_Product_Name_Description

##### 1.10.7.2.2 Columns

- name
- description

##### 1.10.7.2.3 Type

🔹 FullText

## 1.11.0.0.0 Order

### 1.11.1.0.0 Name

Order

### 1.11.2.0.0 Description

The central transactional entity representing a customer's purchase.

### 1.11.3.0.0 Partitioning

| Property | Value |
|----------|-------|
| Type | RANGE |
| Column | placedAt |
| Strategy | MONTHLY |

### 1.11.4.0.0 Attributes

#### 1.11.4.1.0 orderId

##### 1.11.4.1.1 Name

orderId

##### 1.11.4.1.2 Type

🔹 Guid

##### 1.11.4.1.3 Is Required

✅ Yes

##### 1.11.4.1.4 Is Primary Key

✅ Yes

##### 1.11.4.1.5 Is Unique

✅ Yes

##### 1.11.4.1.6 Index Type

UniqueIndex

##### 1.11.4.1.7 Size

0

##### 1.11.4.1.8 Constraints

*No items available*

##### 1.11.4.1.9 Default Value

GENERATE_UUID()

##### 1.11.4.1.10 Is Foreign Key

❌ No

##### 1.11.4.1.11 Precision

0

##### 1.11.4.1.12 Scale

0

#### 1.11.4.2.0 customerId

##### 1.11.4.2.1 Name

customerId

##### 1.11.4.2.2 Type

🔹 Guid

##### 1.11.4.2.3 Is Required

✅ Yes

##### 1.11.4.2.4 Is Primary Key

❌ No

##### 1.11.4.2.5 Is Unique

❌ No

##### 1.11.4.2.6 Index Type

Index

##### 1.11.4.2.7 Size

0

##### 1.11.4.2.8 Constraints

*No items available*

##### 1.11.4.2.9 Default Value



##### 1.11.4.2.10 Is Foreign Key

✅ Yes

##### 1.11.4.2.11 Precision

0

##### 1.11.4.2.12 Scale

0

#### 1.11.4.3.0 vendorId

##### 1.11.4.3.1 Name

vendorId

##### 1.11.4.3.2 Type

🔹 Guid

##### 1.11.4.3.3 Is Required

✅ Yes

##### 1.11.4.3.4 Is Primary Key

❌ No

##### 1.11.4.3.5 Is Unique

❌ No

##### 1.11.4.3.6 Index Type

Index

##### 1.11.4.3.7 Size

0

##### 1.11.4.3.8 Constraints

*No items available*

##### 1.11.4.3.9 Default Value



##### 1.11.4.3.10 Is Foreign Key

✅ Yes

##### 1.11.4.3.11 Precision

0

##### 1.11.4.3.12 Scale

0

#### 1.11.4.4.0 deliveryAddressId

##### 1.11.4.4.1 Name

deliveryAddressId

##### 1.11.4.4.2 Type

🔹 Guid

##### 1.11.4.4.3 Is Required

✅ Yes

##### 1.11.4.4.4 Is Primary Key

❌ No

##### 1.11.4.4.5 Is Unique

❌ No

##### 1.11.4.4.6 Index Type

Index

##### 1.11.4.4.7 Size

0

##### 1.11.4.4.8 Constraints

*No items available*

##### 1.11.4.4.9 Default Value



##### 1.11.4.4.10 Is Foreign Key

✅ Yes

##### 1.11.4.4.11 Precision

0

##### 1.11.4.4.12 Scale

0

#### 1.11.4.5.0 customerName

##### 1.11.4.5.1 Name

customerName

##### 1.11.4.5.2 Type

🔹 VARCHAR

##### 1.11.4.5.3 Is Required

❌ No

##### 1.11.4.5.4 Is Primary Key

❌ No

##### 1.11.4.5.5 Is Unique

❌ No

##### 1.11.4.5.6 Index Type

None

##### 1.11.4.5.7 Size

201

##### 1.11.4.5.8 Constraints

*No items available*

##### 1.11.4.5.9 Default Value



##### 1.11.4.5.10 Is Foreign Key

❌ No

##### 1.11.4.5.11 Precision

0

##### 1.11.4.5.12 Scale

0

#### 1.11.4.6.0 vendorStoreName

##### 1.11.4.6.1 Name

vendorStoreName

##### 1.11.4.6.2 Type

🔹 VARCHAR

##### 1.11.4.6.3 Is Required

❌ No

##### 1.11.4.6.4 Is Primary Key

❌ No

##### 1.11.4.6.5 Is Unique

❌ No

##### 1.11.4.6.6 Index Type

None

##### 1.11.4.6.7 Size

255

##### 1.11.4.6.8 Constraints

*No items available*

##### 1.11.4.6.9 Default Value



##### 1.11.4.6.10 Is Foreign Key

❌ No

##### 1.11.4.6.11 Precision

0

##### 1.11.4.6.12 Scale

0

#### 1.11.4.7.0 subtotal

##### 1.11.4.7.1 Name

subtotal

##### 1.11.4.7.2 Type

🔹 DECIMAL

##### 1.11.4.7.3 Is Required

✅ Yes

##### 1.11.4.7.4 Is Primary Key

❌ No

##### 1.11.4.7.5 Is Unique

❌ No

##### 1.11.4.7.6 Index Type

None

##### 1.11.4.7.7 Size

0

##### 1.11.4.7.8 Constraints

*No items available*

##### 1.11.4.7.9 Default Value



##### 1.11.4.7.10 Is Foreign Key

❌ No

##### 1.11.4.7.11 Precision

10

##### 1.11.4.7.12 Scale

2

#### 1.11.4.8.0 taxes

##### 1.11.4.8.1 Name

taxes

##### 1.11.4.8.2 Type

🔹 DECIMAL

##### 1.11.4.8.3 Is Required

✅ Yes

##### 1.11.4.8.4 Is Primary Key

❌ No

##### 1.11.4.8.5 Is Unique

❌ No

##### 1.11.4.8.6 Index Type

None

##### 1.11.4.8.7 Size

0

##### 1.11.4.8.8 Constraints

*No items available*

##### 1.11.4.8.9 Default Value



##### 1.11.4.8.10 Is Foreign Key

❌ No

##### 1.11.4.8.11 Precision

10

##### 1.11.4.8.12 Scale

2

#### 1.11.4.9.0 deliveryFee

##### 1.11.4.9.1 Name

deliveryFee

##### 1.11.4.9.2 Type

🔹 DECIMAL

##### 1.11.4.9.3 Is Required

✅ Yes

##### 1.11.4.9.4 Is Primary Key

❌ No

##### 1.11.4.9.5 Is Unique

❌ No

##### 1.11.4.9.6 Index Type

None

##### 1.11.4.9.7 Size

0

##### 1.11.4.9.8 Constraints

*No items available*

##### 1.11.4.9.9 Default Value



##### 1.11.4.9.10 Is Foreign Key

❌ No

##### 1.11.4.9.11 Precision

10

##### 1.11.4.9.12 Scale

2

#### 1.11.4.10.0 totalAmount

##### 1.11.4.10.1 Name

totalAmount

##### 1.11.4.10.2 Type

🔹 DECIMAL

##### 1.11.4.10.3 Is Required

✅ Yes

##### 1.11.4.10.4 Is Primary Key

❌ No

##### 1.11.4.10.5 Is Unique

❌ No

##### 1.11.4.10.6 Index Type

Index

##### 1.11.4.10.7 Size

0

##### 1.11.4.10.8 Constraints

*No items available*

##### 1.11.4.10.9 Default Value



##### 1.11.4.10.10 Is Foreign Key

❌ No

##### 1.11.4.10.11 Precision

10

##### 1.11.4.10.12 Scale

2

#### 1.11.4.11.0 status

##### 1.11.4.11.1 Name

status

##### 1.11.4.11.2 Type

🔹 VARCHAR

##### 1.11.4.11.3 Is Required

✅ Yes

##### 1.11.4.11.4 Is Primary Key

❌ No

##### 1.11.4.11.5 Is Unique

❌ No

##### 1.11.4.11.6 Index Type

Index

##### 1.11.4.11.7 Size

30

##### 1.11.4.11.8 Constraints

- ENUM('PAYMENT_PENDING', 'PENDING_VENDOR_ACCEPTANCE', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'ALLOCATION_FAILED')

##### 1.11.4.11.9 Default Value



##### 1.11.4.11.10 Is Foreign Key

❌ No

##### 1.11.4.11.11 Precision

0

##### 1.11.4.11.12 Scale

0

#### 1.11.4.12.0 paymentMethod

##### 1.11.4.12.1 Name

paymentMethod

##### 1.11.4.12.2 Type

🔹 VARCHAR

##### 1.11.4.12.3 Is Required

✅ Yes

##### 1.11.4.12.4 Is Primary Key

❌ No

##### 1.11.4.12.5 Is Unique

❌ No

##### 1.11.4.12.6 Index Type

Index

##### 1.11.4.12.7 Size

20

##### 1.11.4.12.8 Constraints

- ENUM('UPI', 'CREDIT_DEBIT_CARD', 'COD')

##### 1.11.4.12.9 Default Value



##### 1.11.4.12.10 Is Foreign Key

❌ No

##### 1.11.4.12.11 Precision

0

##### 1.11.4.12.12 Scale

0

#### 1.11.4.13.0 vendorInstructions

##### 1.11.4.13.1 Name

vendorInstructions

##### 1.11.4.13.2 Type

🔹 TEXT

##### 1.11.4.13.3 Is Required

❌ No

##### 1.11.4.13.4 Is Primary Key

❌ No

##### 1.11.4.13.5 Is Unique

❌ No

##### 1.11.4.13.6 Index Type

None

##### 1.11.4.13.7 Size

0

##### 1.11.4.13.8 Constraints

*No items available*

##### 1.11.4.13.9 Default Value



##### 1.11.4.13.10 Is Foreign Key

❌ No

##### 1.11.4.13.11 Precision

0

##### 1.11.4.13.12 Scale

0

#### 1.11.4.14.0 riderInstructions

##### 1.11.4.14.1 Name

riderInstructions

##### 1.11.4.14.2 Type

🔹 TEXT

##### 1.11.4.14.3 Is Required

❌ No

##### 1.11.4.14.4 Is Primary Key

❌ No

##### 1.11.4.14.5 Is Unique

❌ No

##### 1.11.4.14.6 Index Type

None

##### 1.11.4.14.7 Size

0

##### 1.11.4.14.8 Constraints

*No items available*

##### 1.11.4.14.9 Default Value



##### 1.11.4.14.10 Is Foreign Key

❌ No

##### 1.11.4.14.11 Precision

0

##### 1.11.4.14.12 Scale

0

#### 1.11.4.15.0 placedAt

##### 1.11.4.15.1 Name

placedAt

##### 1.11.4.15.2 Type

🔹 DateTimeOffset

##### 1.11.4.15.3 Is Required

✅ Yes

##### 1.11.4.15.4 Is Primary Key

❌ No

##### 1.11.4.15.5 Is Unique

❌ No

##### 1.11.4.15.6 Index Type

Index

##### 1.11.4.15.7 Size

0

##### 1.11.4.15.8 Constraints

*No items available*

##### 1.11.4.15.9 Default Value

CURRENT_TIMESTAMP

##### 1.11.4.15.10 Is Foreign Key

❌ No

##### 1.11.4.15.11 Precision

0

##### 1.11.4.15.12 Scale

0

#### 1.11.4.16.0 createdAt

##### 1.11.4.16.1 Name

createdAt

##### 1.11.4.16.2 Type

🔹 DateTimeOffset

##### 1.11.4.16.3 Is Required

✅ Yes

##### 1.11.4.16.4 Is Primary Key

❌ No

##### 1.11.4.16.5 Is Unique

❌ No

##### 1.11.4.16.6 Index Type

None

##### 1.11.4.16.7 Size

0

##### 1.11.4.16.8 Constraints

*No items available*

##### 1.11.4.16.9 Default Value

CURRENT_TIMESTAMP

##### 1.11.4.16.10 Is Foreign Key

❌ No

##### 1.11.4.16.11 Precision

0

##### 1.11.4.16.12 Scale

0

#### 1.11.4.17.0 updatedAt

##### 1.11.4.17.1 Name

updatedAt

##### 1.11.4.17.2 Type

🔹 DateTimeOffset

##### 1.11.4.17.3 Is Required

✅ Yes

##### 1.11.4.17.4 Is Primary Key

❌ No

##### 1.11.4.17.5 Is Unique

❌ No

##### 1.11.4.17.6 Index Type

None

##### 1.11.4.17.7 Size

0

##### 1.11.4.17.8 Constraints

*No items available*

##### 1.11.4.17.9 Default Value

CURRENT_TIMESTAMP

##### 1.11.4.17.10 Is Foreign Key

❌ No

##### 1.11.4.17.11 Precision

0

##### 1.11.4.17.12 Scale

0

### 1.11.5.0.0 Primary Keys

- orderId

### 1.11.6.0.0 Unique Constraints

*No items available*

### 1.11.7.0.0 Indexes

#### 1.11.7.1.0 IX_Order_CustomerId_Status

##### 1.11.7.1.1 Name

IX_Order_CustomerId_Status

##### 1.11.7.1.2 Columns

- customerId
- status

##### 1.11.7.1.3 Type

🔹 BTree

#### 1.11.7.2.0 IX_Order_VendorId_Status

##### 1.11.7.2.1 Name

IX_Order_VendorId_Status

##### 1.11.7.2.2 Columns

- vendorId
- status

##### 1.11.7.2.3 Type

🔹 BTree

#### 1.11.7.3.0 IX_Order_Status_PlacedAt

##### 1.11.7.3.1 Name

IX_Order_Status_PlacedAt

##### 1.11.7.3.2 Columns

- status
- placedAt

##### 1.11.7.3.3 Type

🔹 BTree

## 1.12.0.0.0 OrderItem

### 1.12.1.0.0 Name

OrderItem

### 1.12.2.0.0 Description

A junction table linking Orders and Products, detailing items in a specific order.

### 1.12.3.0.0 Attributes

#### 1.12.3.1.0 orderItemId

##### 1.12.3.1.1 Name

orderItemId

##### 1.12.3.1.2 Type

🔹 Guid

##### 1.12.3.1.3 Is Required

✅ Yes

##### 1.12.3.1.4 Is Primary Key

✅ Yes

##### 1.12.3.1.5 Is Unique

✅ Yes

##### 1.12.3.1.6 Index Type

UniqueIndex

##### 1.12.3.1.7 Size

0

##### 1.12.3.1.8 Constraints

*No items available*

##### 1.12.3.1.9 Default Value

GENERATE_UUID()

##### 1.12.3.1.10 Is Foreign Key

❌ No

##### 1.12.3.1.11 Precision

0

##### 1.12.3.1.12 Scale

0

#### 1.12.3.2.0 orderId

##### 1.12.3.2.1 Name

orderId

##### 1.12.3.2.2 Type

🔹 Guid

##### 1.12.3.2.3 Is Required

✅ Yes

##### 1.12.3.2.4 Is Primary Key

❌ No

##### 1.12.3.2.5 Is Unique

❌ No

##### 1.12.3.2.6 Index Type

Index

##### 1.12.3.2.7 Size

0

##### 1.12.3.2.8 Constraints

*No items available*

##### 1.12.3.2.9 Default Value



##### 1.12.3.2.10 Is Foreign Key

✅ Yes

##### 1.12.3.2.11 Precision

0

##### 1.12.3.2.12 Scale

0

#### 1.12.3.3.0 productId

##### 1.12.3.3.1 Name

productId

##### 1.12.3.3.2 Type

🔹 Guid

##### 1.12.3.3.3 Is Required

✅ Yes

##### 1.12.3.3.4 Is Primary Key

❌ No

##### 1.12.3.3.5 Is Unique

❌ No

##### 1.12.3.3.6 Index Type

Index

##### 1.12.3.3.7 Size

0

##### 1.12.3.3.8 Constraints

*No items available*

##### 1.12.3.3.9 Default Value



##### 1.12.3.3.10 Is Foreign Key

✅ Yes

##### 1.12.3.3.11 Precision

0

##### 1.12.3.3.12 Scale

0

#### 1.12.3.4.0 quantity

##### 1.12.3.4.1 Name

quantity

##### 1.12.3.4.2 Type

🔹 INT

##### 1.12.3.4.3 Is Required

✅ Yes

##### 1.12.3.4.4 Is Primary Key

❌ No

##### 1.12.3.4.5 Is Unique

❌ No

##### 1.12.3.4.6 Index Type

None

##### 1.12.3.4.7 Size

0

##### 1.12.3.4.8 Constraints

- POSITIVE_VALUE

##### 1.12.3.4.9 Default Value



##### 1.12.3.4.10 Is Foreign Key

❌ No

##### 1.12.3.4.11 Precision

0

##### 1.12.3.4.12 Scale

0

#### 1.12.3.5.0 priceAtTimeOfOrder

##### 1.12.3.5.1 Name

priceAtTimeOfOrder

##### 1.12.3.5.2 Type

🔹 DECIMAL

##### 1.12.3.5.3 Is Required

✅ Yes

##### 1.12.3.5.4 Is Primary Key

❌ No

##### 1.12.3.5.5 Is Unique

❌ No

##### 1.12.3.5.6 Index Type

None

##### 1.12.3.5.7 Size

0

##### 1.12.3.5.8 Constraints

*No items available*

##### 1.12.3.5.9 Default Value



##### 1.12.3.5.10 Is Foreign Key

❌ No

##### 1.12.3.5.11 Precision

10

##### 1.12.3.5.12 Scale

2

#### 1.12.3.6.0 productName

##### 1.12.3.6.1 Name

productName

##### 1.12.3.6.2 Type

🔹 VARCHAR

##### 1.12.3.6.3 Is Required

✅ Yes

##### 1.12.3.6.4 Is Primary Key

❌ No

##### 1.12.3.6.5 Is Unique

❌ No

##### 1.12.3.6.6 Index Type

None

##### 1.12.3.6.7 Size

255

##### 1.12.3.6.8 Constraints

*No items available*

##### 1.12.3.6.9 Default Value



##### 1.12.3.6.10 Is Foreign Key

❌ No

##### 1.12.3.6.11 Precision

0

##### 1.12.3.6.12 Scale

0

### 1.12.4.0.0 Primary Keys

- orderItemId

### 1.12.5.0.0 Unique Constraints

- {'name': 'UC_OrderItem_Order_Product', 'columns': ['orderId', 'productId']}

### 1.12.6.0.0 Indexes

*No items available*

## 1.13.0.0.0 OrderStatusHistory

### 1.13.1.0.0 Name

OrderStatusHistory

### 1.13.2.0.0 Description

An immutable log of all status transitions for an order.

### 1.13.3.0.0 Partitioning

| Property | Value |
|----------|-------|
| Type | RANGE |
| Column | createdAt |
| Strategy | YEARLY |

### 1.13.4.0.0 Attributes

#### 1.13.4.1.0 orderStatusHistoryId

##### 1.13.4.1.1 Name

orderStatusHistoryId

##### 1.13.4.1.2 Type

🔹 Guid

##### 1.13.4.1.3 Is Required

✅ Yes

##### 1.13.4.1.4 Is Primary Key

✅ Yes

##### 1.13.4.1.5 Is Unique

✅ Yes

##### 1.13.4.1.6 Index Type

UniqueIndex

##### 1.13.4.1.7 Size

0

##### 1.13.4.1.8 Constraints

*No items available*

##### 1.13.4.1.9 Default Value

GENERATE_UUID()

##### 1.13.4.1.10 Is Foreign Key

❌ No

##### 1.13.4.1.11 Precision

0

##### 1.13.4.1.12 Scale

0

#### 1.13.4.2.0 orderId

##### 1.13.4.2.1 Name

orderId

##### 1.13.4.2.2 Type

🔹 Guid

##### 1.13.4.2.3 Is Required

✅ Yes

##### 1.13.4.2.4 Is Primary Key

❌ No

##### 1.13.4.2.5 Is Unique

❌ No

##### 1.13.4.2.6 Index Type

Index

##### 1.13.4.2.7 Size

0

##### 1.13.4.2.8 Constraints

*No items available*

##### 1.13.4.2.9 Default Value



##### 1.13.4.2.10 Is Foreign Key

✅ Yes

##### 1.13.4.2.11 Precision

0

##### 1.13.4.2.12 Scale

0

#### 1.13.4.3.0 status

##### 1.13.4.3.1 Name

status

##### 1.13.4.3.2 Type

🔹 VARCHAR

##### 1.13.4.3.3 Is Required

✅ Yes

##### 1.13.4.3.4 Is Primary Key

❌ No

##### 1.13.4.3.5 Is Unique

❌ No

##### 1.13.4.3.6 Index Type

None

##### 1.13.4.3.7 Size

30

##### 1.13.4.3.8 Constraints

*No items available*

##### 1.13.4.3.9 Default Value



##### 1.13.4.3.10 Is Foreign Key

❌ No

##### 1.13.4.3.11 Precision

0

##### 1.13.4.3.12 Scale

0

#### 1.13.4.4.0 actor

##### 1.13.4.4.1 Name

actor

##### 1.13.4.4.2 Type

🔹 VARCHAR

##### 1.13.4.4.3 Is Required

✅ Yes

##### 1.13.4.4.4 Is Primary Key

❌ No

##### 1.13.4.4.5 Is Unique

❌ No

##### 1.13.4.4.6 Index Type

None

##### 1.13.4.4.7 Size

50

##### 1.13.4.4.8 Constraints

*No items available*

##### 1.13.4.4.9 Default Value



##### 1.13.4.4.10 Is Foreign Key

❌ No

##### 1.13.4.4.11 Precision

0

##### 1.13.4.4.12 Scale

0

#### 1.13.4.5.0 notes

##### 1.13.4.5.1 Name

notes

##### 1.13.4.5.2 Type

🔹 TEXT

##### 1.13.4.5.3 Is Required

❌ No

##### 1.13.4.5.4 Is Primary Key

❌ No

##### 1.13.4.5.5 Is Unique

❌ No

##### 1.13.4.5.6 Index Type

None

##### 1.13.4.5.7 Size

0

##### 1.13.4.5.8 Constraints

*No items available*

##### 1.13.4.5.9 Default Value



##### 1.13.4.5.10 Is Foreign Key

❌ No

##### 1.13.4.5.11 Precision

0

##### 1.13.4.5.12 Scale

0

#### 1.13.4.6.0 createdAt

##### 1.13.4.6.1 Name

createdAt

##### 1.13.4.6.2 Type

🔹 DateTimeOffset

##### 1.13.4.6.3 Is Required

✅ Yes

##### 1.13.4.6.4 Is Primary Key

❌ No

##### 1.13.4.6.5 Is Unique

❌ No

##### 1.13.4.6.6 Index Type

Index

##### 1.13.4.6.7 Size

0

##### 1.13.4.6.8 Constraints

*No items available*

##### 1.13.4.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.13.4.6.10 Is Foreign Key

❌ No

##### 1.13.4.6.11 Precision

0

##### 1.13.4.6.12 Scale

0

### 1.13.5.0.0 Primary Keys

- orderStatusHistoryId

### 1.13.6.0.0 Unique Constraints

*No items available*

### 1.13.7.0.0 Indexes

- {'name': 'IX_OrderStatusHistory_OrderId_CreatedAt', 'columns': ['orderId', 'createdAt'], 'type': 'BTree'}

## 1.14.0.0.0 Payment

### 1.14.1.0.0 Name

Payment

### 1.14.2.0.0 Description

Records all payment transactions associated with orders.

### 1.14.3.0.0 Attributes

#### 1.14.3.1.0 paymentId

##### 1.14.3.1.1 Name

paymentId

##### 1.14.3.1.2 Type

🔹 Guid

##### 1.14.3.1.3 Is Required

✅ Yes

##### 1.14.3.1.4 Is Primary Key

✅ Yes

##### 1.14.3.1.5 Is Unique

✅ Yes

##### 1.14.3.1.6 Index Type

UniqueIndex

##### 1.14.3.1.7 Size

0

##### 1.14.3.1.8 Constraints

*No items available*

##### 1.14.3.1.9 Default Value

GENERATE_UUID()

##### 1.14.3.1.10 Is Foreign Key

❌ No

##### 1.14.3.1.11 Precision

0

##### 1.14.3.1.12 Scale

0

#### 1.14.3.2.0 orderId

##### 1.14.3.2.1 Name

orderId

##### 1.14.3.2.2 Type

🔹 Guid

##### 1.14.3.2.3 Is Required

✅ Yes

##### 1.14.3.2.4 Is Primary Key

❌ No

##### 1.14.3.2.5 Is Unique

❌ No

##### 1.14.3.2.6 Index Type

Index

##### 1.14.3.2.7 Size

0

##### 1.14.3.2.8 Constraints

*No items available*

##### 1.14.3.2.9 Default Value



##### 1.14.3.2.10 Is Foreign Key

✅ Yes

##### 1.14.3.2.11 Precision

0

##### 1.14.3.2.12 Scale

0

#### 1.14.3.3.0 amount

##### 1.14.3.3.1 Name

amount

##### 1.14.3.3.2 Type

🔹 DECIMAL

##### 1.14.3.3.3 Is Required

✅ Yes

##### 1.14.3.3.4 Is Primary Key

❌ No

##### 1.14.3.3.5 Is Unique

❌ No

##### 1.14.3.3.6 Index Type

None

##### 1.14.3.3.7 Size

0

##### 1.14.3.3.8 Constraints

*No items available*

##### 1.14.3.3.9 Default Value



##### 1.14.3.3.10 Is Foreign Key

❌ No

##### 1.14.3.3.11 Precision

10

##### 1.14.3.3.12 Scale

2

#### 1.14.3.4.0 status

##### 1.14.3.4.1 Name

status

##### 1.14.3.4.2 Type

🔹 VARCHAR

##### 1.14.3.4.3 Is Required

✅ Yes

##### 1.14.3.4.4 Is Primary Key

❌ No

##### 1.14.3.4.5 Is Unique

❌ No

##### 1.14.3.4.6 Index Type

Index

##### 1.14.3.4.7 Size

20

##### 1.14.3.4.8 Constraints

- ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')

##### 1.14.3.4.9 Default Value



##### 1.14.3.4.10 Is Foreign Key

❌ No

##### 1.14.3.4.11 Precision

0

##### 1.14.3.4.12 Scale

0

#### 1.14.3.5.0 gatewayTransactionId

##### 1.14.3.5.1 Name

gatewayTransactionId

##### 1.14.3.5.2 Type

🔹 VARCHAR

##### 1.14.3.5.3 Is Required

✅ Yes

##### 1.14.3.5.4 Is Primary Key

❌ No

##### 1.14.3.5.5 Is Unique

✅ Yes

##### 1.14.3.5.6 Index Type

UniqueIndex

##### 1.14.3.5.7 Size

255

##### 1.14.3.5.8 Constraints

*No items available*

##### 1.14.3.5.9 Default Value



##### 1.14.3.5.10 Is Foreign Key

❌ No

##### 1.14.3.5.11 Precision

0

##### 1.14.3.5.12 Scale

0

#### 1.14.3.6.0 gatewayResponse

##### 1.14.3.6.1 Name

gatewayResponse

##### 1.14.3.6.2 Type

🔹 JSONB

##### 1.14.3.6.3 Is Required

❌ No

##### 1.14.3.6.4 Is Primary Key

❌ No

##### 1.14.3.6.5 Is Unique

❌ No

##### 1.14.3.6.6 Index Type

None

##### 1.14.3.6.7 Size

0

##### 1.14.3.6.8 Constraints

*No items available*

##### 1.14.3.6.9 Default Value

{}

##### 1.14.3.6.10 Is Foreign Key

❌ No

##### 1.14.3.6.11 Precision

0

##### 1.14.3.6.12 Scale

0

#### 1.14.3.7.0 createdAt

##### 1.14.3.7.1 Name

createdAt

##### 1.14.3.7.2 Type

🔹 DateTimeOffset

##### 1.14.3.7.3 Is Required

✅ Yes

##### 1.14.3.7.4 Is Primary Key

❌ No

##### 1.14.3.7.5 Is Unique

❌ No

##### 1.14.3.7.6 Index Type

Index

##### 1.14.3.7.7 Size

0

##### 1.14.3.7.8 Constraints

*No items available*

##### 1.14.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.14.3.7.10 Is Foreign Key

❌ No

##### 1.14.3.7.11 Precision

0

##### 1.14.3.7.12 Scale

0

#### 1.14.3.8.0 updatedAt

##### 1.14.3.8.1 Name

updatedAt

##### 1.14.3.8.2 Type

🔹 DateTimeOffset

##### 1.14.3.8.3 Is Required

✅ Yes

##### 1.14.3.8.4 Is Primary Key

❌ No

##### 1.14.3.8.5 Is Unique

❌ No

##### 1.14.3.8.6 Index Type

None

##### 1.14.3.8.7 Size

0

##### 1.14.3.8.8 Constraints

*No items available*

##### 1.14.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.14.3.8.10 Is Foreign Key

❌ No

##### 1.14.3.8.11 Precision

0

##### 1.14.3.8.12 Scale

0

### 1.14.4.0.0 Primary Keys

- paymentId

### 1.14.5.0.0 Unique Constraints

- {'name': 'UC_Payment_GatewayTransactionId', 'columns': ['gatewayTransactionId']}

### 1.14.6.0.0 Indexes

- {'name': 'IX_Payment_OrderId', 'columns': ['orderId'], 'type': 'BTree'}

## 1.15.0.0.0 DeliveryTask

### 1.15.1.0.0 Name

DeliveryTask

### 1.15.2.0.0 Description

Represents the logistics task of delivering an order, assigned to a rider.

### 1.15.3.0.0 Attributes

#### 1.15.3.1.0 deliveryTaskId

##### 1.15.3.1.1 Name

deliveryTaskId

##### 1.15.3.1.2 Type

🔹 Guid

##### 1.15.3.1.3 Is Required

✅ Yes

##### 1.15.3.1.4 Is Primary Key

✅ Yes

##### 1.15.3.1.5 Is Unique

✅ Yes

##### 1.15.3.1.6 Index Type

UniqueIndex

##### 1.15.3.1.7 Size

0

##### 1.15.3.1.8 Constraints

*No items available*

##### 1.15.3.1.9 Default Value

GENERATE_UUID()

##### 1.15.3.1.10 Is Foreign Key

❌ No

##### 1.15.3.1.11 Precision

0

##### 1.15.3.1.12 Scale

0

#### 1.15.3.2.0 orderId

##### 1.15.3.2.1 Name

orderId

##### 1.15.3.2.2 Type

🔹 Guid

##### 1.15.3.2.3 Is Required

✅ Yes

##### 1.15.3.2.4 Is Primary Key

❌ No

##### 1.15.3.2.5 Is Unique

✅ Yes

##### 1.15.3.2.6 Index Type

UniqueIndex

##### 1.15.3.2.7 Size

0

##### 1.15.3.2.8 Constraints

*No items available*

##### 1.15.3.2.9 Default Value



##### 1.15.3.2.10 Is Foreign Key

✅ Yes

##### 1.15.3.2.11 Precision

0

##### 1.15.3.2.12 Scale

0

#### 1.15.3.3.0 riderId

##### 1.15.3.3.1 Name

riderId

##### 1.15.3.3.2 Type

🔹 Guid

##### 1.15.3.3.3 Is Required

❌ No

##### 1.15.3.3.4 Is Primary Key

❌ No

##### 1.15.3.3.5 Is Unique

❌ No

##### 1.15.3.3.6 Index Type

Index

##### 1.15.3.3.7 Size

0

##### 1.15.3.3.8 Constraints

*No items available*

##### 1.15.3.3.9 Default Value



##### 1.15.3.3.10 Is Foreign Key

✅ Yes

##### 1.15.3.3.11 Precision

0

##### 1.15.3.3.12 Scale

0

#### 1.15.3.4.0 status

##### 1.15.3.4.1 Name

status

##### 1.15.3.4.2 Type

🔹 VARCHAR

##### 1.15.3.4.3 Is Required

✅ Yes

##### 1.15.3.4.4 Is Primary Key

❌ No

##### 1.15.3.4.5 Is Unique

❌ No

##### 1.15.3.4.6 Index Type

Index

##### 1.15.3.4.7 Size

30

##### 1.15.3.4.8 Constraints

- ENUM('PENDING_ALLOCATION', 'OFFERED', 'ACCEPTED', 'AT_STORE', 'PICKED_UP', 'AT_DESTINATION', 'DELIVERED', 'FAILED')

##### 1.15.3.4.9 Default Value

PENDING_ALLOCATION

##### 1.15.3.4.10 Is Foreign Key

❌ No

##### 1.15.3.4.11 Precision

0

##### 1.15.3.4.12 Scale

0

#### 1.15.3.5.0 earnings

##### 1.15.3.5.1 Name

earnings

##### 1.15.3.5.2 Type

🔹 DECIMAL

##### 1.15.3.5.3 Is Required

✅ Yes

##### 1.15.3.5.4 Is Primary Key

❌ No

##### 1.15.3.5.5 Is Unique

❌ No

##### 1.15.3.5.6 Index Type

None

##### 1.15.3.5.7 Size

0

##### 1.15.3.5.8 Constraints

*No items available*

##### 1.15.3.5.9 Default Value

0.00

##### 1.15.3.5.10 Is Foreign Key

❌ No

##### 1.15.3.5.11 Precision

10

##### 1.15.3.5.12 Scale

2

#### 1.15.3.6.0 tip

##### 1.15.3.6.1 Name

tip

##### 1.15.3.6.2 Type

🔹 DECIMAL

##### 1.15.3.6.3 Is Required

✅ Yes

##### 1.15.3.6.4 Is Primary Key

❌ No

##### 1.15.3.6.5 Is Unique

❌ No

##### 1.15.3.6.6 Index Type

None

##### 1.15.3.6.7 Size

0

##### 1.15.3.6.8 Constraints

*No items available*

##### 1.15.3.6.9 Default Value

0.00

##### 1.15.3.6.10 Is Foreign Key

❌ No

##### 1.15.3.6.11 Precision

10

##### 1.15.3.6.12 Scale

2

#### 1.15.3.7.0 pickedUpAt

##### 1.15.3.7.1 Name

pickedUpAt

##### 1.15.3.7.2 Type

🔹 DateTimeOffset

##### 1.15.3.7.3 Is Required

❌ No

##### 1.15.3.7.4 Is Primary Key

❌ No

##### 1.15.3.7.5 Is Unique

❌ No

##### 1.15.3.7.6 Index Type

None

##### 1.15.3.7.7 Size

0

##### 1.15.3.7.8 Constraints

*No items available*

##### 1.15.3.7.9 Default Value



##### 1.15.3.7.10 Is Foreign Key

❌ No

##### 1.15.3.7.11 Precision

0

##### 1.15.3.7.12 Scale

0

#### 1.15.3.8.0 deliveredAt

##### 1.15.3.8.1 Name

deliveredAt

##### 1.15.3.8.2 Type

🔹 DateTimeOffset

##### 1.15.3.8.3 Is Required

❌ No

##### 1.15.3.8.4 Is Primary Key

❌ No

##### 1.15.3.8.5 Is Unique

❌ No

##### 1.15.3.8.6 Index Type

None

##### 1.15.3.8.7 Size

0

##### 1.15.3.8.8 Constraints

*No items available*

##### 1.15.3.8.9 Default Value



##### 1.15.3.8.10 Is Foreign Key

❌ No

##### 1.15.3.8.11 Precision

0

##### 1.15.3.8.12 Scale

0

#### 1.15.3.9.0 createdAt

##### 1.15.3.9.1 Name

createdAt

##### 1.15.3.9.2 Type

🔹 DateTimeOffset

##### 1.15.3.9.3 Is Required

✅ Yes

##### 1.15.3.9.4 Is Primary Key

❌ No

##### 1.15.3.9.5 Is Unique

❌ No

##### 1.15.3.9.6 Index Type

Index

##### 1.15.3.9.7 Size

0

##### 1.15.3.9.8 Constraints

*No items available*

##### 1.15.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.15.3.9.10 Is Foreign Key

❌ No

##### 1.15.3.9.11 Precision

0

##### 1.15.3.9.12 Scale

0

#### 1.15.3.10.0 updatedAt

##### 1.15.3.10.1 Name

updatedAt

##### 1.15.3.10.2 Type

🔹 DateTimeOffset

##### 1.15.3.10.3 Is Required

✅ Yes

##### 1.15.3.10.4 Is Primary Key

❌ No

##### 1.15.3.10.5 Is Unique

❌ No

##### 1.15.3.10.6 Index Type

None

##### 1.15.3.10.7 Size

0

##### 1.15.3.10.8 Constraints

*No items available*

##### 1.15.3.10.9 Default Value

CURRENT_TIMESTAMP

##### 1.15.3.10.10 Is Foreign Key

❌ No

##### 1.15.3.10.11 Precision

0

##### 1.15.3.10.12 Scale

0

### 1.15.4.0.0 Primary Keys

- deliveryTaskId

### 1.15.5.0.0 Unique Constraints

- {'name': 'UC_DeliveryTask_OrderId', 'columns': ['orderId']}

### 1.15.6.0.0 Indexes

#### 1.15.6.1.0 IX_DeliveryTask_RiderId_Status

##### 1.15.6.1.1 Name

IX_DeliveryTask_RiderId_Status

##### 1.15.6.1.2 Columns

- riderId
- status

##### 1.15.6.1.3 Type

🔹 BTree

#### 1.15.6.2.0 IX_DeliveryTask_Status_CreatedAt

##### 1.15.6.2.1 Name

IX_DeliveryTask_Status_CreatedAt

##### 1.15.6.2.2 Columns

- status
- createdAt

##### 1.15.6.2.3 Type

🔹 BTree

## 1.16.0.0.0 ProofOfDelivery

### 1.16.1.0.0 Name

ProofOfDelivery

### 1.16.2.0.0 Description

Stores evidence of a completed delivery, such as a photo or OTP.

### 1.16.3.0.0 Attributes

#### 1.16.3.1.0 podId

##### 1.16.3.1.1 Name

podId

##### 1.16.3.1.2 Type

🔹 Guid

##### 1.16.3.1.3 Is Required

✅ Yes

##### 1.16.3.1.4 Is Primary Key

✅ Yes

##### 1.16.3.1.5 Is Unique

✅ Yes

##### 1.16.3.1.6 Index Type

UniqueIndex

##### 1.16.3.1.7 Size

0

##### 1.16.3.1.8 Constraints

*No items available*

##### 1.16.3.1.9 Default Value

GENERATE_UUID()

##### 1.16.3.1.10 Is Foreign Key

❌ No

##### 1.16.3.1.11 Precision

0

##### 1.16.3.1.12 Scale

0

#### 1.16.3.2.0 deliveryTaskId

##### 1.16.3.2.1 Name

deliveryTaskId

##### 1.16.3.2.2 Type

🔹 Guid

##### 1.16.3.2.3 Is Required

✅ Yes

##### 1.16.3.2.4 Is Primary Key

❌ No

##### 1.16.3.2.5 Is Unique

✅ Yes

##### 1.16.3.2.6 Index Type

UniqueIndex

##### 1.16.3.2.7 Size

0

##### 1.16.3.2.8 Constraints

*No items available*

##### 1.16.3.2.9 Default Value



##### 1.16.3.2.10 Is Foreign Key

✅ Yes

##### 1.16.3.2.11 Precision

0

##### 1.16.3.2.12 Scale

0

#### 1.16.3.3.0 podType

##### 1.16.3.3.1 Name

podType

##### 1.16.3.3.2 Type

🔹 VARCHAR

##### 1.16.3.3.3 Is Required

✅ Yes

##### 1.16.3.3.4 Is Primary Key

❌ No

##### 1.16.3.3.5 Is Unique

❌ No

##### 1.16.3.3.6 Index Type

Index

##### 1.16.3.3.7 Size

10

##### 1.16.3.3.8 Constraints

- ENUM('PHOTO', 'OTP')

##### 1.16.3.3.9 Default Value



##### 1.16.3.3.10 Is Foreign Key

❌ No

##### 1.16.3.3.11 Precision

0

##### 1.16.3.3.12 Scale

0

#### 1.16.3.4.0 podData

##### 1.16.3.4.1 Name

podData

##### 1.16.3.4.2 Type

🔹 VARCHAR

##### 1.16.3.4.3 Is Required

✅ Yes

##### 1.16.3.4.4 Is Primary Key

❌ No

##### 1.16.3.4.5 Is Unique

❌ No

##### 1.16.3.4.6 Index Type

None

##### 1.16.3.4.7 Size

2,048

##### 1.16.3.4.8 Constraints

*No items available*

##### 1.16.3.4.9 Default Value



##### 1.16.3.4.10 Is Foreign Key

❌ No

##### 1.16.3.4.11 Precision

0

##### 1.16.3.4.12 Scale

0

#### 1.16.3.5.0 latitude

##### 1.16.3.5.1 Name

latitude

##### 1.16.3.5.2 Type

🔹 DECIMAL

##### 1.16.3.5.3 Is Required

✅ Yes

##### 1.16.3.5.4 Is Primary Key

❌ No

##### 1.16.3.5.5 Is Unique

❌ No

##### 1.16.3.5.6 Index Type

None

##### 1.16.3.5.7 Size

0

##### 1.16.3.5.8 Constraints

*No items available*

##### 1.16.3.5.9 Default Value



##### 1.16.3.5.10 Is Foreign Key

❌ No

##### 1.16.3.5.11 Precision

9

##### 1.16.3.5.12 Scale

6

#### 1.16.3.6.0 longitude

##### 1.16.3.6.1 Name

longitude

##### 1.16.3.6.2 Type

🔹 DECIMAL

##### 1.16.3.6.3 Is Required

✅ Yes

##### 1.16.3.6.4 Is Primary Key

❌ No

##### 1.16.3.6.5 Is Unique

❌ No

##### 1.16.3.6.6 Index Type

None

##### 1.16.3.6.7 Size

0

##### 1.16.3.6.8 Constraints

*No items available*

##### 1.16.3.6.9 Default Value



##### 1.16.3.6.10 Is Foreign Key

❌ No

##### 1.16.3.6.11 Precision

9

##### 1.16.3.6.12 Scale

6

#### 1.16.3.7.0 createdAt

##### 1.16.3.7.1 Name

createdAt

##### 1.16.3.7.2 Type

🔹 DateTimeOffset

##### 1.16.3.7.3 Is Required

✅ Yes

##### 1.16.3.7.4 Is Primary Key

❌ No

##### 1.16.3.7.5 Is Unique

❌ No

##### 1.16.3.7.6 Index Type

Index

##### 1.16.3.7.7 Size

0

##### 1.16.3.7.8 Constraints

*No items available*

##### 1.16.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.16.3.7.10 Is Foreign Key

❌ No

##### 1.16.3.7.11 Precision

0

##### 1.16.3.7.12 Scale

0

### 1.16.4.0.0 Primary Keys

- podId

### 1.16.5.0.0 Unique Constraints

- {'name': 'UC_ProofOfDelivery_DeliveryTaskId', 'columns': ['deliveryTaskId']}

### 1.16.6.0.0 Indexes

*No items available*

## 1.17.0.0.0 RiderLocationHistory

### 1.17.1.0.0 Name

RiderLocationHistory

### 1.17.2.0.0 Description

Stores a time-series of a rider's GPS location for live tracking.

### 1.17.3.0.0 Partitioning

| Property | Value |
|----------|-------|
| Type | RANGE |
| Column | timestamp |
| Strategy | MONTHLY |

### 1.17.4.0.0 Caching Strategy

| Property | Value |
|----------|-------|
| Type | Distributed |
| Tool | Redis GEO |
| Key | rider_last_location:{riderId} |
| Purpose | Live location tracking for online riders to accele... |

### 1.17.5.0.0 Attributes

#### 1.17.5.1.0 locationId

##### 1.17.5.1.1 Name

locationId

##### 1.17.5.1.2 Type

🔹 BIGSERIAL

##### 1.17.5.1.3 Is Required

✅ Yes

##### 1.17.5.1.4 Is Primary Key

✅ Yes

##### 1.17.5.1.5 Is Unique

✅ Yes

##### 1.17.5.1.6 Index Type

UniqueIndex

##### 1.17.5.1.7 Size

0

##### 1.17.5.1.8 Constraints

*No items available*

##### 1.17.5.1.9 Default Value



##### 1.17.5.1.10 Is Foreign Key

❌ No

##### 1.17.5.1.11 Precision

0

##### 1.17.5.1.12 Scale

0

#### 1.17.5.2.0 riderId

##### 1.17.5.2.1 Name

riderId

##### 1.17.5.2.2 Type

🔹 Guid

##### 1.17.5.2.3 Is Required

✅ Yes

##### 1.17.5.2.4 Is Primary Key

❌ No

##### 1.17.5.2.5 Is Unique

❌ No

##### 1.17.5.2.6 Index Type

Index

##### 1.17.5.2.7 Size

0

##### 1.17.5.2.8 Constraints

*No items available*

##### 1.17.5.2.9 Default Value



##### 1.17.5.2.10 Is Foreign Key

✅ Yes

##### 1.17.5.2.11 Precision

0

##### 1.17.5.2.12 Scale

0

#### 1.17.5.3.0 latitude

##### 1.17.5.3.1 Name

latitude

##### 1.17.5.3.2 Type

🔹 DECIMAL

##### 1.17.5.3.3 Is Required

✅ Yes

##### 1.17.5.3.4 Is Primary Key

❌ No

##### 1.17.5.3.5 Is Unique

❌ No

##### 1.17.5.3.6 Index Type

None

##### 1.17.5.3.7 Size

0

##### 1.17.5.3.8 Constraints

*No items available*

##### 1.17.5.3.9 Default Value



##### 1.17.5.3.10 Is Foreign Key

❌ No

##### 1.17.5.3.11 Precision

9

##### 1.17.5.3.12 Scale

6

#### 1.17.5.4.0 longitude

##### 1.17.5.4.1 Name

longitude

##### 1.17.5.4.2 Type

🔹 DECIMAL

##### 1.17.5.4.3 Is Required

✅ Yes

##### 1.17.5.4.4 Is Primary Key

❌ No

##### 1.17.5.4.5 Is Unique

❌ No

##### 1.17.5.4.6 Index Type

None

##### 1.17.5.4.7 Size

0

##### 1.17.5.4.8 Constraints

*No items available*

##### 1.17.5.4.9 Default Value



##### 1.17.5.4.10 Is Foreign Key

❌ No

##### 1.17.5.4.11 Precision

9

##### 1.17.5.4.12 Scale

6

#### 1.17.5.5.0 accuracy

##### 1.17.5.5.1 Name

accuracy

##### 1.17.5.5.2 Type

🔹 FLOAT

##### 1.17.5.5.3 Is Required

❌ No

##### 1.17.5.5.4 Is Primary Key

❌ No

##### 1.17.5.5.5 Is Unique

❌ No

##### 1.17.5.5.6 Index Type

None

##### 1.17.5.5.7 Size

0

##### 1.17.5.5.8 Constraints

*No items available*

##### 1.17.5.5.9 Default Value



##### 1.17.5.5.10 Is Foreign Key

❌ No

##### 1.17.5.5.11 Precision

0

##### 1.17.5.5.12 Scale

0

#### 1.17.5.6.0 timestamp

##### 1.17.5.6.1 Name

timestamp

##### 1.17.5.6.2 Type

🔹 DateTimeOffset

##### 1.17.5.6.3 Is Required

✅ Yes

##### 1.17.5.6.4 Is Primary Key

❌ No

##### 1.17.5.6.5 Is Unique

❌ No

##### 1.17.5.6.6 Index Type

Index

##### 1.17.5.6.7 Size

0

##### 1.17.5.6.8 Constraints

*No items available*

##### 1.17.5.6.9 Default Value



##### 1.17.5.6.10 Is Foreign Key

❌ No

##### 1.17.5.6.11 Precision

0

##### 1.17.5.6.12 Scale

0

### 1.17.6.0.0 Primary Keys

- locationId

### 1.17.7.0.0 Unique Constraints

*No items available*

### 1.17.8.0.0 Indexes

- {'name': 'IX_RiderLocationHistory_Rider_Timestamp', 'columns': ['riderId', 'timestamp'], 'type': 'BTree'}

## 1.18.0.0.0 RatingReview

### 1.18.1.0.0 Name

RatingReview

### 1.18.2.0.0 Description

Stores customer feedback for vendors and riders.

### 1.18.3.0.0 Attributes

#### 1.18.3.1.0 ratingReviewId

##### 1.18.3.1.1 Name

ratingReviewId

##### 1.18.3.1.2 Type

🔹 Guid

##### 1.18.3.1.3 Is Required

✅ Yes

##### 1.18.3.1.4 Is Primary Key

✅ Yes

##### 1.18.3.1.5 Is Unique

✅ Yes

##### 1.18.3.1.6 Index Type

UniqueIndex

##### 1.18.3.1.7 Size

0

##### 1.18.3.1.8 Constraints

*No items available*

##### 1.18.3.1.9 Default Value

GENERATE_UUID()

##### 1.18.3.1.10 Is Foreign Key

❌ No

##### 1.18.3.1.11 Precision

0

##### 1.18.3.1.12 Scale

0

#### 1.18.3.2.0 orderId

##### 1.18.3.2.1 Name

orderId

##### 1.18.3.2.2 Type

🔹 Guid

##### 1.18.3.2.3 Is Required

✅ Yes

##### 1.18.3.2.4 Is Primary Key

❌ No

##### 1.18.3.2.5 Is Unique

❌ No

##### 1.18.3.2.6 Index Type

Index

##### 1.18.3.2.7 Size

0

##### 1.18.3.2.8 Constraints

*No items available*

##### 1.18.3.2.9 Default Value



##### 1.18.3.2.10 Is Foreign Key

✅ Yes

##### 1.18.3.2.11 Precision

0

##### 1.18.3.2.12 Scale

0

#### 1.18.3.3.0 reviewerId

##### 1.18.3.3.1 Name

reviewerId

##### 1.18.3.3.2 Type

🔹 Guid

##### 1.18.3.3.3 Is Required

✅ Yes

##### 1.18.3.3.4 Is Primary Key

❌ No

##### 1.18.3.3.5 Is Unique

❌ No

##### 1.18.3.3.6 Index Type

Index

##### 1.18.3.3.7 Size

0

##### 1.18.3.3.8 Constraints

*No items available*

##### 1.18.3.3.9 Default Value



##### 1.18.3.3.10 Is Foreign Key

✅ Yes

##### 1.18.3.3.11 Precision

0

##### 1.18.3.3.12 Scale

0

#### 1.18.3.4.0 revieweeId

##### 1.18.3.4.1 Name

revieweeId

##### 1.18.3.4.2 Type

🔹 Guid

##### 1.18.3.4.3 Is Required

✅ Yes

##### 1.18.3.4.4 Is Primary Key

❌ No

##### 1.18.3.4.5 Is Unique

❌ No

##### 1.18.3.4.6 Index Type

Index

##### 1.18.3.4.7 Size

0

##### 1.18.3.4.8 Constraints

*No items available*

##### 1.18.3.4.9 Default Value



##### 1.18.3.4.10 Is Foreign Key

✅ Yes

##### 1.18.3.4.11 Precision

0

##### 1.18.3.4.12 Scale

0

#### 1.18.3.5.0 revieweeType

##### 1.18.3.5.1 Name

revieweeType

##### 1.18.3.5.2 Type

🔹 VARCHAR

##### 1.18.3.5.3 Is Required

✅ Yes

##### 1.18.3.5.4 Is Primary Key

❌ No

##### 1.18.3.5.5 Is Unique

❌ No

##### 1.18.3.5.6 Index Type

Index

##### 1.18.3.5.7 Size

10

##### 1.18.3.5.8 Constraints

- ENUM('VENDOR', 'RIDER')

##### 1.18.3.5.9 Default Value



##### 1.18.3.5.10 Is Foreign Key

❌ No

##### 1.18.3.5.11 Precision

0

##### 1.18.3.5.12 Scale

0

#### 1.18.3.6.0 rating

##### 1.18.3.6.1 Name

rating

##### 1.18.3.6.2 Type

🔹 INT

##### 1.18.3.6.3 Is Required

✅ Yes

##### 1.18.3.6.4 Is Primary Key

❌ No

##### 1.18.3.6.5 Is Unique

❌ No

##### 1.18.3.6.6 Index Type

None

##### 1.18.3.6.7 Size

0

##### 1.18.3.6.8 Constraints

- RANGE(1, 5)

##### 1.18.3.6.9 Default Value



##### 1.18.3.6.10 Is Foreign Key

❌ No

##### 1.18.3.6.11 Precision

0

##### 1.18.3.6.12 Scale

0

#### 1.18.3.7.0 reviewText

##### 1.18.3.7.1 Name

reviewText

##### 1.18.3.7.2 Type

🔹 TEXT

##### 1.18.3.7.3 Is Required

❌ No

##### 1.18.3.7.4 Is Primary Key

❌ No

##### 1.18.3.7.5 Is Unique

❌ No

##### 1.18.3.7.6 Index Type

FullText

##### 1.18.3.7.7 Size

0

##### 1.18.3.7.8 Constraints

*No items available*

##### 1.18.3.7.9 Default Value



##### 1.18.3.7.10 Is Foreign Key

❌ No

##### 1.18.3.7.11 Precision

0

##### 1.18.3.7.12 Scale

0

#### 1.18.3.8.0 createdAt

##### 1.18.3.8.1 Name

createdAt

##### 1.18.3.8.2 Type

🔹 DateTimeOffset

##### 1.18.3.8.3 Is Required

✅ Yes

##### 1.18.3.8.4 Is Primary Key

❌ No

##### 1.18.3.8.5 Is Unique

❌ No

##### 1.18.3.8.6 Index Type

Index

##### 1.18.3.8.7 Size

0

##### 1.18.3.8.8 Constraints

*No items available*

##### 1.18.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.18.3.8.10 Is Foreign Key

❌ No

##### 1.18.3.8.11 Precision

0

##### 1.18.3.8.12 Scale

0

### 1.18.4.0.0 Primary Keys

- ratingReviewId

### 1.18.5.0.0 Unique Constraints

- {'name': 'UC_RatingReview_Order_Reviewee', 'columns': ['orderId', 'revieweeId']}

### 1.18.6.0.0 Indexes

- {'name': 'IX_RatingReview_Reviewee', 'columns': ['revieweeId', 'revieweeType'], 'type': 'BTree'}

## 1.19.0.0.0 ChatMessage

### 1.19.1.0.0 Name

ChatMessage

### 1.19.2.0.0 Description

Stores messages for the in-app chat related to an active order.

### 1.19.3.0.0 Partitioning

| Property | Value |
|----------|-------|
| Type | RANGE |
| Column | createdAt |
| Strategy | MONTHLY |

### 1.19.4.0.0 Attributes

#### 1.19.4.1.0 chatMessageId

##### 1.19.4.1.1 Name

chatMessageId

##### 1.19.4.1.2 Type

🔹 Guid

##### 1.19.4.1.3 Is Required

✅ Yes

##### 1.19.4.1.4 Is Primary Key

✅ Yes

##### 1.19.4.1.5 Is Unique

✅ Yes

##### 1.19.4.1.6 Index Type

UniqueIndex

##### 1.19.4.1.7 Size

0

##### 1.19.4.1.8 Constraints

*No items available*

##### 1.19.4.1.9 Default Value

GENERATE_UUID()

##### 1.19.4.1.10 Is Foreign Key

❌ No

##### 1.19.4.1.11 Precision

0

##### 1.19.4.1.12 Scale

0

#### 1.19.4.2.0 orderId

##### 1.19.4.2.1 Name

orderId

##### 1.19.4.2.2 Type

🔹 Guid

##### 1.19.4.2.3 Is Required

✅ Yes

##### 1.19.4.2.4 Is Primary Key

❌ No

##### 1.19.4.2.5 Is Unique

❌ No

##### 1.19.4.2.6 Index Type

Index

##### 1.19.4.2.7 Size

0

##### 1.19.4.2.8 Constraints

*No items available*

##### 1.19.4.2.9 Default Value



##### 1.19.4.2.10 Is Foreign Key

✅ Yes

##### 1.19.4.2.11 Precision

0

##### 1.19.4.2.12 Scale

0

#### 1.19.4.3.0 senderId

##### 1.19.4.3.1 Name

senderId

##### 1.19.4.3.2 Type

🔹 Guid

##### 1.19.4.3.3 Is Required

✅ Yes

##### 1.19.4.3.4 Is Primary Key

❌ No

##### 1.19.4.3.5 Is Unique

❌ No

##### 1.19.4.3.6 Index Type

Index

##### 1.19.4.3.7 Size

0

##### 1.19.4.3.8 Constraints

*No items available*

##### 1.19.4.3.9 Default Value



##### 1.19.4.3.10 Is Foreign Key

✅ Yes

##### 1.19.4.3.11 Precision

0

##### 1.19.4.3.12 Scale

0

#### 1.19.4.4.0 messageText

##### 1.19.4.4.1 Name

messageText

##### 1.19.4.4.2 Type

🔹 TEXT

##### 1.19.4.4.3 Is Required

✅ Yes

##### 1.19.4.4.4 Is Primary Key

❌ No

##### 1.19.4.4.5 Is Unique

❌ No

##### 1.19.4.4.6 Index Type

None

##### 1.19.4.4.7 Size

0

##### 1.19.4.4.8 Constraints

*No items available*

##### 1.19.4.4.9 Default Value



##### 1.19.4.4.10 Is Foreign Key

❌ No

##### 1.19.4.4.11 Precision

0

##### 1.19.4.4.12 Scale

0

#### 1.19.4.5.0 isDeleted

##### 1.19.4.5.1 Name

isDeleted

##### 1.19.4.5.2 Type

🔹 BOOLEAN

##### 1.19.4.5.3 Is Required

✅ Yes

##### 1.19.4.5.4 Is Primary Key

❌ No

##### 1.19.4.5.5 Is Unique

❌ No

##### 1.19.4.5.6 Index Type

Index

##### 1.19.4.5.7 Size

0

##### 1.19.4.5.8 Constraints

*No items available*

##### 1.19.4.5.9 Default Value

false

##### 1.19.4.5.10 Is Foreign Key

❌ No

##### 1.19.4.5.11 Precision

0

##### 1.19.4.5.12 Scale

0

#### 1.19.4.6.0 createdAt

##### 1.19.4.6.1 Name

createdAt

##### 1.19.4.6.2 Type

🔹 DateTimeOffset

##### 1.19.4.6.3 Is Required

✅ Yes

##### 1.19.4.6.4 Is Primary Key

❌ No

##### 1.19.4.6.5 Is Unique

❌ No

##### 1.19.4.6.6 Index Type

Index

##### 1.19.4.6.7 Size

0

##### 1.19.4.6.8 Constraints

*No items available*

##### 1.19.4.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.19.4.6.10 Is Foreign Key

❌ No

##### 1.19.4.6.11 Precision

0

##### 1.19.4.6.12 Scale

0

### 1.19.5.0.0 Primary Keys

- chatMessageId

### 1.19.6.0.0 Unique Constraints

*No items available*

### 1.19.7.0.0 Indexes

- {'name': 'IX_ChatMessage_Order_CreatedAt', 'columns': ['orderId', 'createdAt'], 'type': 'BTree'}

## 1.20.0.0.0 SupportTicket

### 1.20.1.0.0 Name

SupportTicket

### 1.20.2.0.0 Description

Represents a support request created by any user.

### 1.20.3.0.0 Attributes

#### 1.20.3.1.0 supportTicketId

##### 1.20.3.1.1 Name

supportTicketId

##### 1.20.3.1.2 Type

🔹 Guid

##### 1.20.3.1.3 Is Required

✅ Yes

##### 1.20.3.1.4 Is Primary Key

✅ Yes

##### 1.20.3.1.5 Is Unique

✅ Yes

##### 1.20.3.1.6 Index Type

UniqueIndex

##### 1.20.3.1.7 Size

0

##### 1.20.3.1.8 Constraints

*No items available*

##### 1.20.3.1.9 Default Value

GENERATE_UUID()

##### 1.20.3.1.10 Is Foreign Key

❌ No

##### 1.20.3.1.11 Precision

0

##### 1.20.3.1.12 Scale

0

#### 1.20.3.2.0 userId

##### 1.20.3.2.1 Name

userId

##### 1.20.3.2.2 Type

🔹 Guid

##### 1.20.3.2.3 Is Required

✅ Yes

##### 1.20.3.2.4 Is Primary Key

❌ No

##### 1.20.3.2.5 Is Unique

❌ No

##### 1.20.3.2.6 Index Type

Index

##### 1.20.3.2.7 Size

0

##### 1.20.3.2.8 Constraints

*No items available*

##### 1.20.3.2.9 Default Value



##### 1.20.3.2.10 Is Foreign Key

✅ Yes

##### 1.20.3.2.11 Precision

0

##### 1.20.3.2.12 Scale

0

#### 1.20.3.3.0 subject

##### 1.20.3.3.1 Name

subject

##### 1.20.3.3.2 Type

🔹 VARCHAR

##### 1.20.3.3.3 Is Required

✅ Yes

##### 1.20.3.3.4 Is Primary Key

❌ No

##### 1.20.3.3.5 Is Unique

❌ No

##### 1.20.3.3.6 Index Type

None

##### 1.20.3.3.7 Size

255

##### 1.20.3.3.8 Constraints

*No items available*

##### 1.20.3.3.9 Default Value



##### 1.20.3.3.10 Is Foreign Key

❌ No

##### 1.20.3.3.11 Precision

0

##### 1.20.3.3.12 Scale

0

#### 1.20.3.4.0 description

##### 1.20.3.4.1 Name

description

##### 1.20.3.4.2 Type

🔹 TEXT

##### 1.20.3.4.3 Is Required

✅ Yes

##### 1.20.3.4.4 Is Primary Key

❌ No

##### 1.20.3.4.5 Is Unique

❌ No

##### 1.20.3.4.6 Index Type

None

##### 1.20.3.4.7 Size

0

##### 1.20.3.4.8 Constraints

*No items available*

##### 1.20.3.4.9 Default Value



##### 1.20.3.4.10 Is Foreign Key

❌ No

##### 1.20.3.4.11 Precision

0

##### 1.20.3.4.12 Scale

0

#### 1.20.3.5.0 status

##### 1.20.3.5.1 Name

status

##### 1.20.3.5.2 Type

🔹 VARCHAR

##### 1.20.3.5.3 Is Required

✅ Yes

##### 1.20.3.5.4 Is Primary Key

❌ No

##### 1.20.3.5.5 Is Unique

❌ No

##### 1.20.3.5.6 Index Type

Index

##### 1.20.3.5.7 Size

20

##### 1.20.3.5.8 Constraints

- ENUM('OPEN', 'IN_PROGRESS', 'CLOSED')

##### 1.20.3.5.9 Default Value

OPEN

##### 1.20.3.5.10 Is Foreign Key

❌ No

##### 1.20.3.5.11 Precision

0

##### 1.20.3.5.12 Scale

0

#### 1.20.3.6.0 assignedAdminId

##### 1.20.3.6.1 Name

assignedAdminId

##### 1.20.3.6.2 Type

🔹 Guid

##### 1.20.3.6.3 Is Required

❌ No

##### 1.20.3.6.4 Is Primary Key

❌ No

##### 1.20.3.6.5 Is Unique

❌ No

##### 1.20.3.6.6 Index Type

Index

##### 1.20.3.6.7 Size

0

##### 1.20.3.6.8 Constraints

*No items available*

##### 1.20.3.6.9 Default Value



##### 1.20.3.6.10 Is Foreign Key

✅ Yes

##### 1.20.3.6.11 Precision

0

##### 1.20.3.6.12 Scale

0

#### 1.20.3.7.0 createdAt

##### 1.20.3.7.1 Name

createdAt

##### 1.20.3.7.2 Type

🔹 DateTimeOffset

##### 1.20.3.7.3 Is Required

✅ Yes

##### 1.20.3.7.4 Is Primary Key

❌ No

##### 1.20.3.7.5 Is Unique

❌ No

##### 1.20.3.7.6 Index Type

Index

##### 1.20.3.7.7 Size

0

##### 1.20.3.7.8 Constraints

*No items available*

##### 1.20.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.20.3.7.10 Is Foreign Key

❌ No

##### 1.20.3.7.11 Precision

0

##### 1.20.3.7.12 Scale

0

#### 1.20.3.8.0 updatedAt

##### 1.20.3.8.1 Name

updatedAt

##### 1.20.3.8.2 Type

🔹 DateTimeOffset

##### 1.20.3.8.3 Is Required

✅ Yes

##### 1.20.3.8.4 Is Primary Key

❌ No

##### 1.20.3.8.5 Is Unique

❌ No

##### 1.20.3.8.6 Index Type

None

##### 1.20.3.8.7 Size

0

##### 1.20.3.8.8 Constraints

*No items available*

##### 1.20.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.20.3.8.10 Is Foreign Key

❌ No

##### 1.20.3.8.11 Precision

0

##### 1.20.3.8.12 Scale

0

### 1.20.4.0.0 Primary Keys

- supportTicketId

### 1.20.5.0.0 Unique Constraints

*No items available*

### 1.20.6.0.0 Indexes

- {'name': 'IX_SupportTicket_Status_AssignedAdmin', 'columns': ['status', 'assignedAdminId'], 'type': 'BTree'}

## 1.21.0.0.0 AuditLog

### 1.21.1.0.0 Name

AuditLog

### 1.21.2.0.0 Description

An immutable log of all critical actions performed by administrators.

### 1.21.3.0.0 Partitioning

| Property | Value |
|----------|-------|
| Type | RANGE |
| Column | createdAt |
| Strategy | MONTHLY |

### 1.21.4.0.0 Attributes

#### 1.21.4.1.0 auditLogId

##### 1.21.4.1.1 Name

auditLogId

##### 1.21.4.1.2 Type

🔹 BIGSERIAL

##### 1.21.4.1.3 Is Required

✅ Yes

##### 1.21.4.1.4 Is Primary Key

✅ Yes

##### 1.21.4.1.5 Is Unique

✅ Yes

##### 1.21.4.1.6 Index Type

UniqueIndex

##### 1.21.4.1.7 Size

0

##### 1.21.4.1.8 Constraints

*No items available*

##### 1.21.4.1.9 Default Value



##### 1.21.4.1.10 Is Foreign Key

❌ No

##### 1.21.4.1.11 Precision

0

##### 1.21.4.1.12 Scale

0

#### 1.21.4.2.0 adminId

##### 1.21.4.2.1 Name

adminId

##### 1.21.4.2.2 Type

🔹 Guid

##### 1.21.4.2.3 Is Required

✅ Yes

##### 1.21.4.2.4 Is Primary Key

❌ No

##### 1.21.4.2.5 Is Unique

❌ No

##### 1.21.4.2.6 Index Type

Index

##### 1.21.4.2.7 Size

0

##### 1.21.4.2.8 Constraints

*No items available*

##### 1.21.4.2.9 Default Value



##### 1.21.4.2.10 Is Foreign Key

✅ Yes

##### 1.21.4.2.11 Precision

0

##### 1.21.4.2.12 Scale

0

#### 1.21.4.3.0 action

##### 1.21.4.3.1 Name

action

##### 1.21.4.3.2 Type

🔹 VARCHAR

##### 1.21.4.3.3 Is Required

✅ Yes

##### 1.21.4.3.4 Is Primary Key

❌ No

##### 1.21.4.3.5 Is Unique

❌ No

##### 1.21.4.3.6 Index Type

Index

##### 1.21.4.3.7 Size

100

##### 1.21.4.3.8 Constraints

*No items available*

##### 1.21.4.3.9 Default Value



##### 1.21.4.3.10 Is Foreign Key

❌ No

##### 1.21.4.3.11 Precision

0

##### 1.21.4.3.12 Scale

0

#### 1.21.4.4.0 targetEntity

##### 1.21.4.4.1 Name

targetEntity

##### 1.21.4.4.2 Type

🔹 VARCHAR

##### 1.21.4.4.3 Is Required

❌ No

##### 1.21.4.4.4 Is Primary Key

❌ No

##### 1.21.4.4.5 Is Unique

❌ No

##### 1.21.4.4.6 Index Type

Index

##### 1.21.4.4.7 Size

100

##### 1.21.4.4.8 Constraints

*No items available*

##### 1.21.4.4.9 Default Value



##### 1.21.4.4.10 Is Foreign Key

❌ No

##### 1.21.4.4.11 Precision

0

##### 1.21.4.4.12 Scale

0

#### 1.21.4.5.0 targetEntityId

##### 1.21.4.5.1 Name

targetEntityId

##### 1.21.4.5.2 Type

🔹 VARCHAR

##### 1.21.4.5.3 Is Required

❌ No

##### 1.21.4.5.4 Is Primary Key

❌ No

##### 1.21.4.5.5 Is Unique

❌ No

##### 1.21.4.5.6 Index Type

Index

##### 1.21.4.5.7 Size

255

##### 1.21.4.5.8 Constraints

*No items available*

##### 1.21.4.5.9 Default Value



##### 1.21.4.5.10 Is Foreign Key

❌ No

##### 1.21.4.5.11 Precision

0

##### 1.21.4.5.12 Scale

0

#### 1.21.4.6.0 changedData

##### 1.21.4.6.1 Name

changedData

##### 1.21.4.6.2 Type

🔹 JSONB

##### 1.21.4.6.3 Is Required

❌ No

##### 1.21.4.6.4 Is Primary Key

❌ No

##### 1.21.4.6.5 Is Unique

❌ No

##### 1.21.4.6.6 Index Type

None

##### 1.21.4.6.7 Size

0

##### 1.21.4.6.8 Constraints

*No items available*

##### 1.21.4.6.9 Default Value

{}

##### 1.21.4.6.10 Is Foreign Key

❌ No

##### 1.21.4.6.11 Precision

0

##### 1.21.4.6.12 Scale

0

#### 1.21.4.7.0 createdAt

##### 1.21.4.7.1 Name

createdAt

##### 1.21.4.7.2 Type

🔹 DateTimeOffset

##### 1.21.4.7.3 Is Required

✅ Yes

##### 1.21.4.7.4 Is Primary Key

❌ No

##### 1.21.4.7.5 Is Unique

❌ No

##### 1.21.4.7.6 Index Type

Index

##### 1.21.4.7.7 Size

0

##### 1.21.4.7.8 Constraints

*No items available*

##### 1.21.4.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.21.4.7.10 Is Foreign Key

❌ No

##### 1.21.4.7.11 Precision

0

##### 1.21.4.7.12 Scale

0

### 1.21.5.0.0 Primary Keys

- auditLogId

### 1.21.6.0.0 Unique Constraints

*No items available*

### 1.21.7.0.0 Indexes

- {'name': 'IX_AuditLog_Target', 'columns': ['targetEntity', 'targetEntityId'], 'type': 'BTree'}

## 1.22.0.0.0 FinancialTransaction

### 1.22.1.0.0 Name

FinancialTransaction

### 1.22.2.0.0 Description

An immutable double-entry ledger for all monetary movements in the system.

### 1.22.3.0.0 Attributes

#### 1.22.3.1.0 financialTransactionId

##### 1.22.3.1.1 Name

financialTransactionId

##### 1.22.3.1.2 Type

🔹 Guid

##### 1.22.3.1.3 Is Required

✅ Yes

##### 1.22.3.1.4 Is Primary Key

✅ Yes

##### 1.22.3.1.5 Is Unique

✅ Yes

##### 1.22.3.1.6 Index Type

UniqueIndex

##### 1.22.3.1.7 Size

0

##### 1.22.3.1.8 Constraints

*No items available*

##### 1.22.3.1.9 Default Value

GENERATE_UUID()

##### 1.22.3.1.10 Is Foreign Key

❌ No

##### 1.22.3.1.11 Precision

0

##### 1.22.3.1.12 Scale

0

#### 1.22.3.2.0 orderId

##### 1.22.3.2.1 Name

orderId

##### 1.22.3.2.2 Type

🔹 Guid

##### 1.22.3.2.3 Is Required

❌ No

##### 1.22.3.2.4 Is Primary Key

❌ No

##### 1.22.3.2.5 Is Unique

❌ No

##### 1.22.3.2.6 Index Type

Index

##### 1.22.3.2.7 Size

0

##### 1.22.3.2.8 Constraints

*No items available*

##### 1.22.3.2.9 Default Value



##### 1.22.3.2.10 Is Foreign Key

✅ Yes

##### 1.22.3.2.11 Precision

0

##### 1.22.3.2.12 Scale

0

#### 1.22.3.3.0 payoutId

##### 1.22.3.3.1 Name

payoutId

##### 1.22.3.3.2 Type

🔹 Guid

##### 1.22.3.3.3 Is Required

❌ No

##### 1.22.3.3.4 Is Primary Key

❌ No

##### 1.22.3.3.5 Is Unique

❌ No

##### 1.22.3.3.6 Index Type

Index

##### 1.22.3.3.7 Size

0

##### 1.22.3.3.8 Constraints

*No items available*

##### 1.22.3.3.9 Default Value



##### 1.22.3.3.10 Is Foreign Key

✅ Yes

##### 1.22.3.3.11 Precision

0

##### 1.22.3.3.12 Scale

0

#### 1.22.3.4.0 debitAccount

##### 1.22.3.4.1 Name

debitAccount

##### 1.22.3.4.2 Type

🔹 VARCHAR

##### 1.22.3.4.3 Is Required

✅ Yes

##### 1.22.3.4.4 Is Primary Key

❌ No

##### 1.22.3.4.5 Is Unique

❌ No

##### 1.22.3.4.6 Index Type

Index

##### 1.22.3.4.7 Size

100

##### 1.22.3.4.8 Constraints

*No items available*

##### 1.22.3.4.9 Default Value



##### 1.22.3.4.10 Is Foreign Key

❌ No

##### 1.22.3.4.11 Precision

0

##### 1.22.3.4.12 Scale

0

#### 1.22.3.5.0 creditAccount

##### 1.22.3.5.1 Name

creditAccount

##### 1.22.3.5.2 Type

🔹 VARCHAR

##### 1.22.3.5.3 Is Required

✅ Yes

##### 1.22.3.5.4 Is Primary Key

❌ No

##### 1.22.3.5.5 Is Unique

❌ No

##### 1.22.3.5.6 Index Type

Index

##### 1.22.3.5.7 Size

100

##### 1.22.3.5.8 Constraints

*No items available*

##### 1.22.3.5.9 Default Value



##### 1.22.3.5.10 Is Foreign Key

❌ No

##### 1.22.3.5.11 Precision

0

##### 1.22.3.5.12 Scale

0

#### 1.22.3.6.0 amount

##### 1.22.3.6.1 Name

amount

##### 1.22.3.6.2 Type

🔹 DECIMAL

##### 1.22.3.6.3 Is Required

✅ Yes

##### 1.22.3.6.4 Is Primary Key

❌ No

##### 1.22.3.6.5 Is Unique

❌ No

##### 1.22.3.6.6 Index Type

None

##### 1.22.3.6.7 Size

0

##### 1.22.3.6.8 Constraints

*No items available*

##### 1.22.3.6.9 Default Value



##### 1.22.3.6.10 Is Foreign Key

❌ No

##### 1.22.3.6.11 Precision

10

##### 1.22.3.6.12 Scale

2

#### 1.22.3.7.0 description

##### 1.22.3.7.1 Name

description

##### 1.22.3.7.2 Type

🔹 TEXT

##### 1.22.3.7.3 Is Required

❌ No

##### 1.22.3.7.4 Is Primary Key

❌ No

##### 1.22.3.7.5 Is Unique

❌ No

##### 1.22.3.7.6 Index Type

None

##### 1.22.3.7.7 Size

0

##### 1.22.3.7.8 Constraints

*No items available*

##### 1.22.3.7.9 Default Value



##### 1.22.3.7.10 Is Foreign Key

❌ No

##### 1.22.3.7.11 Precision

0

##### 1.22.3.7.12 Scale

0

#### 1.22.3.8.0 transactionType

##### 1.22.3.8.1 Name

transactionType

##### 1.22.3.8.2 Type

🔹 VARCHAR

##### 1.22.3.8.3 Is Required

✅ Yes

##### 1.22.3.8.4 Is Primary Key

❌ No

##### 1.22.3.8.5 Is Unique

❌ No

##### 1.22.3.8.6 Index Type

Index

##### 1.22.3.8.7 Size

20

##### 1.22.3.8.8 Constraints

- ENUM('SALE', 'COMMISSION', 'PAYOUT', 'REFUND', 'CANCELLATION_FEE')

##### 1.22.3.8.9 Default Value



##### 1.22.3.8.10 Is Foreign Key

❌ No

##### 1.22.3.8.11 Precision

0

##### 1.22.3.8.12 Scale

0

#### 1.22.3.9.0 createdAt

##### 1.22.3.9.1 Name

createdAt

##### 1.22.3.9.2 Type

🔹 DateTimeOffset

##### 1.22.3.9.3 Is Required

✅ Yes

##### 1.22.3.9.4 Is Primary Key

❌ No

##### 1.22.3.9.5 Is Unique

❌ No

##### 1.22.3.9.6 Index Type

Index

##### 1.22.3.9.7 Size

0

##### 1.22.3.9.8 Constraints

*No items available*

##### 1.22.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.22.3.9.10 Is Foreign Key

❌ No

##### 1.22.3.9.11 Precision

0

##### 1.22.3.9.12 Scale

0

### 1.22.4.0.0 Primary Keys

- financialTransactionId

### 1.22.5.0.0 Unique Constraints

*No items available*

### 1.22.6.0.0 Indexes

#### 1.22.6.1.0 IX_FinancialTransaction_DebitAccount_Date

##### 1.22.6.1.1 Name

IX_FinancialTransaction_DebitAccount_Date

##### 1.22.6.1.2 Columns

- debitAccount
- createdAt

##### 1.22.6.1.3 Type

🔹 BTree

#### 1.22.6.2.0 IX_FinancialTransaction_CreditAccount_Date

##### 1.22.6.2.1 Name

IX_FinancialTransaction_CreditAccount_Date

##### 1.22.6.2.2 Columns

- creditAccount
- createdAt

##### 1.22.6.2.3 Type

🔹 BTree

### 1.22.7.0.0 Materialized Views

#### 1.22.7.1.0 daily_vendor_sales

##### 1.22.7.1.1 Name

daily_vendor_sales

##### 1.22.7.1.2 Refresh

Daily

##### 1.22.7.1.3 Purpose

Aggregates daily sales per vendor to speed up reporting.

#### 1.22.7.2.0 daily_rider_earnings

##### 1.22.7.2.1 Name

daily_rider_earnings

##### 1.22.7.2.2 Refresh

Daily

##### 1.22.7.2.3 Purpose

Aggregates daily earnings per rider for faster dashboard loading.

## 1.23.0.0.0 Payout

### 1.23.1.0.0 Name

Payout

### 1.23.2.0.0 Description

Represents a settlement of funds to a vendor or rider.

### 1.23.3.0.0 Attributes

#### 1.23.3.1.0 payoutId

##### 1.23.3.1.1 Name

payoutId

##### 1.23.3.1.2 Type

🔹 Guid

##### 1.23.3.1.3 Is Required

✅ Yes

##### 1.23.3.1.4 Is Primary Key

✅ Yes

##### 1.23.3.1.5 Is Unique

✅ Yes

##### 1.23.3.1.6 Index Type

UniqueIndex

##### 1.23.3.1.7 Size

0

##### 1.23.3.1.8 Constraints

*No items available*

##### 1.23.3.1.9 Default Value

GENERATE_UUID()

##### 1.23.3.1.10 Is Foreign Key

❌ No

##### 1.23.3.1.11 Precision

0

##### 1.23.3.1.12 Scale

0

#### 1.23.3.2.0 userId

##### 1.23.3.2.1 Name

userId

##### 1.23.3.2.2 Type

🔹 Guid

##### 1.23.3.2.3 Is Required

✅ Yes

##### 1.23.3.2.4 Is Primary Key

❌ No

##### 1.23.3.2.5 Is Unique

❌ No

##### 1.23.3.2.6 Index Type

Index

##### 1.23.3.2.7 Size

0

##### 1.23.3.2.8 Constraints

*No items available*

##### 1.23.3.2.9 Default Value



##### 1.23.3.2.10 Is Foreign Key

✅ Yes

##### 1.23.3.2.11 Precision

0

##### 1.23.3.2.12 Scale

0

#### 1.23.3.3.0 amount

##### 1.23.3.3.1 Name

amount

##### 1.23.3.3.2 Type

🔹 DECIMAL

##### 1.23.3.3.3 Is Required

✅ Yes

##### 1.23.3.3.4 Is Primary Key

❌ No

##### 1.23.3.3.5 Is Unique

❌ No

##### 1.23.3.3.6 Index Type

None

##### 1.23.3.3.7 Size

0

##### 1.23.3.3.8 Constraints

*No items available*

##### 1.23.3.3.9 Default Value



##### 1.23.3.3.10 Is Foreign Key

❌ No

##### 1.23.3.3.11 Precision

10

##### 1.23.3.3.12 Scale

2

#### 1.23.3.4.0 periodStartDate

##### 1.23.3.4.1 Name

periodStartDate

##### 1.23.3.4.2 Type

🔹 DATE

##### 1.23.3.4.3 Is Required

✅ Yes

##### 1.23.3.4.4 Is Primary Key

❌ No

##### 1.23.3.4.5 Is Unique

❌ No

##### 1.23.3.4.6 Index Type

Index

##### 1.23.3.4.7 Size

0

##### 1.23.3.4.8 Constraints

*No items available*

##### 1.23.3.4.9 Default Value



##### 1.23.3.4.10 Is Foreign Key

❌ No

##### 1.23.3.4.11 Precision

0

##### 1.23.3.4.12 Scale

0

#### 1.23.3.5.0 periodEndDate

##### 1.23.3.5.1 Name

periodEndDate

##### 1.23.3.5.2 Type

🔹 DATE

##### 1.23.3.5.3 Is Required

✅ Yes

##### 1.23.3.5.4 Is Primary Key

❌ No

##### 1.23.3.5.5 Is Unique

❌ No

##### 1.23.3.5.6 Index Type

Index

##### 1.23.3.5.7 Size

0

##### 1.23.3.5.8 Constraints

*No items available*

##### 1.23.3.5.9 Default Value



##### 1.23.3.5.10 Is Foreign Key

❌ No

##### 1.23.3.5.11 Precision

0

##### 1.23.3.5.12 Scale

0

#### 1.23.3.6.0 status

##### 1.23.3.6.1 Name

status

##### 1.23.3.6.2 Type

🔹 VARCHAR

##### 1.23.3.6.3 Is Required

✅ Yes

##### 1.23.3.6.4 Is Primary Key

❌ No

##### 1.23.3.6.5 Is Unique

❌ No

##### 1.23.3.6.6 Index Type

Index

##### 1.23.3.6.7 Size

20

##### 1.23.3.6.8 Constraints

- ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')

##### 1.23.3.6.9 Default Value

PENDING

##### 1.23.3.6.10 Is Foreign Key

❌ No

##### 1.23.3.6.11 Precision

0

##### 1.23.3.6.12 Scale

0

#### 1.23.3.7.0 payoutGatewayTransactionId

##### 1.23.3.7.1 Name

payoutGatewayTransactionId

##### 1.23.3.7.2 Type

🔹 VARCHAR

##### 1.23.3.7.3 Is Required

❌ No

##### 1.23.3.7.4 Is Primary Key

❌ No

##### 1.23.3.7.5 Is Unique

✅ Yes

##### 1.23.3.7.6 Index Type

UniqueIndex

##### 1.23.3.7.7 Size

255

##### 1.23.3.7.8 Constraints

*No items available*

##### 1.23.3.7.9 Default Value



##### 1.23.3.7.10 Is Foreign Key

❌ No

##### 1.23.3.7.11 Precision

0

##### 1.23.3.7.12 Scale

0

#### 1.23.3.8.0 createdAt

##### 1.23.3.8.1 Name

createdAt

##### 1.23.3.8.2 Type

🔹 DateTimeOffset

##### 1.23.3.8.3 Is Required

✅ Yes

##### 1.23.3.8.4 Is Primary Key

❌ No

##### 1.23.3.8.5 Is Unique

❌ No

##### 1.23.3.8.6 Index Type

Index

##### 1.23.3.8.7 Size

0

##### 1.23.3.8.8 Constraints

*No items available*

##### 1.23.3.8.9 Default Value

CURRENT_TIMESTAMP

##### 1.23.3.8.10 Is Foreign Key

❌ No

##### 1.23.3.8.11 Precision

0

##### 1.23.3.8.12 Scale

0

#### 1.23.3.9.0 updatedAt

##### 1.23.3.9.1 Name

updatedAt

##### 1.23.3.9.2 Type

🔹 DateTimeOffset

##### 1.23.3.9.3 Is Required

✅ Yes

##### 1.23.3.9.4 Is Primary Key

❌ No

##### 1.23.3.9.5 Is Unique

❌ No

##### 1.23.3.9.6 Index Type

None

##### 1.23.3.9.7 Size

0

##### 1.23.3.9.8 Constraints

*No items available*

##### 1.23.3.9.9 Default Value

CURRENT_TIMESTAMP

##### 1.23.3.9.10 Is Foreign Key

❌ No

##### 1.23.3.9.11 Precision

0

##### 1.23.3.9.12 Scale

0

### 1.23.4.0.0 Primary Keys

- payoutId

### 1.23.5.0.0 Unique Constraints

- {'name': 'UC_Payout_GatewayTransactionId', 'columns': ['payoutGatewayTransactionId']}

### 1.23.6.0.0 Indexes

- {'name': 'IX_Payout_User_Period', 'columns': ['userId', 'periodStartDate', 'periodEndDate'], 'type': 'BTree'}

## 1.24.0.0.0 UserConsent

### 1.24.1.0.0 Name

UserConsent

### 1.24.2.0.0 Description

Tracks user consent for data processing activities as per DPDP Act.

### 1.24.3.0.0 Attributes

#### 1.24.3.1.0 userConsentId

##### 1.24.3.1.1 Name

userConsentId

##### 1.24.3.1.2 Type

🔹 Guid

##### 1.24.3.1.3 Is Required

✅ Yes

##### 1.24.3.1.4 Is Primary Key

✅ Yes

##### 1.24.3.1.5 Is Unique

✅ Yes

##### 1.24.3.1.6 Index Type

UniqueIndex

##### 1.24.3.1.7 Size

0

##### 1.24.3.1.8 Constraints

*No items available*

##### 1.24.3.1.9 Default Value

GENERATE_UUID()

##### 1.24.3.1.10 Is Foreign Key

❌ No

##### 1.24.3.1.11 Precision

0

##### 1.24.3.1.12 Scale

0

#### 1.24.3.2.0 userId

##### 1.24.3.2.1 Name

userId

##### 1.24.3.2.2 Type

🔹 Guid

##### 1.24.3.2.3 Is Required

✅ Yes

##### 1.24.3.2.4 Is Primary Key

❌ No

##### 1.24.3.2.5 Is Unique

❌ No

##### 1.24.3.2.6 Index Type

Index

##### 1.24.3.2.7 Size

0

##### 1.24.3.2.8 Constraints

*No items available*

##### 1.24.3.2.9 Default Value



##### 1.24.3.2.10 Is Foreign Key

✅ Yes

##### 1.24.3.2.11 Precision

0

##### 1.24.3.2.12 Scale

0

#### 1.24.3.3.0 consentType

##### 1.24.3.3.1 Name

consentType

##### 1.24.3.3.2 Type

🔹 VARCHAR

##### 1.24.3.3.3 Is Required

✅ Yes

##### 1.24.3.3.4 Is Primary Key

❌ No

##### 1.24.3.3.5 Is Unique

❌ No

##### 1.24.3.3.6 Index Type

Index

##### 1.24.3.3.7 Size

100

##### 1.24.3.3.8 Constraints

*No items available*

##### 1.24.3.3.9 Default Value



##### 1.24.3.3.10 Is Foreign Key

❌ No

##### 1.24.3.3.11 Precision

0

##### 1.24.3.3.12 Scale

0

#### 1.24.3.4.0 isGranted

##### 1.24.3.4.1 Name

isGranted

##### 1.24.3.4.2 Type

🔹 BOOLEAN

##### 1.24.3.4.3 Is Required

✅ Yes

##### 1.24.3.4.4 Is Primary Key

❌ No

##### 1.24.3.4.5 Is Unique

❌ No

##### 1.24.3.4.6 Index Type

None

##### 1.24.3.4.7 Size

0

##### 1.24.3.4.8 Constraints

*No items available*

##### 1.24.3.4.9 Default Value



##### 1.24.3.4.10 Is Foreign Key

❌ No

##### 1.24.3.4.11 Precision

0

##### 1.24.3.4.12 Scale

0

#### 1.24.3.5.0 version

##### 1.24.3.5.1 Name

version

##### 1.24.3.5.2 Type

🔹 VARCHAR

##### 1.24.3.5.3 Is Required

✅ Yes

##### 1.24.3.5.4 Is Primary Key

❌ No

##### 1.24.3.5.5 Is Unique

❌ No

##### 1.24.3.5.6 Index Type

Index

##### 1.24.3.5.7 Size

20

##### 1.24.3.5.8 Constraints

*No items available*

##### 1.24.3.5.9 Default Value



##### 1.24.3.5.10 Is Foreign Key

❌ No

##### 1.24.3.5.11 Precision

0

##### 1.24.3.5.12 Scale

0

#### 1.24.3.6.0 createdAt

##### 1.24.3.6.1 Name

createdAt

##### 1.24.3.6.2 Type

🔹 DateTimeOffset

##### 1.24.3.6.3 Is Required

✅ Yes

##### 1.24.3.6.4 Is Primary Key

❌ No

##### 1.24.3.6.5 Is Unique

❌ No

##### 1.24.3.6.6 Index Type

None

##### 1.24.3.6.7 Size

0

##### 1.24.3.6.8 Constraints

*No items available*

##### 1.24.3.6.9 Default Value

CURRENT_TIMESTAMP

##### 1.24.3.6.10 Is Foreign Key

❌ No

##### 1.24.3.6.11 Precision

0

##### 1.24.3.6.12 Scale

0

#### 1.24.3.7.0 updatedAt

##### 1.24.3.7.1 Name

updatedAt

##### 1.24.3.7.2 Type

🔹 DateTimeOffset

##### 1.24.3.7.3 Is Required

✅ Yes

##### 1.24.3.7.4 Is Primary Key

❌ No

##### 1.24.3.7.5 Is Unique

❌ No

##### 1.24.3.7.6 Index Type

None

##### 1.24.3.7.7 Size

0

##### 1.24.3.7.8 Constraints

*No items available*

##### 1.24.3.7.9 Default Value

CURRENT_TIMESTAMP

##### 1.24.3.7.10 Is Foreign Key

❌ No

##### 1.24.3.7.11 Precision

0

##### 1.24.3.7.12 Scale

0

### 1.24.4.0.0 Primary Keys

- userConsentId

### 1.24.5.0.0 Unique Constraints

- {'name': 'UC_UserConsent_User_Type_Version', 'columns': ['userId', 'consentType', 'version']}

### 1.24.6.0.0 Indexes

*No items available*

## 1.25.0.0.0 SystemConfiguration

### 1.25.1.0.0 Name

SystemConfiguration

### 1.25.2.0.0 Description

A key-value store for system-wide, admin-configurable settings.

### 1.25.3.0.0 Caching Strategy

| Property | Value |
|----------|-------|
| Type | In-Memory |
| Invalidation | Event-based (e.g., message bus) on update |
| Purpose | Provide near-instant access to frequently read, ra... |

### 1.25.4.0.0 Attributes

#### 1.25.4.1.0 configKey

##### 1.25.4.1.1 Name

configKey

##### 1.25.4.1.2 Type

🔹 VARCHAR

##### 1.25.4.1.3 Is Required

✅ Yes

##### 1.25.4.1.4 Is Primary Key

✅ Yes

##### 1.25.4.1.5 Is Unique

✅ Yes

##### 1.25.4.1.6 Index Type

UniqueIndex

##### 1.25.4.1.7 Size

100

##### 1.25.4.1.8 Constraints

*No items available*

##### 1.25.4.1.9 Default Value



##### 1.25.4.1.10 Is Foreign Key

❌ No

##### 1.25.4.1.11 Precision

0

##### 1.25.4.1.12 Scale

0

#### 1.25.4.2.0 configValue

##### 1.25.4.2.1 Name

configValue

##### 1.25.4.2.2 Type

🔹 TEXT

##### 1.25.4.2.3 Is Required

✅ Yes

##### 1.25.4.2.4 Is Primary Key

❌ No

##### 1.25.4.2.5 Is Unique

❌ No

##### 1.25.4.2.6 Index Type

None

##### 1.25.4.2.7 Size

0

##### 1.25.4.2.8 Constraints

*No items available*

##### 1.25.4.2.9 Default Value



##### 1.25.4.2.10 Is Foreign Key

❌ No

##### 1.25.4.2.11 Precision

0

##### 1.25.4.2.12 Scale

0

#### 1.25.4.3.0 description

##### 1.25.4.3.1 Name

description

##### 1.25.4.3.2 Type

🔹 TEXT

##### 1.25.4.3.3 Is Required

❌ No

##### 1.25.4.3.4 Is Primary Key

❌ No

##### 1.25.4.3.5 Is Unique

❌ No

##### 1.25.4.3.6 Index Type

None

##### 1.25.4.3.7 Size

0

##### 1.25.4.3.8 Constraints

*No items available*

##### 1.25.4.3.9 Default Value



##### 1.25.4.3.10 Is Foreign Key

❌ No

##### 1.25.4.3.11 Precision

0

##### 1.25.4.3.12 Scale

0

#### 1.25.4.4.0 updatedAt

##### 1.25.4.4.1 Name

updatedAt

##### 1.25.4.4.2 Type

🔹 DateTimeOffset

##### 1.25.4.4.3 Is Required

✅ Yes

##### 1.25.4.4.4 Is Primary Key

❌ No

##### 1.25.4.4.5 Is Unique

❌ No

##### 1.25.4.4.6 Index Type

None

##### 1.25.4.4.7 Size

0

##### 1.25.4.4.8 Constraints

*No items available*

##### 1.25.4.4.9 Default Value

CURRENT_TIMESTAMP

##### 1.25.4.4.10 Is Foreign Key

❌ No

##### 1.25.4.4.11 Precision

0

##### 1.25.4.4.12 Scale

0

#### 1.25.4.5.0 updatedBy

##### 1.25.4.5.1 Name

updatedBy

##### 1.25.4.5.2 Type

🔹 Guid

##### 1.25.4.5.3 Is Required

✅ Yes

##### 1.25.4.5.4 Is Primary Key

❌ No

##### 1.25.4.5.5 Is Unique

❌ No

##### 1.25.4.5.6 Index Type

Index

##### 1.25.4.5.7 Size

0

##### 1.25.4.5.8 Constraints

*No items available*

##### 1.25.4.5.9 Default Value



##### 1.25.4.5.10 Is Foreign Key

✅ Yes

##### 1.25.4.5.11 Precision

0

##### 1.25.4.5.12 Scale

0

### 1.25.5.0.0 Primary Keys

- configKey

### 1.25.6.0.0 Unique Constraints

*No items available*

### 1.25.7.0.0 Indexes

*No items available*

# 2.0.0.0.0 Relations

## 2.1.0.0.0 UserHasCustomerProfile

### 2.1.1.0.0 Name

UserHasCustomerProfile

### 2.1.2.0.0 Id

REL_USER_CUSTPROF_001

### 2.1.3.0.0 Source Entity

User

### 2.1.4.0.0 Target Entity

CustomerProfile

### 2.1.5.0.0 Type

🔹 OneToOne

### 2.1.6.0.0 Source Multiplicity

1

### 2.1.7.0.0 Target Multiplicity

0..1

### 2.1.8.0.0 Cascade Delete

✅ Yes

### 2.1.9.0.0 Is Identifying

✅ Yes

### 2.1.10.0.0 On Delete

Cascade

### 2.1.11.0.0 On Update

Cascade

### 2.1.12.0.0 Join Table

#### 2.1.12.1.0 Name

N/A

#### 2.1.12.2.0 Columns

*No items available*

## 2.2.0.0.0 UserHasVendorProfile

### 2.2.1.0.0 Name

UserHasVendorProfile

### 2.2.2.0.0 Id

REL_USER_VENDPROF_001

### 2.2.3.0.0 Source Entity

User

### 2.2.4.0.0 Target Entity

VendorProfile

### 2.2.5.0.0 Type

🔹 OneToOne

### 2.2.6.0.0 Source Multiplicity

1

### 2.2.7.0.0 Target Multiplicity

0..1

### 2.2.8.0.0 Cascade Delete

✅ Yes

### 2.2.9.0.0 Is Identifying

✅ Yes

### 2.2.10.0.0 On Delete

Cascade

### 2.2.11.0.0 On Update

Cascade

### 2.2.12.0.0 Join Table

#### 2.2.12.1.0 Name

N/A

#### 2.2.12.2.0 Columns

*No items available*

## 2.3.0.0.0 UserHasRiderProfile

### 2.3.1.0.0 Name

UserHasRiderProfile

### 2.3.2.0.0 Id

REL_USER_RIDERPROF_001

### 2.3.3.0.0 Source Entity

User

### 2.3.4.0.0 Target Entity

RiderProfile

### 2.3.5.0.0 Type

🔹 OneToOne

### 2.3.6.0.0 Source Multiplicity

1

### 2.3.7.0.0 Target Multiplicity

0..1

### 2.3.8.0.0 Cascade Delete

✅ Yes

### 2.3.9.0.0 Is Identifying

✅ Yes

### 2.3.10.0.0 On Delete

Cascade

### 2.3.11.0.0 On Update

Cascade

### 2.3.12.0.0 Join Table

#### 2.3.12.1.0 Name

N/A

#### 2.3.12.2.0 Columns

*No items available*

## 2.4.0.0.0 UserHasAddresses

### 2.4.1.0.0 Name

UserHasAddresses

### 2.4.2.0.0 Id

REL_USER_ADDR_001

### 2.4.3.0.0 Source Entity

User

### 2.4.4.0.0 Target Entity

Address

### 2.4.5.0.0 Type

🔹 OneToMany

### 2.4.6.0.0 Source Multiplicity

1

### 2.4.7.0.0 Target Multiplicity

0..*

### 2.4.8.0.0 Cascade Delete

✅ Yes

### 2.4.9.0.0 Is Identifying

❌ No

### 2.4.10.0.0 On Delete

Cascade

### 2.4.11.0.0 On Update

Cascade

### 2.4.12.0.0 Join Table

#### 2.4.12.1.0 Name

N/A

#### 2.4.12.2.0 Columns

*No items available*

## 2.5.0.0.0 VendorProfileHasPrimaryAddress

### 2.5.1.0.0 Name

VendorProfileHasPrimaryAddress

### 2.5.2.0.0 Id

REL_VENDPROF_ADDR_001

### 2.5.3.0.0 Source Entity

VendorProfile

### 2.5.4.0.0 Target Entity

Address

### 2.5.5.0.0 Type

🔹 OneToOne

### 2.5.6.0.0 Source Multiplicity

1

### 2.5.7.0.0 Target Multiplicity

1

### 2.5.8.0.0 Cascade Delete

❌ No

### 2.5.9.0.0 Is Identifying

❌ No

### 2.5.10.0.0 On Delete

Restrict

### 2.5.11.0.0 On Update

Cascade

### 2.5.12.0.0 Join Table

#### 2.5.12.1.0 Name

N/A

#### 2.5.12.2.0 Columns

*No items available*

## 2.6.0.0.0 VendorProfileHasBusinessHours

### 2.6.1.0.0 Name

VendorProfileHasBusinessHours

### 2.6.2.0.0 Id

REL_VENDPROF_BUSHOUR_001

### 2.6.3.0.0 Source Entity

VendorProfile

### 2.6.4.0.0 Target Entity

VendorBusinessHour

### 2.6.5.0.0 Type

🔹 OneToMany

### 2.6.6.0.0 Source Multiplicity

1

### 2.6.7.0.0 Target Multiplicity

0..*

### 2.6.8.0.0 Cascade Delete

✅ Yes

### 2.6.9.0.0 Is Identifying

✅ Yes

### 2.6.10.0.0 On Delete

Cascade

### 2.6.11.0.0 On Update

Cascade

### 2.6.12.0.0 Join Table

#### 2.6.12.1.0 Name

N/A

#### 2.6.12.2.0 Columns

*No items available*

## 2.7.0.0.0 VendorProfileHasLicenses

### 2.7.1.0.0 Name

VendorProfileHasLicenses

### 2.7.2.0.0 Id

REL_VENDPROF_LICENSE_001

### 2.7.3.0.0 Source Entity

VendorProfile

### 2.7.4.0.0 Target Entity

VendorLicense

### 2.7.5.0.0 Type

🔹 OneToMany

### 2.7.6.0.0 Source Multiplicity

1

### 2.7.7.0.0 Target Multiplicity

0..*

### 2.7.8.0.0 Cascade Delete

✅ Yes

### 2.7.9.0.0 Is Identifying

✅ Yes

### 2.7.10.0.0 On Delete

Cascade

### 2.7.11.0.0 On Update

Cascade

### 2.7.12.0.0 Join Table

#### 2.7.12.1.0 Name

N/A

#### 2.7.12.2.0 Columns

*No items available*

## 2.8.0.0.0 VendorProfileHasProductCategories

### 2.8.1.0.0 Name

VendorProfileHasProductCategories

### 2.8.2.0.0 Id

REL_VENDPROF_PRODCAT_001

### 2.8.3.0.0 Source Entity

VendorProfile

### 2.8.4.0.0 Target Entity

ProductCategory

### 2.8.5.0.0 Type

🔹 OneToMany

### 2.8.6.0.0 Source Multiplicity

1

### 2.8.7.0.0 Target Multiplicity

0..*

### 2.8.8.0.0 Cascade Delete

✅ Yes

### 2.8.9.0.0 Is Identifying

✅ Yes

### 2.8.10.0.0 On Delete

Cascade

### 2.8.11.0.0 On Update

Cascade

### 2.8.12.0.0 Join Table

#### 2.8.12.1.0 Name

N/A

#### 2.8.12.2.0 Columns

*No items available*

## 2.9.0.0.0 ProductCategoryContainsProducts

### 2.9.1.0.0 Name

ProductCategoryContainsProducts

### 2.9.2.0.0 Id

REL_PRODCAT_PROD_001

### 2.9.3.0.0 Source Entity

ProductCategory

### 2.9.4.0.0 Target Entity

Product

### 2.9.5.0.0 Type

🔹 OneToMany

### 2.9.6.0.0 Source Multiplicity

1

### 2.9.7.0.0 Target Multiplicity

0..*

### 2.9.8.0.0 Cascade Delete

❌ No

### 2.9.9.0.0 Is Identifying

❌ No

### 2.9.10.0.0 On Delete

SetNull

### 2.9.11.0.0 On Update

Cascade

### 2.9.12.0.0 Join Table

#### 2.9.12.1.0 Name

N/A

#### 2.9.12.2.0 Columns

*No items available*

## 2.10.0.0.0 VendorProfileSellsProducts

### 2.10.1.0.0 Name

VendorProfileSellsProducts

### 2.10.2.0.0 Id

REL_VENDPROF_PROD_001

### 2.10.3.0.0 Source Entity

VendorProfile

### 2.10.4.0.0 Target Entity

Product

### 2.10.5.0.0 Type

🔹 OneToMany

### 2.10.6.0.0 Source Multiplicity

1

### 2.10.7.0.0 Target Multiplicity

0..*

### 2.10.8.0.0 Cascade Delete

✅ Yes

### 2.10.9.0.0 Is Identifying

✅ Yes

### 2.10.10.0.0 On Delete

Cascade

### 2.10.11.0.0 On Update

Cascade

### 2.10.12.0.0 Join Table

#### 2.10.12.1.0 Name

N/A

#### 2.10.12.2.0 Columns

*No items available*

## 2.11.0.0.0 CustomerPlacesOrders

### 2.11.1.0.0 Name

CustomerPlacesOrders

### 2.11.2.0.0 Id

REL_USER_ORDER_CUST_001

### 2.11.3.0.0 Source Entity

User

### 2.11.4.0.0 Target Entity

Order

### 2.11.5.0.0 Type

🔹 OneToMany

### 2.11.6.0.0 Source Multiplicity

1

### 2.11.7.0.0 Target Multiplicity

0..*

### 2.11.8.0.0 Cascade Delete

❌ No

### 2.11.9.0.0 Is Identifying

❌ No

### 2.11.10.0.0 On Delete

SetNull

### 2.11.11.0.0 On Update

Cascade

### 2.11.12.0.0 Join Table

#### 2.11.12.1.0 Name

N/A

#### 2.11.12.2.0 Columns

*No items available*

## 2.12.0.0.0 VendorFulfillsOrders

### 2.12.1.0.0 Name

VendorFulfillsOrders

### 2.12.2.0.0 Id

REL_USER_ORDER_VEND_001

### 2.12.3.0.0 Source Entity

User

### 2.12.4.0.0 Target Entity

Order

### 2.12.5.0.0 Type

🔹 OneToMany

### 2.12.6.0.0 Source Multiplicity

1

### 2.12.7.0.0 Target Multiplicity

0..*

### 2.12.8.0.0 Cascade Delete

❌ No

### 2.12.9.0.0 Is Identifying

❌ No

### 2.12.10.0.0 On Delete

Restrict

### 2.12.11.0.0 On Update

Cascade

### 2.12.12.0.0 Join Table

#### 2.12.12.1.0 Name

N/A

#### 2.12.12.2.0 Columns

*No items available*

## 2.13.0.0.0 OrderDeliversToAddress

### 2.13.1.0.0 Name

OrderDeliversToAddress

### 2.13.2.0.0 Id

REL_ADDR_ORDER_001

### 2.13.3.0.0 Source Entity

Address

### 2.13.4.0.0 Target Entity

Order

### 2.13.5.0.0 Type

🔹 OneToMany

### 2.13.6.0.0 Source Multiplicity

1

### 2.13.7.0.0 Target Multiplicity

0..*

### 2.13.8.0.0 Cascade Delete

❌ No

### 2.13.9.0.0 Is Identifying

❌ No

### 2.13.10.0.0 On Delete

Restrict

### 2.13.11.0.0 On Update

Cascade

### 2.13.12.0.0 Join Table

#### 2.13.12.1.0 Name

N/A

#### 2.13.12.2.0 Columns

*No items available*

## 2.14.0.0.0 OrderContainsOrderItems

### 2.14.1.0.0 Name

OrderContainsOrderItems

### 2.14.2.0.0 Id

REL_ORDER_ORDERITEM_001

### 2.14.3.0.0 Source Entity

Order

### 2.14.4.0.0 Target Entity

OrderItem

### 2.14.5.0.0 Type

🔹 OneToMany

### 2.14.6.0.0 Source Multiplicity

1

### 2.14.7.0.0 Target Multiplicity

1..*

### 2.14.8.0.0 Cascade Delete

✅ Yes

### 2.14.9.0.0 Is Identifying

✅ Yes

### 2.14.10.0.0 On Delete

Cascade

### 2.14.11.0.0 On Update

Cascade

### 2.14.12.0.0 Join Table

#### 2.14.12.1.0 Name

N/A

#### 2.14.12.2.0 Columns

*No items available*

## 2.15.0.0.0 ProductIsInOrderItems

### 2.15.1.0.0 Name

ProductIsInOrderItems

### 2.15.2.0.0 Id

REL_PROD_ORDERITEM_001

### 2.15.3.0.0 Source Entity

Product

### 2.15.4.0.0 Target Entity

OrderItem

### 2.15.5.0.0 Type

🔹 OneToMany

### 2.15.6.0.0 Source Multiplicity

1

### 2.15.7.0.0 Target Multiplicity

0..*

### 2.15.8.0.0 Cascade Delete

❌ No

### 2.15.9.0.0 Is Identifying

❌ No

### 2.15.10.0.0 On Delete

Restrict

### 2.15.11.0.0 On Update

Cascade

### 2.15.12.0.0 Join Table

#### 2.15.12.1.0 Name

N/A

#### 2.15.12.2.0 Columns

*No items available*

## 2.16.0.0.0 OrderHasStatusHistory

### 2.16.1.0.0 Name

OrderHasStatusHistory

### 2.16.2.0.0 Id

REL_ORDER_STATUSHIST_001

### 2.16.3.0.0 Source Entity

Order

### 2.16.4.0.0 Target Entity

OrderStatusHistory

### 2.16.5.0.0 Type

🔹 OneToMany

### 2.16.6.0.0 Source Multiplicity

1

### 2.16.7.0.0 Target Multiplicity

1..*

### 2.16.8.0.0 Cascade Delete

✅ Yes

### 2.16.9.0.0 Is Identifying

✅ Yes

### 2.16.10.0.0 On Delete

Cascade

### 2.16.11.0.0 On Update

Cascade

### 2.16.12.0.0 Join Table

#### 2.16.12.1.0 Name

N/A

#### 2.16.12.2.0 Columns

*No items available*

## 2.17.0.0.0 OrderHasPayments

### 2.17.1.0.0 Name

OrderHasPayments

### 2.17.2.0.0 Id

REL_ORDER_PAYMENT_001

### 2.17.3.0.0 Source Entity

Order

### 2.17.4.0.0 Target Entity

Payment

### 2.17.5.0.0 Type

🔹 OneToMany

### 2.17.6.0.0 Source Multiplicity

1

### 2.17.7.0.0 Target Multiplicity

0..*

### 2.17.8.0.0 Cascade Delete

✅ Yes

### 2.17.9.0.0 Is Identifying

✅ Yes

### 2.17.10.0.0 On Delete

Cascade

### 2.17.11.0.0 On Update

Cascade

### 2.17.12.0.0 Join Table

#### 2.17.12.1.0 Name

N/A

#### 2.17.12.2.0 Columns

*No items available*

## 2.18.0.0.0 OrderHasDeliveryTask

### 2.18.1.0.0 Name

OrderHasDeliveryTask

### 2.18.2.0.0 Id

REL_ORDER_DELIVERYTASK_001

### 2.18.3.0.0 Source Entity

Order

### 2.18.4.0.0 Target Entity

DeliveryTask

### 2.18.5.0.0 Type

🔹 OneToOne

### 2.18.6.0.0 Source Multiplicity

1

### 2.18.7.0.0 Target Multiplicity

1

### 2.18.8.0.0 Cascade Delete

✅ Yes

### 2.18.9.0.0 Is Identifying

✅ Yes

### 2.18.10.0.0 On Delete

Cascade

### 2.18.11.0.0 On Update

Cascade

### 2.18.12.0.0 Join Table

#### 2.18.12.1.0 Name

N/A

#### 2.18.12.2.0 Columns

*No items available*

## 2.19.0.0.0 RiderPerformsDeliveryTasks

### 2.19.1.0.0 Name

RiderPerformsDeliveryTasks

### 2.19.2.0.0 Id

REL_USER_DELIVERYTASK_001

### 2.19.3.0.0 Source Entity

User

### 2.19.4.0.0 Target Entity

DeliveryTask

### 2.19.5.0.0 Type

🔹 OneToMany

### 2.19.6.0.0 Source Multiplicity

1

### 2.19.7.0.0 Target Multiplicity

0..*

### 2.19.8.0.0 Cascade Delete

❌ No

### 2.19.9.0.0 Is Identifying

❌ No

### 2.19.10.0.0 On Delete

SetNull

### 2.19.11.0.0 On Update

Cascade

### 2.19.12.0.0 Join Table

#### 2.19.12.1.0 Name

N/A

#### 2.19.12.2.0 Columns

*No items available*

## 2.20.0.0.0 DeliveryTaskHasProof

### 2.20.1.0.0 Name

DeliveryTaskHasProof

### 2.20.2.0.0 Id

REL_DELIVERYTASK_POD_001

### 2.20.3.0.0 Source Entity

DeliveryTask

### 2.20.4.0.0 Target Entity

ProofOfDelivery

### 2.20.5.0.0 Type

🔹 OneToOne

### 2.20.6.0.0 Source Multiplicity

1

### 2.20.7.0.0 Target Multiplicity

0..1

### 2.20.8.0.0 Cascade Delete

✅ Yes

### 2.20.9.0.0 Is Identifying

✅ Yes

### 2.20.10.0.0 On Delete

Cascade

### 2.20.11.0.0 On Update

Cascade

### 2.20.12.0.0 Join Table

#### 2.20.12.1.0 Name

N/A

#### 2.20.12.2.0 Columns

*No items available*

## 2.21.0.0.0 RiderHasLocationHistory

### 2.21.1.0.0 Name

RiderHasLocationHistory

### 2.21.2.0.0 Id

REL_USER_RIDERLOC_001

### 2.21.3.0.0 Source Entity

User

### 2.21.4.0.0 Target Entity

RiderLocationHistory

### 2.21.5.0.0 Type

🔹 OneToMany

### 2.21.6.0.0 Source Multiplicity

1

### 2.21.7.0.0 Target Multiplicity

0..*

### 2.21.8.0.0 Cascade Delete

✅ Yes

### 2.21.9.0.0 Is Identifying

✅ Yes

### 2.21.10.0.0 On Delete

Cascade

### 2.21.11.0.0 On Update

Cascade

### 2.21.12.0.0 Join Table

#### 2.21.12.1.0 Name

N/A

#### 2.21.12.2.0 Columns

*No items available*

## 2.22.0.0.0 OrderHasRatingReviews

### 2.22.1.0.0 Name

OrderHasRatingReviews

### 2.22.2.0.0 Id

REL_ORDER_RATING_001

### 2.22.3.0.0 Source Entity

Order

### 2.22.4.0.0 Target Entity

RatingReview

### 2.22.5.0.0 Type

🔹 OneToMany

### 2.22.6.0.0 Source Multiplicity

1

### 2.22.7.0.0 Target Multiplicity

0..*

### 2.22.8.0.0 Cascade Delete

✅ Yes

### 2.22.9.0.0 Is Identifying

✅ Yes

### 2.22.10.0.0 On Delete

Cascade

### 2.22.11.0.0 On Update

Cascade

### 2.22.12.0.0 Join Table

#### 2.22.12.1.0 Name

N/A

#### 2.22.12.2.0 Columns

*No items available*

## 2.23.0.0.0 UserWritesRatingReviews

### 2.23.1.0.0 Name

UserWritesRatingReviews

### 2.23.2.0.0 Id

REL_USER_RATING_REVIEWER_001

### 2.23.3.0.0 Source Entity

User

### 2.23.4.0.0 Target Entity

RatingReview

### 2.23.5.0.0 Type

🔹 OneToMany

### 2.23.6.0.0 Source Multiplicity

1

### 2.23.7.0.0 Target Multiplicity

0..*

### 2.23.8.0.0 Cascade Delete

❌ No

### 2.23.9.0.0 Is Identifying

❌ No

### 2.23.10.0.0 On Delete

Restrict

### 2.23.11.0.0 On Update

Cascade

### 2.23.12.0.0 Join Table

#### 2.23.12.1.0 Name

N/A

#### 2.23.12.2.0 Columns

*No items available*

## 2.24.0.0.0 UserReceivesRatingReviews

### 2.24.1.0.0 Name

UserReceivesRatingReviews

### 2.24.2.0.0 Id

REL_USER_RATING_REVIEWEE_001

### 2.24.3.0.0 Source Entity

User

### 2.24.4.0.0 Target Entity

RatingReview

### 2.24.5.0.0 Type

🔹 OneToMany

### 2.24.6.0.0 Source Multiplicity

1

### 2.24.7.0.0 Target Multiplicity

0..*

### 2.24.8.0.0 Cascade Delete

❌ No

### 2.24.9.0.0 Is Identifying

❌ No

### 2.24.10.0.0 On Delete

Restrict

### 2.24.11.0.0 On Update

Cascade

### 2.24.12.0.0 Join Table

#### 2.24.12.1.0 Name

N/A

#### 2.24.12.2.0 Columns

*No items available*

## 2.25.0.0.0 OrderHasChatMessages

### 2.25.1.0.0 Name

OrderHasChatMessages

### 2.25.2.0.0 Id

REL_ORDER_CHAT_001

### 2.25.3.0.0 Source Entity

Order

### 2.25.4.0.0 Target Entity

ChatMessage

### 2.25.5.0.0 Type

🔹 OneToMany

### 2.25.6.0.0 Source Multiplicity

1

### 2.25.7.0.0 Target Multiplicity

0..*

### 2.25.8.0.0 Cascade Delete

✅ Yes

### 2.25.9.0.0 Is Identifying

✅ Yes

### 2.25.10.0.0 On Delete

Cascade

### 2.25.11.0.0 On Update

Cascade

### 2.25.12.0.0 Join Table

#### 2.25.12.1.0 Name

N/A

#### 2.25.12.2.0 Columns

*No items available*

## 2.26.0.0.0 UserSendsChatMessages

### 2.26.1.0.0 Name

UserSendsChatMessages

### 2.26.2.0.0 Id

REL_USER_CHAT_001

### 2.26.3.0.0 Source Entity

User

### 2.26.4.0.0 Target Entity

ChatMessage

### 2.26.5.0.0 Type

🔹 OneToMany

### 2.26.6.0.0 Source Multiplicity

1

### 2.26.7.0.0 Target Multiplicity

0..*

### 2.26.8.0.0 Cascade Delete

❌ No

### 2.26.9.0.0 Is Identifying

❌ No

### 2.26.10.0.0 On Delete

Restrict

### 2.26.11.0.0 On Update

Cascade

### 2.26.12.0.0 Join Table

#### 2.26.12.1.0 Name

N/A

#### 2.26.12.2.0 Columns

*No items available*

## 2.27.0.0.0 UserCreatesSupportTickets

### 2.27.1.0.0 Name

UserCreatesSupportTickets

### 2.27.2.0.0 Id

REL_USER_SUPPORTTICKET_CREATOR_001

### 2.27.3.0.0 Source Entity

User

### 2.27.4.0.0 Target Entity

SupportTicket

### 2.27.5.0.0 Type

🔹 OneToMany

### 2.27.6.0.0 Source Multiplicity

1

### 2.27.7.0.0 Target Multiplicity

0..*

### 2.27.8.0.0 Cascade Delete

❌ No

### 2.27.9.0.0 Is Identifying

❌ No

### 2.27.10.0.0 On Delete

Restrict

### 2.27.11.0.0 On Update

Cascade

### 2.27.12.0.0 Join Table

#### 2.27.12.1.0 Name

N/A

#### 2.27.12.2.0 Columns

*No items available*

## 2.28.0.0.0 AdminIsAssignedSupportTickets

### 2.28.1.0.0 Name

AdminIsAssignedSupportTickets

### 2.28.2.0.0 Id

REL_USER_SUPPORTTICKET_ASSIGNEE_001

### 2.28.3.0.0 Source Entity

User

### 2.28.4.0.0 Target Entity

SupportTicket

### 2.28.5.0.0 Type

🔹 OneToMany

### 2.28.6.0.0 Source Multiplicity

1

### 2.28.7.0.0 Target Multiplicity

0..*

### 2.28.8.0.0 Cascade Delete

❌ No

### 2.28.9.0.0 Is Identifying

❌ No

### 2.28.10.0.0 On Delete

SetNull

### 2.28.11.0.0 On Update

Cascade

### 2.28.12.0.0 Join Table

#### 2.28.12.1.0 Name

N/A

#### 2.28.12.2.0 Columns

*No items available*

## 2.29.0.0.0 AdminPerformsAuditedActions

### 2.29.1.0.0 Name

AdminPerformsAuditedActions

### 2.29.2.0.0 Id

REL_USER_AUDITLOG_001

### 2.29.3.0.0 Source Entity

User

### 2.29.4.0.0 Target Entity

AuditLog

### 2.29.5.0.0 Type

🔹 OneToMany

### 2.29.6.0.0 Source Multiplicity

1

### 2.29.7.0.0 Target Multiplicity

0..*

### 2.29.8.0.0 Cascade Delete

❌ No

### 2.29.9.0.0 Is Identifying

❌ No

### 2.29.10.0.0 On Delete

Restrict

### 2.29.11.0.0 On Update

Cascade

### 2.29.12.0.0 Join Table

#### 2.29.12.1.0 Name

N/A

#### 2.29.12.2.0 Columns

*No items available*

## 2.30.0.0.0 OrderGeneratesFinancialTransactions

### 2.30.1.0.0 Name

OrderGeneratesFinancialTransactions

### 2.30.2.0.0 Id

REL_ORDER_FINTRANS_001

### 2.30.3.0.0 Source Entity

Order

### 2.30.4.0.0 Target Entity

FinancialTransaction

### 2.30.5.0.0 Type

🔹 OneToMany

### 2.30.6.0.0 Source Multiplicity

1

### 2.30.7.0.0 Target Multiplicity

0..*

### 2.30.8.0.0 Cascade Delete

❌ No

### 2.30.9.0.0 Is Identifying

❌ No

### 2.30.10.0.0 On Delete

Restrict

### 2.30.11.0.0 On Update

Cascade

### 2.30.12.0.0 Join Table

#### 2.30.12.1.0 Name

N/A

#### 2.30.12.2.0 Columns

*No items available*

## 2.31.0.0.0 PayoutGeneratesFinancialTransactions

### 2.31.1.0.0 Name

PayoutGeneratesFinancialTransactions

### 2.31.2.0.0 Id

REL_PAYOUT_FINTRANS_001

### 2.31.3.0.0 Source Entity

Payout

### 2.31.4.0.0 Target Entity

FinancialTransaction

### 2.31.5.0.0 Type

🔹 OneToMany

### 2.31.6.0.0 Source Multiplicity

1

### 2.31.7.0.0 Target Multiplicity

0..*

### 2.31.8.0.0 Cascade Delete

✅ Yes

### 2.31.9.0.0 Is Identifying

❌ No

### 2.31.10.0.0 On Delete

Cascade

### 2.31.11.0.0 On Update

Cascade

### 2.31.12.0.0 Join Table

#### 2.31.12.1.0 Name

N/A

#### 2.31.12.2.0 Columns

*No items available*

## 2.32.0.0.0 UserReceivesPayouts

### 2.32.1.0.0 Name

UserReceivesPayouts

### 2.32.2.0.0 Id

REL_USER_PAYOUT_001

### 2.32.3.0.0 Source Entity

User

### 2.32.4.0.0 Target Entity

Payout

### 2.32.5.0.0 Type

🔹 OneToMany

### 2.32.6.0.0 Source Multiplicity

1

### 2.32.7.0.0 Target Multiplicity

0..*

### 2.32.8.0.0 Cascade Delete

❌ No

### 2.32.9.0.0 Is Identifying

❌ No

### 2.32.10.0.0 On Delete

Restrict

### 2.32.11.0.0 On Update

Cascade

### 2.32.12.0.0 Join Table

#### 2.32.12.1.0 Name

N/A

#### 2.32.12.2.0 Columns

*No items available*

## 2.33.0.0.0 UserGivesConsents

### 2.33.1.0.0 Name

UserGivesConsents

### 2.33.2.0.0 Id

REL_USER_CONSENT_001

### 2.33.3.0.0 Source Entity

User

### 2.33.4.0.0 Target Entity

UserConsent

### 2.33.5.0.0 Type

🔹 OneToMany

### 2.33.6.0.0 Source Multiplicity

1

### 2.33.7.0.0 Target Multiplicity

1..*

### 2.33.8.0.0 Cascade Delete

✅ Yes

### 2.33.9.0.0 Is Identifying

✅ Yes

### 2.33.10.0.0 On Delete

Cascade

### 2.33.11.0.0 On Update

Cascade

### 2.33.12.0.0 Join Table

#### 2.33.12.1.0 Name

N/A

#### 2.33.12.2.0 Columns

*No items available*

## 2.34.0.0.0 AdminUpdatesSystemConfiguration

### 2.34.1.0.0 Name

AdminUpdatesSystemConfiguration

### 2.34.2.0.0 Id

REL_USER_SYSCONFIG_001

### 2.34.3.0.0 Source Entity

User

### 2.34.4.0.0 Target Entity

SystemConfiguration

### 2.34.5.0.0 Type

🔹 OneToMany

### 2.34.6.0.0 Source Multiplicity

1

### 2.34.7.0.0 Target Multiplicity

0..*

### 2.34.8.0.0 Cascade Delete

❌ No

### 2.34.9.0.0 Is Identifying

❌ No

### 2.34.10.0.0 On Delete

Restrict

### 2.34.11.0.0 On Update

Cascade

### 2.34.12.0.0 Join Table

#### 2.34.12.1.0 Name

N/A

#### 2.34.12.2.0 Columns

*No items available*

