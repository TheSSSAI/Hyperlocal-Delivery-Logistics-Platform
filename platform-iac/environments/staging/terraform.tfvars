# Terraform Input Variables for the Staging Environment
# This file provides environment-specific values for the variables defined in the reusable modules.
# Staging is configured with resources that are closer to production scale for performance testing and pre-prod validation.

# General Project & Environment Configuration
project_name = "hyperlocal"
environment  = "staging"
aws_region   = "ap-south-1"

# Tags applied to all taggable resources
common_tags = {
  Project     = "Hyperlocal"
  Environment = "staging"
  ManagedBy   = "Terraform"
}

# VPC Module Variables
# Using a different CIDR block to avoid overlap with dev/prod if peering is ever needed.
vpc_cidr_block      = "10.1.0.0/16"
availability_zones  = ["ap-south-1a", "ap-south-1b"]
enable_nat_gateway  = true
single_nat_gateway  = false # Use redundant NAT gateways for higher availability, closer to prod config.

# RDS Module Variables
# A slightly larger instance class than dev. Multi-AZ is enabled to test failover procedures.
db_instance_class         = "db.t3.medium"
db_allocated_storage      = 50
db_engine_version         = "15.4"
db_multi_az               = true
db_backup_retention_period = 15
db_deletion_protection    = true

# ElastiCache Module Variables
redis_node_type      = "cache.t3.small"
redis_cluster_size   = 2 # Multi-node cluster for resilience testing.

# EKS Module Variables
# Larger instances and higher node count for staging to handle load testing.
eks_cluster_version    = "1.28"
eks_instance_type      = "t3.large"
eks_node_group_min_size  = 2
eks_node_group_max_size  = 5
eks_node_group_desired_size = 2

# Cognito Module Variables
cognito_user_pool_name = "hyperlocal-staging-user-pool"

# SQS/SNS Module Variables
order_events_topic_name = "hyperlocal-staging-order-events"
notification_queue_name = "hyperlocal-staging-notification-queue"