# Terraform Input Variables for the Production Environment
# This file provides production-grade values for the variables defined in the reusable modules.
# Production is configured for high availability, scalability, and resilience as per non-functional requirements.

# General Project & Environment Configuration
project_name = "hyperlocal"
environment  = "prod"
aws_region   = "ap-south-1"

# Tags applied to all taggable resources
common_tags = {
  Project     = "Hyperlocal"
  Environment = "prod"
  ManagedBy   = "Terraform"
}

# VPC Module Variables
# Using a distinct CIDR block for production.
vpc_cidr_block      = "10.2.0.0/16"
availability_zones  = ["ap-south-1a", "ap-south-1b", "ap-south-1c"] # Using 3 AZs for maximum resilience (REQ-1-016).
enable_nat_gateway  = true
single_nat_gateway  = false # Redundant NAT gateways for high availability.

# RDS Module Variables
# Production-grade instance class, with Multi-AZ, high backup retention, and deletion protection enabled (REQ-1-094).
db_instance_class         = "db.m5.large"
db_allocated_storage      = 100
db_engine_version         = "15.4"
db_multi_az               = true
db_backup_retention_period = 30
db_deletion_protection    = true

# ElastiCache Module Variables
# Larger, replicated Redis cluster for high availability and performance.
redis_node_type      = "cache.m5.large"
redis_cluster_size   = 3 # A 3-node cluster with replication enabled.

# EKS Module Variables
# Production-grade instances and a robust auto-scaling configuration to handle production load (REQ-1-100).
eks_cluster_version    = "1.28"
eks_instance_type      = "m5.large"
eks_node_group_min_size  = 3
eks_node_group_max_size  = 10
eks_node_group_desired_size = 3

# Cognito Module Variables
cognito_user_pool_name = "hyperlocal-prod-user-pool"

# SQS/SNS Module Variables
order_events_topic_name = "hyperlocal-prod-order-events"
notification_queue_name = "hyperlocal-prod-notification-queue"