# Terraform Remote State Backend Configuration for the Development Environment
# This file configures Terraform to store its state file remotely in an AWS S3 bucket.
# Using a remote backend is critical for team collaboration and for running Terraform in automated CI/CD pipelines.
# State locking is enabled via a DynamoDB table to prevent concurrent state modifications, which can lead to corruption.

terraform {
  backend "s3" {
    # The S3 bucket where the Terraform state files are stored.
    # This bucket must be created manually or via a separate Terraform configuration before this can be used.
    # The name should be globally unique.
    bucket = "hyperlocal-tf-state-bucket"

    # The path to the state file within the S3 bucket for this specific environment.
    # This ensures that the state for the 'dev' environment is completely isolated from 'staging' and 'prod'.
    key = "dev/terraform.tfstate"

    # The AWS region where the S3 bucket and DynamoDB table reside.
    region = "ap-south-1"

    # The DynamoDB table used for state locking. This prevents multiple users or automation jobs
    # from running 'terraform apply' at the same time and corrupting the state.
    dynamodb_table = "hyperlocal-tf-state-lock"

    # Encrypts the state file at rest in S3, providing an additional layer of security for sensitive
    # infrastructure information that may be stored in the state.
    encrypt = true
  }
}