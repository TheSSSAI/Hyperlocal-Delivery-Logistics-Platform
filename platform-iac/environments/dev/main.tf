# Main Terraform Configuration for the Development Environment
# This file acts as the composition root, instantiating all the reusable modules
# from the `/modules` directory and wiring them together to create the complete
# infrastructure stack for the 'dev' environment.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# -----------------------------------------------------------------------------
# Data Sources
# -----------------------------------------------------------------------------

data "aws_availability_zones" "available" {
  state = "available"
}

# -----------------------------------------------------------------------------
# Module Instantiations
# -----------------------------------------------------------------------------

# Networking Foundation (VPC)
module "vpc" {
  source = "../../modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr_block     = var.vpc_cidr_block
  availability_zones = var.availability_zones
  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway
  common_tags        = var.common_tags
}

# Security (IAM Roles, KMS Keys) - Provisioned before dependent resources
module "iam" {
  source = "../../modules/iam"

  project_name = var.project_name
  environment  = var.environment
  common_tags  = var.common_tags
}

module "kms" {
  source = "../../modules/kms"

  project_name = var.project_name
  environment  = var.environment
  common_tags  = var.common_tags
}

# Persistence (RDS PostgreSQL)
module "rds" {
  source = "../../modules/rds"

  project_name               = var.project_name
  environment                = var.environment
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  db_instance_class          = var.db_instance_class
  db_allocated_storage       = var.db_allocated_storage
  db_engine_version          = var.db_engine_version
  db_multi_az                = var.db_multi_az
  db_backup_retention_period = var.db_backup_retention_period
  db_deletion_protection     = var.db_deletion_protection
  kms_key_id                 = module.kms.db_kms_key_arn
  common_tags                = var.common_tags
}

# Caching (ElastiCache Redis)
module "elasticache" {
  source = "../../modules/elasticache"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  node_type          = var.redis_node_type
  cluster_size       = var.redis_cluster_size
  common_tags        = var.common_tags
}

# Compute (EKS Kubernetes Cluster)
module "eks" {
  source = "../../modules/eks"

  project_name                = var.project_name
  environment                 = var.environment
  vpc_id                      = module.vpc.vpc_id
  private_subnet_ids          = module.vpc.private_subnet_ids
  cluster_version             = var.eks_cluster_version
  instance_type               = var.eks_instance_type
  node_group_min_size         = var.eks_node_group_min_size
  node_group_max_size         = var.eks_node_group_max_size
  node_group_desired_size     = var.eks_node_group_desired_size
  eks_cluster_role_arn        = module.iam.eks_cluster_role_arn
  eks_node_group_role_arn     = module.iam.eks_node_group_role_arn
  common_tags                 = var.common_tags
}

# Authentication (Cognito)
module "cognito" {
  source = "../../modules/cognito"

  user_pool_name = var.cognito_user_pool_name
  environment    = var.environment
  common_tags    = var.common_tags
}

# Messaging (SQS & SNS)
module "sqs_sns" {
  source = "../../modules/sqs_sns"

  order_events_topic_name = var.order_events_topic_name
  notification_queue_name = var.notification_queue_name
  common_tags             = var.common_tags
}

# Other modules like S3, API Gateway would be instantiated here as well.
# This ensures the entire environment is managed from a single composition root.

# -----------------------------------------------------------------------------
# Outputs
# This section defines the outputs that will be consumed by application CI/CD pipelines.
# -----------------------------------------------------------------------------

output "vpc_id" {
  description = "The ID of the VPC for the dev environment."
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs."
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs."
  value       = module.vpc.private_subnet_ids
}

output "eks_cluster_name" {
  description = "The name of the EKS cluster."
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "The endpoint for the EKS cluster's Kubernetes API."
  value       = module.eks.cluster_endpoint
}

output "rds_instance_endpoint" {
  description = "The endpoint of the RDS PostgreSQL instance."
  value       = module.rds.db_instance_endpoint
}

output "rds_instance_port" {
  description = "The port of the RDS PostgreSQL instance."
  value       = module.rds.db_instance_port
}

output "rds_master_secret_arn" {
  description = "The ARN of the AWS Secrets Manager secret for the RDS master credentials."
  value       = module.rds.db_master_secret_arn
}

output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool."
  value       = module.cognito.user_pool_id
}

output "order_events_sns_topic_arn" {
  description = "The ARN of the SNS topic for order events."
  value       = module.sqs_sns.order_events_topic_arn
}

output "notification_sqs_queue_url" {
  description = "The URL of the SQS queue for notifications."
  value       = module.sqs_sns.notification_queue_url
}

output "redis_primary_endpoint" {
  description = "The primary endpoint for the ElastiCache Redis cluster."
  value       = module.elasticache.redis_primary_endpoint
}