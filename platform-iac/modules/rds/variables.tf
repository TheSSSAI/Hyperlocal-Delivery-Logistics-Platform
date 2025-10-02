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
  description = "The ID of the VPC where the RDS instance will be deployed."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs for the RDS instance."
  type        = list(string)
}

variable "kms_key_id" {
  description = "The ID of the KMS key for RDS storage encryption."
  type        = string
}

variable "allowed_security_group_id" {
  description = "The ID of the security group (e.g., EKS worker nodes) allowed to access the database."
  type        = string
}

variable "db_name" {
  description = "The name of the database to create."
  type        = string
}

variable "db_instance_class" {
  description = "The instance class for the RDS database (e.g., db.t3.micro)."
  type        = string
}

variable "allocated_storage" {
  description = "The allocated storage in gigabytes."
  type        = number
}

variable "postgres_version" {
  description = "The version of PostgreSQL to use."
  type        = string
  default     = "15.4"
}

variable "backup_retention_period" {
  description = "The number of days to retain automated backups."
  type        = number
  default     = 30
}