5.  AWS WAF

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


głosowanie - w lambdzie w momencie gdy przyjdzie to przekierowuje z powrotem do strony