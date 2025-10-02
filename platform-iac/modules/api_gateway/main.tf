locals {
  tags = merge(
    var.tags,
    {
      "Project"     = var.project_name
      "Environment" = var.environment
      "Module"      = "APIGateway"
    }
  )
}

resource "aws_api_gateway_rest_api" "main" {
  name        = var.api_name
  description = "API Gateway for ${var.project_name} in ${var.environment}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = local.tags
}

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name          = "CognitoAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.main.id
  provider_arns = var.cognito_user_pool_arns
  identity_source = "method.request.header.Authorization"
}

resource "aws_api_gateway_deployment" "main" {
  rest_api_id = aws_api_gateway_rest_api.main.id

  # This empty trigger is a common pattern. The actual triggers should be
  # on the resources/methods themselves to redeploy when they change.
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_rest_api.main.body,
      aws_api_gateway_authorizer.cognito_authorizer.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "main" {
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.main.id
  stage_name    = var.api_gateway_stage_name

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_logs.arn
    format          = jsonencode({
      "requestId" : "$context.requestId",
      "ip" : "$context.identity.sourceIp",
      "caller" : "$context.identity.caller",
      "user" : "$context.identity.user",
      "requestTime" : "$context.requestTime",
      "httpMethod" : "$context.httpMethod",
      "resourcePath" : "$context.resourcePath",
      "status" : "$context.status",
      "protocol" : "$context.protocol",
      "responseLength" : "$context.responseLength"
      }
    )
  }

  tags = local.tags
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name              = "/aws/api-gateway/${var.api_name}-${var.environment}"
  retention_in_days = 90

  tags = local.tags
}

# This resource defines the overall policy for the REST API
# allowing it to be invoked from the internet.
resource "aws_api_gateway_rest_api_policy" "main" {
  rest_api_id = aws_api_gateway_rest_api.main.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = "execute-api:Invoke"
        Resource = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
      }
      # You can add more specific deny rules here, e.g., based on IP
    ]
  })
}

# Example of a mock integration for the root path to make the gateway deployable.
# Actual integrations will be defined in service-specific Terraform files.
resource "aws_api_gateway_resource" "root" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "health"
}

resource "aws_api_gateway_method" "health_check" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.root.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "health_check" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.health_check.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }
}

resource "aws_api_gateway_method_response" "health_check_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.health_check.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "health_check_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.health_check.http_method
  status_code = aws_api_gateway_method_response.health_check_200.status_code

  response_templates = {
    "application/json" = "{\"status\": \"OK\"}"
  }
}