# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Node.js (NestJS)
- React Native
- PostgreSQL (AWS RDS)
- Amazon EKS
- AWS SQS/SNS
- AWS ElastiCache (Redis)

## 1.3 Architecture Patterns

- Microservices
- Event-Driven Architecture
- Saga Pattern
- API Gateway

## 1.4 Resource Needs

- Container Orchestration (EKS)
- Managed Relational Database (RDS)
- Managed Cache (ElastiCache)
- Managed Message Queues (SQS/SNS)
- Object Storage (S3)

## 1.5 Performance Expectations

REQ-NFR-001 specifies P95 latency under 200ms for critical APIs and support for 100 orders/minute. REQ-NFR-005 specifies support for 10,000 concurrent users.

## 1.6 Data Processing Volumes

High volume of small, transactional database operations. Real-time, high-frequency location data streams. Asynchronous event processing via message queues.

# 2.0 Workload Characterization

## 2.1 Processing Resource Consumption

### 2.1.1 Operation

#### 2.1.1.1 Operation

Order Management Service

#### 2.1.1.2 Cpu Pattern

bursty

#### 2.1.1.3 Cpu Utilization

| Property | Value |
|----------|-------|
| Baseline | 10% |
| Peak | 80% |
| Average | 25% |

#### 2.1.1.4 Memory Pattern

fluctuating

#### 2.1.1.5 Memory Requirements

| Property | Value |
|----------|-------|
| Baseline | 512MB |
| Peak | 2GB |
| Growth | low |

#### 2.1.1.6 Io Characteristics

| Property | Value |
|----------|-------|
| Disk Iops | low |
| Network Throughput | high |
| Io Pattern | mixed |

### 2.1.2.0 Operation

#### 2.1.2.1 Operation

Rider Logistics Service (Live Tracking)

#### 2.1.2.2 Cpu Pattern

cyclic

#### 2.1.2.3 Cpu Utilization

| Property | Value |
|----------|-------|
| Baseline | 15% |
| Peak | 60% |
| Average | 30% |

#### 2.1.2.4 Memory Pattern

steady

#### 2.1.2.5 Memory Requirements

| Property | Value |
|----------|-------|
| Baseline | 1GB |
| Peak | 3GB |
| Growth | low |

#### 2.1.2.6 Io Characteristics

| Property | Value |
|----------|-------|
| Disk Iops | low |
| Network Throughput | very-high |
| Io Pattern | mixed |

## 2.2.0.0 Concurrency Requirements

- {'operation': 'Order Placement', 'maxConcurrentJobs': 10000, 'threadPoolSize': 0, 'connectionPoolSize': 50, 'queueDepth': 100}

## 2.3.0.0 Database Access Patterns

- {'accessType': 'mixed', 'connectionRequirements': 'High connection count from multiple microservices.', 'queryComplexity': 'mixed', 'transactionVolume': 'High (100+ orders/minute)', 'cacheHitRatio': '>90% for product data'}

## 2.4.0.0 Frontend Resource Demands

- {'component': 'Rider & Customer Mobile Apps', 'renderingLoad': 'moderate', 'staticContentSize': 'low', 'dynamicContentVolume': 'high (live tracking, order updates)', 'userConcurrency': '10,000+'}

## 2.5.0.0 Load Patterns

- {'pattern': 'peak-trough', 'description': 'Load peaks during meal times (lunch, dinner) and weekends, with lower activity overnight.', 'frequency': 'daily', 'magnitude': '5-10x baseline', 'predictability': 'high'}

# 3.0.0.0 Scaling Strategy Design

## 3.1.0.0 Scaling Approaches

### 3.1.1.0 Component

#### 3.1.1.1 Component

All Backend Microservices (EKS Pods)

#### 3.1.1.2 Primary Strategy

horizontal

#### 3.1.1.3 Justification

REQ-NFR-005 mandates Horizontal Pod Autoscalers (HPA) to handle fluctuating loads for the microservices architecture. It's cost-effective and resilient.

#### 3.1.1.4 Limitations

- Dependent on stateless service design.
- Can be limited by downstream dependencies like the database.

#### 3.1.1.5 Implementation

Kubernetes Horizontal Pod Autoscaler

### 3.1.2.0 Component

#### 3.1.2.1 Component

EKS Cluster Nodes

#### 3.1.2.2 Primary Strategy

horizontal

#### 3.1.2.3 Justification

REQ-NFR-005 mandates the Cluster Autoscaler to add or remove EC2 instances based on pod scheduling needs, ensuring resource availability.

#### 3.1.2.4 Limitations

- Node provisioning can have a slight delay.

#### 3.1.2.5 Implementation

Kubernetes Cluster Autoscaler for AWS

### 3.1.3.0 Component

#### 3.1.3.1 Component

PostgreSQL Database (RDS)

#### 3.1.3.2 Primary Strategy

hybrid

#### 3.1.3.3 Justification

Vertical scaling (changing instance size) for write capacity. Horizontal scaling via Read Replicas as specified in REQ-NFR-005 for read-heavy workloads like product discovery.

#### 3.1.3.4 Limitations

- Vertical scaling requires a brief downtime.
- Read replicas add complexity for data consistency.

#### 3.1.3.5 Implementation

AWS RDS instance scaling and Read Replica creation.

## 3.2.0.0 Instance Specifications

### 3.2.1.0 Workload Type

#### 3.2.1.1 Workload Type

EKS Worker Nodes (General Purpose)

#### 3.2.1.2 Instance Family

m5

#### 3.2.1.3 Instance Size

m5.large

#### 3.2.1.4 V Cpus

2

#### 3.2.1.5 Memory Gb

8

#### 3.2.1.6 Storage Type

gp3

#### 3.2.1.7 Network Performance

moderate

#### 3.2.1.8 Optimization

balanced

### 3.2.2.0 Workload Type

#### 3.2.2.1 Workload Type

PostgreSQL Database (RDS)

#### 3.2.2.2 Instance Family

db.r5

#### 3.2.2.3 Instance Size

db.r5.large

#### 3.2.2.4 V Cpus

2

#### 3.2.2.5 Memory Gb

16

#### 3.2.2.6 Storage Type

io1

#### 3.2.2.7 Network Performance

high

#### 3.2.2.8 Optimization

memory

### 3.2.3.0 Workload Type

#### 3.2.3.1 Workload Type

Redis Cache (ElastiCache)

#### 3.2.3.2 Instance Family

cache.t3

#### 3.2.3.3 Instance Size

cache.t3.medium

#### 3.2.3.4 V Cpus

2

#### 3.2.3.5 Memory Gb

3.22

#### 3.2.3.6 Storage Type

in-memory

#### 3.2.3.7 Network Performance

moderate

#### 3.2.3.8 Optimization

memory

## 3.3.0.0 Multithreading Considerations

*No items available*

## 3.4.0.0 Specialized Hardware

*No items available*

## 3.5.0.0 Storage Scaling

- {'storageType': 'database', 'scalingMethod': 'vertical', 'performance': 'High IOPS (io1/io2)', 'consistency': 'strong'}

## 3.6.0.0 Licensing Implications

*No items available*

# 4.0.0.0 Auto Scaling Trigger Metrics

## 4.1.0.0 Cpu Utilization Triggers

- {'component': 'All Microservices', 'scaleUpThreshold': 75, 'scaleDownThreshold': 40, 'evaluationPeriods': 3, 'dataPoints': 2, 'justification': 'Primary scaling metric for compute-bound workloads, explicitly mentioned in REQ-NFR-005. A 75% threshold provides a buffer before resource exhaustion.'}

## 4.2.0.0 Memory Consumption Triggers

- {'component': 'All Microservices', 'scaleUpThreshold': 80, 'scaleDownThreshold': 50, 'evaluationPeriods': 3, 'triggerCondition': 'used', 'justification': 'Secondary scaling metric, as per REQ-NFR-005, for memory-intensive services to prevent OutOfMemory (OOM) errors.'}

## 4.3.0.0 Database Connection Triggers

*No items available*

## 4.4.0.0 Queue Length Triggers

- {'queueType': 'message', 'scaleUpThreshold': 100, 'scaleDownThreshold': 10, 'ageThreshold': '300s', 'priority': 'normal'}

## 4.5.0.0 Response Time Triggers

*No items available*

## 4.6.0.0 Custom Metric Triggers

- {'metricName': 'orders_per_minute', 'description': 'Number of orders being processed per minute by the Order Management Service.', 'scaleUpThreshold': 80, 'scaleDownThreshold': 20, 'calculation': 'Calculated via Prometheus custom metrics.', 'businessJustification': "Directly scales the core transactional service based on business throughput, aligning with REQ-NFR-001's target of 100 orders/minute."}

## 4.7.0.0 Disk Iotriggers

*No items available*

# 5.0.0.0 Scaling Limits And Safeguards

## 5.1.0.0 Instance Limits

### 5.1.1.0 Component

#### 5.1.1.1 Component

Order Management Service

#### 5.1.1.2 Min Instances

3

#### 5.1.1.3 Max Instances

20

#### 5.1.1.4 Justification

Min instances ensure high availability across AZs. Max instances prevent runaway scaling and control costs.

#### 5.1.1.5 Cost Implication

Sets a predictable upper bound on compute costs for this service.

### 5.1.2.0 Component

#### 5.1.2.1 Component

Notifications Service

#### 5.1.2.2 Min Instances

2

#### 5.1.2.3 Max Instances

10

#### 5.1.2.4 Justification

Lower baseline as it is less critical than order processing. Max instances handle burst traffic (e.g., promotional notifications).

#### 5.1.2.5 Cost Implication

Lower cost profile for a background service.

## 5.2.0.0 Cooldown Periods

### 5.2.1.0 Action

#### 5.2.1.1 Action

scale-up

#### 5.2.1.2 Duration

180s

#### 5.2.1.3 Reasoning

Allows new pods to become fully operational and stabilize before further scaling decisions are made.

#### 5.2.1.4 Component

All Microservices (HPA)

### 5.2.2.0 Action

#### 5.2.2.1 Action

scale-down

#### 5.2.2.2 Duration

300s

#### 5.2.2.3 Reasoning

Prevents aggressive downscaling during temporary lulls in traffic, avoiding 'flapping' (rapid scale up/down cycles).

#### 5.2.2.4 Component

All Microservices (HPA)

## 5.3.0.0 Scaling Step Sizes

*No items available*

## 5.4.0.0 Runaway Protection

- {'safeguard': 'cost-threshold', 'implementation': 'AWS Budgets with alerts', 'trigger': 'Forecasted monthly spend exceeds a predefined limit.', 'action': 'Notify administrators.'}

## 5.5.0.0 Graceful Degradation

- {'scenario': 'Database at max connection limit.', 'strategy': 'queue-throttling', 'implementation': 'Services will reduce the rate at which they process jobs from SQS queues, preventing further DB connections.', 'userImpact': 'Delayed background processing (e.g., notifications, settlements). Core order placement might be slowed.'}

## 5.6.0.0 Resource Quotas

*No items available*

## 5.7.0.0 Workload Prioritization

*No items available*

# 6.0.0.0 Cost Optimization Strategy

## 6.1.0.0 Instance Right Sizing

*No items available*

## 6.2.0.0 Time Based Scaling

- {'schedule': 'Scale down at 11 PM, Scale up at 7 AM', 'timezone': 'IST', 'scaleAction': 'set-replicas', 'instanceCount': 1, 'justification': 'Reduces costs for non-production (Development, Staging) environments during off-hours.'}

## 6.3.0.0 Instance Termination Policies

*No items available*

## 6.4.0.0 Spot Instance Strategies

- {'component': 'Stateless Microservices (e.g., Notifications, Ratings)', 'spotPercentage': 50, 'fallbackStrategy': 'Fall back to on-demand instances if spot capacity is unavailable.', 'interruptionHandling': 'Graceful shutdown to finish in-flight requests before termination.', 'costSavings': 'Significant reduction in EC2 costs for non-critical or batch workloads.'}

## 6.5.0.0 Reserved Instance Planning

- {'instanceType': 'm5.large, db.r5.large', 'reservationTerm': '1-year', 'utilizationForecast': '70%', 'baselineInstances': 5, 'paymentOption': 'no-upfront'}

## 6.6.0.0 Resource Tracking

*No items available*

## 6.7.0.0 Cleanup Policies

*No items available*

# 7.0.0.0 Load Testing And Validation

## 7.1.0.0 Baseline Metrics

- {'metric': 'P95 API Latency', 'baselineValue': '180ms', 'acceptableVariation': '10%', 'measurementMethod': 'Prometheus'}

## 7.2.0.0 Validation Procedures

- {'procedure': 'Automated performance tests in CI/CD pipeline against Staging environment.', 'frequency': 'On every deployment to main branch', 'successCriteria': ['P95 latency remains below 200ms.', 'Error rate < 1%.'], 'failureActions': ['Block deployment.', 'Alert development team.']}

## 7.3.0.0 Synthetic Load Scenarios

*No items available*

## 7.4.0.0 Scaling Event Monitoring

*No items available*

## 7.5.0.0 Policy Refinement

*No items available*

## 7.6.0.0 Effectiveness Kpis

*No items available*

## 7.7.0.0 Feedback Mechanisms

*No items available*

# 8.0.0.0 Project Specific Scaling Policies

## 8.1.0.0 Policies

### 8.1.1.0 hpa-order-management-service

#### 8.1.1.1 Id

hpa-order-management-service

#### 8.1.1.2 Type

🔹 Horizontal

#### 8.1.1.3 Component

Order Management Service

#### 8.1.1.4 Rules

##### 8.1.1.4.1 Metric

###### 8.1.1.4.1.1 Metric

CPU Utilization

###### 8.1.1.4.1.2 Threshold

75

###### 8.1.1.4.1.3 Operator

GREATER_THAN

###### 8.1.1.4.1.4 Scale Change

0

###### 8.1.1.4.1.5 Cooldown

####### 8.1.1.4.1.5.1 Scale Up Seconds

180

####### 8.1.1.4.1.5.2 Scale Down Seconds

300

###### 8.1.1.4.1.6.0 Evaluation Periods

3

###### 8.1.1.4.1.7.0 Data Points To Alarm

2

##### 8.1.1.4.2.0.0 Metric

###### 8.1.1.4.2.1.0 Metric

orders_per_minute (Custom)

###### 8.1.1.4.2.2.0 Threshold

80

###### 8.1.1.4.2.3.0 Operator

GREATER_THAN

###### 8.1.1.4.2.4.0 Scale Change

0

###### 8.1.1.4.2.5.0 Cooldown

####### 8.1.1.4.2.5.1 Scale Up Seconds

180

####### 8.1.1.4.2.5.2 Scale Down Seconds

300

###### 8.1.1.4.2.6.0 Evaluation Periods

2

###### 8.1.1.4.2.7.0 Data Points To Alarm

2

#### 8.1.1.5.0.0.0 Safeguards

| Property | Value |
|----------|-------|
| Min Instances | 3 |
| Max Instances | 20 |
| Max Scaling Rate | 10 pods/minute |
| Cost Threshold |  |

#### 8.1.1.6.0.0.0 Schedule

##### 8.1.1.6.1.0.0 Enabled

❌ No

##### 8.1.1.6.2.0.0 Timezone



##### 8.1.1.6.3.0.0 Rules

*No items available*

### 8.1.2.0.0.0.0 hpa-notifications-service

#### 8.1.2.1.0.0.0 Id

hpa-notifications-service

#### 8.1.2.2.0.0.0 Type

🔹 Horizontal

#### 8.1.2.3.0.0.0 Component

Notifications Service

#### 8.1.2.4.0.0.0 Rules

- {'metric': 'SQS Queue Length', 'threshold': 100, 'operator': 'GREATER_THAN_OR_EQUAL', 'scaleChange': 1, 'cooldown': {'scaleUpSeconds': 120, 'scaleDownSeconds': 300}, 'evaluationPeriods': 2, 'dataPointsToAlarm': 2}

#### 8.1.2.5.0.0.0 Safeguards

| Property | Value |
|----------|-------|
| Min Instances | 2 |
| Max Instances | 10 |
| Max Scaling Rate |  |
| Cost Threshold |  |

#### 8.1.2.6.0.0.0 Schedule

##### 8.1.2.6.1.0.0 Enabled

❌ No

##### 8.1.2.6.2.0.0 Timezone



##### 8.1.2.6.3.0.0 Rules

*No items available*

## 8.2.0.0.0.0.0 Configuration

### 8.2.1.0.0.0.0 Min Instances

2

### 8.2.2.0.0.0.0 Max Instances

50

### 8.2.3.0.0.0.0 Default Timeout

300s

### 8.2.4.0.0.0.0 Region

ap-south-1

### 8.2.5.0.0.0.0 Resource Group

platform-prod-rg

### 8.2.6.0.0.0.0 Notification Endpoint

arn:aws:sns:ap-south-1:123456789012:ops-alerts

### 8.2.7.0.0.0.0 Logging Level

INFO

### 8.2.8.0.0.0.0 Vpc Id

vpc-prod-xxxxxxxx

### 8.2.9.0.0.0.0 Instance Type

m5.large

### 8.2.10.0.0.0.0 Enable Detailed Monitoring

true

### 8.2.11.0.0.0.0 Scaling Mode

reactive

### 8.2.12.0.0.0.0 Cost Optimization

| Property | Value |
|----------|-------|
| Spot Instances Enabled | ✅ |
| Spot Percentage | 30 |
| Reserved Instances Planned | ✅ |

### 8.2.13.0.0.0.0 Performance Targets

| Property | Value |
|----------|-------|
| Response Time | <200ms (P95) |
| Throughput | 100 orders/min |
| Availability | 99.9% |

## 8.3.0.0.0.0.0 Environment Specific Policies

### 8.3.1.0.0.0.0 Environment

#### 8.3.1.1.0.0.0 Environment

production

#### 8.3.1.2.0.0.0 Scaling Enabled

✅ Yes

#### 8.3.1.3.0.0.0 Aggressiveness

moderate

#### 8.3.1.4.0.0.0 Cost Priority

balanced

### 8.3.2.0.0.0.0 Environment

#### 8.3.2.1.0.0.0 Environment

staging

#### 8.3.2.2.0.0.0 Scaling Enabled

✅ Yes

#### 8.3.2.3.0.0.0 Aggressiveness

conservative

#### 8.3.2.4.0.0.0 Cost Priority

cost-optimized

### 8.3.3.0.0.0.0 Environment

#### 8.3.3.1.0.0.0 Environment

development

#### 8.3.3.2.0.0.0 Scaling Enabled

❌ No

#### 8.3.3.3.0.0.0 Aggressiveness

conservative

#### 8.3.3.4.0.0.0 Cost Priority

cost-optimized

# 9.0.0.0.0.0.0 Implementation Priority

## 9.1.0.0.0.0.0 Component

### 9.1.1.0.0.0.0 Component

EKS HPA for Critical Services (Orders, Logistics)

### 9.1.2.0.0.0.0 Priority

🔴 high

### 9.1.3.0.0.0.0 Dependencies

- EKS Cluster Setup
- Prometheus Metrics Server

### 9.1.4.0.0.0.0 Estimated Effort

Medium

### 9.1.5.0.0.0.0 Risk Level

medium

## 9.2.0.0.0.0.0 Component

### 9.2.1.0.0.0.0 Component

EKS Cluster Autoscaler

### 9.2.2.0.0.0.0 Priority

🔴 high

### 9.2.3.0.0.0.0 Dependencies

- EKS Cluster Setup

### 9.2.4.0.0.0.0 Estimated Effort

Low

### 9.2.5.0.0.0.0 Risk Level

low

## 9.3.0.0.0.0.0 Component

### 9.3.1.0.0.0.0 Component

RDS Read Replicas

### 9.3.2.0.0.0.0 Priority

🟡 medium

### 9.3.3.0.0.0.0 Dependencies

- RDS Primary Instance

### 9.3.4.0.0.0.0 Estimated Effort

Low

### 9.3.5.0.0.0.0 Risk Level

medium

## 9.4.0.0.0.0.0 Component

### 9.4.1.0.0.0.0 Component

KEDA for SQS-based Scaling

### 9.4.2.0.0.0.0 Priority

🟡 medium

### 9.4.3.0.0.0.0 Dependencies

- EKS HPA for Critical Services (Orders, Logistics)

### 9.4.4.0.0.0.0 Estimated Effort

Medium

### 9.4.5.0.0.0.0 Risk Level

low

# 10.0.0.0.0.0.0 Risk Assessment

## 10.1.0.0.0.0.0 Risk

### 10.1.1.0.0.0.0 Risk

Autoscaling misconfiguration causes service unavailability ('flapping' or failure to scale up).

### 10.1.2.0.0.0.0 Impact

high

### 10.1.3.0.0.0.0 Probability

medium

### 10.1.4.0.0.0.0 Mitigation

Thoroughly test scaling policies under load in a staging environment. Set appropriate minimum instance counts for high availability.

### 10.1.5.0.0.0.0 Contingency Plan

Manual intervention by an on-call engineer to adjust HPA replica counts. Revert the scaling policy change.

## 10.2.0.0.0.0.0 Risk

### 10.2.1.0.0.0.0 Risk

Runaway scaling leads to excessive cloud costs.

### 10.2.2.0.0.0.0 Impact

medium

### 10.2.3.0.0.0.0 Probability

low

### 10.2.4.0.0.0.0 Mitigation

Set hard maximum limits on all HPAs and the Cluster Autoscaler. Implement AWS Budgets with alerts for cost anomalies.

### 10.2.5.0.0.0.0 Contingency Plan

Manually scale down the offending service. Perform a root cause analysis of the scaling trigger.

## 10.3.0.0.0.0.0 Risk

### 10.3.1.0.0.0.0 Risk

Database becomes a bottleneck, preventing application services from scaling effectively.

### 10.3.2.0.0.0.0 Impact

high

### 10.3.3.0.0.0.0 Probability

medium

### 10.3.4.0.0.0.0 Mitigation

Implement RDS Read Replicas for read-heavy workloads (REQ-NFR-005). Optimize queries and ensure proper database connection pooling.

### 10.3.5.0.0.0.0 Contingency Plan

Temporarily scale up the RDS instance size (vertical scaling) while a long-term fix (e.g., query optimization) is implemented.

# 11.0.0.0.0.0.0 Recommendations

## 11.1.0.0.0.0.0 Category

### 11.1.1.0.0.0.0 Category

🔹 Cost Optimization

### 11.1.2.0.0.0.0 Recommendation

Use KEDA (Kubernetes Event-driven Autoscaling) for scaling worker microservices based on SQS queue length.

### 11.1.3.0.0.0.0 Justification

KEDA provides more sophisticated and direct scaling triggers for message queues than the standard HPA custom metrics adapter, leading to more responsive and cost-effective scaling for asynchronous workloads like the Notifications Service.

### 11.1.4.0.0.0.0 Priority

🟡 medium

### 11.1.5.0.0.0.0 Implementation Notes

Deploy the KEDA operator to the EKS cluster and define `ScaledObject` resources for target deployments.

## 11.2.0.0.0.0.0 Category

### 11.2.1.0.0.0.0 Category

🔹 Performance

### 11.2.2.0.0.0.0 Recommendation

Implement database connection pooling within each microservice instance and tune it carefully.

### 11.2.3.0.0.0.0 Justification

As per REQ-NFR-005, connection pooling is required. It is critical to prevent exhausting the database's connection limit as services scale out horizontally. A poorly tuned pool can become a major bottleneck.

### 11.2.4.0.0.0.0 Priority

🔴 high

### 11.2.5.0.0.0.0 Implementation Notes

Use the connection pooling features of the chosen Node.js database library (e.g., TypeORM) and monitor pool utilization via Prometheus.

## 11.3.0.0.0.0.0 Category

### 11.3.1.0.0.0.0 Category

🔹 Reliability

### 11.3.2.0.0.0.0 Recommendation

Configure Pod Disruption Budgets (PDBs) for all critical microservices.

### 11.3.3.0.0.0.0 Justification

PDBs ensure that a minimum number of replicas are always running during voluntary disruptions like node upgrades or deployments, which is crucial for maintaining the 99.9% uptime requirement (REQ-NFR-004).

### 11.3.4.0.0.0.0 Priority

🔴 high

### 11.3.5.0.0.0.0 Implementation Notes

Define a PDB for each critical Deployment, setting `minAvailable` to a value that guarantees service availability (e.g., 2 for a service with minReplicas=3).

