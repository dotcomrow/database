terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    google = ">= 3.53.0"
  }
}

provider "cloudflare" {
  api_token = "${var.cloudflare_token}"
}