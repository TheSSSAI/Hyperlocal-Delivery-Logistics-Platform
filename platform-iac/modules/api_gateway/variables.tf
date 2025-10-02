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

variable "api_name" {
  description = "The name of the API Gateway REST API."
  type        = string
}

variable "cognito_user_pool_arns" {
  description = "A list of Cognito User Pool ARNs to be used for authorizers."
  type        = list(string)
}

variable "api_gateway_stage_name" {
  description = "The name of the deployment stage for the API Gateway."
  type        = string
  default     = "v1"
}