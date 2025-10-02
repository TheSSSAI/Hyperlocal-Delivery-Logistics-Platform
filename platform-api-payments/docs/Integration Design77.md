# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-payments |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 98% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-082

#### 1.2.1.2 Requirement Text

The system shall implement a dedicated financial module based on immutable, double-entry accounting principles to manage all monetary transactions. This module must automatically calculate the platform's commission for each completed order. The calculation inputs (order value, commission rate at the time of transaction) must be stored immutably with the transaction record to ensure auditability.

#### 1.2.1.3 Validation Criteria

- For a completed order, inspect the financial transaction records.
- Verify that corresponding debit and credit entries exist (double-entry).
- Verify the commission transaction record contains the exact order value and commission percentage used for the calculation.
- Verify that these transaction records cannot be altered after creation.

#### 1.2.1.4 Implementation Implications

- A 'FinancialTransaction' table is required, designed for double-entry bookkeeping (e.g., with debit_account, credit_account, amount fields).
- All financial state changes must be recorded as transactions; direct updates to balances are forbidden.
- Database permissions should restrict or prevent UPDATE/DELETE operations on historical transaction rows.

#### 1.2.1.5 Extraction Reasoning

This is a foundational requirement defining the core architectural principle of the Payments & Settlements service, as explicitly stated in its repository definition and purpose.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-033

#### 1.2.2.2 Requirement Text

The system shall calculate and apply a commission fee on each completed order. The commission must be calculated as a percentage of the order subtotal (before taxes and delivery fees). The commission rate must be configurable by an Administrator at a per-vendor or per-vendor-category level, with a system-wide default of 15%.

#### 1.2.2.3 Validation Criteria

- Verify that for a completed order, the commission recorded is correctly calculated based on the order subtotal and the applicable commission rate.
- Verify an Administrator can set a specific commission rate for an individual vendor.
- Verify an Administrator can set a commission rate for a category of vendors.
- Verify that if no specific rate is set, the default of 15% is used.

#### 1.2.2.4 Implementation Implications

- The service must have a mechanism to fetch the correct commission rate for a given vendor, respecting the hierarchy (vendor > category > default).
- The service must consume 'OrderDelivered' events which must contain the order subtotal.
- The commission calculation logic must be precise and handle floating-point arithmetic carefully.

#### 1.2.2.5 Extraction Reasoning

This requirement details the primary revenue calculation logic, which is a core responsibility of the Payments & Settlements service.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-083

#### 1.2.3.2 Requirement Text

The financial module shall aggregate net earnings for each vendor by subtracting commissions and other fees from their total sales over a settlement period. The system must process these payouts weekly on a T+2 banking day cycle. The vendor dashboard must provide a feature for vendors to download monthly financial statements in PDF or CSV format, detailing every transaction, the commission applied, and the final payout amounts.

#### 1.2.3.3 Validation Criteria

- Verify that a vendor's payout amount for a period is correctly calculated as (Total Sales - Total Commissions).
- Verify that the payout process is triggered weekly.
- Log in as a vendor and download a monthly statement. Verify it contains accurate, itemized financial data.

#### 1.2.3.4 Implementation Implications

- A scheduled job is required to run weekly to trigger the settlement process.
- The service must aggregate all financial transactions for each vendor within the settlement period.
- Requires integration with a payout API to disburse funds.

#### 1.2.3.5 Extraction Reasoning

This requirement defines the vendor settlement and payout process, a key function of this service as per its description.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-084

#### 1.2.4.2 Requirement Text

The financial module shall calculate total rider earnings, including delivery fees and tips. It must also track and reconcile COD amounts collected by the rider. The rider application must display a clear financial ledger showing all earnings, all COD collected, and the net balance (amount to be paid out to the rider or remitted by the rider). Riders must be able to download weekly earnings statements.

#### 1.2.4.3 Validation Criteria

- Check the rider ledger and verify that earnings and COD collected are accurately reflected.
- Verify the net balance is calculated correctly (Earnings - COD Collected).
- Download a weekly statement and verify its accuracy.

#### 1.2.4.4 Implementation Implications

- The service's ledger must track both earnings (credits) and COD collections (debits) for riders.
- The weekly settlement job must also process rider accounts, calculating net payouts or amounts owed.
- The service must expose an API for the rider app to fetch this ledger data.

#### 1.2.4.5 Extraction Reasoning

This requirement defines the rider settlement and reconciliation process, a key function of this service as per its description.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-085

#### 1.2.5.2 Requirement Text

The system shall integrate with the RazorpayX bulk payout API to automate weekly fund disbursements to vendors and riders. Every payout attempt made via the API must be logged, and the log must include the outcome of the attempt (e.g., success, failure) and a reason code or message if the payout failed.

#### 1.2.5.3 Validation Criteria

- Trigger a test payout for a vendor or rider.
- Verify that an API call is made to the RazorpayX service with the correct details.
- Check the payout logs to confirm the attempt and its outcome were recorded.

#### 1.2.5.4 Implementation Implications

- The service must include the RazorpayX SDK and handle its authentication.
- A 'Payouts' table is needed to log every attempt, its status, and any response from the gateway.
- Error handling for failed payouts is critical and must trigger alerts or a manual review process.

#### 1.2.5.5 Extraction Reasoning

This requirement specifies the exact third-party integration for payouts, which is central to this service's function.

### 1.2.6.0 Requirement Id

#### 1.2.6.1 Requirement Id

REQ-1-057

#### 1.2.6.2 Requirement Text

The system shall implement a stateful reconciliation process for online payments. If a payment is initiated but the confirmation callback from the gateway is not immediately received, the order status shall be set to payment_pending_confirmation. All API interactions with the payment gateway for a given transaction must be logged, including the unique transaction ID.

#### 1.2.6.3 Validation Criteria

- Simulate a payment scenario where the payment gateway callback is blocked or delayed.
- Verify that the order is created with the status 'payment_pending_confirmation'.
- Check the system logs and verify that the initial payment request and its transaction ID have been logged.

#### 1.2.6.4 Implementation Implications

- The service must be able to create a payment record with a 'pending' status.
- The service is responsible for logging the gatewayTransactionId received from Razorpay upon payment initiation.
- This implies an event-driven flow where the Order service creates an order in a pending state based on an event from this service.

#### 1.2.6.5 Extraction Reasoning

This requirement is explicitly mentioned in the repository's technology guidance as a critical error handling pattern for this service to implement.

### 1.2.7.0 Requirement Id

#### 1.2.7.1 Requirement Id

REQ-1-098

#### 1.2.7.2 Requirement Text

The system must be developed following OWASP Top 10 security practices... The system must achieve PCI-DSS compliance by ensuring no sensitive cardholder data is ever stored on its servers. The CI/CD pipeline must include automated vulnerability scanning for code dependencies and container images.

#### 1.2.7.3 Validation Criteria

- Confirm that the payment integration uses a method (e.g., tokenization) that avoids handling raw card data.

#### 1.2.7.4 Implementation Implications

- The integration with Razorpay must use a client-side tokenization method (e.g., Razorpay Checkout.js) where card details are sent directly from the client to Razorpay, and the service only handles a non-sensitive token.

#### 1.2.7.5 Extraction Reasoning

The repository description explicitly calls out PCI-DSS compliance as a primary driver for isolating this service, making this a core non-functional requirement.

## 1.3.0.0 Relevant Components

- {'component_name': 'Payments & Settlements Service', 'component_specification': 'This component is responsible for all financial operations on the platform. It manages the entire lifecycle of money, including initiating payments, processing refunds, calculating platform commissions from completed orders, and automating the weekly settlement and payout cycle for vendors and riders. It integrates directly with the Razorpay payment gateway.', 'implementation_requirements': ['Implement a double-entry, immutable ledger for all transactions.', 'Integrate with Razorpay for payment intent creation.', 'Integrate with RazorpayX for bulk payouts.', 'Develop a scheduled job for weekly settlement processing.', 'Implement a stateful reconciliation job for pending payments.', 'Expose APIs for creating payments and provide financial data to other services.', 'Consume events from the Order Management service to trigger financial workflows.'], 'architectural_context': "Belongs to the Application Services Layer. It encapsulates the 'Payments & Settlements' bounded context as defined by Domain-Driven Design.", 'extraction_reasoning': "This is the single component mapped to this repository, and its responsibilities directly align with the repository's description and list of relevant requirements."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer (Microservices)', 'layer_responsibilities': 'This layer implements the core business logic and workflows of the platform. Services in this layer are independently deployable, organized around business capabilities (Bounded Contexts), and communicate asynchronously via a messaging layer.', 'layer_constraints': ['Services must be containerized (Docker) and orchestrated by Kubernetes (EKS).', 'Services should be loosely coupled and communicate via events where possible.'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Event-Driven Architecture', 'Saga Pattern for distributed transactions'], 'extraction_reasoning': "The repository is explicitly mapped to this layer. Its role as a dedicated microservice for a specific business capability (financials) is a primary example of this layer's purpose."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IOrderEventsConsumer

#### 1.5.1.2 Source Repository

REPO-BE-ORDER

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

onOrderDelivered

###### 1.5.1.3.1.2 Method Signature

handleEvent(payload: OrderDeliveredEvent)

###### 1.5.1.3.1.3 Method Purpose

Listens for 'order.delivered' event to trigger commission calculation and record the sale in the financial ledger.

###### 1.5.1.3.1.4 Integration Context

Triggered when an order is successfully delivered, finalizing the transaction.

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

onOrderCancelled

###### 1.5.1.3.2.2 Method Signature

handleEvent(payload: OrderCancelledEvent)

###### 1.5.1.3.2.3 Method Purpose

Listens for 'order.cancelled' event to initiate a full or partial refund for prepaid orders.

###### 1.5.1.3.2.4 Integration Context

Triggered when an order is cancelled by any party (customer, vendor, system).

#### 1.5.1.4.0.0 Integration Pattern

Event-Driven (Choreography)

#### 1.5.1.5.0.0 Communication Protocol

Asynchronous messaging via AWS SNS/SQS. The service subscribes to an SNS topic where order events are published.

#### 1.5.1.6.0.0 Extraction Reasoning

The repository's dependency contract explicitly defines that it listens for events from the Order service. This is a primary input for its functionality for refunds and commission calculations.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

IUserInternalAPI

#### 1.5.2.2.0.0 Source Repository

REPO-BE-IDENT

#### 1.5.2.3.0.0 Method Contracts

- {'method_name': 'getBankDetailsForPayout', 'method_signature': 'GET /internal/users/{userId}/bank-details -> BankDetailsDTO', 'method_purpose': 'To securely fetch the verified bank account details for a specific user (vendor or rider) required for processing payouts.', 'integration_context': 'Called synchronously by the weekly settlement job just before initiating a payout.'}

#### 1.5.2.4.0.0 Integration Pattern

Synchronous Request/Response

#### 1.5.2.5.0.0 Communication Protocol

HTTPS/REST, secured by the internal service mesh (AWS App Mesh).

#### 1.5.2.6.0.0 Extraction Reasoning

The settlement process (REQ-1-083, REQ-1-084) requires fetching sensitive bank details. This must be done via a secure, internal API call to the authoritative Identity service.

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

IVendorInternalAPI

#### 1.5.3.2.0.0 Source Repository

REPO-BE-CATLG

#### 1.5.3.3.0.0 Method Contracts

- {'method_name': 'getCommissionRateForVendor', 'method_signature': 'GET /internal/vendors/{vendorId}/commission-rate -> { rate: number }', 'method_purpose': 'To fetch the applicable commission rate for a vendor, respecting the hierarchy (vendor-specific > category > default).', 'integration_context': "Called synchronously by the commission calculation logic after an 'OrderDeliveredEvent' is received."}

#### 1.5.3.4.0.0 Integration Pattern

Synchronous Request/Response

#### 1.5.3.5.0.0 Communication Protocol

HTTPS/REST, secured by the internal service mesh (AWS App Mesh).

#### 1.5.3.6.0.0 Extraction Reasoning

The commission calculation logic (REQ-1-033) is complex and depends on fetching the correct, potentially customized, rate from the Vendor & Catalog service.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IRazorpayWebhook

#### 1.5.4.2.0.0 Source Repository

External (Razorpay)

#### 1.5.4.3.0.0 Method Contracts

- {'method_name': 'handlePaymentEvents', 'method_signature': 'POST /webhooks/razorpay', 'method_purpose': "Receives asynchronous payment status updates from Razorpay, such as 'payment.captured' or 'payment.failed'.", 'integration_context': 'Triggered externally by Razorpay servers after a payment event occurs.'}

#### 1.5.4.4.0.0 Integration Pattern

Webhook (Asynchronous)

#### 1.5.4.5.0.0 Communication Protocol

HTTPS/REST. The endpoint must be publicly accessible via the API Gateway.

#### 1.5.4.6.0.0 Extraction Reasoning

This is the primary mechanism for receiving definitive payment confirmation, crucial for the order creation Saga and reconciliation process.

## 1.6.0.0.0.0 Exposed Interfaces

### 1.6.1.0.0.0 Interface Name

#### 1.6.1.1.0.0 Interface Name

IPaymentsAPI

#### 1.6.1.2.0.0 Consumer Repositories

- REPO-API-CLIENT

#### 1.6.1.3.0.0 Method Contracts

- {'method_name': 'createPaymentIntent', 'method_signature': 'POST /api/v1/payments/intent (body: { orderId: string, amount: number }) -> { clientSecret: string }', 'method_purpose': 'To create a payment order with the Razorpay gateway. This returns a client secret that the frontend application uses to initialize the Razorpay payment widget securely.', 'implementation_requirements': "This endpoint orchestrates the first step of the payment saga. It receives a request from the Order service, creates a payment record in 'pending' state, calls Razorpay to create a payment order, and returns the necessary details to the caller."}

#### 1.6.1.4.0.0 Service Level Requirements

- High Availability (>= 99.9%)
- P95 Latency < 500ms for createPaymentIntent endpoint, as it is in the critical user path.

#### 1.6.1.5.0.0 Implementation Constraints

- Must adhere to PCI-DSS compliance standards by not handling or storing sensitive cardholder data.
- Must log the `gatewayTransactionId` for every payment intent for reconciliation purposes (REQ-1-057).

#### 1.6.1.6.0.0 Extraction Reasoning

This is the primary synchronous interface exposed by the service for initiating all online payments, consumed by the Order service as part of the checkout Saga.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

IFinancialEventsPublisher

#### 1.6.2.2.0.0 Consumer Repositories

- REPO-BE-ORDER
- REPO-BE-NOTIF

#### 1.6.2.3.0.0 Method Contracts

##### 1.6.2.3.1.0 Method Name

###### 1.6.2.3.1.1 Method Name

publishPaymentSucceededEvent

###### 1.6.2.3.1.2 Method Signature

publish(event: PaymentSucceededEvent)

###### 1.6.2.3.1.3 Method Purpose

To notify the system that a payment for an order has been successfully captured. The Order service consumes this to move the order to the 'Pending Vendor Acceptance' state.

###### 1.6.2.3.1.4 Implementation Requirements

Publish a message with a well-defined schema from REPO-LIB-CONTRACTS to a dedicated SNS topic for payment events.

##### 1.6.2.3.2.0 Method Name

###### 1.6.2.3.2.1 Method Name

publishPaymentFailedEvent

###### 1.6.2.3.2.2 Method Signature

publish(event: PaymentFailedEvent)

###### 1.6.2.3.2.3 Method Purpose

To notify the system that a payment attempt has failed. The Order service consumes this to move the order to a 'Cancelled' state.

###### 1.6.2.3.2.4 Implementation Requirements

Publish a message with a well-defined schema to the payment events SNS topic.

##### 1.6.2.3.3.0 Method Name

###### 1.6.2.3.3.1 Method Name

publishPayoutProcessedEvent

###### 1.6.2.3.3.2 Method Signature

publish(event: PayoutProcessedEvent)

###### 1.6.2.3.3.3 Method Purpose

To notify the system that a weekly payout to a vendor or rider has been processed. The Notification service may consume this to inform the user.

###### 1.6.2.3.3.4 Implementation Requirements

Publish a message with a well-defined schema to a dedicated SNS topic for settlement events.

#### 1.6.2.4.0.0 Service Level Requirements

*No items available*

#### 1.6.2.5.0.0 Implementation Constraints

*No items available*

#### 1.6.2.6.0.0 Extraction Reasoning

These events are crucial for orchestrating workflows across the microservices architecture, such as updating order status after payment or notifying users about payouts.

### 1.6.3.0.0.0 Interface Name

#### 1.6.3.1.0.0 Interface Name

IFinancialDataAPI

#### 1.6.3.2.0.0 Consumer Repositories

- REPO-FE-RIDER
- REPO-FE-VEND
- REPO-FE-ADMIN

#### 1.6.3.3.0.0 Method Contracts

##### 1.6.3.3.1.0 Method Name

###### 1.6.3.3.1.1 Method Name

getRiderLedger

###### 1.6.3.3.1.2 Method Signature

GET /api/v1/riders/me/ledger -> RiderLedgerDTO

###### 1.6.3.3.1.3 Method Purpose

Provides the rider's financial ledger, including earnings, COD collected, and net balance, for display in the rider app.

###### 1.6.3.3.1.4 Implementation Requirements

Must be secured and scoped to the authenticated rider.

##### 1.6.3.3.2.0 Method Name

###### 1.6.3.3.2.1 Method Name

getVendorStatement

###### 1.6.3.3.2.2 Method Signature

GET /api/v1/vendors/me/statements/{month} -> StatementDTO

###### 1.6.3.3.2.3 Method Purpose

Provides the data for a vendor's monthly financial statement.

###### 1.6.3.3.2.4 Implementation Requirements

Must be secured and scoped to the authenticated vendor.

##### 1.6.3.3.3.0 Method Name

###### 1.6.3.3.3.1 Method Name

getPayoutLogs

###### 1.6.3.3.3.2 Method Signature

GET /api/v1/admin/payouts -> PaginatedResult<PayoutLogDTO>

###### 1.6.3.3.3.3 Method Purpose

Provides a searchable and filterable log of all payout attempts for administrators.

###### 1.6.3.3.3.4 Implementation Requirements

Must be secured and restricted to the 'Administrator' role.

#### 1.6.3.4.0.0 Service Level Requirements

*No items available*

#### 1.6.3.5.0.0 Implementation Constraints

*No items available*

#### 1.6.3.6.0.0 Extraction Reasoning

This interface exposes the necessary financial data required by the various frontend applications for their respective user roles (Rider, Vendor, Admin), enabling features like earnings tracking and reconciliation.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using NestJS on Node.js v18.18+ with TypeScript. It must use PostgreSQL for its database, managed via AWS RDS.

### 1.7.2.0.0.0 Integration Technologies

- Razorpay Payment Gateway SDK
- RazorpayX Payout API
- AWS SNS/SQS for asynchronous messaging
- AWS Secrets Manager for credentials
- Amazon ElastiCache (Redis) for caching and distributed locks/counters if needed.

### 1.7.3.0.0.0 Performance Constraints

The payment intent creation API must be low latency (<500ms P95). Weekly settlement and payout jobs are long-running batch processes and must be designed to be resilient, resumable, and not impact real-time transaction processing.

### 1.7.4.0.0.0 Security Requirements

This is a high-security service. It must achieve PCI-DSS compliance by not storing sensitive cardholder data. All credentials and API keys must be stored in AWS Secrets Manager. All data must be encrypted at rest and in transit. All financial operations must be logged in an immutable audit trail.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository's explicit mappings for requirement... |
| Cross Reference Validation | The service's role as a consumer of Order service ... |
| Implementation Readiness Assessment | The context is highly ready for implementation. Re... |
| Quality Assurance Confirmation | The extracted context is internally consistent and... |

