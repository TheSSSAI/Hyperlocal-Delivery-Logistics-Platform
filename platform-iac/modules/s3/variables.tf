variable "bucket_name" {
  description = "The name of the S3 bucket. Must be globally unique."
  type        = string
}

variable "versioning_enabled" {
  description = "A boolean flag to enable/disable versioning of the S3 bucket."
  type        = bool
  default     = true
}

variable "kms_key_arn" {
  description = "The ARN of the KMS key to use for server-side encryption. If not provided, AWS-managed S3 key is used."
  type        = string
  default     = null
}

variable "log_bucket_name" {
  description = "The name of the bucket to which S3 access logs will be delivered. If not provided, logging is disabled."
  type        = string
  default     = null
}

variable "log_prefix" {
  description = "A prefix for all log object keys."
  type        = string
  default     = "logs/"
}

variable "create_dynamodb_lock_table" {
  description = "Set to true to create a DynamoDB table for Terraform state locking. Only use for state buckets."
  type        = bool
  default     = false
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table for state locking."
  type        = string
  default     = ""
}

variable "tags" {
  description = "A map of tags to add to all resources."
  type        = map(string)
  default     = {}
}