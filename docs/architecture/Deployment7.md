# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Node.js (NestJS)
- React Native
- React.js
- PostgreSQL (AWS RDS)
- Redis (AWS ElastiCache)
- Amazon EKS
- Docker
- AWS SQS/SNS
- Terraform
- GitHub Actions

## 1.3 Architecture Patterns

- Microservices
- Event-Driven Architecture
- Saga Pattern
- API Gateway
- Backend for Frontend (BFF)

## 1.4 Data Handling Needs

- Personally Identifiable Information (PII)
- Financial Transaction Data
- Sensitive User Documents (Licenses, ID cards)
- Geospatial Data

## 1.5 Performance Expectations

High throughput (100 orders/min), low latency (P95 < 200ms for APIs), and scalability to support 10,000 concurrent users.

## 1.6 Regulatory Requirements

- India's Digital Personal Data Protection Act (DPDP), 2023
- PCI-DSS Compliance (by not storing sensitive card data)

# 2.0 Environment Strategy

## 2.1 Environment Types

### 2.1.1 Development

#### 2.1.1.1 Type

🔹 Development

#### 2.1.1.2 Purpose

For developers to build and unit test new features in isolation.

#### 2.1.1.3 Usage Patterns

- Feature development
- Unit testing
- CI builds

#### 2.1.1.4 Isolation Level

complete

#### 2.1.1.5 Data Policy

Mock data or heavily anonymized data.

#### 2.1.1.6 Lifecycle Management

Ephemeral; can be torn down and rebuilt on demand from feature branches.

### 2.1.2.0 Staging

#### 2.1.2.1 Type

🔹 Staging

#### 2.1.2.2 Purpose

A production-like environment for integration testing, UAT, and performance testing before release.

#### 2.1.2.3 Usage Patterns

- End-to-end automated testing (Cypress)
- User Acceptance Testing (UAT)
- Pre-release validation
- Load testing

#### 2.1.2.4 Isolation Level

complete

#### 2.1.2.5 Data Policy

Anonymized, recent snapshot of production data.

#### 2.1.2.6 Lifecycle Management

Persistent; updated with each release candidate.

### 2.1.3.0 Production

#### 2.1.3.1 Type

🔹 Production

#### 2.1.3.2 Purpose

The live environment serving all end-users (customers, vendors, riders).

#### 2.1.3.3 Usage Patterns

- Live user traffic
- Real-time transaction processing

#### 2.1.3.4 Isolation Level

complete

#### 2.1.3.5 Data Policy

Live user data, subject to all regulatory controls.

#### 2.1.3.6 Lifecycle Management

Persistent; highly available and continuously monitored.

### 2.1.4.0 DR

#### 2.1.4.1 Type

🔹 DR

#### 2.1.4.2 Purpose

Disaster Recovery environment to restore service in case of a primary region failure.

#### 2.1.4.3 Usage Patterns

- Standby for failover
- Periodic DR testing

#### 2.1.4.4 Isolation Level

complete

#### 2.1.4.5 Data Policy

Replicated production data (asynchronous).

#### 2.1.4.6 Lifecycle Management

Persistent warm standby; activated only during a disaster.

## 2.2.0.0 Promotion Strategy

### 2.2.1.0 Workflow

GitFlow-based: Feature Branch -> Develop (Dev Env) -> Staging Branch (Staging Env) -> Main Branch (Prod Env).

### 2.2.2.0 Approval Gates

- Mandatory peer code review for all pull requests.
- Successful completion of all automated tests in Staging.
- Manual QA sign-off for UAT in Staging.

### 2.2.3.0 Automation Level

automated

### 2.2.4.0 Rollback Procedure

Automated rollback to the previously deployed version via GitHub Actions and Kubernetes deployment history.

## 2.3.0.0 Isolation Strategies

### 2.3.1.0 Environment

#### 2.3.1.1 Environment

All

#### 2.3.1.2 Isolation Type

network

#### 2.3.1.3 Implementation

Each environment (Dev, Staging, Prod) is deployed in a separate, dedicated AWS VPC with no direct peering, as mandated by REQ-DEP-001.

#### 2.3.1.4 Justification

Provides maximum security and prevents cross-environment interference.

### 2.3.2.0 Environment

#### 2.3.2.1 Environment

All

#### 2.3.2.2 Isolation Type

compute

#### 2.3.2.3 Implementation

Each environment has its own dedicated EKS cluster and RDS database instance.

#### 2.3.2.4 Justification

Ensures performance isolation and prevents resource contention.

### 2.3.3.0 Environment

#### 2.3.3.1 Environment

All

#### 2.3.3.2 Isolation Type

data

#### 2.3.3.3 Implementation

Separate RDS instances, S3 buckets, and ElastiCache clusters per environment.

#### 2.3.3.4 Justification

Protects production data and supports environment-specific data policies (e.g., anonymization in Staging).

## 2.4.0.0 Scaling Approaches

### 2.4.1.0 Environment

#### 2.4.1.1 Environment

Production

#### 2.4.1.2 Scaling Type

auto

#### 2.4.1.3 Triggers

- CPU utilization
- Memory utilization

#### 2.4.1.4 Limits

Configured via Kubernetes Horizontal Pod Autoscaler (HPA) and Cluster Autoscaler.

### 2.4.2.0 Environment

#### 2.4.2.1 Environment

Staging

#### 2.4.2.2 Scaling Type

fixed

#### 2.4.2.3 Triggers

- Manual scaling for scheduled load tests.

#### 2.4.2.4 Limits

Sized to handle UAT and load testing, but does not auto-scale by default to control costs.

### 2.4.3.0 Environment

#### 2.4.3.1 Environment

Development

#### 2.4.3.2 Scaling Type

fixed

#### 2.4.3.3 Triggers

- N/A

#### 2.4.3.4 Limits

Minimal fixed size to support developer workloads cost-effectively.

## 2.5.0.0 Provisioning Automation

| Property | Value |
|----------|-------|
| Tool | terraform |
| Templating | Terraform modules for reusable components (VPC, EK... |
| State Management | Terraform Cloud or S3 backend with DynamoDB lockin... |
| Cicd Integration | ✅ |

# 3.0.0.0 Resource Requirements Analysis

## 3.1.0.0 Workload Analysis

### 3.1.1.0 Workload Type

#### 3.1.1.1 Workload Type

API Services (Orders, Vendors, Users)

#### 3.1.1.2 Expected Load

High request volume, low latency required.

#### 3.1.1.3 Peak Capacity

100 orders/minute, 10,000 concurrent users.

#### 3.1.1.4 Resource Profile

balanced

### 3.1.2.0 Workload Type

#### 3.1.2.1 Workload Type

Rider Logistics Service

#### 3.1.2.2 Expected Load

Complex calculations for allocation and routing.

#### 3.1.2.3 Peak Capacity

High frequency of location updates.

#### 3.1.2.4 Resource Profile

cpu-intensive

### 3.1.3.0 Workload Type

#### 3.1.3.1 Workload Type

Financial Settlements

#### 3.1.3.2 Expected Load

Weekly batch processing for payouts.

#### 3.1.3.3 Peak Capacity

Scheduled, high-volume batch jobs.

#### 3.1.3.4 Resource Profile

memory-intensive

## 3.2.0.0 Compute Requirements

### 3.2.1.0 Environment

#### 3.2.1.1 Environment

Production

#### 3.2.1.2 Instance Type

Mix of General Purpose (m5.large) and Compute Optimized (c5.large) EC2 instances for EKS node groups.

#### 3.2.1.3 Cpu Cores

4

#### 3.2.1.4 Memory Gb

16

#### 3.2.1.5 Instance Count

3

#### 3.2.1.6 Auto Scaling

##### 3.2.1.6.1 Enabled

✅ Yes

##### 3.2.1.6.2 Min Instances

3

##### 3.2.1.6.3 Max Instances

20

##### 3.2.1.6.4 Scaling Triggers

- CPU > 70%

#### 3.2.1.7.0 Justification

Handles baseline load with ability to scale for peak traffic per REQ-NFR-005. Optimized node groups for different microservice workloads.

### 3.2.2.0.0 Environment

#### 3.2.2.1.0 Environment

Staging

#### 3.2.2.2.0 Instance Type

General Purpose (t3.xlarge)

#### 3.2.2.3.0 Cpu Cores

4

#### 3.2.2.4.0 Memory Gb

16

#### 3.2.2.5.0 Instance Count

2

#### 3.2.2.6.0 Auto Scaling

##### 3.2.2.6.1 Enabled

❌ No

##### 3.2.2.6.2 Min Instances

2

##### 3.2.2.6.3 Max Instances

2

##### 3.2.2.6.4 Scaling Triggers

*No items available*

#### 3.2.2.7.0 Justification

Sized to be a smaller replica of production for cost-effective testing, with burstable capacity.

### 3.2.3.0.0 Environment

#### 3.2.3.1.0 Environment

Development

#### 3.2.3.2.0 Instance Type

General Purpose (t3.large)

#### 3.2.3.3.0 Cpu Cores

2

#### 3.2.3.4.0 Memory Gb

8

#### 3.2.3.5.0 Instance Count

1

#### 3.2.3.6.0 Auto Scaling

##### 3.2.3.6.1 Enabled

❌ No

##### 3.2.3.6.2 Min Instances

1

##### 3.2.3.6.3 Max Instances

1

##### 3.2.3.6.4 Scaling Triggers

*No items available*

#### 3.2.3.7.0 Justification

Minimum viable size for developer testing to keep costs low.

## 3.3.0.0.0 Storage Requirements

### 3.3.1.0.0 Environment

#### 3.3.1.1.0 Environment

Production

#### 3.3.1.2.0 Storage Type

ssd

#### 3.3.1.3.0 Capacity

Initial 1TB RDS, auto-scaling. S3 for documents.

#### 3.3.1.4.0 Iops Requirements

3000 provisioned IOPS for RDS.

#### 3.3.1.5.0 Throughput Requirements

High for transactional database.

#### 3.3.1.6.0 Redundancy

Multi-AZ for RDS and S3.

#### 3.3.1.7.0 Encryption

✅ Yes

### 3.3.2.0.0 Environment

#### 3.3.2.1.0 Environment

Staging

#### 3.3.2.2.0 Storage Type

ssd

#### 3.3.2.3.0 Capacity

200GB RDS.

#### 3.3.2.4.0 Iops Requirements

General Purpose SSD (gp3).

#### 3.3.2.5.0 Throughput Requirements

Moderate.

#### 3.3.2.6.0 Redundancy

Single-AZ.

#### 3.3.2.7.0 Encryption

✅ Yes

## 3.4.0.0.0 Special Hardware Requirements

*No items available*

## 3.5.0.0.0 Scaling Strategies

- {'environment': 'Production', 'strategy': 'reactive', 'implementation': 'Kubernetes HPA for pods based on CPU/memory. EKS Cluster Autoscaler for nodes.', 'costOptimization': 'Scale down during off-peak hours.'}

# 4.0.0.0.0 Security Architecture

## 4.1.0.0.0 Authentication Controls

### 4.1.1.0.0 Method

#### 4.1.1.1.0 Method

mfa

#### 4.1.1.2.0 Scope

All users

#### 4.1.1.3.0 Implementation

AWS Cognito for OTP-based login (REQ-FUN-002).

#### 4.1.1.4.0 Environment

All

### 4.1.2.0.0 Method

#### 4.1.2.1.0 Method

sso

#### 4.1.2.2.0 Scope

Internal administrators and developers

#### 4.1.2.3.0 Implementation

AWS IAM Identity Center (SSO) for console and CLI access.

#### 4.1.2.4.0 Environment

All

## 4.2.0.0.0 Authorization Controls

- {'model': 'rbac', 'implementation': 'Role-Based Access Control enforced at the API Gateway and microservice level based on JWT claims and the User Permissions Matrix (REQ-USR-001).', 'granularity': 'fine-grained', 'environment': 'All'}

## 4.3.0.0.0 Certificate Management

| Property | Value |
|----------|-------|
| Authority | external |
| Rotation Policy | Automated yearly rotation. |
| Automation | ✅ |
| Monitoring | ✅ |

## 4.4.0.0.0 Encryption Standards

### 4.4.1.0.0 Scope

#### 4.4.1.1.0 Scope

data-in-transit

#### 4.4.1.2.0 Algorithm

TLS 1.2+

#### 4.4.1.3.0 Key Management

AWS Certificate Manager (ACM)

#### 4.4.1.4.0 Compliance

*No items available*

### 4.4.2.0.0 Scope

#### 4.4.2.1.0 Scope

data-at-rest

#### 4.4.2.2.0 Algorithm

AES-256

#### 4.4.2.3.0 Key Management

AWS KMS with customer-managed keys (CMKs).

#### 4.4.2.4.0 Compliance

- DPDP Act

## 4.5.0.0.0 Access Control Mechanisms

### 4.5.1.0.0 iam

#### 4.5.1.1.0 Type

🔹 iam

#### 4.5.1.2.0 Configuration

Principle of Least Privilege. IAM Roles for Service Accounts (IRSA) for EKS pods to access AWS services.

#### 4.5.1.3.0 Environment

All

#### 4.5.1.4.0 Rules

*No items available*

### 4.5.2.0.0 waf

#### 4.5.2.1.0 Type

🔹 waf

#### 4.5.2.2.0 Configuration

AWS WAF attached to the Application Load Balancer/API Gateway to protect against OWASP Top 10 attacks.

#### 4.5.2.3.0 Environment

Production

#### 4.5.2.4.0 Rules

- AWS Managed Rules for SQLi, XSS

## 4.6.0.0.0 Data Protection Measures

- {'dataType': 'pii', 'protectionMethod': 'encryption', 'implementation': 'Application-level encryption for specific sensitive fields before storing in the database; AWS KMS for encryption at rest on all data stores (REQ-CON-001).', 'compliance': ['DPDP Act']}

## 4.7.0.0.0 Network Security

- {'control': 'ids', 'implementation': 'AWS GuardDuty for intelligent threat detection.', 'rules': [], 'monitoring': True}

## 4.8.0.0.0 Security Monitoring

### 4.8.1.0.0 siem

#### 4.8.1.1.0 Type

🔹 siem

#### 4.8.1.2.0 Implementation

AWS Security Hub to aggregate findings from GuardDuty, Macie, and other security services.

#### 4.8.1.3.0 Frequency

real-time

#### 4.8.1.4.0 Alerting

✅ Yes

### 4.8.2.0.0 vulnerability-scanning

#### 4.8.2.1.0 Type

🔹 vulnerability-scanning

#### 4.8.2.2.0 Implementation

Automated scanning of container images (AWS ECR Scan) and code dependencies (GitHub Advanced Security) within the CI/CD pipeline (REQ-NFR-003).

#### 4.8.2.3.0 Frequency

on-commit

#### 4.8.2.4.0 Alerting

✅ Yes

### 4.8.3.0.0 pen-testing

#### 4.8.3.1.0 Type

🔹 pen-testing

#### 4.8.3.2.0 Implementation

Annual third-party penetration test (REQ-NFR-003).

#### 4.8.3.3.0 Frequency

annual

#### 4.8.3.4.0 Alerting

❌ No

## 4.9.0.0.0 Backup Security

| Property | Value |
|----------|-------|
| Encryption | ✅ |
| Access Control | Strict IAM policies on backup access. |
| Offline Storage | ❌ |
| Testing Frequency | semi-annual |

## 4.10.0.0.0 Compliance Frameworks

### 4.10.1.0.0 Framework

#### 4.10.1.1.0 Framework

pci-dss

#### 4.10.1.2.0 Applicable Environments

- Production

#### 4.10.1.3.0 Controls

- Never store sensitive card data (REQ-NFR-003).
- Encrypt all data in transit.
- Implement WAF.

#### 4.10.1.4.0 Audit Frequency

annual

### 4.10.2.0.0 Framework

#### 4.10.2.1.0 Framework

dpdp

#### 4.10.2.2.0 Applicable Environments

- Production

#### 4.10.2.3.0 Controls

- Encrypt PII at rest and in transit.
- Implement granular user consent mechanisms.
- Enforce data residency in India (`ap-south-1` region).

#### 4.10.2.4.0 Audit Frequency

as-needed

# 5.0.0.0.0 Network Design

## 5.1.0.0.0 Network Segmentation

### 5.1.1.0.0 Environment

#### 5.1.1.1.0 Environment

Production

#### 5.1.1.2.0 Segment Type

private

#### 5.1.1.3.0 Purpose

EKS Nodes, RDS Database, ElastiCache

#### 5.1.1.4.0 Isolation

logical

### 5.1.2.0.0 Environment

#### 5.1.2.1.0 Environment

Production

#### 5.1.2.2.0 Segment Type

public

#### 5.1.2.3.0 Purpose

Application Load Balancer, NAT Gateways

#### 5.1.2.4.0 Isolation

logical

## 5.2.0.0.0 Subnet Strategy

### 5.2.1.0.0 Environment

#### 5.2.1.1.0 Environment

Production

#### 5.2.1.2.0 Subnet Type

private

#### 5.2.1.3.0 Cidr Block

10.0.1.0/24

#### 5.2.1.4.0 Availability Zone

ap-south-1a

#### 5.2.1.5.0 Routing Table

Route to NAT Gateway

### 5.2.2.0.0 Environment

#### 5.2.2.1.0 Environment

Production

#### 5.2.2.2.0 Subnet Type

public

#### 5.2.2.3.0 Cidr Block

10.0.101.0/24

#### 5.2.2.4.0 Availability Zone

ap-south-1a

#### 5.2.2.5.0 Routing Table

Route to Internet Gateway

## 5.3.0.0.0 Security Group Rules

### 5.3.1.0.0 Group Name

#### 5.3.1.1.0 Group Name

sg-alb

#### 5.3.1.2.0 Direction

inbound

#### 5.3.1.3.0 Protocol

tcp

#### 5.3.1.4.0 Port Range

443

#### 5.3.1.5.0 Source

0.0.0.0/0

#### 5.3.1.6.0 Purpose

Allow HTTPS traffic from the internet.

### 5.3.2.0.0 Group Name

#### 5.3.2.1.0 Group Name

sg-eks-nodes

#### 5.3.2.2.0 Direction

inbound

#### 5.3.2.3.0 Protocol

tcp

#### 5.3.2.4.0 Port Range

1025-65535

#### 5.3.2.5.0 Source

sg-alb

#### 5.3.2.6.0 Purpose

Allow traffic from ALB to microservices.

### 5.3.3.0.0 Group Name

#### 5.3.3.1.0 Group Name

sg-rds

#### 5.3.3.2.0 Direction

inbound

#### 5.3.3.3.0 Protocol

tcp

#### 5.3.3.4.0 Port Range

5432

#### 5.3.3.5.0 Source

sg-eks-nodes

#### 5.3.3.6.0 Purpose

Allow database connections only from the application layer.

## 5.4.0.0.0 Connectivity Requirements

*No items available*

## 5.5.0.0.0 Network Monitoring

- {'type': 'flow-logs', 'implementation': 'VPC Flow Logs enabled and sent to CloudWatch Logs for analysis and threat detection.', 'alerting': True, 'retention': '90 days'}

## 5.6.0.0.0 Bandwidth Controls

*No items available*

## 5.7.0.0.0 Service Discovery

| Property | Value |
|----------|-------|
| Method | service-mesh |
| Implementation | AWS App Mesh for managing inter-service communicat... |
| Health Checks | ✅ |

## 5.8.0.0.0 Environment Communication

*No items available*

# 6.0.0.0.0 Data Management Strategy

## 6.1.0.0.0 Data Isolation

- {'environment': 'All', 'isolationLevel': 'complete', 'method': 'separate-instances', 'justification': 'Prevents any possibility of non-production workloads impacting the production database.'}

## 6.2.0.0.0 Backup And Recovery

### 6.2.1.0.0 Environment

#### 6.2.1.1.0 Environment

Production

#### 6.2.1.2.0 Backup Frequency

Daily automated snapshots

#### 6.2.1.3.0 Retention Period

30 days

#### 6.2.1.4.0 Recovery Time Objective

< 15 minutes

#### 6.2.1.5.0 Recovery Point Objective

< 5 minutes

#### 6.2.1.6.0 Testing Schedule

Semi-annual

### 6.2.2.0.0 Environment

#### 6.2.2.1.0 Environment

Staging

#### 6.2.2.2.0 Backup Frequency

On-demand before major testing cycles

#### 6.2.2.3.0 Retention Period

7 days

#### 6.2.2.4.0 Recovery Time Objective

Best Effort (< 4 hours)

#### 6.2.2.5.0 Recovery Point Objective

24 hours

#### 6.2.2.6.0 Testing Schedule

N/A

## 6.3.0.0.0 Data Masking Anonymization

### 6.3.1.0.0 Environment

#### 6.3.1.1.0 Environment

Staging

#### 6.3.1.2.0 Data Type

pii

#### 6.3.1.3.0 Masking Method

static

#### 6.3.1.4.0 Coverage

complete

#### 6.3.1.5.0 Compliance

- DPDP Act

### 6.3.2.0.0 Environment

#### 6.3.2.1.0 Environment

Development

#### 6.3.2.2.0 Data Type

pii

#### 6.3.2.3.0 Masking Method

anonymization

#### 6.3.2.4.0 Coverage

complete

#### 6.3.2.5.0 Compliance

- DPDP Act

## 6.4.0.0.0 Migration Processes

- {'sourceEnvironment': 'Production', 'targetEnvironment': 'Staging', 'migrationMethod': 'dump-restore', 'validation': 'Automated script to verify data integrity post-anonymization.', 'rollbackPlan': 'Delete and restore from a previous clean snapshot.'}

## 6.5.0.0.0 Retention Policies

### 6.5.1.0.0 Environment

#### 6.5.1.1.0 Environment

Production

#### 6.5.1.2.0 Data Type

Order/Transaction Records

#### 6.5.1.3.0 Retention Period

7 years

#### 6.5.1.4.0 Archival Method

Data partitioning and archival to S3.

#### 6.5.1.5.0 Compliance Requirement

REQ-NFR-007

### 6.5.2.0.0 Environment

#### 6.5.2.1.0 Environment

Production

#### 6.5.2.2.0 Data Type

POD Photos / Chat Logs

#### 6.5.2.3.0 Retention Period

90 days

#### 6.5.2.4.0 Archival Method

Automated deletion job.

#### 6.5.2.5.0 Compliance Requirement

REQ-NFR-007

## 6.6.0.0.0 Data Classification

- {'classification': 'restricted', 'handlingRequirements': ['Encryption at rest and in transit', 'Strict access controls'], 'accessControls': ['IAM roles with least privilege'], 'environments': ['Production']}

## 6.7.0.0.0 Disaster Recovery

- {'environment': 'Production', 'drSite': 'A different AWS region (e.g., ap-southeast-1).', 'replicationMethod': 'asynchronous', 'failoverTime': '< 15 minutes (RTO)', 'testingFrequency': 'semi-annual'}

# 7.0.0.0.0 Monitoring And Observability

## 7.1.0.0.0 Monitoring Components

### 7.1.1.0.0 Component

#### 7.1.1.1.0 Component

logs

#### 7.1.1.2.0 Tool

AWS CloudWatch Logs

#### 7.1.1.3.0 Implementation

Fluent Bit agent on EKS nodes forwards structured JSON logs.

#### 7.1.1.4.0 Environments

- Development
- Staging
- Production

### 7.1.2.0.0 Component

#### 7.1.2.1.0 Component

infrastructure

#### 7.1.2.2.0 Tool

Prometheus

#### 7.1.2.3.0 Implementation

Prometheus Operator on EKS scrapes metrics from nodes and pods.

#### 7.1.2.4.0 Environments

- Staging
- Production

### 7.1.3.0.0 Component

#### 7.1.3.1.0 Component

apm

#### 7.1.3.2.0 Tool

Prometheus

#### 7.1.3.3.0 Implementation

Custom application metrics (latency, throughput, errors) exposed via `/metrics` endpoint.

#### 7.1.3.4.0 Environments

- Staging
- Production

### 7.1.4.0.0 Component

#### 7.1.4.1.0 Component

tracing

#### 7.1.4.2.0 Tool

OpenTelemetry

#### 7.1.4.3.0 Implementation

SDKs integrated into all microservices, propagating `correlationId`.

#### 7.1.4.4.0 Environments

- Staging
- Production

### 7.1.5.0.0 Component

#### 7.1.5.1.0 Component

alerting

#### 7.1.5.2.0 Tool

Prometheus Alertmanager

#### 7.1.5.3.0 Implementation

Configured with rules for critical thresholds and routing to PagerDuty/Slack.

#### 7.1.5.4.0 Environments

- Production

## 7.2.0.0.0 Environment Specific Thresholds

### 7.2.1.0.0 Environment

#### 7.2.1.1.0 Environment

Production

#### 7.2.1.2.0 Metric

API P95 Latency

#### 7.2.1.3.0 Warning Threshold

> 150ms for 5 mins

#### 7.2.1.4.0 Critical Threshold

> 200ms for 5 mins

#### 7.2.1.5.0 Justification

Aligned with performance requirement REQ-NFR-001.

### 7.2.2.0.0 Environment

#### 7.2.2.1.0 Environment

Staging

#### 7.2.2.2.0 Metric

API P95 Latency

#### 7.2.2.3.0 Warning Threshold

> 300ms for 5 mins

#### 7.2.2.4.0 Critical Threshold

> 500ms for 5 mins

#### 7.2.2.5.0 Justification

Looser thresholds for non-production environment.

## 7.3.0.0.0 Metrics Collection

- {'category': 'application', 'metrics': ['api_latency', 'api_error_rate', 'orders_per_minute', 'rider_allocation_success_rate'], 'collectionInterval': '15s', 'retention': '30 days raw, 1 year aggregated'}

## 7.4.0.0.0 Health Check Endpoints

### 7.4.1.0.0 Component

#### 7.4.1.1.0 Component

All Microservices

#### 7.4.1.2.0 Endpoint

/health/liveness

#### 7.4.1.3.0 Check Type

liveness

#### 7.4.1.4.0 Timeout

2s

#### 7.4.1.5.0 Frequency

10s

### 7.4.2.0.0 Component

#### 7.4.2.1.0 Component

All Microservices

#### 7.4.2.2.0 Endpoint

/health/readiness

#### 7.4.2.3.0 Check Type

readiness

#### 7.4.2.4.0 Timeout

5s

#### 7.4.2.5.0 Frequency

10s

## 7.5.0.0.0 Logging Configuration

### 7.5.1.0.0 Environment

#### 7.5.1.1.0 Environment

Production

#### 7.5.1.2.0 Log Level

info

#### 7.5.1.3.0 Destinations

- CloudWatch Logs

#### 7.5.1.4.0 Retention

90 days

#### 7.5.1.5.0 Sampling

1% for high-volume non-error logs (e.g., location updates).

### 7.5.2.0.0 Environment

#### 7.5.2.1.0 Environment

Staging

#### 7.5.2.2.0 Log Level

debug

#### 7.5.2.3.0 Destinations

- CloudWatch Logs

#### 7.5.2.4.0 Retention

30 days

#### 7.5.2.5.0 Sampling

N/A

## 7.6.0.0.0 Escalation Policies

### 7.6.1.0.0 Environment

#### 7.6.1.1.0 Environment

Production

#### 7.6.1.2.0 Severity

Critical

#### 7.6.1.3.0 Escalation Path

- Primary On-Call Engineer
- Secondary On-Call Engineer
- Engineering Lead

#### 7.6.1.4.0 Timeouts

- 5m
- 10m

#### 7.6.1.5.0 Channels

- PagerDuty
- SMS

### 7.6.2.0.0 Environment

#### 7.6.2.1.0 Environment

Production

#### 7.6.2.2.0 Severity

Warning

#### 7.6.2.3.0 Escalation Path

- On-Call Team Channel

#### 7.6.2.4.0 Timeouts

*No items available*

#### 7.6.2.5.0 Channels

- Slack

## 7.7.0.0.0 Dashboard Configurations

### 7.7.1.0.0 Dashboard Type

#### 7.7.1.1.0 Dashboard Type

operational

#### 7.7.1.2.0 Audience

SRE/On-Call Team

#### 7.7.1.3.0 Refresh Interval

30s

#### 7.7.1.4.0 Metrics

- API Error Rate (per service)
- API Latency P95 (per service)
- SQS Queue Depth
- RDS CPU Utilization
- EKS Pod Health

### 7.7.2.0.0 Dashboard Type

#### 7.7.2.1.0 Dashboard Type

business

#### 7.7.2.2.0 Audience

Admin/Operations Team

#### 7.7.2.3.0 Refresh Interval

1m

#### 7.7.2.4.0 Metrics

- Orders per Minute
- Rider Allocation Success Rate
- Average Delivery Time
- Payment Success Rate

# 8.0.0.0.0 Project Specific Environments

## 8.1.0.0.0 Environments

*No items available*

## 8.2.0.0.0 Configuration

*No data available*

## 8.3.0.0.0 Cross Environment Policies

*No items available*

# 9.0.0.0.0 Implementation Priority

## 9.1.0.0.0 Component

### 9.1.1.0.0 Component

Foundational IaC (Terraform)

### 9.1.2.0.0 Priority

🔴 high

### 9.1.3.0.0 Dependencies

*No items available*

### 9.1.4.0.0 Estimated Effort

4 Sprints

### 9.1.5.0.0 Risk Level

medium

## 9.2.0.0.0 Component

### 9.2.1.0.0 Component

CI/CD Pipeline (GitHub Actions)

### 9.2.2.0.0 Priority

🔴 high

### 9.2.3.0.0 Dependencies

- Foundational IaC

### 9.2.4.0.0 Estimated Effort

3 Sprints

### 9.2.5.0.0 Risk Level

low

## 9.3.0.0.0 Component

### 9.3.1.0.0 Component

Production Environment Hardening

### 9.3.2.0.0 Priority

🔴 high

### 9.3.3.0.0 Dependencies

- CI/CD Pipeline

### 9.3.4.0.0 Estimated Effort

2 Sprints

### 9.3.5.0.0 Risk Level

high

## 9.4.0.0.0 Component

### 9.4.1.0.0 Component

Monitoring & Alerting Configuration

### 9.4.2.0.0 Priority

🟡 medium

### 9.4.3.0.0 Dependencies

- CI/CD Pipeline

### 9.4.4.0.0 Estimated Effort

2 Sprints

### 9.4.5.0.0 Risk Level

medium

# 10.0.0.0.0 Risk Assessment

## 10.1.0.0.0 Risk

### 10.1.1.0.0 Risk

Security misconfiguration in VPC or IAM leading to a data breach.

### 10.1.2.0.0 Impact

high

### 10.1.3.0.0 Probability

medium

### 10.1.4.0.0 Mitigation

Use Infrastructure as Code (Terraform) with mandatory peer reviews. Implement automated security checks in the CI/CD pipeline. Follow the principle of least privilege strictly.

### 10.1.5.0.0 Contingency Plan

Incident Response Plan, including isolating affected resources, forensic analysis, and stakeholder communication.

## 10.2.0.0.0 Risk

### 10.2.1.0.0 Risk

Cloud cost overruns due to misconfigured autoscaling or unoptimized resource allocation.

### 10.2.2.0.0 Impact

medium

### 10.2.3.0.0 Probability

high

### 10.2.4.0.0 Mitigation

Set up AWS Budgets and cost anomaly detection alerts. Perform regular cost optimization reviews. Use smaller, fixed-size instances for non-production environments.

### 10.2.5.0.0 Contingency Plan

Emergency manual down-scaling of resources. Root cause analysis of cost spike.

## 10.3.0.0.0 Risk

### 10.3.1.0.0 Risk

Failure to meet RTO/RPO during a disaster recovery event.

### 10.3.2.0.0 Impact

high

### 10.3.3.0.0 Probability

low

### 10.3.4.0.0 Mitigation

Conduct mandatory, semi-annual DR tests as per REQ-NFR-002. Automate the DR failover process using Terraform scripts.

### 10.3.5.0.0 Contingency Plan

Documented manual failover procedure as a backup to the automated process.

# 11.0.0.0.0 Recommendations

## 11.1.0.0.0 Category

### 11.1.1.0.0 Category

🔹 Automation

### 11.1.2.0.0 Recommendation

Adopt a GitOps approach for Kubernetes deployments using a tool like ArgoCD or Flux.

### 11.1.3.0.0 Justification

Provides a single source of truth (the Git repository) for the desired state of the EKS cluster, improving auditability, traceability, and simplifying rollbacks.

### 11.1.4.0.0 Priority

🟡 medium

### 11.1.5.0.0 Implementation Notes

Integrate the GitOps tool with the GitHub Actions pipeline. The pipeline's role becomes updating the Git repository, and the GitOps tool handles the synchronization to the cluster.

## 11.2.0.0.0 Category

### 11.2.1.0.0 Category

🔹 Security

### 11.2.2.0.0 Recommendation

Implement automated SAST, DAST, and dependency scanning within the GitHub Actions CI pipeline.

### 11.2.3.0.0 Justification

Fulfills REQ-NFR-003 and provides an early-detection mechanism for security vulnerabilities before they reach production, adhering to DevSecOps best practices.

### 11.2.4.0.0 Priority

🔴 high

### 11.2.5.0.0 Implementation Notes

Utilize GitHub Advanced Security or integrate third-party tools like Snyk or SonarQube into the CI workflow. Fail builds on critical vulnerabilities.

## 11.3.0.0.0 Category

### 11.3.1.0.0 Category

🔹 Cost Optimization

### 11.3.2.0.0 Recommendation

Implement lifecycle policies for non-production environments to automatically shut down during non-business hours.

### 11.3.3.0.0 Justification

The Development environment is only used during work hours. Shutting it down can lead to significant cost savings (up to 60-70% on compute resources).

### 11.3.4.0.0 Priority

🟡 medium

### 11.3.5.0.0 Implementation Notes

Use AWS Instance Scheduler or custom Lambda functions triggered by EventBridge schedules to stop/start EC2 instances in the EKS node groups and RDS instances.

