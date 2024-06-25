variable "project_name" {
  description = "The name of the project to create"
  type        = string
  nullable = false
}

variable "gcp_org_id" {
  description = "The organization id to create the project under"
  type        = string
  nullable = false
}

variable "apis" {
  description = "The list of apis to enable"  
  type        = list(string)
  default     = [
    "iam.googleapis.com", 
    "cloudresourcemanager.googleapis.com", 
    "bigquery.googleapis.com",
    "bigquerystorage.googleapis.com",
    "cloudbilling.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "containerregistry.googleapis.com",
    "compute.googleapis.com",
    "bigquerydatatransfer.googleapis.com"
  ]
}

variable billing_account {
    description = "The billing account to associate with the project"
    type        = string
    nullable = false
}

variable "project_id" {
  description = "The project id to create"
  type        = string
  nullable = false
}

variable "common_project_id" {
  description = "Common resources project id"
  type        = string
  nullable = false
}

variable "cloudflare_account_id" {
  description = "Cloudflare account id"
  type        = string
  nullable = false
}

variable "bucket_name" {
  description = "Bucket name"
  type        = string
  nullable = false
}

# variable "r2_access_key_id" {
#   description = "value of the r2 access key id"
#   type        = string
#   nullable = false
# }

# variable "r2_secret_access_key" {
#   description = "value of the r2 secret access key"
#   type        = string
#   nullable = false
# }

# variable "r2_account_id" {
#   description = "value of the r2 account id"
#   type        = string
#   nullable = false
# }