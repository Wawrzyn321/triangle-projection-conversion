resource "aws_lambda_function" "feedback_lambda" {
  function_name = "feedback"
  architectures = [
    "x86_64",
  ]
  description  = "Feedback lambda."
  handler      = "index.handler"
  memory_size  = 512
  package_type = "Zip"
  role         = "arn:aws:iam::187949932559:role/service-role/feedback-role-8ljevutw"
  runtime      = "nodejs22.x"
  timeout      = 10
  filename     = "${path.module}/functions/lambda.zip"

}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.feedback_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
