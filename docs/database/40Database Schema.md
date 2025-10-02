# 1 Title

Rider Logistics Service DB

# 2 Name

logistics_db

# 3 Db Type

- relational

# 4 Db Technology

PostgreSQL

# 5 Entities

## 5.1 RiderProfile

### 5.1.1 Name

RiderProfile

### 5.1.2 Description

Stores profile, vehicle, and operational information specific to Riders. Owned by the Rider Logistics Service.

### 5.1.3 Attributes

#### 5.1.3.1 riderProfileId

##### 5.1.3.1.1 Name

riderProfileId

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

#### 5.1.3.3.0 firstName

##### 5.1.3.3.1 Name

firstName

##### 5.1.3.3.2 Type

🔹 VARCHAR

##### 5.1.3.3.3 Is Required

✅ Yes

##### 5.1.3.3.4 Is Primary Key

❌ No

##### 5.1.3.3.5 Size

100

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

#### 5.1.3.4.0 lastName

##### 5.1.3.4.1 Name

lastName

##### 5.1.3.4.2 Type

🔹 VARCHAR

##### 5.1.3.4.3 Is Required

✅ Yes

##### 5.1.3.4.4 Is Primary Key

❌ No

##### 5.1.3.4.5 Size

100

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

#### 5.1.3.5.0 vehicleDetails

##### 5.1.3.5.1 Name

vehicleDetails

##### 5.1.3.5.2 Type

🔹 JSONB

##### 5.1.3.5.3 Is Required

❌ No

##### 5.1.3.5.4 Is Primary Key

❌ No

##### 5.1.3.5.5 Size

0

##### 5.1.3.5.6 Is Unique

❌ No

##### 5.1.3.5.7 Constraints

- DEFAULT '{}'

##### 5.1.3.5.8 Precision

0

##### 5.1.3.5.9 Scale

0

##### 5.1.3.5.10 Is Foreign Key

❌ No

#### 5.1.3.6.0 bankAccountDetails

##### 5.1.3.6.1 Name

bankAccountDetails

##### 5.1.3.6.2 Type

🔹 TEXT

##### 5.1.3.6.3 Is Required

❌ No

##### 5.1.3.6.4 Is Primary Key

❌ No

##### 5.1.3.6.5 Size

0

##### 5.1.3.6.6 Is Unique

❌ No

##### 5.1.3.6.7 Constraints

- ENCRYPTED

##### 5.1.3.6.8 Precision

0

##### 5.1.3.6.9 Scale

0

##### 5.1.3.6.10 Is Foreign Key

❌ No

#### 5.1.3.7.0 documentUrls

##### 5.1.3.7.1 Name

documentUrls

##### 5.1.3.7.2 Type

🔹 JSONB

##### 5.1.3.7.3 Is Required

❌ No

##### 5.1.3.7.4 Is Primary Key

❌ No

##### 5.1.3.7.5 Size

0

##### 5.1.3.7.6 Is Unique

❌ No

##### 5.1.3.7.7 Constraints

- DEFAULT '{}'

##### 5.1.3.7.8 Precision

0

##### 5.1.3.7.9 Scale

0

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

#### 5.1.3.9.0 cashInHand

##### 5.1.3.9.1 Name

cashInHand

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

- DEFAULT 0.00

##### 5.1.3.9.8 Precision

10

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

#### 5.1.3.11.0 createdAt

##### 5.1.3.11.1 Name

createdAt

##### 5.1.3.11.2 Type

🔹 DateTimeOffset

##### 5.1.3.11.3 Is Required

✅ Yes

##### 5.1.3.11.4 Is Primary Key

❌ No

##### 5.1.3.11.5 Size

0

##### 5.1.3.11.6 Is Unique

❌ No

##### 5.1.3.11.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.1.3.11.8 Precision

0

##### 5.1.3.11.9 Scale

0

##### 5.1.3.11.10 Is Foreign Key

❌ No

#### 5.1.3.12.0 updatedAt

##### 5.1.3.12.1 Name

updatedAt

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

### 5.1.4.0.0 Primary Keys

- riderProfileId

### 5.1.5.0.0 Unique Constraints

- {'name': 'UC_RiderProfile_UserId', 'columns': ['userId']}

### 5.1.6.0.0 Indexes

#### 5.1.6.1.0 IX_RiderProfile_FullName

##### 5.1.6.1.1 Name

IX_RiderProfile_FullName

##### 5.1.6.1.2 Columns

- firstName
- lastName

##### 5.1.6.1.3 Type

🔹 BTree

#### 5.1.6.2.0 IX_RiderProfile_Online_Rating

##### 5.1.6.2.1 Name

IX_RiderProfile_Online_Rating

##### 5.1.6.2.2 Columns

- isOnline
- averageRating

##### 5.1.6.2.3 Type

🔹 BTree

## 5.2.0.0.0 DeliveryTask

### 5.2.1.0.0 Name

DeliveryTask

### 5.2.2.0.0 Description

Represents the logistics task of delivering an order, assigned to a rider. Owned by the Rider Logistics Service.

### 5.2.3.0.0 Attributes

#### 5.2.3.1.0 deliveryTaskId

##### 5.2.3.1.1 Name

deliveryTaskId

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

✅ Yes

##### 5.2.3.2.7 Constraints

*No items available*

##### 5.2.3.2.8 Precision

0

##### 5.2.3.2.9 Scale

0

##### 5.2.3.2.10 Is Foreign Key

❌ No

#### 5.2.3.3.0 riderId

##### 5.2.3.3.1 Name

riderId

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

❌ No

#### 5.2.3.4.0 status

##### 5.2.3.4.1 Name

status

##### 5.2.3.4.2 Type

🔹 VARCHAR

##### 5.2.3.4.3 Is Required

✅ Yes

##### 5.2.3.4.4 Is Primary Key

❌ No

##### 5.2.3.4.5 Size

30

##### 5.2.3.4.6 Is Unique

❌ No

##### 5.2.3.4.7 Constraints

- ENUM('PENDING_ALLOCATION', 'OFFERED', 'ACCEPTED', 'AT_STORE', 'PICKED_UP', 'AT_DESTINATION', 'DELIVERED', 'FAILED')
- DEFAULT 'PENDING_ALLOCATION'

##### 5.2.3.4.8 Precision

0

##### 5.2.3.4.9 Scale

0

##### 5.2.3.4.10 Is Foreign Key

❌ No

#### 5.2.3.5.0 earnings

##### 5.2.3.5.1 Name

earnings

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

- DEFAULT 0.00

##### 5.2.3.5.8 Precision

10

##### 5.2.3.5.9 Scale

2

##### 5.2.3.5.10 Is Foreign Key

❌ No

#### 5.2.3.6.0 tip

##### 5.2.3.6.1 Name

tip

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

- DEFAULT 0.00

##### 5.2.3.6.8 Precision

10

##### 5.2.3.6.9 Scale

2

##### 5.2.3.6.10 Is Foreign Key

❌ No

#### 5.2.3.7.0 pickedUpAt

##### 5.2.3.7.1 Name

pickedUpAt

##### 5.2.3.7.2 Type

🔹 DateTimeOffset

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

#### 5.2.3.8.0 deliveredAt

##### 5.2.3.8.1 Name

deliveredAt

##### 5.2.3.8.2 Type

🔹 DateTimeOffset

##### 5.2.3.8.3 Is Required

❌ No

##### 5.2.3.8.4 Is Primary Key

❌ No

##### 5.2.3.8.5 Size

0

##### 5.2.3.8.6 Is Unique

❌ No

##### 5.2.3.8.7 Constraints

*No items available*

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

#### 5.2.3.10.0 updatedAt

##### 5.2.3.10.1 Name

updatedAt

##### 5.2.3.10.2 Type

🔹 DateTimeOffset

##### 5.2.3.10.3 Is Required

✅ Yes

##### 5.2.3.10.4 Is Primary Key

❌ No

##### 5.2.3.10.5 Size

0

##### 5.2.3.10.6 Is Unique

❌ No

##### 5.2.3.10.7 Constraints

- DEFAULT CURRENT_TIMESTAMP

##### 5.2.3.10.8 Precision

0

##### 5.2.3.10.9 Scale

0

##### 5.2.3.10.10 Is Foreign Key

❌ No

### 5.2.4.0.0 Primary Keys

- deliveryTaskId

### 5.2.5.0.0 Unique Constraints

- {'name': 'UC_DeliveryTask_OrderId', 'columns': ['orderId']}

### 5.2.6.0.0 Indexes

#### 5.2.6.1.0 IX_DeliveryTask_RiderId_Status

##### 5.2.6.1.1 Name

IX_DeliveryTask_RiderId_Status

##### 5.2.6.1.2 Columns

- riderId
- status

##### 5.2.6.1.3 Type

🔹 BTree

#### 5.2.6.2.0 IX_DeliveryTask_Status_CreatedAt

##### 5.2.6.2.1 Name

IX_DeliveryTask_Status_CreatedAt

##### 5.2.6.2.2 Columns

- status
- createdAt

##### 5.2.6.2.3 Type

🔹 BTree

## 5.3.0.0.0 ProofOfDelivery

### 5.3.1.0.0 Name

ProofOfDelivery

### 5.3.2.0.0 Description

Stores evidence of a completed delivery, such as a photo or OTP. Owned by the Rider Logistics Service.

### 5.3.3.0.0 Attributes

#### 5.3.3.1.0 podId

##### 5.3.3.1.1 Name

podId

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

#### 5.3.3.2.0 deliveryTaskId

##### 5.3.3.2.1 Name

deliveryTaskId

##### 5.3.3.2.2 Type

🔹 Guid

##### 5.3.3.2.3 Is Required

✅ Yes

##### 5.3.3.2.4 Is Primary Key

❌ No

##### 5.3.3.2.5 Size

0

##### 5.3.3.2.6 Is Unique

✅ Yes

##### 5.3.3.2.7 Constraints

*No items available*

##### 5.3.3.2.8 Precision

0

##### 5.3.3.2.9 Scale

0

##### 5.3.3.2.10 Is Foreign Key

✅ Yes

#### 5.3.3.3.0 podType

##### 5.3.3.3.1 Name

podType

##### 5.3.3.3.2 Type

🔹 VARCHAR

##### 5.3.3.3.3 Is Required

✅ Yes

##### 5.3.3.3.4 Is Primary Key

❌ No

##### 5.3.3.3.5 Size

10

##### 5.3.3.3.6 Is Unique

❌ No

##### 5.3.3.3.7 Constraints

- ENUM('PHOTO', 'OTP')

##### 5.3.3.3.8 Precision

0

##### 5.3.3.3.9 Scale

0

##### 5.3.3.3.10 Is Foreign Key

❌ No

#### 5.3.3.4.0 podData

##### 5.3.3.4.1 Name

podData

##### 5.3.3.4.2 Type

🔹 VARCHAR

##### 5.3.3.4.3 Is Required

✅ Yes

##### 5.3.3.4.4 Is Primary Key

❌ No

##### 5.3.3.4.5 Size

2,048

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

#### 5.3.3.5.0 latitude

##### 5.3.3.5.1 Name

latitude

##### 5.3.3.5.2 Type

🔹 DECIMAL

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

9

##### 5.3.3.5.9 Scale

6

##### 5.3.3.5.10 Is Foreign Key

❌ No

#### 5.3.3.6.0 longitude

##### 5.3.3.6.1 Name

longitude

##### 5.3.3.6.2 Type

🔹 DECIMAL

##### 5.3.3.6.3 Is Required

✅ Yes

##### 5.3.3.6.4 Is Primary Key

❌ No

##### 5.3.3.6.5 Size

0

##### 5.3.3.6.6 Is Unique

❌ No

##### 5.3.3.6.7 Constraints

*No items available*

##### 5.3.3.6.8 Precision

9

##### 5.3.3.6.9 Scale

6

##### 5.3.3.6.10 Is Foreign Key

❌ No

#### 5.3.3.7.0 createdAt

##### 5.3.3.7.1 Name

createdAt

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

- podId

### 5.3.5.0.0 Unique Constraints

- {'name': 'UC_ProofOfDelivery_DeliveryTaskId', 'columns': ['deliveryTaskId']}

### 5.3.6.0.0 Indexes

*No items available*

## 5.4.0.0.0 OperationalZone

### 5.4.1.0.0 Name

OperationalZone

### 5.4.2.0.0 Description

Defines geofenced areas where the service is available. Owned by the Rider Logistics Service.

### 5.4.3.0.0 Attributes

#### 5.4.3.1.0 zoneId

##### 5.4.3.1.1 Name

zoneId

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

#### 5.4.3.2.0 name

##### 5.4.3.2.1 Name

name

##### 5.4.3.2.2 Type

🔹 VARCHAR

##### 5.4.3.2.3 Is Required

✅ Yes

##### 5.4.3.2.4 Is Primary Key

❌ No

##### 5.4.3.2.5 Size

100

##### 5.4.3.2.6 Is Unique

✅ Yes

##### 5.4.3.2.7 Constraints

*No items available*

##### 5.4.3.2.8 Precision

0

##### 5.4.3.2.9 Scale

0

##### 5.4.3.2.10 Is Foreign Key

❌ No

#### 5.4.3.3.0 geoPolygon

##### 5.4.3.3.1 Name

geoPolygon

##### 5.4.3.3.2 Type

🔹 GEOMETRY

##### 5.4.3.3.3 Is Required

✅ Yes

##### 5.4.3.3.4 Is Primary Key

❌ No

##### 5.4.3.3.5 Size

0

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

#### 5.4.3.4.0 deliveryRadiusKm

##### 5.4.3.4.1 Name

deliveryRadiusKm

##### 5.4.3.4.2 Type

🔹 DECIMAL

##### 5.4.3.4.3 Is Required

✅ Yes

##### 5.4.3.4.4 Is Primary Key

❌ No

##### 5.4.3.4.5 Size

0

##### 5.4.3.4.6 Is Unique

❌ No

##### 5.4.3.4.7 Constraints

- DEFAULT 7.0

##### 5.4.3.4.8 Precision

5

##### 5.4.3.4.9 Scale

2

##### 5.4.3.4.10 Is Foreign Key

❌ No

#### 5.4.3.5.0 isActive

##### 5.4.3.5.1 Name

isActive

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

- DEFAULT true

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

- zoneId

### 5.4.5.0.0 Unique Constraints

- {'name': 'UC_OperationalZone_Name', 'columns': ['name']}

### 5.4.6.0.0 Indexes

- {'name': 'IX_OperationalZone_GeoPolygon', 'columns': ['geoPolygon'], 'type': 'Spatial'}

## 5.5.0.0.0 RiderLocationHistory

### 5.5.1.0.0 Name

RiderLocationHistory

### 5.5.2.0.0 Description

Source-of-truth table for a rider's GPS location. Primarily for archival and analysis. Live data is handled by a specialized time-series DB and in-memory cache.

### 5.5.3.0.0 Attributes

#### 5.5.3.1.0 locationId

##### 5.5.3.1.1 Name

locationId

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

#### 5.5.3.2.0 riderId

##### 5.5.3.2.1 Name

riderId

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

❌ No

#### 5.5.3.3.0 latitude

##### 5.5.3.3.1 Name

latitude

##### 5.5.3.3.2 Type

🔹 DECIMAL

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

9

##### 5.5.3.3.9 Scale

6

##### 5.5.3.3.10 Is Foreign Key

❌ No

#### 5.5.3.4.0 longitude

##### 5.5.3.4.1 Name

longitude

##### 5.5.3.4.2 Type

🔹 DECIMAL

##### 5.5.3.4.3 Is Required

✅ Yes

##### 5.5.3.4.4 Is Primary Key

❌ No

##### 5.5.3.4.5 Size

0

##### 5.5.3.4.6 Is Unique

❌ No

##### 5.5.3.4.7 Constraints

*No items available*

##### 5.5.3.4.8 Precision

9

##### 5.5.3.4.9 Scale

6

##### 5.5.3.4.10 Is Foreign Key

❌ No

#### 5.5.3.5.0 accuracy

##### 5.5.3.5.1 Name

accuracy

##### 5.5.3.5.2 Type

🔹 FLOAT

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

#### 5.5.3.6.0 timestamp

##### 5.5.3.6.1 Name

timestamp

##### 5.5.3.6.2 Type

🔹 DateTimeOffset

##### 5.5.3.6.3 Is Required

✅ Yes

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

### 5.5.4.0.0 Primary Keys

- locationId

### 5.5.5.0.0 Unique Constraints

*No items available*

### 5.5.6.0.0 Indexes

- {'name': 'IX_RiderLocationHistory_Rider_Timestamp', 'columns': ['riderId', 'timestamp'], 'type': 'BTree'}

