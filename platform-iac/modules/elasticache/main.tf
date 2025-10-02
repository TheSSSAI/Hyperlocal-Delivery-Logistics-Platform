locals {
  tags = merge(
    var.tags,
    {
      "Project"     = var.project_name
      "Environment" = var.environment
      "Module"      = "ElastiCache"
    }
  )
}

resource "aws_security_group" "elasticache" {
  name        = "${var.project_name}-${var.environment}-elasticache-sg"
  description = "Security group for ElastiCache Redis cluster"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.allowed_security_group_id]
    description     = "Allow Redis access from application"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-elasticache-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = local.tags
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id = var.cluster_id
  description          = "ElastiCache Redis cluster for ${var.project_name}-${var.environment}"
  node_type            = var.node_type
  num_cache_clusters   = var.num_cache_nodes
  engine               = "redis"
  engine_version       = var.redis_version
  port                 = 6379

  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.elasticache.id]
  parameter_group_name = "default.redis${var.redis_version}"

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  kms_key_id                 = var.kms_key_id

  # Multi-AZ is enabled by having num_cache_clusters > 1
  automatic_failover_enabled = true

  tags = local.tags

  # Ensure subnets are created before trying to create the cluster
  depends_on = [aws_elasticache_subnet_group.main]
}