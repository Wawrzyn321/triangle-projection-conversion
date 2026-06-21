data "aws_acm_certificate" "website_cert" {
  provider    = aws.aws_provider_but_in_us_east_1
  domain      = var.domain_name
  statuses    = ["ISSUED"]
  most_recent = true
}
