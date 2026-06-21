
 5) czy GH Action może inwalidować CF? / AWS WAF 

- lambda for feedback
- ddb for feedback
- api gateway

1. AWS Lambda payload limit
   Synchronous invoke request payload: ~6 MB
   Response also has limits (same order of magnitude)

So even if API Gateway allowed it, Lambda itself becomes the blocker.

2. API Gateway limit

Depending on type:

REST API / HTTP API: ~10 MB max request body

So:

20 MB ❌ exceeds API Gateway limit
20 MB ❌ exceeds Lambda limit

🧯 3. Automatic “shutdown actions” (important part)

This is where you actually stop things.

Option A — Disable API Gateway (best for abuse stop)

Trigger Lambda from SNS:

Updates API Gateway stage:
throttling → 0
or deploys “maintenance mode” version

✔ stops all incoming traffic instantly





🚀 4. (Optional but recommended) Enable static hosting

Run once (or via Terraform):

S3 → Properties → Static website hosting
Index: index.html

Or Terraform:

resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}


⚡ Optional upgrades
1. Add cache headers for assets
aws s3 sync ui/dist s3://$BUCKET \
  --delete \
  --cache-control "public,max-age=31536000,immutable"

  2. Add CloudFront invalidation (recommended)
- name: Invalidate CloudFront
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
      --paths "/*"