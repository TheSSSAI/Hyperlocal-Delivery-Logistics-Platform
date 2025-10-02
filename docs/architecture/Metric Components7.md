# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Technology Stack

- Node.js (NestJS)
- Amazon EKS
- PostgreSQL (RDS)
- AWS SQS/SNS
- Prometheus
- Grafana

## 1.3 Monitoring Components

- Prometheus
- Grafana
- Alertmanager
- AWS CloudWatch
- OpenTelemetry

## 1.4 Requirements

- REQ-1-093 (Performance Targets)
- REQ-1-099 (Uptime)
- REQ-1-100 (Scalability)
- REQ-1-109 (Alerting Metrics)
- REQ-1-028 (Resilience)

## 1.5 Environment

production

# 2.0 Standard System Metrics Selection

## 2.1 Hardware Utilization Metrics

### 2.1.1 node_cpu_utilization_percent

#### 2.1.1.1 Name

node_cpu_utilization_percent

#### 2.1.1.2 Type

🔹 gauge

#### 2.1.1.3 Unit

percent

#### 2.1.1.4 Description

CPU utilization of EKS worker nodes.

#### 2.1.1.5 Collection

##### 2.1.1.5.1 Interval

15s

##### 2.1.1.5.2 Method

Prometheus node-exporter

#### 2.1.1.6.0 Thresholds

##### 2.1.1.6.1 Warning

> 80%

##### 2.1.1.6.2 Critical

> 95%

#### 2.1.1.7.0 Justification

Required by REQ-1-100 and REQ-1-109 to monitor pod health and trigger cluster autoscaling.

### 2.1.2.0.0 node_memory_utilization_percent

#### 2.1.2.1.0 Name

node_memory_utilization_percent

#### 2.1.2.2.0 Type

🔹 gauge

#### 2.1.2.3.0 Unit

percent

#### 2.1.2.4.0 Description

Memory utilization of EKS worker nodes.

#### 2.1.2.5.0 Collection

##### 2.1.2.5.1 Interval

15s

##### 2.1.2.5.2 Method

Prometheus node-exporter

#### 2.1.2.6.0 Thresholds

##### 2.1.2.6.1 Warning

> 85%

##### 2.1.2.6.2 Critical

> 95%

#### 2.1.2.7.0 Justification

Required by REQ-1-100 and REQ-1-109 to monitor pod health and trigger cluster autoscaling.

## 2.2.0.0.0 Runtime Metrics

### 2.2.1.0.0 nodejs_eventloop_lag_seconds

#### 2.2.1.1.0 Name

nodejs_eventloop_lag_seconds

#### 2.2.1.2.0 Type

🔹 gauge

#### 2.2.1.3.0 Unit

seconds

#### 2.2.1.4.0 Description

Measures the latency of the Node.js event loop, indicating if the process is blocked.

#### 2.2.1.5.0 Technology

Node.js

#### 2.2.1.6.0 Collection

##### 2.2.1.6.1 Interval

15s

##### 2.2.1.6.2 Method

prom-client (Node.js library)

#### 2.2.1.7.0 Criticality

high

### 2.2.2.0.0 db_connection_pool_utilization

#### 2.2.2.1.0 Name

db_connection_pool_utilization

#### 2.2.2.2.0 Type

🔹 gauge

#### 2.2.2.3.0 Unit

percent

#### 2.2.2.4.0 Description

Percentage of the database connection pool currently in use.

#### 2.2.2.5.0 Technology

Node.js

#### 2.2.2.6.0 Collection

##### 2.2.2.6.1 Interval

30s

##### 2.2.2.6.2 Method

Custom application metric

#### 2.2.2.7.0 Criticality

high

## 2.3.0.0.0 Request Response Metrics

- {'name': 'http_request_duration_seconds', 'type': 'histogram', 'unit': 'seconds', 'description': 'Latency of all inbound HTTP requests to microservices, measured at the service level.', 'dimensions': ['service', 'route', 'method', 'status_code'], 'percentiles': ['p95', 'p99'], 'collection': {'interval': 'N/A (on request)', 'method': 'OpenTelemetry instrumentation'}}

## 2.4.0.0.0 Availability Metrics

- {'name': 'platform_availability_percent', 'type': 'gauge', 'unit': 'percent', 'description': 'Monthly uptime of public-facing services, calculated from synthetic checks.', 'calculation': '(1 - (downtime_seconds / total_seconds_in_month)) * 100', 'slaTarget': '99.9%'}

## 2.5.0.0.0 Scalability Metrics

- {'name': 'kube_hpa_status_replicas', 'type': 'gauge', 'unit': 'count', 'description': 'Tracks the current and desired number of replicas for each Horizontal Pod Autoscaler.', 'capacityThreshold': 'current_replicas >= max_replicas', 'autoScalingTrigger': True}

# 3.0.0.0.0 Application Specific Metrics Design

## 3.1.0.0.0 Transaction Metrics

### 3.1.1.0.0 app_rider_allocation_duration_seconds

#### 3.1.1.1.0 Name

app_rider_allocation_duration_seconds

#### 3.1.1.2.0 Type

🔹 histogram

#### 3.1.1.3.0 Unit

seconds

#### 3.1.1.4.0 Description

Time taken from an order being marked 'Ready for Pickup' to a rider being successfully assigned.

#### 3.1.1.5.0 Business Context

Rider Logistics

#### 3.1.1.6.0 Dimensions

- operational_zone

#### 3.1.1.7.0 Collection

##### 3.1.1.7.1 Interval

N/A (on event)

##### 3.1.1.7.2 Method

Custom application metric

#### 3.1.1.8.0 Aggregation

##### 3.1.1.8.1 Functions

- histogram_quantile

##### 3.1.1.8.2 Window

5m

### 3.1.2.0.0 app_login_flow_duration_seconds

#### 3.1.2.1.0 Name

app_login_flow_duration_seconds

#### 3.1.2.2.0 Type

🔹 histogram

#### 3.1.2.3.0 Unit

seconds

#### 3.1.2.4.0 Description

End-to-end duration from OTP request to token issuance.

#### 3.1.2.5.0 Business Context

User Authentication

#### 3.1.2.6.0 Dimensions

- user_type

#### 3.1.2.7.0 Collection

##### 3.1.2.7.1 Interval

N/A (on event)

##### 3.1.2.7.2 Method

Custom application metric

#### 3.1.2.8.0 Aggregation

##### 3.1.2.8.1 Functions

- histogram_quantile

##### 3.1.2.8.2 Window

5m

## 3.2.0.0.0 Cache Performance Metrics

- {'name': 'app_cache_hits_misses_total', 'type': 'counter', 'unit': 'count', 'description': 'Total number of cache hits and misses for system configuration and product data.', 'cacheType': 'Redis (ElastiCache)', 'hitRatioTarget': '> 95%'}

## 3.3.0.0.0 External Dependency Metrics

### 3.3.1.0.0 app_external_api_request_duration_seconds

#### 3.3.1.1.0 Name

app_external_api_request_duration_seconds

#### 3.3.1.2.0 Type

🔹 histogram

#### 3.3.1.3.0 Unit

seconds

#### 3.3.1.4.0 Description

Latency of requests to critical third-party APIs.

#### 3.3.1.5.0 Dependency

Razorpay

#### 3.3.1.6.0 Circuit Breaker Integration

✅ Yes

#### 3.3.1.7.0 Sla

##### 3.3.1.7.1 Response Time

< 1000ms

##### 3.3.1.7.2 Availability

99.9%

### 3.3.2.0.0 app_external_api_requests_total

#### 3.3.2.1.0 Name

app_external_api_requests_total

#### 3.3.2.2.0 Type

🔹 counter

#### 3.3.2.3.0 Unit

count

#### 3.3.2.4.0 Description

Total number of requests to critical third-party APIs, segmented by outcome.

#### 3.3.2.5.0 Dependency

Mapbox

#### 3.3.2.6.0 Circuit Breaker Integration

✅ Yes

#### 3.3.2.7.0 Sla

##### 3.3.2.7.1 Response Time

< 500ms

##### 3.3.2.7.2 Availability

99.95%

## 3.4.0.0.0 Error Metrics

- {'name': 'app_errors_total', 'type': 'counter', 'unit': 'count', 'description': 'Total count of application errors, categorized by service and severity.', 'errorTypes': ['unhandled_exception', 'validation_error', 'db_error'], 'dimensions': ['service', 'severity'], 'alertThreshold': '> 5 critical errors in 5m'}

## 3.5.0.0.0 Throughput And Latency Metrics

- {'name': 'api_latency_p95', 'type': 'summary', 'unit': 'milliseconds', 'description': '95th percentile latency for all critical APIs.', 'percentiles': ['p95'], 'buckets': [], 'slaTargets': {'p95': '< 200ms', 'p99': '< 500ms'}}

# 4.0.0.0.0 Business Kpi Identification

## 4.1.0.0.0 Critical Business Metrics

- {'name': 'app_orders_total', 'type': 'counter', 'unit': 'orders', 'description': 'Total number of successfully placed orders.', 'businessOwner': 'Operations', 'calculation': "COUNT(orders WHERE status = 'placed')", 'reportingFrequency': 'real-time', 'target': '100 orders/minute (peak)'}

## 4.2.0.0.0 User Engagement Metrics

- {'name': 'app_active_users', 'type': 'gauge', 'unit': 'users', 'description': 'Number of unique users active in the last 5 minutes.', 'segmentation': ['user_type (customer, vendor, rider)'], 'cohortAnalysis': False}

## 4.3.0.0.0 Conversion Metrics

- {'name': 'app_order_funnel_total', 'type': 'counter', 'unit': 'count', 'description': 'Tracks user progression through the order placement funnel.', 'funnelStage': 'cart_view -> checkout -> payment_success', 'conversionTarget': 'N/A'}

## 4.4.0.0.0 Operational Efficiency Kpis

### 4.4.1.0.0 app_order_rejection_rate_percent

#### 4.4.1.1.0 Name

app_order_rejection_rate_percent

#### 4.4.1.2.0 Type

🔹 gauge

#### 4.4.1.3.0 Unit

percent

#### 4.4.1.4.0 Description

Percentage of orders rejected (manually by vendor or automatically by system).

#### 4.4.1.5.0 Calculation

(rejected_orders / total_orders) * 100

#### 4.4.1.6.0 Benchmark Target

< 5%

### 4.4.2.0.0 app_rider_allocation_failures_total

#### 4.4.2.1.0 Name

app_rider_allocation_failures_total

#### 4.4.2.2.0 Type

🔹 counter

#### 4.4.2.3.0 Unit

count

#### 4.4.2.4.0 Description

Count of orders that failed rider allocation after all retries.

#### 4.4.2.5.0 Calculation

COUNT(orders WHERE status = 'Allocation Failed')

#### 4.4.2.6.0 Benchmark Target

< 1%

## 4.5.0.0.0 Revenue And Cost Metrics

- {'name': 'app_platform_commission_total', 'type': 'counter', 'unit': 'rupees', 'description': 'Total commission earned by the platform on completed orders.', 'frequency': 'real-time', 'accuracy': 'high'}

## 4.6.0.0.0 Customer Satisfaction Indicators

- {'name': 'app_average_rating', 'type': 'gauge', 'unit': 'stars', 'description': 'Average rating given by customers.', 'dataSource': 'RatingReview table', 'updateFrequency': 'batch (hourly)'}

# 5.0.0.0.0 Collection Interval Optimization

## 5.1.0.0.0 Sampling Frequencies

### 5.1.1.0.0 Metric Category

#### 5.1.1.1.0 Metric Category

System Hardware

#### 5.1.1.2.0 Interval

15s

#### 5.1.1.3.0 Justification

Provides a good balance between granularity for alerting and resource overhead.

#### 5.1.1.4.0 Resource Impact

low

### 5.1.2.0.0 Metric Category

#### 5.1.2.1.0 Metric Category

API Performance

#### 5.1.2.2.0 Interval

N/A (on request)

#### 5.1.2.3.0 Justification

Histograms are populated on every request for accuracy.

#### 5.1.2.4.0 Resource Impact

low

### 5.1.3.0.0 Metric Category

#### 5.1.3.1.0 Metric Category

Business KPIs

#### 5.1.3.2.0 Interval

30s

#### 5.1.3.3.0 Justification

Slightly longer interval is acceptable for business dashboards.

#### 5.1.3.4.0 Resource Impact

low

## 5.2.0.0.0 High Frequency Metrics

*No items available*

## 5.3.0.0.0 Cardinality Considerations

- {'metricName': 'http_request_duration_seconds', 'estimatedCardinality': 'medium', 'dimensionStrategy': 'Only include essential dimensions: service, route, method, status_code. Avoid user IDs or order IDs.', 'mitigationApproach': 'Use recording rules in Prometheus to pre-aggregate metrics.'}

## 5.4.0.0.0 Aggregation Periods

- {'metricType': 'Latency', 'periods': ['1m', '5m', '1h'], 'retentionStrategy': '30 days raw, 1 year aggregated'}

## 5.5.0.0.0 Collection Methods

- {'method': 'real-time', 'applicableMetrics': ['http_request_duration_seconds', 'app_orders_total'], 'implementation': 'OpenTelemetry for latency, prom-client for custom counters.', 'performance': 'high'}

# 6.0.0.0.0 Aggregation Method Selection

## 6.1.0.0.0 Statistical Aggregations

- {'metricName': 'app_orders_total', 'aggregationFunctions': ['rate', 'sum'], 'windows': ['1m', '5m'], 'justification': 'Rate is used to calculate orders/minute for REQ-1-093. Sum is for total counts.'}

## 6.2.0.0.0 Histogram Requirements

- {'metricName': 'http_request_duration_seconds', 'buckets': ['0.005', '0.01', '0.025', '0.05', '0.1', '0.2', '0.5', '1', '2.5', '5'], 'percentiles': ['p95', 'p99'], 'accuracy': 'high'}

## 6.3.0.0.0 Percentile Calculations

- {'metricName': 'app_rider_allocation_duration_seconds', 'percentiles': ['p95'], 'algorithm': 'histogram_quantile', 'accuracy': 'high'}

## 6.4.0.0.0 Metric Types

### 6.4.1.0.0 app_orders_total

#### 6.4.1.1.0 Name

app_orders_total

#### 6.4.1.2.0 Implementation

counter

#### 6.4.1.3.0 Reasoning

This is a monotonically increasing value representing the total number of orders.

#### 6.4.1.4.0 Resets Handling

Handled by `rate()` and `increase()` functions in PromQL.

### 6.4.2.0.0 sqs_queue_depth

#### 6.4.2.1.0 Name

sqs_queue_depth

#### 6.4.2.2.0 Implementation

gauge

#### 6.4.2.3.0 Reasoning

This value can go up and down, representing the current state of the queue.

#### 6.4.2.4.0 Resets Handling

N/A

## 6.5.0.0.0 Dimensional Aggregation

- {'metricName': 'http_request_duration_seconds', 'dimensions': ['service', 'route', 'method', 'status_code'], 'aggregationStrategy': 'sum(rate(...)) by (service, status_code) to get total request rate per service.', 'cardinalityImpact': 'medium'}

## 6.6.0.0.0 Derived Metrics

- {'name': 'api_error_rate_percent', 'calculation': '(sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100', 'sourceMetrics': ['http_requests_total'], 'updateFrequency': 'on query'}

# 7.0.0.0.0 Storage Requirements Planning

## 7.1.0.0.0 Retention Periods

### 7.1.1.0.0 Metric Type

#### 7.1.1.1.0 Metric Type

High-resolution (raw)

#### 7.1.1.2.0 Retention Period

30 days

#### 7.1.1.3.0 Justification

Sufficient for short-term debugging and incident analysis.

#### 7.1.1.4.0 Compliance Requirement

N/A

### 7.1.2.0.0 Metric Type

#### 7.1.2.1.0 Metric Type

Aggregated (downsampled)

#### 7.1.2.2.0 Retention Period

1 year

#### 7.1.2.3.0 Justification

Required for long-term trend analysis and capacity planning.

#### 7.1.2.4.0 Compliance Requirement

N/A

## 7.2.0.0.0 Data Resolution

### 7.2.1.0.0 Time Range

#### 7.2.1.1.0 Time Range

0-30 days

#### 7.2.1.2.0 Resolution

15s

#### 7.2.1.3.0 Query Performance

high

#### 7.2.1.4.0 Storage Optimization

none

### 7.2.2.0.0 Time Range

#### 7.2.2.1.0 Time Range

30 days - 1 year

#### 7.2.2.2.0 Resolution

5m

#### 7.2.2.3.0 Query Performance

medium

#### 7.2.2.4.0 Storage Optimization

downsampling

## 7.3.0.0.0 Downsampling Strategies

- {'sourceResolution': '15s', 'targetResolution': '5m', 'aggregationMethod': 'avg for gauges, sum for counters, merged histograms', 'triggerCondition': 'After 30 days'}

## 7.4.0.0.0 Storage Performance

| Property | Value |
|----------|-------|
| Write Latency | < 100ms |
| Query Latency | < 1s for typical dashboard queries |
| Throughput Requirements | High write throughput for metrics from all service... |
| Scalability Needs | Horizontal scalability of Prometheus/Mimir |

## 7.5.0.0.0 Query Optimization

- {'queryPattern': 'Aggregating latency percentiles by service', 'optimizationStrategy': 'Use Prometheus recording rules to pre-calculate p95 latency per service over 5m windows.', 'indexingRequirements': ['N/A for Prometheus']}

## 7.6.0.0.0 Cost Optimization

- {'strategy': 'Downsampling and long-term storage', 'implementation': 'Use a tool like Thanos or Mimir to downsample old data and move it to cheaper object storage (S3).', 'expectedSavings': '60-80% on long-term metric storage', 'tradeoffs': 'Loss of high-resolution data for historical analysis.'}

# 8.0.0.0.0 Project Specific Metrics Config

## 8.1.0.0.0 Standard Metrics

### 8.1.1.0.0 http_requests_total

#### 8.1.1.1.0 Name

http_requests_total

#### 8.1.1.2.0 Type

🔹 counter

#### 8.1.1.3.0 Unit

requests

#### 8.1.1.4.0 Collection

##### 8.1.1.4.1 Interval

N/A (on request)

##### 8.1.1.4.2 Method

OpenTelemetry

#### 8.1.1.5.0 Thresholds

##### 8.1.1.5.1 Warning

Error rate > 2% over 5m

##### 8.1.1.5.2 Critical

Error rate > 5% over 5m

#### 8.1.1.6.0 Dimensions

- service
- route
- method
- status_code

### 8.1.2.0.0 sqs_messages_visible

#### 8.1.2.1.0 Name

sqs_messages_visible

#### 8.1.2.2.0 Type

🔹 gauge

#### 8.1.2.3.0 Unit

messages

#### 8.1.2.4.0 Collection

##### 8.1.2.4.1 Interval

30s

##### 8.1.2.4.2 Method

Prometheus CloudWatch Exporter

#### 8.1.2.5.0 Thresholds

##### 8.1.2.5.1 Warning

> 1000

##### 8.1.2.5.2 Critical

> 5000

#### 8.1.2.6.0 Dimensions

- queue_name

## 8.2.0.0.0 Custom Metrics

### 8.2.1.0.0 app_orders_total

#### 8.2.1.1.0 Name

app_orders_total

#### 8.2.1.2.0 Description

Monotonically increasing count of successfully placed orders.

#### 8.2.1.3.0 Calculation

Incremented on successful order creation.

#### 8.2.1.4.0 Type

🔹 counter

#### 8.2.1.5.0 Unit

orders

#### 8.2.1.6.0 Business Context

Tracks overall platform throughput as per REQ-1-093.

#### 8.2.1.7.0 Collection

##### 8.2.1.7.1 Interval

N/A (on event)

##### 8.2.1.7.2 Method

prom-client

#### 8.2.1.8.0 Alerting

##### 8.2.1.8.1 Enabled

✅ Yes

##### 8.2.1.8.2 Conditions

- rate(app_orders_total[5m]) < 1 for 15m (during business hours)

### 8.2.2.0.0 app_rider_allocation_duration_seconds

#### 8.2.2.1.0 Name

app_rider_allocation_duration_seconds

#### 8.2.2.2.0 Description

Time to assign a rider after an order is ready.

#### 8.2.2.3.0 Calculation

Timer between 'OrderReadyForPickup' and 'RiderAssigned' events.

#### 8.2.2.4.0 Type

🔹 histogram

#### 8.2.2.5.0 Unit

seconds

#### 8.2.2.6.0 Business Context

Tracks operational efficiency SLA from REQ-1-093.

#### 8.2.2.7.0 Collection

##### 8.2.2.7.1 Interval

N/A (on event)

##### 8.2.2.7.2 Method

prom-client

#### 8.2.2.8.0 Alerting

##### 8.2.2.8.1 Enabled

✅ Yes

##### 8.2.2.8.2 Conditions

- histogram_quantile(0.95, sum(rate(app_rider_allocation_duration_seconds_bucket[5m])) by (le)) > 30

## 8.3.0.0.0 Dashboard Metrics

### 8.3.1.0.0 Dashboard

#### 8.3.1.1.0 Dashboard

System Health Overview

#### 8.3.1.2.0 Metrics

- api_error_rate_percent
- api_latency_p95
- node_cpu_utilization_percent
- sqs_queue_depth

#### 8.3.1.3.0 Refresh Interval

30s

#### 8.3.1.4.0 Audience

On-Call Engineers

### 8.3.2.0.0 Dashboard

#### 8.3.2.1.0 Dashboard

Business Operations KPI

#### 8.3.2.2.0 Metrics

- app_orders_total (rate)
- app_order_rejection_rate_percent
- app_rider_allocation_duration_seconds (p95)
- app_active_users

#### 8.3.2.3.0 Refresh Interval

1m

#### 8.3.2.4.0 Audience

Operations Team

# 9.0.0.0.0 Implementation Priority

## 9.1.0.0.0 Component

### 9.1.1.0.0 Component

Core API Metrics (Latency, Errors, Throughput)

### 9.1.2.0.0 Priority

🔴 high

### 9.1.3.0.0 Dependencies

- OpenTelemetry SDK setup

### 9.1.4.0.0 Estimated Effort

Medium

### 9.1.5.0.0 Risk Level

low

## 9.2.0.0.0 Component

### 9.2.1.0.0 Component

Critical Business Metrics (Orders, Rider Allocation)

### 9.2.2.0.0 Priority

🔴 high

### 9.2.3.0.0 Dependencies

- Application code instrumentation

### 9.2.4.0.0 Estimated Effort

Medium

### 9.2.5.0.0 Risk Level

medium

## 9.3.0.0.0 Component

### 9.3.1.0.0 Component

Infrastructure Metrics (EKS, RDS, SQS)

### 9.3.2.0.0 Priority

🟡 medium

### 9.3.3.0.0 Dependencies

- Prometheus Operator
- CloudWatch Exporter setup

### 9.3.4.0.0 Estimated Effort

Low

### 9.3.5.0.0 Risk Level

low

# 10.0.0.0.0 Risk Assessment

- {'risk': 'High cardinality of metrics causing performance issues in Prometheus.', 'impact': 'medium', 'probability': 'medium', 'mitigation': 'Strictly control dimensions on metrics. Avoid adding high-cardinality labels like `userId` or `orderId`. Use recording rules to pre-aggregate data.', 'contingencyPlan': 'If performance degrades, reduce scrape intervals or drop high-cardinality metrics until the issue is resolved. Scale Prometheus horizontally.'}

# 11.0.0.0.0 Recommendations

## 11.1.0.0.0 Category

### 11.1.1.0.0 Category

🔹 Implementation

### 11.1.2.0.0 Recommendation

Standardize all custom metrics instrumentation in a shared library to be used by all NestJS microservices.

### 11.1.3.0.0 Justification

Ensures consistency in metric names, labels, and descriptions across the platform, simplifying dashboard creation and alerting.

### 11.1.4.0.0 Priority

🔴 high

### 11.1.5.0.0 Implementation Notes

The shared library should wrap `prom-client` and provide decorators or simple functions for common metric types (e.g., `recordAPICall`, `incrementOrderCounter`).

## 11.2.0.0.0 Category

### 11.2.1.0.0 Category

🔹 Observability

### 11.2.2.0.0 Recommendation

Integrate OpenTelemetry traces with logs by ensuring the `traceId` is automatically injected into the structured JSON logs.

### 11.2.3.0.0 Justification

Allows for seamless jumping from a slow trace in a tool like Jaeger/X-Ray directly to the relevant logs in CloudWatch for that specific request, dramatically reducing debugging time.

### 11.2.4.0.0 Priority

🔴 high

### 11.2.5.0.0 Implementation Notes

Configure the logging library (e.g., Pino, Winston) to automatically include the current trace context from OpenTelemetry in every log entry.

