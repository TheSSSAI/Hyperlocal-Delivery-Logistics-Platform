variable "project_name" {
  description = "The name of the project, used to construct resource names."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
}

variable "key_usage" {
  description = "Specifies the intended use of the key. The default value is ENCRYPT_DECRYPT."
  type        = string
  default     = "ENCRYPT_DECRYPT"
}

variable "deletion_window_in_days" {
  description = "The waiting period, in days, before a KMS key is permanently deleted."
  type        = number
  default     = 30
}

variable "enable_key_rotation" {
  description = "Specifies whether key rotation is enabled."
  type        = bool
  default     = true
}

variable "administrator_role_arns" {
  description = "A list of IAM Role ARNs that will have administrative permissions on this key."
  type        = list(string)
  default     = []
}

variable "user_role_arns" {
  description = "A list of IAM Role ARNs that will have user permissions (encrypt, decrypt, etc.) on this key."
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "A map of tags to add to the KMS key."
  type        = map(string)
  default     = {}
}