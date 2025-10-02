output "db_instance_id" {
  description = "The ID of the RDS instance."
  value       = aws_db_instance.main.id
}

output "db_instance_arn" {
  description = "The ARN of the RDS instance."
  value       = aws_db_instance.main.arn
}

output "db_instance_address" {
  description = "The address of the RDS instance."
  value       = aws_db_instance.main.address
}

output "db_instance_port" {
  description = "The port of the RDS instance."
  value       = aws_db_instance.main.port
}

output "db_name" {
  description = "The name of the database."
  value       = aws_db_instance.main.db_name
}

output "db_credentials_secret_arn" {
  description = "The ARN of the Secrets Manager secret holding the DB credentials."
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "security_group_id" {
  description = "The ID of the security group for the RDS instance."
  value       = aws_security_group.rds.id
}