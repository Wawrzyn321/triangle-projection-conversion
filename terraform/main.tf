terraform {
  required_version = ">= 0.12"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# 2x providery: oba są w us-east-1, ale ten drugi jest tylko do
# certyfikatów ACM - jeśli przeniosę TYLKO pierwszy gdzie indziej,
# ACM dalej będzie działać
provider "aws" {
  region                  = "us-east-1"
  shared_credentials_files = ["/Users/pw/.aws/credentials"]
  profile                 = "personal_terraform"
}

provider "aws" {
  alias  = "aws_provider_but_in_us_east_1"
  region = "us-east-1"
  shared_credentials_files = ["/Users/pw/.aws/credentials"]
  profile                 = "personal_terraform"
}
