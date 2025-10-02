variable "project_name" {
  description = "The name of the project, used to construct resource names."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
}

variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "A list of Availability Zones to deploy subnets into."
  type        = list(string)
}

variable "public_subnet_cidr_blocks" {
  description = "A list of CIDR blocks for the public subnets. Must have the same number of elements as availability_zones."
  type        = list(string)
}

variable "private_subnet_cidr_blocks" {
  description = "A list of CIDR blocks for the private subnets. Must have the same number of elements as availability_zones."
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Set to true to create a NAT Gateway in each public subnet."
  type        = bool
  default     = true
}

variable "tags" {
  description = "A map of tags to add to all resources."
  type        = map(string)
  default     = {}
}