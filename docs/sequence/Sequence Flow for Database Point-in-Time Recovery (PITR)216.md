# 1 Overview

## 1.1 Diagram Id

SEQ-RF-001

## 1.2 Name

Database Point-in-Time Recovery (PITR)

## 1.3 Description

An operational procedure for recovering the primary PostgreSQL database to a specific point in time (e.g., just before a data corruption event) using automated backups, ensuring minimal data loss (low RPO).

## 1.4 Type

🔹 RecoveryFlow

## 1.5 Purpose

To recover from catastrophic data loss or corruption events, such as an accidental deletion or a bad data migration, with a low Recovery Point Objective (RPO) as per REQ-NFR-002.

## 1.6 Complexity

High

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

*No items available*

## 1.10 Key Interactions

- A critical data corruption incident is identified via monitoring or user reports.
- The on-call engineer, following a documented runbook, determines the exact time (to the second) to which the database needs to be restored.
- Using the AWS RDS console or CLI, the engineer initiates a Point-in-Time Recovery action.
- RDS provisions a new database instance, using the latest daily snapshot and applying transaction logs (WAL segments) to restore it to the specified time.
- The engineer validates the data integrity in the new instance.
- Once validated, the application's configuration (stored in AWS Secrets Manager) is updated to point to the new database instance's endpoint.
- A controlled application restart (rolling restart in EKS) is performed to pick up the new configuration.
- The old, corrupted database instance is decommissioned after a safe period.

## 1.11 Triggers

- A critical data loss or corruption incident that cannot be fixed with application logic.

## 1.12 Outcomes

- The database is restored to a consistent state from before the incident.
- Data loss is minimized to less than 5 minutes (RPO).
- Service is restored within 15 minutes (RTO).

## 1.13 Business Rules

- The database must have automated daily snapshots and point-in-time recovery enabled (REQ-NFR-002).
- Backups must be retained for a minimum of 30 days (REQ-NFR-002).
- The target RPO is < 5 minutes and RTO is < 15 minutes (REQ-NFR-002).
- Disaster recovery procedures must be documented and tested on a semi-annual basis (REQ-NFR-002).

## 1.14 Error Scenarios

- The required transaction logs are no longer available (beyond the retention window).
- The restored data is also found to be corrupted, requiring an even earlier recovery point.

## 1.15 Integration Points

- Amazon RDS backup and recovery services.
- AWS Secrets Manager for database credentials.

# 2.0 Details

## 2.1 Diagram Id

SEQ-RF-001

## 2.2 Name

Implementation: Database Point-in-Time Recovery (PITR) Procedure

## 2.3 Description

A detailed operational sequence for recovering the primary PostgreSQL database to a specific point in time using AWS RDS automated backups. This procedure is designed to meet the critical Recovery Time Objective (RTO) of < 15 minutes and Recovery Point Objective (RPO) of < 5 minutes as specified in REQ-NFR-002.

## 2.4 Participants

### 2.4.1 Human

#### 2.4.1.1 Repository Id

HumanActor

#### 2.4.1.2 Display Name

On-Call Engineer

#### 2.4.1.3 Type

🔹 Human

#### 2.4.1.4 Technology

AWS Console/CLI, kubectl

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #E6E6FA |
| Stereotype | Operator |

### 2.4.2.0 Infrastructure

#### 2.4.2.1 Repository Id

observability-stack-203

#### 2.4.2.2 Display Name

Observability Stack

#### 2.4.2.3 Type

🔹 Infrastructure

#### 2.4.2.4 Technology

Prometheus, Grafana, AWS CloudWatch

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #D5F5E3 |
| Stereotype | Monitoring |

### 2.4.3.0 Managed Service

#### 2.4.3.1 Repository Id

tech-aws-rds-postgresql-primary

#### 2.4.3.2 Display Name

Amazon RDS (Primary DB)

#### 2.4.3.3 Type

🔹 Managed Service

#### 2.4.3.4 Technology

PostgreSQL 15.4 on RDS

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #FADBD8 |
| Stereotype | Corrupted |

### 2.4.4.0 Managed Service

#### 2.4.4.1 Repository Id

tech-aws-rds-postgresql-restored

#### 2.4.4.2 Display Name

Amazon RDS (Restored DB)

#### 2.4.4.3 Type

🔹 Managed Service

#### 2.4.4.4 Technology

PostgreSQL 15.4 on RDS

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #D4E6F1 |
| Stereotype | New Instance |

### 2.4.5.0 Managed Service

#### 2.4.5.1 Repository Id

tech-aws-secrets-manager

#### 2.4.5.2 Display Name

AWS Secrets Manager

#### 2.4.5.3 Type

🔹 Managed Service

#### 2.4.5.4 Technology

AWS Secrets Manager

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #FEF9E7 |
| Stereotype | Security |

### 2.4.6.0 Managed Service

#### 2.4.6.1 Repository Id

tech-aws-eks

#### 2.4.6.2 Display Name

Amazon EKS

#### 2.4.6.3 Type

🔹 Managed Service

#### 2.4.6.4 Technology

Kubernetes 1.29

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #F5EEF8 |
| Stereotype | Orchestrator |

### 2.4.7.0 ApplicationServices

#### 2.4.7.1 Repository Id

ApplicationServices

#### 2.4.7.2 Display Name

Application Services

#### 2.4.7.3 Type

🔹 ApplicationServices

#### 2.4.7.4 Technology

NestJS on Docker

#### 2.4.7.5 Order

7

#### 2.4.7.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #E8DAEF |
| Stereotype | Microservices |

## 2.5.0.0 Interactions

### 2.5.1.0 Notification

#### 2.5.1.1 Source Id

observability-stack-203

#### 2.5.1.2 Target Id

HumanActor

#### 2.5.1.3 Message

1. [Trigger] Receive Critical Data Corruption Alert

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 Notification

#### 2.5.1.6 Is Synchronous

❌ No

#### 2.5.1.7 Return Message



#### 2.5.1.8 Has Return

❌ No

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | PagerDuty/Slack |
| Method | Alert Notification |
| Parameters | Alert details: High rate of SQL errors, specific e... |
| Authentication | N/A |
| Error Handling | Escalation policy triggers if alert is not acknowl... |
| Performance | Latency < 1 minute. |

### 2.5.2.0 Manual Action

#### 2.5.2.1 Source Id

HumanActor

#### 2.5.2.2 Target Id

HumanActor

#### 2.5.2.3 Message

2. Investigate issue, consult runbook, and determine `recoveryTimestamp`

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 Manual Action

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message



#### 2.5.2.8 Has Return

❌ No

#### 2.5.2.9 Is Activation

❌ No

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | N/A |
| Method | Log Analysis & Triage |
| Parameters | Analyze application logs (CloudWatch) and database... |
| Authentication | N/A |
| Error Handling | If timestamp is ambiguous, choose a slightly earli... |
| Performance | RTO component: Target < 5 minutes for this step. |

### 2.5.3.0 API Call

#### 2.5.3.1 Source Id

HumanActor

#### 2.5.3.2 Target Id

tech-aws-rds-postgresql-primary

#### 2.5.3.3 Message

3. [Security] Initiate Point-in-Time Recovery

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 API Call

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

Acknowledge request, return `newDbClusterIdentifier`

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

✅ Yes

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS API (HTTPS) |
| Method | aws rds restore-db-cluster-to-point-in-time |
| Parameters | `--source-db-cluster-identifier`, `--restore-to-ti... |
| Authentication | Requires IAM Role with `rds:RestoreDBClusterToPoin... |
| Error Handling | API call fails if permissions are insufficient, so... |
| Performance | API response < 2 seconds. |

### 2.5.4.0 Internal Process

#### 2.5.4.1 Source Id

tech-aws-rds-postgresql-primary

#### 2.5.4.2 Target Id

tech-aws-rds-postgresql-restored

#### 2.5.4.3 Message

4. Provision new DB instance from snapshot and WAL logs

#### 2.5.4.4 Sequence Number

4

#### 2.5.4.5 Type

🔹 Internal Process

#### 2.5.4.6 Is Synchronous

❌ No

#### 2.5.4.7 Return Message



#### 2.5.4.8 Has Return

❌ No

#### 2.5.4.9 Is Activation

✅ Yes

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS Internal |
| Method | RDS Restore Workflow |
| Parameters | Latest daily snapshot, transaction logs (WAL segme... |
| Authentication | N/A |
| Error Handling | Provisioning can fail due to internal AWS issues. ... |
| Performance | RTO component: Typically takes 5-10 minutes, depen... |

### 2.5.5.0 API Call

#### 2.5.5.1 Source Id

HumanActor

#### 2.5.5.2 Target Id

tech-aws-rds-postgresql-restored

#### 2.5.5.3 Message

5. Poll DB instance status until 'available'

#### 2.5.5.4 Sequence Number

5

#### 2.5.5.5 Type

🔹 API Call

#### 2.5.5.6 Is Synchronous

✅ Yes

#### 2.5.5.7 Return Message

`status: 'available'`, `endpoint: 'new-db-endpoint.rds.amazonaws.com'`

#### 2.5.5.8 Has Return

✅ Yes

#### 2.5.5.9 Is Activation

❌ No

#### 2.5.5.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS API (HTTPS) |
| Method | aws rds describe-db-clusters |
| Parameters | `--db-cluster-identifier <new-identifier>` |
| Authentication | Requires IAM Role with `rds:DescribeDBClusters` pe... |
| Error Handling | Script should have a timeout to prevent infinite p... |
| Performance | Polling interval: 30 seconds. |

### 2.5.6.0 Database Query

#### 2.5.6.1 Source Id

HumanActor

#### 2.5.6.2 Target Id

tech-aws-rds-postgresql-restored

#### 2.5.6.3 Message

6. [Data Flow] Execute validation queries on restored data

#### 2.5.6.4 Sequence Number

6

#### 2.5.6.5 Type

🔹 Database Query

#### 2.5.6.6 Is Synchronous

✅ Yes

#### 2.5.6.7 Return Message

Query results confirming data integrity

#### 2.5.6.8 Has Return

✅ Yes

#### 2.5.6.9 Is Activation

❌ No

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL/TCP |
| Method | SELECT count(*), SELECT max(created_at) FROM ... |
| Parameters | Connect using a secure bastion host or temporary V... |
| Authentication | Database user credentials. |
| Error Handling | If validation fails, the entire process must be re... |
| Performance | Queries should be simple and fast (< 10 seconds). |

### 2.5.7.0 API Call

#### 2.5.7.1 Source Id

HumanActor

#### 2.5.7.2 Target Id

tech-aws-secrets-manager

#### 2.5.7.3 Message

7. [Security] Update database connection secret

#### 2.5.7.4 Sequence Number

7

#### 2.5.7.5 Type

🔹 API Call

#### 2.5.7.6 Is Synchronous

✅ Yes

#### 2.5.7.7 Return Message

Confirmation of secret update

#### 2.5.7.8 Has Return

✅ Yes

#### 2.5.7.9 Is Activation

✅ Yes

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS API (HTTPS) |
| Method | aws secretsmanager update-secret |
| Parameters | `--secret-id <db-secret-arn>`, `--secret-string '{... |
| Authentication | Requires IAM Role with `secretsmanager:UpdateSecre... |
| Error Handling | Failure indicates a critical permissions issue tha... |
| Performance | API response < 1 second. |

### 2.5.8.0 CLI Command

#### 2.5.8.1 Source Id

HumanActor

#### 2.5.8.2 Target Id

tech-aws-eks

#### 2.5.8.3 Message

8. Trigger rolling restart of application deployments

#### 2.5.8.4 Sequence Number

8

#### 2.5.8.5 Type

🔹 CLI Command

#### 2.5.8.6 Is Synchronous

❌ No

#### 2.5.8.7 Return Message

Acknowledge restart command

#### 2.5.8.8 Has Return

✅ Yes

#### 2.5.8.9 Is Activation

✅ Yes

#### 2.5.8.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Kubernetes API |
| Method | kubectl rollout restart deployment <service-name> |
| Parameters | Loop through all microservice deployments. |
| Authentication | Requires Kubernetes RBAC permissions to manage dep... |
| Error Handling | If a rollout fails, it must be investigated and po... |
| Performance | RTO component: Rolling restart takes 2-4 minutes. |

### 2.5.9.0 API Call

#### 2.5.9.1 Source Id

ApplicationServices

#### 2.5.9.2 Target Id

tech-aws-secrets-manager

#### 2.5.9.3 Message

9. [On Startup] Fetch updated DB connection secret

#### 2.5.9.4 Sequence Number

9

#### 2.5.9.5 Type

🔹 API Call

#### 2.5.9.6 Is Synchronous

✅ Yes

#### 2.5.9.7 Return Message

Secret payload with new DB endpoint

#### 2.5.9.8 Has Return

✅ Yes

#### 2.5.9.9 Is Activation

✅ Yes

#### 2.5.9.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS API (HTTPS) |
| Method | aws secretsmanager get-secret-value |
| Parameters | `--secret-id <db-secret-arn>` |
| Authentication | Requires IAM Role for Service Account (IRSA) with ... |
| Error Handling | Application startup fails if secret cannot be fetc... |
| Performance | API response < 200ms. |

### 2.5.10.0 Database Connection

#### 2.5.10.1 Source Id

ApplicationServices

#### 2.5.10.2 Target Id

tech-aws-rds-postgresql-restored

#### 2.5.10.3 Message

10. Establish new database connections

#### 2.5.10.4 Sequence Number

10

#### 2.5.10.5 Type

🔹 Database Connection

#### 2.5.10.6 Is Synchronous

✅ Yes

#### 2.5.10.7 Return Message

Connection successful

#### 2.5.10.8 Has Return

✅ Yes

#### 2.5.10.9 Is Activation

❌ No

#### 2.5.10.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL/TCP |
| Method | Connection Pool Initialization |
| Parameters | Host, Port, User, Password from secret. |
| Authentication | Database credentials. |
| Error Handling | Connection failure prevents application from becom... |
| Performance | Connection time < 500ms. |

### 2.5.11.0 Monitoring

#### 2.5.11.1 Source Id

HumanActor

#### 2.5.11.2 Target Id

observability-stack-203

#### 2.5.11.3 Message

11. Monitor application health and confirm service restoration

#### 2.5.11.4 Sequence Number

11

#### 2.5.11.5 Type

🔹 Monitoring

#### 2.5.11.6 Is Synchronous

✅ Yes

#### 2.5.11.7 Return Message

Dashboards show healthy status (2xx responses, low latency)

#### 2.5.11.8 Has Return

✅ Yes

#### 2.5.11.9 Is Activation

❌ No

#### 2.5.11.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | View Grafana Dashboards |
| Parameters | Check API error rates, latency percentiles, and po... |
| Authentication | Grafana user login. |
| Error Handling | If health checks fail, investigate pod logs and co... |
| Performance | N/A |

## 2.6.0.0 Notes

### 2.6.1.0 Content

#### 2.6.1.1 Content

RTO/RPO Compliance: The entire flow from step 1 to 11 must complete within 15 minutes (RTO). The `recoveryTimestamp` ensures data loss is less than 5 minutes (RPO). This aligns with REQ-NFR-002.

#### 2.6.1.2 Position

top-right

#### 2.6.1.3 Participant Id

*Not specified*

#### 2.6.1.4 Sequence Number

*Not specified*

### 2.6.2.0 Content

#### 2.6.2.1 Content

Audit Requirement: All manual actions by the On-Call Engineer involving AWS API calls (steps 3, 5, 7) are automatically logged in AWS CloudTrail, satisfying auditability requirement REQ-NFR-008.

#### 2.6.2.2 Position

bottom-left

#### 2.6.2.3 Participant Id

*Not specified*

#### 2.6.2.4 Sequence Number

7

### 2.6.3.0 Content

#### 2.6.3.1 Content

Decommissioning: The old, corrupted database instance (Primary DB) is retained for 72 hours for post-mortem analysis and then manually decommissioned to reduce costs.

#### 2.6.3.2 Position

bottom-right

#### 2.6.3.3 Participant Id

tech-aws-rds-postgresql-primary

#### 2.6.3.4 Sequence Number

11

## 2.7.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Strict IAM roles must be used for both the On-Call... |
| Performance Targets | RTO: < 15 minutes from incident declaration to ful... |
| Error Handling Strategy | Primary failure mode is the restored data still be... |
| Testing Considerations | This entire procedure must be documented in a runb... |
| Monitoring Requirements | Grafana dashboards must clearly show application h... |
| Deployment Considerations | The production RDS instance must be provisioned vi... |

