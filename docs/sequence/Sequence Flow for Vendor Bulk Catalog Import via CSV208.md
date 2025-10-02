# 1 Overview

## 1.1 Diagram Id

SEQ-DF-001

## 1.2 Name

Vendor Bulk Catalog Import via CSV

## 1.3 Description

A vendor uses their dashboard to upload a CSV file containing their product catalog. The system processes this file asynchronously, validates each row, imports the valid products into the database, and generates a downloadable error report for any failed rows.

## 1.4 Type

🔹 DataFlow

## 1.5 Purpose

To provide vendors with an efficient method for onboarding and managing a large number of products, reducing manual data entry as per REQ-FUN-011.

## 1.6 Complexity

High

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-VEND
- REPO-BE-CATALOG

## 1.10 Key Interactions

- Vendor uploads a CSV file via the Vendor Dashboard.
- The file is securely uploaded to a temporary S3 location.
- An asynchronous job is triggered in the Catalog Service (e.g., via an SQS message).
- The service streams the file, validating each row for required columns, data types (e.g., price is a number), and other constraints.
- Valid rows are transformed into Product entities and bulk-inserted/updated in the PostgreSQL database.
- Invalid rows and their corresponding error messages are written to an error report CSV file.
- The error report is stored in S3 with a secure, downloadable link.
- The vendor is notified via the dashboard upon completion and can download the error report if any errors occurred.

## 1.11 Triggers

- A vendor uploads a product catalog CSV file from their dashboard.

## 1.12 Outcomes

- The vendor's product catalog is created or updated in the system.
- A detailed, downloadable error report is available for the vendor if any data was invalid.

## 1.13 Business Rules

- The import process must be asynchronous to not block the UI.
- Data validation must be performed on required columns and data types (REQ-FUN-011).
- A downloadable error report for failed rows must be provided (REQ-FUN-011).

## 1.14 Error Scenarios

- CSV file has incorrect headers or is malformed.
- A row contains non-numeric data in the price column.
- A row is missing a required field like product name.

## 1.15 Integration Points

- Amazon S3 for storing the uploaded source file and the generated error report.
- AWS SQS for triggering the asynchronous processing job.

# 2.0 Details

## 2.1 Diagram Id

SEQ-DF-001

## 2.2 Name

Vendor Bulk Catalog Import via CSV with Asynchronous Processing

## 2.3 Description

Implementation-ready sequence for a vendor uploading a product catalog CSV. The sequence details the secure upload process via a pre-signed S3 URL, the triggering of an asynchronous background job via SQS, and the robust data pipeline within the Catalog Service. This pipeline streams, validates, transforms, and bulk-inserts data into a PostgreSQL database, while meticulously generating a downloadable error report for failed rows. The process concludes by notifying the vendor of the outcome via a WebSocket push.

## 2.4 Participants

### 2.4.1 Web Frontend

#### 2.4.1.1 Repository Id

REPO-FE-VEND

#### 2.4.1.2 Display Name

Vendor Dashboard

#### 2.4.1.3 Type

🔹 Web Frontend

#### 2.4.1.4 Technology

React.js v18.2+, Vite

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #1E90FF |
| Stereotype | Client |

### 2.4.2.0 Microservice

#### 2.4.2.1 Repository Id

REPO-BE-CATALOG

#### 2.4.2.2 Display Name

Vendor & Catalog Service

#### 2.4.2.3 Type

🔹 Microservice

#### 2.4.2.4 Technology

NestJS, TypeScript

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | rectangle |
| Color | #D2691E |
| Stereotype | API / Worker |

### 2.4.3.0 Cloud Storage

#### 2.4.3.1 Repository Id

tech-aws-s3

#### 2.4.3.2 Display Name

Amazon S3

#### 2.4.3.3 Type

🔹 Cloud Storage

#### 2.4.3.4 Technology

AWS SDK

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #527FFF |
| Stereotype | Object Storage |

### 2.4.4.0 Message Queue

#### 2.4.4.1 Repository Id

tech-aws-sqs

#### 2.4.4.2 Display Name

Amazon SQS

#### 2.4.4.3 Type

🔹 Message Queue

#### 2.4.4.4 Technology

AWS SDK

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | rectangle |
| Color | #FF4F8B |
| Stereotype | Queue |

### 2.4.5.0 Database

#### 2.4.5.1 Repository Id

tech-aws-rds-postgresql

#### 2.4.5.2 Display Name

PostgreSQL DB

#### 2.4.5.3 Type

🔹 Database

#### 2.4.5.4 Technology

Amazon RDS for PostgreSQL v15.4+

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #34A853 |
| Stereotype | Relational DB |

### 2.4.6.0 Microservice

#### 2.4.6.1 Repository Id

REPO-BE-CHAT

#### 2.4.6.2 Display Name

Chat Service

#### 2.4.6.3 Type

🔹 Microservice

#### 2.4.6.4 Technology

NestJS (WebSockets)

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | rectangle |
| Color | #F9A825 |
| Stereotype | WebSocket Gateway |

## 2.5.0.0 Interactions

### 2.5.1.0 API Request

#### 2.5.1.1 Source Id

REPO-FE-VEND

#### 2.5.1.2 Target Id

REPO-BE-CATALOG

#### 2.5.1.3 Message

1. Request secure upload URL for catalog import

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 API Request

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

2. Respond with pre-signed URL and a unique importJobId

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | POST /api/v1/catalog/import/initiate |
| Parameters | Body: { "fileName": "catalog.csv", "fileType": "te... |
| Authentication | Bearer <JWT> |
| Error Handling | Returns 400 if file metadata is invalid. Returns 5... |
| Performance | P95 < 150ms |

### 2.5.2.0 SDK Call

#### 2.5.2.1 Source Id

REPO-BE-CATALOG

#### 2.5.2.2 Target Id

tech-aws-s3

#### 2.5.2.3 Message

1.1. Generate pre-signed PUT URL for temporary upload

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 SDK Call

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

1.2. Returns secure, time-limited URL

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

❌ No

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | S3.getSignedUrl('putObject', ...) |
| Parameters | Params: { Bucket: 'platform-imports-temp', Key: 'u... |
| Authentication | IAM Role for EKS Service Account |
| Error Handling | SDK exceptions handled; circuit breaker pattern ap... |
| Performance | P95 < 100ms |

### 2.5.3.0 File Upload

#### 2.5.3.1 Source Id

REPO-FE-VEND

#### 2.5.3.2 Target Id

tech-aws-s3

#### 2.5.3.3 Message

3. Upload CSV file directly to S3 using pre-signed URL

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 File Upload

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

4. S3 confirms successful upload (HTTP 200 OK)

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

❌ No

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | PUT [presignedUrl] |
| Parameters | Headers: { 'Content-Type': 'text/csv' }, Body: <fi... |
| Authentication | Pre-signed URL query parameters |
| Error Handling | Client handles upload errors (e.g., network failur... |
| Performance | Dependent on user's network bandwidth. |

### 2.5.4.0 API Request

#### 2.5.4.1 Source Id

REPO-FE-VEND

#### 2.5.4.2 Target Id

REPO-BE-CATALOG

#### 2.5.4.3 Message

5. Notify backend that upload is complete and start processing

#### 2.5.4.4 Sequence Number

4

#### 2.5.4.5 Type

🔹 API Request

#### 2.5.4.6 Is Synchronous

✅ Yes

#### 2.5.4.7 Return Message

6. Acknowledge that job is queued for processing

#### 2.5.4.8 Has Return

✅ Yes

#### 2.5.4.9 Is Activation

❌ No

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | POST /api/v1/catalog/import/{importJobId}/start |
| Parameters | Path: { importJobId } |
| Authentication | Bearer <JWT> |
| Error Handling | Returns 404 if jobId not found. Returns 500 if SQS... |
| Performance | P95 < 100ms |

### 2.5.5.0 Message Enqueue

#### 2.5.5.1 Source Id

REPO-BE-CATALOG

#### 2.5.5.2 Target Id

tech-aws-sqs

#### 2.5.5.3 Message

5.1. Enqueue job for asynchronous processing

#### 2.5.5.4 Sequence Number

5

#### 2.5.5.5 Type

🔹 Message Enqueue

#### 2.5.5.6 Is Synchronous

✅ Yes

#### 2.5.5.7 Return Message

5.2. SQS confirms message received

#### 2.5.5.8 Has Return

✅ Yes

#### 2.5.5.9 Is Activation

❌ No

#### 2.5.5.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | SQS.sendMessage |
| Parameters | Body: { "importJobId": "...", "s3Key": "...", "ven... |
| Authentication | IAM Role for EKS Service Account |
| Error Handling | Retry with exponential backoff on failure. If pers... |
| Performance | P95 < 50ms |

### 2.5.6.0 Message Consume

#### 2.5.6.1 Source Id

tech-aws-sqs

#### 2.5.6.2 Target Id

REPO-BE-CATALOG

#### 2.5.6.3 Message

7. (Async) Delivers job message to a worker instance

#### 2.5.6.4 Sequence Number

6

#### 2.5.6.5 Type

🔹 Message Consume

#### 2.5.6.6 Is Synchronous

❌ No

#### 2.5.6.7 Return Message



#### 2.5.6.8 Has Return

❌ No

#### 2.5.6.9 Is Activation

✅ Yes

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK (Long Polling) |
| Method | SQS.receiveMessage |
| Parameters | N/A |
| Authentication | IAM Role for EKS Service Account |
| Error Handling | Message visibility timeout ensures another worker ... |
| Performance | N/A |

### 2.5.7.0 File Stream

#### 2.5.7.1 Source Id

REPO-BE-CATALOG

#### 2.5.7.2 Target Id

tech-aws-s3

#### 2.5.7.3 Message

8. Stream uploaded CSV file for processing

#### 2.5.7.4 Sequence Number

7

#### 2.5.7.5 Type

🔹 File Stream

#### 2.5.7.6 Is Synchronous

✅ Yes

#### 2.5.7.7 Return Message

8.1. Returns readable stream of the file content

#### 2.5.7.8 Has Return

✅ Yes

#### 2.5.7.9 Is Activation

❌ No

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | S3.getObject().createReadStream() |
| Parameters | Key: 'uploads/{vendorId}/{importJobId}.csv' |
| Authentication | IAM Role for EKS Service Account |
| Error Handling | Handles file not found or access denied errors. Ma... |
| Performance | High throughput, low memory usage by avoiding load... |

### 2.5.8.0 Internal Processing

#### 2.5.8.1 Source Id

REPO-BE-CATALOG

#### 2.5.8.2 Target Id

REPO-BE-CATALOG

#### 2.5.8.3 Message

9. Loop: Process file stream row-by-row

#### 2.5.8.4 Sequence Number

8

#### 2.5.8.5 Type

🔹 Internal Processing

#### 2.5.8.6 Is Synchronous

✅ Yes

#### 2.5.8.7 Return Message



#### 2.5.8.8 Has Return

❌ No

#### 2.5.8.9 Is Activation

❌ No

#### 2.5.8.10 Nested Interactions

##### 2.5.8.10.1 Validation

###### 2.5.8.10.1.1 Source Id

REPO-BE-CATALOG

###### 2.5.8.10.1.2 Target Id

REPO-BE-CATALOG

###### 2.5.8.10.1.3 Message

9.1. Validate row (headers, required fields, data types per REQ-FUN-011)

###### 2.5.8.10.1.4 Sequence Number

9

###### 2.5.8.10.1.5 Type

🔹 Validation

###### 2.5.8.10.1.6 Is Synchronous

✅ Yes

###### 2.5.8.10.1.7 Return Message



###### 2.5.8.10.1.8 Has Return

❌ No

###### 2.5.8.10.1.9 Is Activation

❌ No

###### 2.5.8.10.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | In-Memory |
| Method | validator.validateRow(row) |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | On failure, appends row data and error message to ... |
| Performance | Sub-millisecond per row. |

##### 2.5.8.10.2.0 Transformation

###### 2.5.8.10.2.1 Source Id

REPO-BE-CATALOG

###### 2.5.8.10.2.2 Target Id

REPO-BE-CATALOG

###### 2.5.8.10.2.3 Message

9.2. If valid, transform row to Product entity

###### 2.5.8.10.2.4 Sequence Number

10

###### 2.5.8.10.2.5 Type

🔹 Transformation

###### 2.5.8.10.2.6 Is Synchronous

✅ Yes

###### 2.5.8.10.2.7 Return Message



###### 2.5.8.10.2.8 Has Return

❌ No

###### 2.5.8.10.2.9 Is Activation

❌ No

###### 2.5.8.10.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | In-Memory |
| Method | mapper.toProductEntity(row) |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | Collects transformed entities in a buffer for bulk... |
| Performance | Sub-millisecond per row. |

### 2.5.9.0.0.0 DB Operation

#### 2.5.9.1.0.0 Source Id

REPO-BE-CATALOG

#### 2.5.9.2.0.0 Target Id

tech-aws-rds-postgresql

#### 2.5.9.3.0.0 Message

10. Begin Transaction

#### 2.5.9.4.0.0 Sequence Number

11

#### 2.5.9.5.0.0 Type

🔹 DB Operation

#### 2.5.9.6.0.0 Is Synchronous

✅ Yes

#### 2.5.9.7.0.0 Return Message



#### 2.5.9.8.0.0 Has Return

❌ No

#### 2.5.9.9.0.0 Is Activation

✅ Yes

#### 2.5.9.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | PostgreSQL Wire Protocol |
| Method | BEGIN; (via TypeORM QueryRunner) |
| Parameters | Isolation Level: READ COMMITTED |
| Authentication | AWS Secrets Manager for credentials |
| Error Handling | On failure to start transaction, job is marked as ... |
| Performance | < 5ms |

### 2.5.10.0.0.0 DB Operation

#### 2.5.10.1.0.0 Source Id

REPO-BE-CATALOG

#### 2.5.10.2.0.0 Target Id

tech-aws-rds-postgresql

#### 2.5.10.3.0.0 Message

11. Bulk insert/update valid Product entities

#### 2.5.10.4.0.0 Sequence Number

12

#### 2.5.10.5.0.0 Type

🔹 DB Operation

#### 2.5.10.6.0.0 Is Synchronous

✅ Yes

#### 2.5.10.7.0.0 Return Message

11.1. Returns count of affected rows

#### 2.5.10.8.0.0 Has Return

✅ Yes

#### 2.5.10.9.0.0 Is Activation

❌ No

#### 2.5.10.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | PostgreSQL Wire Protocol |
| Method | TypeORM repository.save(entities, { chunk: 1000 })... |
| Parameters | Array of Product entities |
| Authentication | AWS Secrets Manager for credentials |
| Error Handling | On failure, transaction is rolled back. Job is mar... |
| Performance | Optimized for high throughput (10k rows < 10s). |

### 2.5.11.0.0.0 DB Operation

#### 2.5.11.1.0.0 Source Id

REPO-BE-CATALOG

#### 2.5.11.2.0.0 Target Id

tech-aws-rds-postgresql

#### 2.5.11.3.0.0 Message

12. Commit Transaction

#### 2.5.11.4.0.0 Sequence Number

13

#### 2.5.11.5.0.0 Type

🔹 DB Operation

#### 2.5.11.6.0.0 Is Synchronous

✅ Yes

#### 2.5.11.7.0.0 Return Message



#### 2.5.11.8.0.0 Has Return

❌ No

#### 2.5.11.9.0.0 Is Activation

❌ No

#### 2.5.11.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | PostgreSQL Wire Protocol |
| Method | COMMIT; (via TypeORM QueryRunner) |
| Parameters | N/A |
| Authentication | AWS Secrets Manager for credentials |
| Error Handling | On failure, job is marked as failed. Data is alrea... |
| Performance | < 10ms |

### 2.5.12.0.0.0 File Upload

#### 2.5.12.1.0.0 Source Id

REPO-BE-CATALOG

#### 2.5.12.2.0.0 Target Id

tech-aws-s3

#### 2.5.12.3.0.0 Message

13. If errors occurred, upload generated error report CSV

#### 2.5.12.4.0.0 Sequence Number

14

#### 2.5.12.5.0.0 Type

🔹 File Upload

#### 2.5.12.6.0.0 Is Synchronous

✅ Yes

#### 2.5.12.7.0.0 Return Message

13.1. S3 confirms successful upload

#### 2.5.12.8.0.0 Has Return

✅ Yes

#### 2.5.12.9.0.0 Is Activation

❌ No

#### 2.5.12.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | S3.upload() |
| Parameters | Body: <error_csv_content>, Key: 'reports/{vendorId... |
| Authentication | IAM Role for EKS Service Account |
| Error Handling | Retry on failure. Log error if upload fails persis... |
| Performance | Dependent on report size. |

### 2.5.13.0.0.0 DB Operation

#### 2.5.13.1.0.0 Source Id

REPO-BE-CATALOG

#### 2.5.13.2.0.0 Target Id

tech-aws-rds-postgresql

#### 2.5.13.3.0.0 Message

14. Update job status with results

#### 2.5.13.4.0.0 Sequence Number

15

#### 2.5.13.5.0.0 Type

🔹 DB Operation

#### 2.5.13.6.0.0 Is Synchronous

✅ Yes

#### 2.5.13.7.0.0 Return Message



#### 2.5.13.8.0.0 Has Return

❌ No

#### 2.5.13.9.0.0 Is Activation

❌ No

#### 2.5.13.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | PostgreSQL Wire Protocol |
| Method | UPDATE ImportJobs SET status = 'Completed', ... |
| Parameters | { status, successCount, errorCount, errorReportUrl... |
| Authentication | AWS Secrets Manager for credentials |
| Error Handling | Critical operation. Retry on failure. |
| Performance | < 20ms |

### 2.5.14.0.0.0 API Request

#### 2.5.14.1.0.0 Source Id

REPO-BE-CATALOG

#### 2.5.14.2.0.0 Target Id

REPO-BE-CHAT

#### 2.5.14.3.0.0 Message

15. Publish completion event for vendor notification

#### 2.5.14.4.0.0 Sequence Number

16

#### 2.5.14.5.0.0 Type

🔹 API Request

#### 2.5.14.6.0.0 Is Synchronous

❌ No

#### 2.5.14.7.0.0 Return Message



#### 2.5.14.8.0.0 Has Return

❌ No

#### 2.5.14.9.0.0 Is Activation

✅ Yes

#### 2.5.14.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Internal (e.g., Redis Pub/Sub or direct call) |
| Method | notificationGateway.sendToUser |
| Parameters | Payload: { type: 'import:complete', jobId: '...', ... |
| Authentication | Internal Service Authentication |
| Error Handling | Log and alert on notification failure, but do not ... |
| Performance | P99 < 50ms |

### 2.5.15.0.0.0 WebSocket Push

#### 2.5.15.1.0.0 Source Id

REPO-BE-CHAT

#### 2.5.15.2.0.0 Target Id

REPO-FE-VEND

#### 2.5.15.3.0.0 Message

16. Push real-time notification to Vendor Dashboard

#### 2.5.15.4.0.0 Sequence Number

17

#### 2.5.15.5.0.0 Type

🔹 WebSocket Push

#### 2.5.15.6.0.0 Is Synchronous

❌ No

#### 2.5.15.7.0.0 Return Message



#### 2.5.15.8.0.0 Has Return

❌ No

#### 2.5.15.9.0.0 Is Activation

❌ No

#### 2.5.15.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | WSS (Secure WebSocket) |
| Method | emit('import:complete', payload) |
| Parameters | Payload from previous step. |
| Authentication | Connection authenticated with JWT |
| Error Handling | Client-side handling of connection drops and recon... |
| Performance | Latency < 2s |

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content

Security: Pre-signed URLs provide temporary, secure, direct-to-S3 upload access, preventing large file uploads from overwhelming the backend service and reducing data transfer costs.

#### 2.6.1.2.0.0 Position

top-right

#### 2.6.1.3.0.0 Participant Id

tech-aws-s3

#### 2.6.1.4.0.0 Sequence Number

3

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

Performance: The entire file is streamed from S3. This is crucial for performance and memory efficiency, as it allows processing of very large files without loading the entire content into the worker's memory.

#### 2.6.2.2.0.0 Position

middle-right

#### 2.6.2.3.0.0 Participant Id

REPO-BE-CATALOG

#### 2.6.2.4.0.0 Sequence Number

7

### 2.6.3.0.0.0 Content

#### 2.6.3.1.0.0 Content

Data Integrity: The bulk insert/update operation is wrapped in a single database transaction. If any part of the database write fails, the entire batch is rolled back, ensuring the database is never left in a partially updated state.

#### 2.6.3.2.0.0 Position

bottom-right

#### 2.6.3.3.0.0 Participant Id

tech-aws-rds-postgresql

#### 2.6.3.4.0.0 Sequence Number

11

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Vendor authentication is handled by a JWT. Service... |
| Performance Targets | The asynchronous job should process a CSV file of ... |
| Error Handling Strategy | Row-level errors during validation do not stop the... |
| Testing Considerations | Unit tests must cover validation logic for various... |
| Monitoring Requirements | Key metrics to monitor: SQS queue depth (`Approxim... |
| Deployment Considerations | The CSV processing logic should run in a separate ... |

