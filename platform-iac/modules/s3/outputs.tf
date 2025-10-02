output "bucket_id" {
  description = "The name of the S3 bucket."
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket."
  value       = aws_s3_bucket.this.arn
}

output "bucket_domain_name" {
  description = "The domain name of the S3 bucket."
  value       = aws_s3_bucket.this.bucket_regional_domain_name
}

output "dynamodb_lock_table_name" {
  description = "The name of the DynamoDB table for state locking, if created."
  value       = var.create_dynamodb_lock_table ? aws_dynamodb_table.terraform_lock[0].name : null
}