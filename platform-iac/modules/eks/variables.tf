variable "cluster_name" {
  description = "The name of the EKS cluster."
  type        = string
}

variable "cluster_version" {
  description = "The Kubernetes version for the EKS cluster."
  type        = string
  default     = "1.29"
}

variable "vpc_id" {
  description = "The ID of the VPC where the cluster and its nodes will be deployed."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs where the EKS nodes will be deployed. Must be in at least two different Availability Zones for HA."
  type        = list(string)
}

variable "instance_types" {
  description = "The EC2 instance types for the worker nodes."
  type        = list(string)
  default     = ["t3.large"]
}

variable "node_group_name" {
  description = "The name of the EKS node group."
  type        = string
  default     = "primary-workers"
}

variable "desired_size" {
  description = "The desired number of worker nodes in the node group."
  type        = number
  default     = 2
}

variable "min_size" {
  description = "The minimum number of worker nodes in the node group's auto-scaling group."
  type        = number
  default     = 2
}

variable "max_size" {
  description = "The maximum number of worker nodes in the node group's auto-scaling group."
  type        = number
  default     = 4
}

variable "disk_size" {
  description = "The disk size in GiB for the worker nodes."
  type        = number
  default     = 50
}

variable "ebs_kms_key_arn" {
  description = "The ARN of the KMS key to use for EBS encryption on worker nodes."
  type        = string
}

variable "ssh_key_name" {
  description = "The name of the EC2 key pair to allow SSH access to the nodes. Set to null to disable SSH access."
  type        = string
  default     = null
}

variable "tags" {
  description = "A map of tags to apply to all resources."
  type        = map(string)
  default     = {}
}