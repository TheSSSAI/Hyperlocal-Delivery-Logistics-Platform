output "rest_api_id" {
  description = "The ID of the REST API."
  value       = aws_api_gateway_rest_api.main.id
}

output "rest_api_arn" {
  description = "The ARN of the REST API."
  value       = aws_api_gateway_rest_api.main.arn
}

output "execution_arn" {
  description = "The execution ARN of the REST API."
  value       = aws_api_gateway_rest_api.main.execution_arn
}

output "invoke_url" {
  description = "The URL to invoke the REST API."
  value       = aws_api_gateway_deployment.main.invoke_url
}

output "stage_invoke_url" {
  description = "The URL to invoke the REST API stage."
  value       = aws_api_gateway_stage.main.invoke_url
}

output "cognito_authorizer_id" {
  description = "The ID of the Cognito authorizer."
  value       = aws_api_gateway_authorizer.cognito_authorizer.id
}