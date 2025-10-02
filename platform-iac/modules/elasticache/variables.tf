variable "project_name" {
  description = "The name of the project."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the resources."
  type        = map(string)
  default     = {}
}

variable "vpc_id" {
  description = "The ID of the VPC where the ElastiCache cluster will be deployed."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs for the ElastiCache cluster."
  type        = list(string)
}

variable "kms_key_id" {
  description = "The ID of the KMS key for encryption at rest."
  type        = string
}

variable "allowed_security_group_id" {
  description = "The ID of the security group (e.g., EKS worker nodes) allowed to access the cluster."
  type        = string
}

variable "cluster_id" {
  description = "A unique identifier for the ElastiCache replication group."
  type        = string
}

variable "node_type" {
  description = "The node type for the ElastiCache cluster nodes (e.g., cache.t3.micro)."
  type        = string
}

variable "num_cache_nodes" {
  description = "The number of nodes in the ElastiCache replication group."
  type        = number
  default     = 2
}

variable "redis_version" {
  description = "The version of Redis to use."
  type        = string
  default     = "6.2"
}