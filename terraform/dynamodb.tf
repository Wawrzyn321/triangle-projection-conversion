resource "aws_dynamodb_table" "feedback" {
  name         = "feedback"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "feedbackType"
  table_class  = "STANDARD"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "feedbackType"
    type = "S"
  }
}