
resource "aws_cloudfront_origin_access_control" "website_aoc" {
  name                              = "s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "site" {
  enabled = true

  aliases = [
    var.domain_name,
    "www.${var.domain_name}",
  ]

  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "s3-origin"

    origin_access_control_id = aws_cloudfront_origin_access_control.website_aoc.id
  }

  origin {
    domain_name = trimprefix(aws_apigatewayv2_api.api.api_endpoint, "https://")
    origin_id   = "api-gw"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  ordered_cache_behavior {
    path_pattern     = "/feedback"
    target_origin_id = "api-gw"

    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods  = ["HEAD", "GET"]

    viewer_protocol_policy = "https-only"

    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.site_canonical_function.arn
    }

    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.website_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

}

resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
    content_security_policy {
      # unsafe-inline required for Chakra UI (emotion CSS-in-JS)
      # blob: required for Three.js workers and jsPDF object URLs
      content_security_policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; worker-src 'self' blob:; connect-src 'self'; frame-ancestors 'none';"
      override                = true
    }
  }
}

resource "aws_cloudfront_function" "site_canonical_function" {
  name    = "site-canonical-function"
  runtime = "cloudfront-js-2.0"
  comment = "Redirect www.domain.com --> domain.com"
  publish = true
  code    = file("${path.module}/functions/viewer-request.js")
}
