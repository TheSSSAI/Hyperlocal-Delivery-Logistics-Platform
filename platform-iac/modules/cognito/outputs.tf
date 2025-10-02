output "user_pool_id" {
  description = "The ID of the Cognito User Pool."
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "The ARN of the Cognito User Pool."
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_endpoint" {
  description = "The endpoint of the Cognito User Pool."
  value       = aws_cognito_user_pool.main.endpoint
}

output "app_client_ids" {
  description = "A map of the created app client names to their IDs."
  value       = { for k, v in aws_cognito_user_pool_client.clients : k => v.id }
}

output "app_client_secrets" {
  description = "A map of the created app client names to their secrets (if generated)."
  value       = { for k, v in aws_cognito_user_pool_client.clients : k => v.client_secret if v.generate_secret }
  sensitive   = true
}

output "user_pool_domain" {
  description = "The domain of the Cognito User Pool."
  value       = var.custom_domain != null ? aws_cognito_user_pool_domain.custom[0].domain : (local.cognito_domain != null ? aws_cognito_user_pool_domain.main[0].domain : null)
}