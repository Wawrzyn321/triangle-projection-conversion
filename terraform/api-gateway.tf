resource "aws_apigatewayv2_api" "api" {
  api_key_selection_expression = "$request.header.x-api-key"
  description                  = "Created by AWS Lambda"
  name                         = "lambda-api"
  protocol_type                = "HTTP"
  route_selection_expression   = "$request.method $request.path"

  cors_configuration {
    allow_methods = [
      "POST",
    ]
    allow_origins = [
      "*",
      "http://localhost:5173",
      "https://${var.domain_name}",
    ]
  }
}


resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_method     = "POST"
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.feedback_lambda.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "feedback_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /feedback"

  target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}
