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

variable "user_pool_name" {
  description = "The name for the main Cognito User Pool."
  type        = string
}

variable "password_policy" {
  description = "A map defining the password policy for the user pool."
  type = object({
    minimum_length    = number
    require_lowercase = bool
    require_numbers   = bool
    require_symbols   = bool
    require_uppercase = bool
  })
  default = {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
}

variable "app_client_configs" {
  description = "A map of application client configurations to create for the user pool."
  type = map(object({
    generate_secret              = bool
    explicit_auth_flows          = list(string)
    supported_identity_providers = list(string)
    callback_urls                = list(string)
    logout_urls                  = list(string)
    allowed_oauth_flows          = list(string)
    allowed_oauth_scopes         = list(string)
    allowed_oauth_flows_user_pool_client = bool
  }))
  default = {}
}

variable "custom_domain" {
  description = "The custom domain for the Cognito hosted UI. If null, a Cognito-managed domain will be used."
  type        = string
  default     = null
}