locals {
  tags = merge(
    var.tags,
    {
      "Project"     = var.project_name
      "Environment" = var.environment
      "Module"      = "Cognito"
    }
  )

  # Use a Cognito-managed domain if no custom domain is provided
  cognito_domain = var.custom_domain == null ? "${var.project_name}-${var.environment}" : null
}

resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name

  password_policy {
    minimum_length    = var.password_policy.minimum_length
    require_lowercase = var.password_policy.require_lowercase
    require_numbers   = var.password_policy.require_numbers
    require_symbols   = var.password_policy.require_symbols
    require_uppercase = var.password_policy.require_uppercase
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  auto_verified_attributes = ["email", "phone_number"]

  mfa_configuration = "OFF" # Can be configured to ON or OPTIONAL if needed

  schema {
    name                = "phone_number"
    attribute_dataType  = "String"
    developerOnlyAttribute = false
    mutable             = true
    required            = true
  }

  schema {
    name                = "email"
    attribute_dataType  = "String"
    developerOnlyAttribute = false
    mutable             = true
    required            = false
  }

  schema {
    name                = "user_role"
    attribute_dataType  = "String"
    developerOnlyAttribute = false
    mutable             = true
    required            = true
  }

  username_attributes = ["phone_number"]

  tags = local.tags
}

resource "aws_cognito_user_pool_client" "clients" {
  for_each = var.app_client_configs

  name         = "${var.user_pool_name}-${each.key}"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret              = each.value.generate_secret
  explicit_auth_flows          = each.value.explicit_auth_flows
  supported_identity_providers = each.value.supported_identity_providers
  callback_urls                = each.value.callback_urls
  logout_urls                  = each.value.logout_urls
  allowed_oauth_flows          = each.value.allowed_oauth_flows
  allowed_oauth_scopes         = each.value.allowed_oauth_scopes
  allowed_oauth_flows_user_pool_client = each.value.allowed_oauth_flows_user_pool_client
}

resource "aws_cognito_user_pool_domain" "main" {
  count = local.cognito_domain != null ? 1 : 0

  domain       = local.cognito_domain
  user_pool_id = aws_cognito_user_pool.main.id
}

resource "aws_cognito_user_pool_domain" "custom" {
  count = var.custom_domain != null ? 1 : 0

  domain       = var.custom_domain
  user_pool_id = aws_cognito_user_pool.main.id
  // Note: Requires a certificate to be specified if using a custom domain.
  // certificate_arn = var.cognito_domain_certificate_arn
}