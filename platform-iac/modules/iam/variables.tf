variable "role_name" {
  description = "The name of the IAM role."
  type        = string
}

variable "assume_role_policy_json" {
  description = "The JSON policy document that grants an entity permission to assume the role."
  type        = string
}

variable "policy_arns" {
  description = "A list of ARNs for the IAM policies to attach to the role."
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "A map of tags to add to the IAM role."
  type        = map(string)
  default     = {}
}