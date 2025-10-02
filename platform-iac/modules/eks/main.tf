# ---------------------------------------------------------------------------------------------------------------------
# IAM Role for EKS Cluster Control Plane
# This role is assumed by the EKS control plane to manage AWS resources on your behalf.
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_iam_role" "cluster" {
  name = "${var.cluster_name}-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "cluster_eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.cluster.name
}

# ---------------------------------------------------------------------------------------------------------------------
# IAM Role for EKS Worker Nodes
# This role is assumed by the worker nodes to allow them to join the cluster and interact with other AWS services.
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_iam_role" "nodes" {
  name = "${var.cluster_name}-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "nodes_eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.nodes.name
}

resource "aws_iam_role_policy_attachment" "nodes_ec2_container_registry_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.nodes.name
}

resource "aws_iam_role_policy_attachment" "nodes_eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.nodes.name
}

# ---------------------------------------------------------------------------------------------------------------------
# EKS Cluster
# Defines the managed Kubernetes control plane.
# REQ-1-018: Manages deployment and orchestration of Docker containers.
# REQ-1-016: Deploys across multiple AZs by referencing subnets in different AZs.
# REQ-1-097: Secrets are encrypted using a provided KMS key.
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  version  = var.cluster_version
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids              = var.private_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  encryption_config {
    resources = ["secrets"]
    provider {
      key_arn = var.ebs_kms_key_arn
    }
  }

  tags = merge(var.tags, {
    Name = var.cluster_name
  })

  depends_on = [
    aws_iam_role_policy_attachment.cluster_eks_cluster_policy
  ]
}

# ---------------------------------------------------------------------------------------------------------------------
# IAM OIDC Provider for IAM Roles for Service Accounts (IRSA)
# This allows Kubernetes service accounts to assume IAM roles, providing granular, secure access to AWS services.
# REQ-1-096: Provides the foundation for services running on EKS to securely interact with Cognito and other AWS services.
# ---------------------------------------------------------------------------------------------------------------------
data "tls_certificate" "oidc" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "oidc" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.oidc.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.main.identity[0].oidc[0].issuer

  tags = var.tags
}

# ---------------------------------------------------------------------------------------------------------------------
# EKS Managed Node Group
# Provisions and manages the EC2 instances that serve as worker nodes for the cluster.
# REQ-1-100: Configured with an Auto Scaling Group to enable Horizontal Pod Autoscalers and Cluster Autoscaler.
# REQ-1-016: Deployed across the provided private subnets, which span multiple AZs.
# ---------------------------------------------------------------------------------------------------------------------
resource "aws_eks_node_group" "primary" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = var.node_group_name
  node_role_arn   = aws_iam_role.nodes.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = var.instance_types
  disk_size       = var.disk_size

  scaling_config {
    desired_size = var.desired_size
    min_size     = var.min_size
    max_size     = var.max_size
  }

  remote_access {
    ec2_ssh_key = var.ssh_key_name
  }

  ami_type = "AL2_x86_64"

  # Tags required for the Kubernetes Cluster Autoscaler to discover and manage the node group.
  tags = merge(var.tags, {
    "k8s.io/cluster-autoscaler/enabled"             = "true"
    "k8s.io/cluster-autoscaler/${var.cluster_name}" = "owned"
  })

  depends_on = [
    aws_iam_role_policy_attachment.nodes_eks_worker_node_policy,
    aws_iam_role_policy_attachment.nodes_ec2_container_registry_read_only,
    aws_iam_role_policy_attachment.nodes_eks_cni_policy,
  ]
}