### **Software Requirements Specification**

#### **1. Introduction**

**1.2 Project Scope**

*   **REQ-SCP-001:** The platform shall connect local vendors, customers, and delivery riders in a three-sided marketplace. The platform shall include a customer-facing mobile application, a vendor-facing web dashboard, a rider-facing mobile application, and an administrative backend for platform management. The platform shall provide core functionalities including user onboarding, product discovery, order placement, payment processing, live delivery tracking, and a ratings/review system. The platform shall provide backend logistics including rider allocation, route optimization, and commission management. The platform shall explicitly exclude physical warehouse management or inventory ownership, international shipping and logistics, in-depth vendor-side Point of Sale (POS) or ERP integration, and the manufacturing or production of goods. The platform shall provide its own inventory management tools for vendors.

#### **2. Overall Description**

**2.1 Product Perspective**

*   **REQ-OVD-001:** The platform shall be a self-contained, cloud-native system. The system shall be designed using a microservices architecture and hosted on Amazon Web Services (AWS). The system shall interface with external systems, including payment gateways, mapping services, and notification services. The system shall provide a distinct mobile interface for Customers, a distinct web interface for Vendors, a distinct mobile interface for Riders, and a distinct web interface for Administrators.

**2.3 User Classes and Characteristics**

*   **REQ-USR-001:** The system shall enforce permissions based on a defined User Permissions Matrix.
    *   A Customer user role shall be able to create, read, and update their own profile and addresses; read vendor and product data; create and read their own orders; and create ratings and reviews.
    *   A Vendor user role shall be able to create, read, and update their own store profile, products, and inventory; read and update orders assigned to them; and read ratings and reviews for their store.
    *   A Rider user role shall be able to create, read, and update their own profile; read assigned delivery tasks; update the status of assigned deliveries; and read ratings and reviews for their performance.
    *   An Administrator user role shall have full Create, Read, Update, Delete (CRUD) access on all system data. All administrative actions that modify data (e.g., user suspension, order cancellation, configuration changes) must be logged in a dedicated, immutable audit trail. Critical delete operations shall require a two-step confirmation process.
    *   Chat permissions shall be enforced as follows: Customer, Vendor, and Rider roles can create and read messages only for active orders they are party to. Chat history shall become read-only upon order completion. The Administrator role shall have read-only access to all chat logs for support and moderation purposes.

**2.4 Operating Environment**

*   **REQ-DEP-001:** The system shall be deployed on Amazon Web Services (AWS), initially in the `ap-south-1` (Mumbai) region. The system deployment shall be configured across multiple Availability Zones for high availability. The project shall maintain separate Development, Staging, and Production environments, with strict network isolation between them using separate VPCs. Client devices (mobile phones, computers) shall have a stable internet connection to use the platform. All server-side software dependencies shall be managed via Docker containers, orchestrated by Kubernetes, specifically AWS Elastic Kubernetes Service (EKS).

**2.5 Design and Implementation Constraints**

*   **REQ-CON-001:** The system shall adhere to the technology stack mandated in Section 6.2 of the SRS. The platform shall support Cash on Delivery (COD) as a payment method. The platform shall comply with the following specific regulations:
    *   The system must comply with India's Digital Personal Data Protection Act (DPDP), 2023, by providing mechanisms for explicit, granular user consent management during onboarding and for data access requests. All Personally Identifiable Information (PII) such as name, phone number, address, and government IDs shall be classified as sensitive and protected with strict access controls and encryption at rest.
    *   The right to erasure shall be implemented by anonymizing the user's PII in historical order and transaction records, replacing personal details with generic placeholders (e.g., 'Deleted User'), while preserving the non-personal transactional data required for financial audits. The user shall be informed about this necessary data retention during the erasure process.
    *   For vendors requiring licenses (e.g., FSSAI, drug licenses), the system must store the license number and expiry date. The system shall send automated reminder notifications to the vendor 30, 15, and 7 days before license expiry. The system shall automatically prevent the vendor from accepting new orders if their license is expired and notify them of the license status. All changes to license information must be recorded in an audit log.

**2.6 Assumptions and Dependencies**

*   **REQ-DEP-002:** The platform's functionality shall be critically dependent on the availability and correctness of APIs from third-party payment gateways, mapping services (including geocoding and routing), and SMS/push notification providers. The system must implement robust error handling, circuit breakers, and fallback mechanisms for third-party service outages.

**2.7 Business Rules**

*   **REQ-BR-001:** The system shall enforce an administrator-configurable maximum order value for Cash on Delivery (COD) orders, with a default limit of ₹2,500.
*   **REQ-BR-002:** The system shall enforce an administrator-configurable delivery radius for each operational zone, with a default limit of 7 kilometers from the vendor's location.
*   **REQ-BR-003:** The system shall enforce a strict cancellation policy. Customers can cancel an order for a full refund within 60 seconds of placement. A fixed cancellation fee, configurable by an administrator with a default of ₹50, shall be applied if the cancellation occurs after a rider has been assigned to the order.
*   **REQ-BR-004:** The platform shall apply a commission on the order subtotal (exclusive of taxes and delivery fees). The commission percentage shall be configurable by an administrator per vendor or vendor category, with a default rate of 15%.
*   **REQ-BR-005:** Rider earnings shall be settled weekly via automated bank transfer on a T+2 banking day settlement cycle.

#### **3. System Features**

**3.1 User Management**

**3.1.1 User Registration & Onboarding**

*   **REQ-FUN-001:** The system shall allow a new Customer to register using a mobile number, which shall be verified via a One-Time Password (OTP). The system shall validate the mobile number format against Indian standards. The system shall allow a new Vendor to initiate registration by providing business name, address, contact info, and uploading required documents including GST certificate and FSSAI license (if applicable); the account status shall be `pending_verification` until an administrator approves it. The system shall allow a new Rider to initiate registration by providing personal details, driver's license, vehicle registration, bank details, and identity documents including Aadhaar and PAN card; the account status shall be `pending_verification` until an administrator approves it. The system shall display a clear error message if a user attempts to register with an already existing mobile number or email. The API response for a registration submission shall be less than 500ms.

**3.1.2 User Authentication**

*   **REQ-FUN-002:** The system shall allow a registered user to log in with their mobile number and an OTP sent to their registered mobile number. Upon successful OTP validation, the system shall issue a JSON Web Token (JWT) access token and a refresh token. Refresh tokens must be stored securely on the client device and be invalidated upon logout or suspicious activity. The system shall implement rate limiting on OTP generation requests to prevent abuse. The system shall display an error message for an invalid OTP entry and temporarily lock an account after 5 consecutive failed OTP attempts. The login process, from OTP request to token issuance, shall complete within 3 seconds.

**3.1.3 Profile Management**

*   **REQ-FUN-003:** The system shall allow a logged-in Customer to manage their name, email, and multiple delivery addresses. The system shall allow a logged-in Vendor to manage their store profile, including name, address, contact details, and business hours. The system shall allow a logged-in Rider to manage their personal contact information, vehicle details, and bank account for payouts. All changes to PII or financial information must trigger a notification to the user.

**3.2 Customer-Facing Features**

**3.2.1 Store and Product Discovery**

*   **REQ-FUN-004:** The customer application shall display a list of vendors based on the customer's current GPS location. It shall provide a search bar to allow searching for specific stores or items, with support for partial matches and typo tolerance. The system shall allow customers to filter search results by category, cuisine, rating, and price range. Search results shall be returned in under 500ms.

**3.2.2 Inventory and Availability Display**

*   **REQ-FUN-005:** Each product listing shall display a stock status of 'Available,' 'Limited Stock,' or 'Out of Stock'. The system shall prevent customers from adding 'Out of Stock' items to their cart. The 'Limited Stock' status shall be displayed when the stock quantity falls below a vendor-configurable threshold.

**3.2.3 Ordering and Cart Management**

*   **REQ-FUN-006:** The system shall allow customers to add items to the cart, remove items from the cart, and update item quantities. The cart shall display a subtotal, applicable taxes, delivery fees, and a final total amount. The system shall provide separate text fields for customers to add special instructions for the vendor and for the rider.

**3.2.4 Payment Processing**

*   **REQ-FUN-007:** The platform shall support Unified Payments Interface (UPI), Credit/Debit Cards, and Cash on Delivery (COD) as payment methods. An administrator shall be able to set a maximum order value limit for COD orders. Before processing a payment, the system must perform a final, real-time availability check for all items in the cart. If an item has become unavailable, the transaction shall be halted, and the customer shall be notified with an option to update their cart. A successful online payment shall move the associated order to the `pending` state for vendor acceptance. To handle integration failures, the system shall implement a stateful reconciliation process:
    *   If a payment confirmation callback from the payment gateway fails or is delayed, the order shall be placed in a `payment_pending_confirmation` state. All interactions with the payment gateway API (request, response, callbacks) must be logged with the associated transaction ID.
    *   A scheduled job shall periodically query the payment gateway's API using the transaction ID to reconcile the final payment status and update the order accordingly, preventing lost orders or financial discrepancies.

**3.2.5 Live Order Tracking**

*   **REQ-FUN-008:** After an order is picked up by a rider, the customer's order screen shall display a map showing the rider's current position, updating every 5-10 seconds. The map shall display the pickup location (vendor) and the delivery location (customer). The location data payload shall include latitude, longitude, timestamp, and accuracy. If the rider's GPS signal is temporarily lost, the map shall display their last known location with a timestamp. The latency for location updates from the rider's device to the customer's application shall be under 2 seconds.

**3.2.6 Ratings and Reviews**

*   **REQ-FUN-009:** The system shall prompt the customer to leave a rating after an order is marked as `delivered`. The rating system shall allow separate ratings on a 1 to 5-star scale and optional text reviews for the vendor/products and the rider. The system shall calculate and display average ratings on vendor profiles and calculate average ratings for riders, which shall be visible to administrators.

**3.3 Vendor-Facing Features**

**3.3.1 Vendor Order Management**

*   **REQ-FUN-010:** The vendor dashboard shall display new incoming orders with details including items, customer info, and special instructions, providing clear 'Accept' and 'Reject' actions. Vendors must accept or reject an order within a configurable time limit (default: 5 minutes). Upon accepting an order, the vendor must select an 'Estimated Preparation Time' from an administrator-configurable list with default values of '10-15 min', '15-20 min', and '20-30 min', which will be used to provide an updated ETA to the customer. If no action is taken within the time limit, the system shall automatically reject the order and notify the customer. All order rejections (manual or automatic) shall be logged for performance analysis.

**3.3.2 Vendor Inventory & Catalog Management**

*   **REQ-FUN-011:** The system shall provide an interface for vendors to add, edit, and delete products and categories. For each product, vendors can set the name, description, price, an image, and a numerical stock quantity. The system shall automatically derive and display the stock status ('Available', 'Limited Stock', 'Out of Stock') based on the numerical quantity and configurable thresholds. The system shall support bulk import and export of catalog items via a CSV file format. The CSV import functionality must include data validation for required columns, data types (e.g., price as a number), and provide a downloadable error report for failed rows.

**3.3.3 Store Availability Management**

*   **REQ-FUN-012:** The system shall allow vendors to define their daily business hours and prevent customers from placing orders outside these hours. The vendor dashboard shall provide a master switch to immediately take the store offline or bring it back online.

**3.4 Rider-Facing Features**

**3.4.1 Rider Task Management & Availability**

*   **REQ-FUN-013:** The rider application shall have a toggle to set the rider's status to 'Online' or 'Offline'. The system shall only assign new delivery tasks to 'Online' riders. When a new task is offered, the application shall display the vendor's name/address, customer's address, estimated distance, and earnings. The rider shall have the option to 'Accept' or 'Reject' the task within a set time limit (default: 60 seconds).

**3.4.2 Delivery Execution & Status Updates**

*   **REQ-FUN-014:** The rider application shall provide integrated map navigation to both pickup and drop-off locations. It shall allow the rider to update the order status with single-tap actions for: `Arrived at Store`, `Picked Up`, `Arrived at Destination`, and `Delivered`. Each status update shall trigger a real-time notification to the customer.

**3.4.3 Proof of Delivery (POD)**

*   **REQ-FUN-015:** The system shall support two configurable Proof of Delivery (POD) methods: photo capture and customer OTP confirmation. The default method for prepaid orders shall be capturing a photo of the delivered item at the doorstep. The system can be configured to require the rider to enter a 4-digit OTP displayed on the customer's application as POD. The captured POD (photo or OTP confirmation) shall be stored against the order record with metadata including a timestamp and the GPS coordinates of the capture location.

**3.4.4 COD and Earnings Management**

*   **REQ-FUN-016:** For COD orders, the rider application shall clearly display the exact amount of cash to be collected. It shall maintain a running total of 'cash-in-hand' from completed COD orders and provide instructions for the cash remittance process. A dedicated 'Earnings' section shall show a breakdown of earnings per delivery, tips, and total earnings over daily and weekly periods.

**3.5 Platform & Administrative Features**

**3.5.1 Order Lifecycle Management**

*   **REQ-FUN-017:** The system shall manage orders through the following discrete states: `Payment Pending`, `Pending Vendor Acceptance`, `Accepted`, `Preparing`, `Ready for Pickup`, `In Transit`, `Delivered`, `Cancelled`, `Allocation Failed`. Every transition in the order state must be recorded in an immutable order event log, capturing the timestamp, the new state, and the actor that triggered the change. The system shall allow customers to cancel an order according to the policy in REQ-BR-003. Vendors can cancel an order after acceptance in exceptional cases, which shall be tracked as a negative performance metric. The system shall have logic to process full or partial refunds back to the original payment source.

**3.5.2 Rider Allocation and Route Optimization**

*   **REQ-FUN-018:** The system shall initiate rider allocation when a vendor marks an order as `Ready for Pickup`. The allocation algorithm shall consider rider proximity, current load, performance rating, and potential for order batching with other deliveries in the same direction. The system shall suggest an optimized route based on real-time traffic data from the mapping service. If an assigned rider rejects the task or their timer expires, the system shall re-assign it to the next best rider.
    *   **Failure Protocol:** If no rider accepts the task after 3 attempts over 5 minutes, the order status shall change to `Allocation Failed`. This shall trigger a notification to the customer and vendor about the failure and create a high-priority alert for an administrator to intervene manually or trigger an automated order cancellation and refund.

**3.5.3 User and Service Area Management**

*   **REQ-FUN-019:** Administrators shall have a dashboard to view, search, and manage all users (customers, vendors, riders), with actions including approving registrations, suspending accounts, and deactivating accounts. Administrators shall be able to define operational zones using geofencing tools. The system shall prevent orders from being placed for delivery outside these zones. All changes to user statuses or operational zones must be logged in the audit trail.

**3.5.4 Communication and Support**

*   **REQ-FUN-020:** The system shall provide in-app chat between the customer and the assigned rider, and between the customer and the vendor for an active order. The chat interface shall support predefined quick-reply templates to facilitate common interactions. A dedicated helpdesk module shall allow all users to raise support tickets, which administrators can manage and respond to.

**3.6 Financial Management and Settlements**

*   **REQ-FUN-021:** The system shall include a dedicated financial module or microservice to manage the complete settlement lifecycle using immutable, double-entry accounting principles for all transactions.
    *   **Commission Calculation:** The system shall automatically calculate the platform's commission on each order based on a configurable structure, specifically a percentage of the order value. All inputs to the calculation (order value, commission rate) must be stored with the transaction record.
    *   **Vendor Payouts:** The system shall aggregate net earnings for each vendor (total sales minus commissions and fees) and process payouts according to a weekly schedule on a T+2 banking day settlement cycle. Vendors shall be able to download monthly financial statements detailing each transaction, commission, and the final payout amount.
    *   **Rider Settlements:** The system shall calculate rider earnings (delivery fees, tips) and manage the reconciliation of Cash on Delivery (COD) collections. The system shall provide a clear ledger for riders showing earnings, COD collected, and the net amount to be paid out or remitted. Riders shall be able to download weekly earnings statements.
    *   **Payout Integration:** The system shall integrate with the RazorpayX bulk payout API to automate the disbursement of funds to vendor and rider bank accounts. Every payout attempt and its outcome (success, failure, reason) must be logged.

#### **4. Interface Requirements**

**4.1 User Interfaces**

*   **REQ-INT-001:** The User Interface (UI) for all applications shall be clean, intuitive, and responsive, following modern design principles for a consistent user experience. The Vendor and Admin web dashboards shall be responsive on all modern web browsers and screen sizes. All user-facing interfaces shall strive for compliance with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. The mobile applications shall provide basic offline support, such as viewing cached data (e.g., order history, cart items) when the network is unavailable. A consistent branding and theme shall be applied across all applications.
*   **REQ-INT-005:** The system shall support localization and internationalization (I18N). Initially, all UI text shall be in English. The system shall correctly display currency in Indian Rupees (₹), and all dates and times shall be formatted according to the IST (Indian Standard Time) zone.

**4.2 Hardware Interfaces**

*   **REQ-INT-002:** The customer and rider mobile applications shall require access to the device's GPS. The rider application shall require camera access for Proof of Delivery photos. The vendor application shall require camera access for uploading product images. The applications must gracefully handle cases where hardware permissions are denied by the user, explaining why the permission is needed to enable the feature.

**4.3 Software Interfaces**

*   **REQ-INT-003:** The platform shall integrate with the Razorpay payment gateway via server-side SDKs, Mapbox APIs for location services, Firebase Cloud Messaging (FCM) for push notifications, and AWS Simple Notification Service (SNS) for transactional SMS. All external API integrations must be versioned to ensure backward compatibility and stable operation during third-party updates. The system shall implement contract testing for critical third-party APIs to detect breaking changes early.

**4.4 Communication Interfaces**

*   **REQ-INT-004:** All communication between clients and the backend shall occur over HTTPS/TLS 1.2 or higher. Real-time communication for tracking and chat shall use the Secure WebSocket (WSS) protocol. The standard data format for all API requests and responses shall be JSON. All public-facing APIs shall be versioned (e.g., /api/v1/).

#### **5. Non-Functional Requirements**

**5.1 Performance Requirements**

*   **REQ-NFR-001:** The 95th percentile (P95) latency for all critical APIs shall be under 200ms. Core web pages on dashboards shall achieve a Largest Contentful Paint (LCP) of under 2.5 seconds. The time from an order being marked `Ready for Pickup` to a rider being assigned shall be under 30 seconds. The latency for broadcasting rider location updates shall be under 2 seconds. The system shall be designed to process a minimum of 100 orders per minute during peak hours.

**5.2 Backup, Recovery, and Data Retention**

*   **REQ-NFR-002:** The primary PostgreSQL database (AWS RDS) shall have automated daily snapshots with point-in-time recovery enabled, and backups shall be retained for a minimum of 30 days. The production environment shall be deployed in a Multi-AZ configuration on AWS with automatic failover, targeting a Recovery Point Objective (RPO) of less than 5 minutes and a Recovery Time Objective (RTO) of less than 15 minutes. Disaster recovery procedures shall be documented and tested on a semi-annual basis. Microservices shall implement circuit breaker patterns to prevent cascading failures.
*   **REQ-NFR-007:** The system shall adhere to a formal data retention policy:
    *   Order details and transaction records shall be retained for a minimum of 7 years for financial and tax auditing purposes.
    *   Inactive user profiles and associated Personally Identifiable Information (PII) shall be anonymized after 2 years of inactivity. Upon a valid erasure request, PII associated with the user will be anonymized in historical records, while the non-personal transactional data is retained for legal compliance.
    *   Sensitive operational data, such as Proof-of-Delivery photos and in-app chat logs, shall be permanently deleted after 90 days from order completion.
    *   System and application logs shall be retained in CloudWatch for 90 days for debugging and analysis, after which they shall be archived to AWS S3 Glacier for a total of 1 year.

**5.3 Security Requirements**

*   **REQ-NFR-003:** User authentication shall be managed by AWS Cognito. The system shall use short-lived JWT access tokens and long-lived refresh tokens. A Role-Based Access Control (RBAC) model shall be implemented and enforced at the API Gateway and microservice levels. All data in transit shall be encrypted using HTTPS/TLS 1.2+, and all data at rest (RDS, ElastiCache, S3) shall be encrypted using AWS KMS. All application secrets, including database credentials and third-party API keys, shall be managed via AWS Secrets Manager and securely injected into the runtime environment. The platform shall adhere to OWASP Top 10 security practices, including robust input validation on all user-supplied data to prevent injection attacks. The platform shall be PCI-DSS compliant by never storing sensitive card data on platform servers. The system shall undergo regular, automated vulnerability scanning of code dependencies and container images within the CI/CD pipeline, and an annual third-party penetration test.

**5.4 Quality Attributes**

**5.4.1 Availability**

*   **REQ-NFR-004:** The platform services shall maintain an uptime of 99.9%, measured monthly, excluding scheduled maintenance. Planned maintenance shall be scheduled during off-peak hours between 2 AM and 4 AM IST, and users shall be notified at least 24 hours in advance. In the event of a partial system failure, core functionality (e.g., order placement) shall remain operational through graceful degradation.

**5.4.2 Scalability**

*   **REQ-NFR-005:** The system shall be designed to support an initial load of 10,000 concurrent users. All microservices shall be containerized and deployed on Kubernetes with Horizontal Pod Autoscalers (HPA) configured based on CPU and memory utilization. The EKS cluster shall use the Cluster Autoscaler to manage nodes. The primary database shall use read replicas to scale read-heavy workloads. Database connection pooling shall be implemented and tuned to handle the expected concurrent load.

**5.4.3 Maintainability**

*   **REQ-NFR-006:** All backend services shall maintain a minimum of 80% unit and integration test coverage, implemented using the Jest testing framework. Frontend applications shall adhere to the same coverage standard using Jest and React Testing Library. End-to-end testing shall be automated using Cypress. All APIs shall be documented using the OpenAPI specification. The microservices architecture shall enforce a clean separation of concerns for independent development, testing, and deployment. A consistent coding style, enforced by linters and formatters (ESLint, Prettier), shall be maintained across all codebases. A formal code review process requiring at least one peer approval shall be enforced for all pull requests to the main branch.

**5.4.4 Auditability and Documentation**

*   **REQ-NFR-008:** The system must provide a comprehensive audit trail for all security-sensitive and financially significant events. This includes, but is not limited to, user login attempts, changes to user permissions, administrative actions, order cancellations, refunds, and payout processing. Each audit log entry must contain a timestamp, the user/system actor responsible, the action performed, and the outcome.
*   **REQ-NFR-009:** The project shall maintain up-to-date documentation including:
    *   **User Documentation:** User guides for customers, vendors, and riders.
    *   **Technical Documentation:** System architecture diagrams, API documentation (OpenAPI), and data models.
    *   **Operational Documentation:** Runbooks for common operational tasks, incident response procedures, and disaster recovery plans.

#### **6. Other Requirements**

**6.1 System Architecture**

*   **REQ-ARC-001:** The system shall be designed using a Microservices Architecture pattern.
    *   **Service Decomposition:** Initial high-level service boundaries shall be defined based on Domain-Driven Design (DDD) principles. Core bounded contexts shall include 'Identity & Access', 'Order Management', 'Vendor & Catalog', 'Rider Logistics', and 'Payments & Settlements'. Each service shall have a clear charter outlining its responsibilities and data ownership.
    *   **Communication:** Services shall prefer asynchronous communication via a message bus (AWS SQS/SNS) for background tasks and decoupling. The Saga pattern shall be implemented for managing data consistency across services in distributed transactions. Synchronous request/response communication is permitted for user-facing operations that require an immediate and definitive outcome.
    *   **API Exposure:** Services shall expose APIs through a central API Gateway. Inter-service communication shall be managed and secured using a service mesh, specifically AWS App Mesh, to handle traffic routing, observability, and resilience patterns.

**6.2 Technology Stack**

*   **REQ-TEC-001:**
    *   **Frontend:** React Native v0.73+ (Mobile), React.js v18.2+ with Vite (Web), Redux Toolkit and React Query (State Management).
    *   **Backend:** Node.js v18.18+ with NestJS Framework (TypeScript), REST and WebSockets (via Socket.IO).
    *   **Data Tier:** Amazon RDS for PostgreSQL v15.4+ with PostGIS, Amazon ElastiCache for Redis, Amazon OpenSearch Service, Amazon S3.
    *   **Infrastructure & Cloud Services:** Amazon Web Services (AWS), Amazon EKS (Elastic Kubernetes Service), Amazon API Gateway (HTTP & WebSocket), Amazon SQS & SNS, AWS App Mesh, AWS Secrets Manager, AWS Cognito, AWS KMS.
    *   **DevOps & Tooling:** GitHub Actions (CI/CD), Terraform (Infrastructure as Code), Docker, ESLint, Prettier.
    *   **Testing:** Jest, React Testing Library (Frontend), Cypress (End-to-End).
    *   **Third-Party Integrations:** Razorpay (Payments), Mapbox (Mapping), Firebase Cloud Messaging (Push Notifications).

#### **7. Reporting, Monitoring & Logging**

**7.1 Reports**

*   **REQ-REP-001:** The admin dashboard shall provide detailed reports on sales, delivery performance, vendor performance, and rider performance. The vendor dashboard shall provide reports on their own sales, top-selling items, and order history. The rider application shall provide a history of completed deliveries and detailed earnings statements. All reports shall be exportable in CSV and PDF formats. Data freshness for all reports shall be clearly indicated, with near-real-time data for operational dashboards and up to 24-hour latency for analytical reports.

**7.2 Monitoring & Logging**

*   **REQ-REP-002:** The system shall use Prometheus for metrics and Grafana for visualization dashboards. All application and system logs shall be centralized in AWS CloudWatch Logs in a structured JSON format. The system shall implement OpenTelemetry across all services for distributed tracing. Prometheus Alertmanager shall be used for real-time alerts on system health and performance degradation.
    *   **Key Metrics & Alerts:** Monitoring shall include, but not be limited to: API latency and error rates (per endpoint), database connection pool utilization, message queue depth, Kubernetes pod health (CPU/memory), and third-party API success/failure rates. Alerts shall be categorized by severity (P1-Critical, P2-Warning) and routed to the appropriate on-call personnel via defined escalation policies.
    *   **Business Metrics:** A dedicated Grafana dashboard shall be created for administrators to monitor key business metrics in real-time, including orders per minute, rider allocation success rate, average delivery time, and payment success rates.
    *   **Correlation ID:** Every log entry, across all services, must include a `correlationId` (or trace ID). This ID must be generated at the API Gateway for new requests or propagated from incoming messages and be passed consistently through all subsequent internal API calls and asynchronous events to enable effective request tracing.

#### **8. Transition Requirements**

**8.1 Implementation Approach**

*   **REQ-TRN-001:** The platform shall be launched using a phased rollout strategy, beginning with a pilot launch in designated zones within Mumbai (`ap-south-1`). Subsequent rollouts to new geographical areas shall be contingent on the successful stabilization and performance of the platform in the initial zones.

**8.2 Data Migration Strategy**

*   **REQ-TRN-002:** For initial vendor onboarding, a data migration path shall be provided.
    *   **Extraction:** Vendor and catalog data shall be extracted from vendor-provided spreadsheets in CSV or XLSX format.
    *   **Transformation:** A dedicated data transformation script shall validate, clean, and map the extracted data to the platform's database schema.
    *   **Loading:** The transformed data shall be loaded into the system using the bulk import functionality defined in REQ-FUN-011.
    *   **Validation:** Post-migration, a dedicated onboarding team and the respective vendors shall perform a sanity check on a sample of the migrated data to ensure accuracy and completeness.

**8.3 Training Requirements**

*   **REQ-TRN-003:** Role-specific training shall be provided to all user classes prior to go-live in a new operational zone.
    *   **Vendors:** Training shall be delivered via online webinars, pre-recorded video tutorials, and a comprehensive knowledge base. Topics will cover dashboard navigation, order management, inventory updates, and financial reporting.
    *   **Riders:** Training shall consist of a mandatory virtual onboarding session covering app usage, delivery protocols, COD handling procedures, customer interaction standards, and safety guidelines.
    *   **Administrators:** Training shall be conducted through hands-on sessions covering the full scope of the admin backend, including user management, support ticket resolution, financial reconciliation, and system monitoring.

**8.4 Cutover Plan**

*   **REQ-TRN-004:** A formal cutover plan shall be executed for the launch of each new operational zone.
    *   **Pre-Go-Live (T-72h to T-1h):** Final data migration, deployment of production-ready code, comprehensive system health checks, and final communication to all stakeholders.
    *   **Go-Live (T-0):** The system is made live for the target zone, enabling new user registrations and order placements. A dedicated "hypercare" support team shall be on standby for immediate issue resolution.
    *   **Post-Go-Live (T+1 to T+7 days):** Intensive monitoring of system performance, user feedback channels, and key business metrics.
    *   **Fallback Procedure:** In the event of a critical system failure during cutover, the immediate fallback procedure is to disable new order placement in the affected zone. The incident response team will then perform root cause analysis and deploy a hotfix. A full rollback is not planned; the focus is on rapid forward-resolution.

**8.5 Legacy System Decommissioning**

*   **REQ-TRN-005:** Not applicable. The platform is a new greenfield system with no legacy system to decommission.