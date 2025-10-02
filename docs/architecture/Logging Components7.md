# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Node.js (NestJS)
- React Native
- React.js
- PostgreSQL (AWS RDS)
- Amazon EKS
- AWS SQS/SNS
- AWS CloudWatch
- Prometheus
- OpenTelemetry

## 1.3 Monitoring Requirements

- REQ-1-108: Centralized, structured JSON logging in AWS CloudWatch.
- REQ-1-110: Mandatory 'correlationId' in all log entries for distributed tracing.
- REQ-1-109: Real-time alerting on key metrics via Prometheus Alertmanager.
- REQ-1-095: Specific data and log retention policies.
- REQ-1-102: Comprehensive audit trail for sensitive events.

## 1.4 System Architecture

Event-Driven Microservices on Amazon EKS

## 1.5 Environment

production

# 2.0 Log Level And Category Strategy

## 2.1 Default Log Level

INFO

## 2.2 Environment Specific Levels

### 2.2.1 Environment

#### 2.2.1.1 Environment

production

#### 2.2.1.2 Log Level

INFO

#### 2.2.1.3 Justification

Provides a balance of operational visibility and cost-effectiveness for the production environment.

### 2.2.2.0 Environment

#### 2.2.2.1 Environment

staging

#### 2.2.2.2 Log Level

DEBUG

#### 2.2.2.3 Justification

Enables detailed logging for pre-production testing and troubleshooting without impacting production performance.

### 2.2.3.0 Environment

#### 2.2.3.1 Environment

development

#### 2.2.3.2 Log Level

DEBUG

#### 2.2.3.3 Justification

Allows developers to trace code execution paths and debug issues effectively during development.

## 2.3.0.0 Component Categories

### 2.3.1.0 Component

#### 2.3.1.1 Component

Order Management Service

#### 2.3.1.2 Category

🔹 SagaOrchestration

#### 2.3.1.3 Log Level

INFO

#### 2.3.1.4 Verbose Logging

✅ Yes

#### 2.3.1.5 Justification

Saga steps are critical state transitions. DEBUG level logging should be enabled during incident response to trace distributed transactions.

### 2.3.2.0 Component

#### 2.3.2.1 Component

Payments & Settlements Service

#### 2.3.2.2 Category

🔹 FinancialTransaction

#### 2.3.2.3 Log Level

INFO

#### 2.3.2.4 Verbose Logging

✅ Yes

#### 2.3.2.5 Justification

All payment gateway interactions and settlement calculations are financially sensitive and require detailed, auditable logs. DEBUG level is critical for resolving discrepancies.

### 2.3.3.0 Component

#### 2.3.3.1 Component

Rider Logistics Service

#### 2.3.3.2 Category

🔹 LocationTracking

#### 2.3.3.3 Log Level

INFO

#### 2.3.3.4 Verbose Logging

❌ No

#### 2.3.3.5 Justification

High-volume location updates should be logged at INFO for key events (e.g., entering a geofence) but not for every coordinate update to manage costs.

## 2.4.0.0 Sampling Strategies

- {'component': 'Rider Logistics Service', 'samplingRate': '1%', 'condition': 'Successful real-time location update processing.', 'reason': 'Reduces log volume and cost from high-frequency GPS updates (REQ-1-059) while still providing a representative sample for performance monitoring. Error logs should never be sampled.'}

## 2.5.0.0 Logging Approach

### 2.5.1.0 Structured

✅ Yes

### 2.5.2.0 Format

JSON

### 2.5.3.0 Standard Fields

- timestamp
- logLevel
- serviceName
- correlationId
- message
- actorId
- actorType
- durationMs

### 2.5.4.0 Custom Fields

- orderId
- riderId
- vendorId
- transactionId
- podName
- namespace

# 3.0.0.0 Log Aggregation Architecture

## 3.1.0.0 Collection Mechanism

### 3.1.1.0 Type

🔹 agent

### 3.1.2.0 Technology

Fluent Bit

### 3.1.3.0 Configuration

| Property | Value |
|----------|-------|
| Deployment | DaemonSet on EKS nodes |
| Parsers | JSON parser for application logs |
| Filters | Kubernetes filter to enrich logs with pod name, na... |

### 3.1.4.0 Justification

Fluent Bit is lightweight and efficient for collecting container logs from EKS nodes and forwarding them to AWS CloudWatch as required by the architecture (REQ-1-018, REQ-1-108).

## 3.2.0.0 Strategy

| Property | Value |
|----------|-------|
| Approach | centralized |
| Reasoning | Mandated by REQ-1-108 to provide a single pane of ... |
| Local Retention | 1 day |

## 3.3.0.0 Shipping Methods

- {'protocol': 'HTTP', 'destination': 'AWS CloudWatch Logs API', 'reliability': 'at-least-once', 'compression': True}

## 3.4.0.0 Buffering And Batching

| Property | Value |
|----------|-------|
| Buffer Size | 5MB |
| Batch Size | 1000 |
| Flush Interval | 5s |
| Backpressure Handling | File system buffering on the EKS node |

## 3.5.0.0 Transformation And Enrichment

- {'transformation': 'Add Kubernetes Metadata', 'purpose': 'Enriches logs with contextual information like pod name, namespace, and container ID for precise troubleshooting.', 'stage': 'collection'}

## 3.6.0.0 High Availability

| Property | Value |
|----------|-------|
| Required | ✅ |
| Redundancy | Managed by AWS CloudWatch Logs service |
| Failover Strategy | The Fluent Bit agent will buffer logs locally and ... |

# 4.0.0.0 Retention Policy Design

## 4.1.0.0 Retention Periods

### 4.1.1.0 Log Type

#### 4.1.1.1 Log Type

application-logs

#### 4.1.1.2 Retention Period

90 days (hot) + archive for total 1 year (cold)

#### 4.1.1.3 Justification

Explicitly defined in REQ-1-095 for debugging and short-term analysis.

#### 4.1.1.4 Compliance Requirement

N/A

### 4.1.2.0 Log Type

#### 4.1.2.1 Log Type

audit-logs

#### 4.1.2.2 Retention Period

7 years

#### 4.1.2.3 Justification

Matches the data retention requirement for financial and tax auditing purposes as per REQ-1-095.

#### 4.1.2.4 Compliance Requirement

Financial Auditability

### 4.1.3.0 Log Type

#### 4.1.3.1 Log Type

security-logs

#### 4.1.3.2 Retention Period

1 year

#### 4.1.3.3 Justification

Standard practice for security incident investigation.

#### 4.1.3.4 Compliance Requirement

PCI-DSS

## 4.2.0.0 Compliance Requirements

### 4.2.1.0 Regulation

#### 4.2.1.1 Regulation

DPDP Act, 2023 (REQ-1-021)

#### 4.2.1.2 Applicable Log Types

- application-logs
- audit-logs

#### 4.2.1.3 Minimum Retention

N/A

#### 4.2.1.4 Special Handling

PII must be masked or excluded from logs unless explicitly required for a documented purpose.

### 4.2.2.0 Regulation

#### 4.2.2.1 Regulation

PCI-DSS (REQ-1-098)

#### 4.2.2.2 Applicable Log Types

- application-logs
- security-logs

#### 4.2.2.3 Minimum Retention

1 year

#### 4.2.2.4 Special Handling

Sensitive cardholder data must never be logged. Log access must be strictly controlled and audited.

## 4.3.0.0 Volume Impact Analysis

| Property | Value |
|----------|-------|
| Estimated Daily Volume | 500 GB - 1 TB |
| Storage Cost Projection | High, necessitating the tiered storage strategy. |
| Compression Ratio | 10:1 estimated |

## 4.4.0.0 Storage Tiering

### 4.4.1.0 Hot Storage

| Property | Value |
|----------|-------|
| Duration | 90 days |
| Accessibility | immediate |
| Cost | high |

### 4.4.2.0 Warm Storage

| Property | Value |
|----------|-------|
| Duration | N/A |
| Accessibility | N/A |
| Cost | N/A |

### 4.4.3.0 Cold Storage

| Property | Value |
|----------|-------|
| Duration | From day 91 to 1 year |
| Accessibility | hours |
| Cost | low |

## 4.5.0.0 Compression Strategy

| Property | Value |
|----------|-------|
| Algorithm | Gzip |
| Compression Level | default |
| Expected Ratio | 10:1 |

## 4.6.0.0 Anonymization Requirements

- {'dataType': 'PII (name, address, phone)', 'method': 'Masking', 'timeline': 'At time of ingestion', 'compliance': 'DPDP Act'}

# 5.0.0.0 Search Capability Requirements

## 5.1.0.0 Essential Capabilities

### 5.1.1.0 Capability

#### 5.1.1.1 Capability

Search by correlationId

#### 5.1.1.2 Performance Requirement

< 5 seconds

#### 5.1.1.3 Justification

Critical for distributed tracing as per REQ-1-110.

### 5.1.2.0 Capability

#### 5.1.2.1 Capability

Free-text search on error messages

#### 5.1.2.2 Performance Requirement

< 10 seconds

#### 5.1.2.3 Justification

Essential for troubleshooting unknown issues.

### 5.1.3.0 Capability

#### 5.1.3.1 Capability

Filtered search by serviceName, orderId, userId

#### 5.1.3.2 Performance Requirement

< 5 seconds

#### 5.1.3.3 Justification

Required for targeted debugging of specific transactions or user sessions.

## 5.2.0.0 Performance Characteristics

| Property | Value |
|----------|-------|
| Search Latency | < 10 seconds for queries on hot storage |
| Concurrent Users | 50 |
| Query Complexity | complex |
| Indexing Strategy | Managed by AWS CloudWatch Logs Insights |

## 5.3.0.0 Indexed Fields

### 5.3.1.0 Field

#### 5.3.1.1 Field

correlationId

#### 5.3.1.2 Index Type

Key

#### 5.3.1.3 Search Pattern

Exact match

#### 5.3.1.4 Frequency

high

### 5.3.2.0 Field

#### 5.3.2.1 Field

orderId

#### 5.3.2.2 Index Type

Key

#### 5.3.2.3 Search Pattern

Exact match

#### 5.3.2.4 Frequency

high

### 5.3.3.0 Field

#### 5.3.3.1 Field

logLevel

#### 5.3.3.2 Index Type

Key

#### 5.3.3.3 Search Pattern

Exact match

#### 5.3.3.4 Frequency

high

### 5.3.4.0 Field

#### 5.3.4.1 Field

serviceName

#### 5.3.4.2 Index Type

Key

#### 5.3.4.3 Search Pattern

Exact match

#### 5.3.4.4 Frequency

high

## 5.4.0.0 Full Text Search

### 5.4.1.0 Required

✅ Yes

### 5.4.2.0 Fields

- message

### 5.4.3.0 Search Engine

AWS CloudWatch Logs Insights

### 5.4.4.0 Relevance Scoring

✅ Yes

## 5.5.0.0 Correlation And Tracing

### 5.5.1.0 Correlation Ids

- correlationId

### 5.5.2.0 Trace Id Propagation

Handled by OpenTelemetry instrumentation as per REQ-1-108.

### 5.5.3.0 Span Correlation

✅ Yes

### 5.5.4.0 Cross Service Tracing

✅ Yes

## 5.6.0.0 Dashboard Requirements

- {'dashboard': 'Error Rate Dashboard', 'purpose': 'Visualize log-based error rates per service.', 'refreshInterval': '1m', 'audience': 'SRE/On-Call'}

# 6.0.0.0 Storage Solution Selection

## 6.1.0.0 Selected Technology

### 6.1.1.0 Primary

AWS CloudWatch Logs

### 6.1.2.0 Reasoning

Mandated by REQ-1-108. Tightly integrated with the AWS ecosystem (EKS, IAM, S3) and provides the required search and analysis capabilities.

### 6.1.3.0 Alternatives

- ELK Stack
- Datadog

## 6.2.0.0 Scalability Requirements

| Property | Value |
|----------|-------|
| Expected Growth Rate | 50% Month-over-Month in first year |
| Peak Load Handling | 100 orders/minute (REQ-1-093) |
| Horizontal Scaling | ✅ |

## 6.3.0.0 Cost Performance Analysis

- {'solution': 'CloudWatch Logs + S3 Glacier', 'costPerGB': 'Tiered (high for ingest/hot, low for cold)', 'queryPerformance': 'High for hot storage, low for cold storage.', 'operationalComplexity': 'low'}

## 6.4.0.0 Backup And Recovery

| Property | Value |
|----------|-------|
| Backup Frequency | Managed by AWS |
| Recovery Time Objective | N/A (highly available service) |
| Recovery Point Objective | < 1 minute |
| Testing Frequency | N/A |

## 6.5.0.0 Geo Distribution

### 6.5.1.0 Required

❌ No

### 6.5.2.0 Regions

- ap-south-1

### 6.5.3.0 Replication Strategy

N/A

## 6.6.0.0 Data Sovereignty

- {'region': 'ap-south-1 (Mumbai)', 'requirements': ['All log data to be stored within Indian borders to comply with data residency regulations.'], 'complianceFramework': 'DPDP Act'}

# 7.0.0.0 Access Control And Compliance

## 7.1.0.0 Access Control Requirements

### 7.1.1.0 Role

#### 7.1.1.1 Role

SRE/On-Call Engineer

#### 7.1.1.2 Permissions

- read
- query

#### 7.1.1.3 Log Types

- application-logs
- security-logs
- audit-logs

#### 7.1.1.4 Justification

Required for production troubleshooting and incident response.

### 7.1.2.0 Role

#### 7.1.2.1 Role

Developer

#### 7.1.2.2 Permissions

- read
- query

#### 7.1.2.3 Log Types

- application-logs

#### 7.1.2.4 Justification

Limited to non-production environments (dev/staging) for development and testing purposes.

### 7.1.3.0 Role

#### 7.1.3.1 Role

Auditor

#### 7.1.3.2 Permissions

- read-only

#### 7.1.3.3 Log Types

- audit-logs
- security-logs

#### 7.1.3.4 Justification

Required for compliance audits.

## 7.2.0.0 Sensitive Data Handling

### 7.2.1.0 Data Type

#### 7.2.1.1 Data Type

PII

#### 7.2.1.2 Handling Strategy

mask

#### 7.2.1.3 Fields

- customer.name
- customer.address
- customer.phone

#### 7.2.1.4 Compliance Requirement

DPDP Act (REQ-1-021)

### 7.2.2.0 Data Type

#### 7.2.2.1 Data Type

Sensitive Cardholder Data

#### 7.2.2.2 Handling Strategy

exclude

#### 7.2.2.3 Fields

- pan
- cvv
- expiry

#### 7.2.2.4 Compliance Requirement

PCI-DSS (REQ-1-098)

## 7.3.0.0 Encryption Requirements

### 7.3.1.0 In Transit

| Property | Value |
|----------|-------|
| Required | ✅ |
| Protocol | TLS 1.2+ |
| Certificate Management | AWS Certificate Manager (ACM) |

### 7.3.2.0 At Rest

| Property | Value |
|----------|-------|
| Required | ✅ |
| Algorithm | AES-256 |
| Key Management | AWS KMS |

## 7.4.0.0 Audit Trail

| Property | Value |
|----------|-------|
| Log Access | ✅ |
| Retention Period | 1 year |
| Audit Log Location | AWS CloudTrail |
| Compliance Reporting | ✅ |

## 7.5.0.0 Regulatory Compliance

- {'regulation': 'PCI-DSS', 'applicableComponents': ['Payments & Settlements Service', 'API Gateway'], 'specificRequirements': ['Do not log sensitive cardholder data.', 'Audit all access to log data.'], 'evidenceCollection': 'CloudTrail logs, IAM policies, application code review.'}

## 7.6.0.0 Data Protection Measures

- {'measure': 'PII Masking Filter', 'implementation': 'A filter in the Fluent Bit collection agent to identify and mask PII patterns before shipping to CloudWatch.', 'monitoringRequired': True}

# 8.0.0.0 Project Specific Logging Config

## 8.1.0.0 Logging Config

### 8.1.1.0 Level

🔹 INFO

### 8.1.2.0 Retention

90d_hot_1y_cold

### 8.1.3.0 Aggregation

CloudWatch

### 8.1.4.0 Storage

CloudWatch_S3

### 8.1.5.0 Configuration

*No data available*

## 8.2.0.0 Component Configurations

- {'component': 'All NestJS Services', 'logLevel': 'INFO', 'outputFormat': 'JSON', 'destinations': ['stdout'], 'sampling': {'enabled': False, 'rate': 'N/A'}, 'customFields': ['correlationId', 'orderId']}

## 8.3.0.0 Metrics

### 8.3.1.0 Custom Metrics

*No data available*

## 8.4.0.0 Alert Rules

### 8.4.1.0 HighApiErrorRate

#### 8.4.1.1 Name

HighApiErrorRate

#### 8.4.1.2 Condition

5xx error rate > 5% for 5 minutes on API Gateway

#### 8.4.1.3 Severity

Critical

#### 8.4.1.4 Actions

- {'type': 'PagerDuty', 'target': 'SRE On-Call', 'configuration': {}}

#### 8.4.1.5 Suppression Rules

*No items available*

#### 8.4.1.6 Escalation Path

*No items available*

### 8.4.2.0 DeadLetterQueueHasMessages

#### 8.4.2.1 Name

DeadLetterQueueHasMessages

#### 8.4.2.2 Condition

Number of messages in any DLQ > 0

#### 8.4.2.3 Severity

High

#### 8.4.2.4 Actions

- {'type': 'Slack', 'target': '#on-call-alerts', 'configuration': {}}

#### 8.4.2.5 Suppression Rules

*No items available*

#### 8.4.2.6 Escalation Path

*No items available*

# 9.0.0.0 Implementation Priority

## 9.1.0.0 Component

### 9.1.1.0 Component

Structured JSON Logging Library

### 9.1.2.0 Priority

🔴 high

### 9.1.3.0 Dependencies

*No items available*

### 9.1.4.0 Estimated Effort

Low

### 9.1.5.0 Risk Level

low

## 9.2.0.0 Component

### 9.2.1.0 Component

Correlation ID Propagation Middleware

### 9.2.2.0 Priority

🔴 high

### 9.2.3.0 Dependencies

- Structured JSON Logging Library

### 9.2.4.0 Estimated Effort

Medium

### 9.2.5.0 Risk Level

medium

## 9.3.0.0 Component

### 9.3.1.0 Component

Fluent Bit DaemonSet for EKS

### 9.3.2.0 Priority

🔴 high

### 9.3.3.0 Dependencies

*No items available*

### 9.3.4.0 Estimated Effort

Medium

### 9.3.5.0 Risk Level

low

## 9.4.0.0 Component

### 9.4.1.0 Component

PII Masking Filter

### 9.4.2.0 Priority

🟡 medium

### 9.4.3.0 Dependencies

- Fluent Bit DaemonSet for EKS

### 9.4.4.0 Estimated Effort

Medium

### 9.4.5.0 Risk Level

medium

# 10.0.0.0 Risk Assessment

## 10.1.0.0 Risk

### 10.1.1.0 Risk

Logging sensitive PII in plaintext, violating DPDP Act.

### 10.1.2.0 Impact

high

### 10.1.3.0 Probability

medium

### 10.1.4.0 Mitigation

Implement and test automated PII masking at the collection layer. Conduct regular code reviews to prevent logging of sensitive data.

### 10.1.5.0 Contingency Plan

Procedure to purge sensitive data from logs. Notify data protection officer.

## 10.2.0.0 Risk

### 10.2.1.0 Risk

Excessive log volume from a single component (e.g., Rider Location) leads to prohibitive costs.

### 10.2.2.0 Impact

medium

### 10.2.3.0 Probability

high

### 10.2.4.0 Mitigation

Implement log sampling for high-frequency, low-criticality events. Set up cost alerts in AWS Budgets.

### 10.2.5.0 Contingency Plan

Dynamically adjust log levels or sampling rates in response to alerts.

## 10.3.0.0 Risk

### 10.3.1.0 Risk

Loss of correlationId between services, making distributed tracing and debugging impossible.

### 10.3.2.0 Impact

high

### 10.3.3.0 Probability

low

### 10.3.4.0 Mitigation

Use a standardized OpenTelemetry library and middleware across all services. Include automated tests to verify header/attribute propagation.

### 10.3.5.0 Contingency Plan

Fall back to manual, multi-service log searching using other identifiers like orderId or userId, which is time-consuming.

# 11.0.0.0 Recommendations

## 11.1.0.0 Category

### 11.1.1.0 Category

🔹 Implementation

### 11.1.2.0 Recommendation

Adopt a single, standardized logging library (e.g., a wrapper around Pino.js) for all NestJS microservices.

### 11.1.3.0 Justification

Ensures consistency in log format, automatic inclusion of standard fields like `correlationId`, and simplifies configuration management across the entire backend.

### 11.1.4.0 Priority

🔴 high

### 11.1.5.0 Implementation Notes

The library should be published as a private NPM package. It must automatically extract the `correlationId` from request headers or message attributes.

## 11.2.0.0 Category

### 11.2.1.0 Category

🔹 Cost Optimization

### 11.2.2.0 Recommendation

Use CloudWatch Logs Insights for analysis but avoid creating an excessive number of log-based metrics.

### 11.2.3.0 Justification

Log-based metrics in CloudWatch can become expensive at scale. For metrics, the primary tool should be Prometheus as defined in REQ-1-108, which is more cost-effective for high-cardinality time-series data.

### 11.2.4.0 Priority

🟡 medium

### 11.2.5.0 Implementation Notes

Reserve CloudWatch log-based metrics for critical business events or error counting where Prometheus metrics are not feasible.

