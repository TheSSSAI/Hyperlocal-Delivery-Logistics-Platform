# Terraform Remote State Backend Configuration for the Production Environment
# This file configures Terraform to store its state file remotely in an AWS S3 bucket.
# It uses a unique key to ensure the production state is fully isolated and secure.

terraform {
  backend "s3" {
    # The S3 bucket where the Terraform state files are stored.
    bucket = "hyperlocal-tf-state-bucket"

    # The path to the state file for the production environment.
    key = "prod/terraform.tfstate"

    # The AWS region where the S3 bucket and DynamoDB table reside.
    region = "ap-south-1"

    # The DynamoDB table used for state locking, critical for production stability.
    dynamodb_table = "hyperlocal-tf-state-lock"

    # Encryption is mandatory for production state files.
    encrypt = true
  }
}