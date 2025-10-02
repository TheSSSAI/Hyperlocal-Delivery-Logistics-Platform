output "replication_group_id" {
  description = "The ID of the ElastiCache replication group."
  value       = aws_elasticache_replication_group.main.id
}

output "primary_endpoint_address" {
  description = "The address of the primary endpoint for the ElastiCache replication group."
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "member_clusters" {
  description = "The identifiers of the member clusters in the ElastiCache replication group."
  value       = aws_elasticache_replication_group.main.member_clusters
}

output "security_group_id" {
  description = "The ID of the security group created for the ElastiCache cluster."
  value       = aws_security_group.elasticache.id
}