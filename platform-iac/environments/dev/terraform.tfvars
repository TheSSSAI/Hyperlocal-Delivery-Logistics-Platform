# Terraform Input Variables for the Development Environment
# This file provides environment-specific values for the variables defined in the reusable modules.
# Dev environment is configured with smaller instance sizes and lower replica counts to optimize for cost.

# General Project & Environment Configuration
project_name = "hyperlocal"
environment  = "dev"
aws_region   = "ap-south-1"

# Tags applied to all taggable resources for cost allocation and resource identification.
common_tags = {
  Project     = "Hyperlocal"
  Environment = "dev"
  ManagedBy   = "Terraform"
}

# VPC Module Variables (for networking)
# A smaller CIDR block is sufficient for the development environment.
vpc_cidr_block      = "10.0.0.0/16"
availability_zones  = ["ap-south-1a", "ap-south-1b"]
enable_nat_gateway  = true # Enable NAT for private subnets to access the internet.
single_nat_gateway  = true # Use a single NAT gateway to save costs in dev.

# RDS Module Variables (for PostgreSQL database)
# Uses a small, burstable instance class and disables Multi-AZ for cost savings in dev.
db_instance_class         = "db.t3.small"
db_allocated_storage      = 20
db_engine_version         = "15.4"
db_multi_az               = false
db_backup_retention_period = 7 # Lower retention period for dev backups.
db_deletion_protection    = false

# ElastiCache Module Variables (for Redis)
# A small node type is used for caching in the dev environment.
redis_node_type      = "cache.t3.micro"
redis_cluster_size   = 1 # A single node cluster is sufficient for dev.

# EKS Module Variables (for Kubernetes cluster)
# Configured with a small, auto-scaling node group.
eks_cluster_version    = "1.28"
eks_instance_type      = "t3.medium"
eks_node_group_min_size  = 1
eks_node_group_max_size  = 3
eks_node_group_desired_size = 1

# Cognito Module Variables (for user authentication)
cognito_user_pool_name = "hyperlocal-dev-user-pool"

# SQS/SNS Module Variables
# Naming queues and topics with the environment prefix to ensure isolation.
order_events_topic_name = "hyperlocal-dev-order-events"
notification_queue_name = "hyperlocal-dev-notification-queue"