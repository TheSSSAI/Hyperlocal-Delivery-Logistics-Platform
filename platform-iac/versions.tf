# This file defines the required versions for Terraform and its providers.
# Pinning versions is a best practice to ensure consistent and predictable
# behavior across all environments (local, dev, staging, prod) and CI/CD runs.
# This prevents unexpected breaking changes from new provider releases.

terraform {
  required_version = "~> 1.8" # Specifies that any version from 1.8.0 up to, but not including, 1.9.0 is acceptable.

  required_providers {
    # The primary provider for managing all AWS resources.
    # This is the core dependency for the entire infrastructure-as-code repository.
    # REQ-1-007, REQ-1-016, REQ-1-111
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.59"
    }

    # Provider for generating random data, such as passwords for the RDS database,
    # to avoid hardcoding secrets, in compliance with REQ-1-097.
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }

    # Provider for interacting with the Kubernetes API.
    # This will be used to configure the EKS cluster after it's provisioned by AWS,
    # for tasks like setting up namespaces, service accounts, or core services.
    # REQ-1-018, REQ-1-111
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.31"
    }

    # Provider for deploying Helm charts onto the Kubernetes cluster.
    # This will be used to manage deployments of observability tools (Prometheus, Grafana)
    # and potentially other third-party applications within the EKS cluster.
    # REQ-1-108
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.14"
    }
  }
}