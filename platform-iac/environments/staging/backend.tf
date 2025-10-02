# Terraform Remote State Backend Configuration for the Staging Environment
# This file configures Terraform to store its state file remotely in an AWS S3 bucket.
# It uses a different key from other environments to ensure complete state isolation.

terraform {
  backend "s3" {
    # The S3 bucket where the Terraform state files are stored.
    # This is the same bucket as other environments, but the key is different.
    bucket = "hyperlocal-tf-state-bucket"

    # The path to the state file within the S3 bucket for this specific environment.
    # This ensures that the state for 'staging' is completely isolated.
    key = "staging/terraform.tfstate"

    # The AWS region where the S3 bucket and DynamoDB table reside.
    region = "ap-south-1"

    # The DynamoDB table used for state locking.
    dynamodb_table = "hyperlocal-tf-state-lock"

    # Encrypts the state file at rest in S3.
    encrypt = true
  }
}