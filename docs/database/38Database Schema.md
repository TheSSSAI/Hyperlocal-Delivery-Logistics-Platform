# 1 Title

Vendor & Catalog Service DB

# 2 Name

vendor_db

# 3 Db Type

- relational

# 4 Db Technology

PostgreSQL

# 5 Entities

## 5.1 VendorProfile

### 5.1.1 Name

VendorProfile

### 5.1.2 Description

Stores profile and operational information specific to Vendors. Owned by the Vendor & Catalog Service.

### 5.1.3 Attributes

#### 5.1.3.1 vendorProfileId

##### 5.1.3.1.1 Name

vendorProfileId

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

#### 5.1.3.2.0 userId

##### 5.1.3.2.1 Name

userId

##### 5.1.3.2.2 Type

🔹 Guid

##### 5.1.3.2.3 Is Required

✅ Yes

##### 5.1.3.2.4 Is Primary Key

❌ No

##### 5.1.3.2.5 Size

0

##### 5.1.3.2.6 Is Unique

✅ Yes

##### 5.1.3.2.7 Constraints

*No items available*

##### 5.1.3.2.8 Precision

0

##### 5.1.3.2.9 Scale

0

##### 5.1.3.2.10 Is Foreign Key

❌ No

#### 5.1.3.3.0 storeName

##### 5.1.3.3.1 Name

storeName

##### 5.1.3.3.2 Type

🔹 VARCHAR

##### 5.1.3.3.3 Is Required

✅ Yes

##### 5.1.3.3.4 Is Primary Key

❌ No

##### 5.1.3.3.5 Size

255

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

#### 5.1.3.4.0 description

##### 5.1.3.4.1 Name

description

##### 5.1.3.4.2 Type

🔹 TEXT

##### 5.1.3.4.3 Is Required

❌ No

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

#### 5.1.3.5.0 addressId

##### 5.1.3.5.1 Name

addressId

##### 5.1.3.5.2 Type

🔹 Guid

##### 5.1.3.5.3 Is Required

✅ Yes

##### 5.1.3.5.4 Is Primary Key

❌ No

##### 5.1.3.5.5 Size

0

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

#### 5.1.3.6.0 latitude

##### 5.1.3.6.1 Name

latitude

##### 5.1.3.6.2 Type

🔹 DECIMAL

##### 5.1.3.6.3 Is Required

✅ Yes

##### 5.1.3.6.4 Is Primary Key

❌ No

##### 5.1.3.6.5 Size

0

##### 5.1.3.6.6 Is Unique

❌ No

##### 5.1.3.6.7 Constraints

*No items available*

##### 5.1.3.6.8 Precision

9

##### 5.1.3.6.9 Scale

6

##### 5.1.3.6.10 Is Foreign Key

❌ No

#### 5.1.3.7.0 longitude

##### 5.1.3.7.1 Name

longitude

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

9

##### 5.1.3.7.9 Scale

6

##### 5.1.3.7.10 Is Foreign Key

❌ No

#### 5.1.3.8.0 averageRating

##### 5.1.3.8.1 Name

averageRating

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

- RANGE(0, 5)
- DEFAULT 0.0

##### 5.1.3.8.8 Precision

3

##### 5.1.3.8.9 Scale

2

##### 5.1.3.8.10 Is Foreign Key

❌ No

#### 5.1.3.9.0 commissionRate

##### 5.1.3.9.1 Name

commissionRate

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

- RANGE(0, 100)
- DEFAULT 15.00

##### 5.1.3.9.8 Precision

5

##### 5.1.3.9.9 Scale

2

##### 5.1.3.9.10 Is Foreign Key

❌ No

#### 5.1.3.10.0 isOnline

##### 5.1.3.10.1 Name

isOnline

##### 5.1.3.10.2 Type

🔹 BOOLEAN

##### 5.1.3.10.3 Is Required

✅ Yes

##### 5.1.3.10.4 Is Primary Key

❌ No

##### 5.1.3.10.5 Size

0

##### 5.1.3.10.6 Is Unique

❌ No

##### 5.1.3.10.7 Constraints

- DEFAULT false

##### 5.1.3.10.8 Precision

0

##### 5.1.3.10.9 Scale

0

##### 5.1.3.10.10 Is Foreign Key

❌ No

#### 5.1.3.11.0 documentUrls

##### 5.1.3.11.1 Name

documentUrls

##### 5.1.3.11.2 Type

🔹 JSONB

##### 5.1.3.11.3 Is Required

❌ No

##### 5.1.3.11.4 Is Primary Key

❌ No

##### 5.1.3.11.5 Size

0

##### 5.1.3.11.6 Is Unique

❌ No

##### 5.1.3.11.7 Constraints

- DEFAULT '{}'

##### 5.1.3.11.8 Precision

0

##### 5.1.3.11.9 Scale

0

##### 5.1.3.11.10 Is Foreign Key

❌ No

#### 5.1.3.12.0 createdAt

##### 5.1.3.12.1 Name

createdAt

##### 5.1.3.12.2 Type

🔹 DateTimeOffset

##### 5.1.3.12.3 Is Required

✅ Yes

##### 5.1.3.12.4 Is Primary Key

❌ No

##### 5.1.3.12.5 Size

0

##### 5.1.3.12.6 Is Unique

❌ No

##### 5.1.3.12.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.12.8 Precision

0

##### 5.1.3.12.9 Scale

0

##### 5.1.3.12.10 Is Foreign Key

❌ No

#### 5.1.3.13.0 updatedAt

##### 5.1.3.13.1 Name

updatedAt

##### 5.1.3.13.2 Type

🔹 DateTimeOffset

##### 5.1.3.13.3 Is Required

✅ Yes

##### 5.1.3.13.4 Is Primary Key

❌ No

##### 5.1.3.13.5 Size

0

##### 5.1.3.13.6 Is Unique

❌ No

##### 5.1.3.13.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.13.8 Precision

0

##### 5.1.3.13.9 Scale

0

##### 5.1.3.13.10 Is Foreign Key

❌ No

### 5.1.4.0.0 Primary Keys

- vendorProfileId

### 5.1.5.0.0 Unique Constraints

- {'name': 'UC_VendorProfile_UserId', 'columns': ['userId']}

### 5.1.6.0.0 Indexes

#### 5.1.6.1.0 IX_VendorProfile_StoreName

##### 5.1.6.1.1 Name

IX_VendorProfile_StoreName

##### 5.1.6.1.2 Columns

- storeName

##### 5.1.6.1.3 Type

🔹 BTree

#### 5.1.6.2.0 FT_VendorProfile_Description

##### 5.1.6.2.1 Name

FT_VendorProfile_Description

##### 5.1.6.2.2 Columns

- description

##### 5.1.6.2.3 Type

🔹 FullText

#### 5.1.6.3.0 IX_VendorProfile_Online_RatingDesc

##### 5.1.6.3.1 Name

IX_VendorProfile_Online_RatingDesc

##### 5.1.6.3.2 Columns

- isOnline
- averageRating

##### 5.1.6.3.3 Type

🔹 BTree

#### 5.1.6.4.0 IX_VendorProfile_Location_Spatial

##### 5.1.6.4.1 Name

IX_VendorProfile_Location_Spatial

##### 5.1.6.4.2 Columns

- latitude
- longitude

##### 5.1.6.4.3 Type

🔹 Spatial_GIST

## 5.2.0.0.0 VendorBusinessHour

### 5.2.1.0.0 Name

VendorBusinessHour

### 5.2.2.0.0 Description

Stores the daily opening and closing times for a vendor. Owned by the Vendor & Catalog Service.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 businessHourId

##### 5.2.3.1.1 Name

businessHourId

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

#### 5.2.3.2.0 vendorProfileId

##### 5.2.3.2.1 Name

vendorProfileId

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

#### 5.2.3.3.0 dayOfWeek

##### 5.2.3.3.1 Name

dayOfWeek

##### 5.2.3.3.2 Type

🔹 INT

##### 5.2.3.3.3 Is Required

✅ Yes

##### 5.2.3.3.4 Is Primary Key

❌ No

##### 5.2.3.3.5 Size

0

##### 5.2.3.3.6 Is Unique

❌ No

##### 5.2.3.3.7 Constraints

- RANGE(0, 6)

##### 5.2.3.3.8 Precision

0

##### 5.2.3.3.9 Scale

0

##### 5.2.3.3.10 Is Foreign Key

❌ No

#### 5.2.3.4.0 openTime

##### 5.2.3.4.1 Name

openTime

##### 5.2.3.4.2 Type

🔹 TIME

##### 5.2.3.4.3 Is Required

❌ No

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

#### 5.2.3.5.0 closeTime

##### 5.2.3.5.1 Name

closeTime

##### 5.2.3.5.2 Type

🔹 TIME

##### 5.2.3.5.3 Is Required

❌ No

##### 5.2.3.5.4 Is Primary Key

❌ No

##### 5.2.3.5.5 Size

0

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

#### 5.2.3.6.0 isClosed

##### 5.2.3.6.1 Name

isClosed

##### 5.2.3.6.2 Type

🔹 BOOLEAN

##### 5.2.3.6.3 Is Required

✅ Yes

##### 5.2.3.6.4 Is Primary Key

❌ No

##### 5.2.3.6.5 Size

0

##### 5.2.3.6.6 Is Unique

❌ No

##### 5.2.3.6.7 Constraints

- DEFAULT false

##### 5.2.3.6.8 Precision

0

##### 5.2.3.6.9 Scale

0

##### 5.2.3.6.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- businessHourId

### 5.2.5.0.0 Unique Constraints

- {'name': 'UC_VendorBusinessHour_Vendor_Day', 'columns': ['vendorProfileId', 'dayOfWeek']}

### 5.2.6.0.0 Indexes

*No items available*

## 5.3.0.0.0 VendorLicense

### 5.3.1.0.0 Name

VendorLicense

### 5.3.2.0.0 Description

Stores mandatory license information for vendors in regulated categories. Owned by the Vendor & Catalog Service.

### 5.3.3.0.0 Attributes

#### 5.3.3.1.0 licenseId

##### 5.3.3.1.1 Name

licenseId

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

#### 5.3.3.2.0 vendorProfileId

##### 5.3.3.2.1 Name

vendorProfileId

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

#### 5.3.3.3.0 licenseNumber

##### 5.3.3.3.1 Name

licenseNumber

##### 5.3.3.3.2 Type

🔹 VARCHAR

##### 5.3.3.3.3 Is Required

✅ Yes

##### 5.3.3.3.4 Is Primary Key

❌ No

##### 5.3.3.3.5 Size

100

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

#### 5.3.3.4.0 expiryDate

##### 5.3.3.4.1 Name

expiryDate

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

#### 5.3.3.5.0 licenseType

##### 5.3.3.5.1 Name

licenseType

##### 5.3.3.5.2 Type

🔹 VARCHAR

##### 5.3.3.5.3 Is Required

✅ Yes

##### 5.3.3.5.4 Is Primary Key

❌ No

##### 5.3.3.5.5 Size

50

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

#### 5.3.3.7.0 updatedAt

##### 5.3.3.7.1 Name

updatedAt

##### 5.3.3.7.2 Type

🔹 DateTimeOffset

##### 5.3.3.7.3 Is Required

✅ Yes

##### 5.3.3.7.4 Is Primary Key

❌ No

##### 5.3.3.7.5 Size

0

##### 5.3.3.7.6 Is Unique

❌ No

##### 5.3.3.7.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.3.3.7.8 Precision

0

##### 5.3.3.7.9 Scale

0

##### 5.3.3.7.10 Is Foreign Key

❌ No

### 5.3.4.0.0 Primary Keys

- licenseId

### 5.3.5.0.0 Unique Constraints

*No items available*

### 5.3.6.0.0 Indexes

- {'name': 'IX_VendorLicense_VendorProfileId_Expiry', 'columns': ['vendorProfileId', 'expiryDate'], 'type': 'BTree'}

## 5.4.0.0.0 ProductCategory

### 5.4.1.0.0 Name

ProductCategory

### 5.4.2.0.0 Description

Represents categories for organizing a vendor's products. Owned by the Vendor & Catalog Service.

### 5.4.3.0.0 Attributes

#### 5.4.3.1.0 productCategoryId

##### 5.4.3.1.1 Name

productCategoryId

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

#### 5.4.3.2.0 vendorProfileId

##### 5.4.3.2.1 Name

vendorProfileId

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

#### 5.4.3.3.0 name

##### 5.4.3.3.1 Name

name

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

#### 5.4.3.4.0 description

##### 5.4.3.4.1 Name

description

##### 5.4.3.4.2 Type

🔹 TEXT

##### 5.4.3.4.3 Is Required

❌ No

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

#### 5.4.3.5.0 isDeleted

##### 5.4.3.5.1 Name

isDeleted

##### 5.4.3.5.2 Type

🔹 BOOLEAN

##### 5.4.3.5.3 Is Required

✅ Yes

##### 5.4.3.5.4 Is Primary Key

❌ No

##### 5.4.3.5.5 Size

0

##### 5.4.3.5.6 Is Unique

❌ No

##### 5.4.3.5.7 Constraints

- DEFAULT false

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

- productCategoryId

### 5.4.5.0.0 Unique Constraints

- {'name': 'UC_ProductCategory_Vendor_Name', 'columns': ['vendorProfileId', 'name']}

### 5.4.6.0.0 Indexes

*No items available*

## 5.5.0.0.0 Product

### 5.5.1.0.0 Name

Product

### 5.5.2.0.0 Description

Represents an individual item sold by a vendor. Owned by the Vendor & Catalog Service.

### 5.5.3.0.0 Attributes

#### 5.5.3.1.0 productId

##### 5.5.3.1.1 Name

productId

##### 5.5.3.1.2 Type

🔹 Guid

##### 5.5.3.1.3 Is Required

✅ Yes

##### 5.5.3.1.4 Is Primary Key

✅ Yes

##### 5.5.3.1.5 Size

0

##### 5.5.3.1.6 Is Unique

✅ Yes

##### 5.5.3.1.7 Constraints

- DEFAULT GENERATE_UUID()

##### 5.5.3.1.8 Precision

0

##### 5.5.3.1.9 Scale

0

##### 5.5.3.1.10 Is Foreign Key

❌ No

#### 5.5.3.2.0 vendorProfileId

##### 5.5.3.2.1 Name

vendorProfileId

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

#### 5.5.3.3.0 productCategoryId

##### 5.5.3.3.1 Name

productCategoryId

##### 5.5.3.3.2 Type

🔹 Guid

##### 5.5.3.3.3 Is Required

✅ Yes

##### 5.5.3.3.4 Is Primary Key

❌ No

##### 5.5.3.3.5 Size

0

##### 5.5.3.3.6 Is Unique

❌ No

##### 5.5.3.3.7 Constraints

*No items available*

##### 5.5.3.3.8 Precision

0

##### 5.5.3.3.9 Scale

0

##### 5.5.3.3.10 Is Foreign Key

✅ Yes

#### 5.5.3.4.0 name

##### 5.5.3.4.1 Name

name

##### 5.5.3.4.2 Type

🔹 VARCHAR

##### 5.5.3.4.3 Is Required

✅ Yes

##### 5.5.3.4.4 Is Primary Key

❌ No

##### 5.5.3.4.5 Size

255

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

#### 5.5.3.5.0 description

##### 5.5.3.5.1 Name

description

##### 5.5.3.5.2 Type

🔹 TEXT

##### 5.5.3.5.3 Is Required

❌ No

##### 5.5.3.5.4 Is Primary Key

❌ No

##### 5.5.3.5.5 Size

0

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

#### 5.5.3.6.0 price

##### 5.5.3.6.1 Name

price

##### 5.5.3.6.2 Type

🔹 DECIMAL

##### 5.5.3.6.3 Is Required

✅ Yes

##### 5.5.3.6.4 Is Primary Key

❌ No

##### 5.5.3.6.5 Size

0

##### 5.5.3.6.6 Is Unique

❌ No

##### 5.5.3.6.7 Constraints

- POSITIVE_VALUE

##### 5.5.3.6.8 Precision

10

##### 5.5.3.6.9 Scale

2

##### 5.5.3.6.10 Is Foreign Key

❌ No

#### 5.5.3.7.0 imageUrl

##### 5.5.3.7.1 Name

imageUrl

##### 5.5.3.7.2 Type

🔹 VARCHAR

##### 5.5.3.7.3 Is Required

❌ No

##### 5.5.3.7.4 Is Primary Key

❌ No

##### 5.5.3.7.5 Size

2,048

##### 5.5.3.7.6 Is Unique

❌ No

##### 5.5.3.7.7 Constraints

*No items available*

##### 5.5.3.7.8 Precision

0

##### 5.5.3.7.9 Scale

0

##### 5.5.3.7.10 Is Foreign Key

❌ No

#### 5.5.3.8.0 stockQuantity

##### 5.5.3.8.1 Name

stockQuantity

##### 5.5.3.8.2 Type

🔹 INT

##### 5.5.3.8.3 Is Required

✅ Yes

##### 5.5.3.8.4 Is Primary Key

❌ No

##### 5.5.3.8.5 Size

0

##### 5.5.3.8.6 Is Unique

❌ No

##### 5.5.3.8.7 Constraints

- NON_NEGATIVE
- DEFAULT 0

##### 5.5.3.8.8 Precision

0

##### 5.5.3.8.9 Scale

0

##### 5.5.3.8.10 Is Foreign Key

❌ No

#### 5.5.3.9.0 limitedStockThreshold

##### 5.5.3.9.1 Name

limitedStockThreshold

##### 5.5.3.9.2 Type

🔹 INT

##### 5.5.3.9.3 Is Required

❌ No

##### 5.5.3.9.4 Is Primary Key

❌ No

##### 5.5.3.9.5 Size

0

##### 5.5.3.9.6 Is Unique

❌ No

##### 5.5.3.9.7 Constraints

- NON_NEGATIVE
- DEFAULT 5

##### 5.5.3.9.8 Precision

0

##### 5.5.3.9.9 Scale

0

##### 5.5.3.9.10 Is Foreign Key

❌ No

#### 5.5.3.10.0 isAvailable

##### 5.5.3.10.1 Name

isAvailable

##### 5.5.3.10.2 Type

🔹 BOOLEAN

##### 5.5.3.10.3 Is Required

✅ Yes

##### 5.5.3.10.4 Is Primary Key

❌ No

##### 5.5.3.10.5 Size

0

##### 5.5.3.10.6 Is Unique

❌ No

##### 5.5.3.10.7 Constraints

- DEFAULT true

##### 5.5.3.10.8 Precision

0

##### 5.5.3.10.9 Scale

0

##### 5.5.3.10.10 Is Foreign Key

❌ No

#### 5.5.3.11.0 isDeleted

##### 5.5.3.11.1 Name

isDeleted

##### 5.5.3.11.2 Type

🔹 BOOLEAN

##### 5.5.3.11.3 Is Required

✅ Yes

##### 5.5.3.11.4 Is Primary Key

❌ No

##### 5.5.3.11.5 Size

0

##### 5.5.3.11.6 Is Unique

❌ No

##### 5.5.3.11.7 Constraints

- DEFAULT false

##### 5.5.3.11.8 Precision

0

##### 5.5.3.11.9 Scale

0

##### 5.5.3.11.10 Is Foreign Key

❌ No

#### 5.5.3.12.0 createdAt

##### 5.5.3.12.1 Name

createdAt

##### 5.5.3.12.2 Type

🔹 DateTimeOffset

##### 5.5.3.12.3 Is Required

✅ Yes

##### 5.5.3.12.4 Is Primary Key

❌ No

##### 5.5.3.12.5 Size

0

##### 5.5.3.12.6 Is Unique

❌ No

##### 5.5.3.12.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.5.3.12.8 Precision

0

##### 5.5.3.12.9 Scale

0

##### 5.5.3.12.10 Is Foreign Key

❌ No

#### 5.5.3.13.0 updatedAt

##### 5.5.3.13.1 Name

updatedAt

##### 5.5.3.13.2 Type

🔹 DateTimeOffset

##### 5.5.3.13.3 Is Required

✅ Yes

##### 5.5.3.13.4 Is Primary Key

❌ No

##### 5.5.3.13.5 Size

0

##### 5.5.3.13.6 Is Unique

❌ No

##### 5.5.3.13.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.5.3.13.8 Precision

0

##### 5.5.3.13.9 Scale

0

##### 5.5.3.13.10 Is Foreign Key

❌ No

### 5.5.4.0.0 Primary Keys

- productId

### 5.5.5.0.0 Unique Constraints

*No items available*

### 5.5.6.0.0 Indexes

#### 5.5.6.1.0 IX_Product_Vendor_Availability

##### 5.5.6.1.1 Name

IX_Product_Vendor_Availability

##### 5.5.6.1.2 Columns

- vendorProfileId
- isAvailable
- isDeleted

##### 5.5.6.1.3 Type

🔹 BTree

#### 5.5.6.2.0 FT_Product_Name_Description

##### 5.5.6.2.1 Name

FT_Product_Name_Description

##### 5.5.6.2.2 Columns

- name
- description

##### 5.5.6.2.3 Type

🔹 FullText

