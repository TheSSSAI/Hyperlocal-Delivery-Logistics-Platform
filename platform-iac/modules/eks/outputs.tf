output "cluster_name" {
  description = "The name of the EKS cluster."
  value       = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  description = "The endpoint for the EKS cluster's API server."
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_certificate_authority_data" {
  description = "The base64 encoded certificate data for the EKS cluster's certificate authority."
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "cluster_oidc_issuer_url" {
  description = "The OIDC issuer URL for the EKS cluster, used for IAM Roles for Service Accounts (IRSA)."
  value       = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

output "oidc_provider_arn" {
  description = "The ARN of the IAM OIDC Provider."
  value       = aws_iam_openid_connect_provider.oidc.arn
}

output "node_group_role_arn" {
  description = "The ARN of the IAM role for the worker nodes."
  value       = aws_iam_role.nodes.arn
}

output "cluster_version" {
  description = "The Kubernetes version of the EKS cluster."
  value       = aws_eks_cluster.main.version
}