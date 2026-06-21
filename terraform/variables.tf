variable "domain_name" {
  description = "Primary domain for the site"
  type        = string
  default     = "3d-projection-lab.com"
}

variable "bucket_name" {
  description = "S3 bucket name for website assets"
  type        = string
  default     = "triangle-projection-conversion--website"
}