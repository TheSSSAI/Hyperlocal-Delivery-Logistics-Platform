locals {
  tags = merge(
    var.tags,
    {
      "Project"     = var.project_name
      "Environment" = var.environment
      "Module"      = "RDS"
    }
  )
  db_identifier = "${var.project_name}-${var.environment}-db"
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group for RDS PostgreSQL instance"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.allowed_security_group_id]
    description     = "Allow PostgreSQL access from application"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-rds-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = local.tags
}

resource "random_password" "db_master_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${local.db_identifier}-credentials"
  description = "Master credentials for the RDS instance ${local.db_identifier}"
  kms_key_id  = var.kms_key_id

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "postgres"
    password = random_password.db_master_password.result
    engine   = "postgres"
    host     = aws_db_instance.main.address
    port     = aws_db_instance.main.port
    dbname   = var.db_name
  })

  depends_on = [aws_db_instance.main]
}

resource "aws_db_instance" "main" {
  identifier           = local.db_identifier
  engine               = "postgres"
  engine_version       = var.postgres_version
  instance_class       = var.db_instance_class
  allocated_storage    = var.allocated_storage
  storage_type         = "gp3"
  
  db_name              = var.db_name
  username             = "postgres"
  password             = random_password.db_master_password.result

  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # High Availability and Backups
  multi_az                   = true
  backup_retention_period    = var.backup_retention_period
  delete_automated_backups   = false # Set to true for dev/staging if desired
  skip_final_snapshot        = var.environment != "prod"

  # Encryption
  storage_encrypted   = true
  kms_key_id          = var.kms_key_id

  # Performance and Logging
  performance_insights_enabled = true
  performance_insights_kms_key_id = var.kms_key_id
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # Maintenance
  auto_minor_version_upgrade = true
  apply_immediately          = false
  
  tags = local.tags

  lifecycle {
    # Prevent accidental deletion of the database password before the instance
    prevent_destroy = true
  }
}