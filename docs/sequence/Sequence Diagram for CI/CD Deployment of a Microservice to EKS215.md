sequenceDiagram
    participant "GitHub SCM" as GitHubSCM
    participant "GitHub Actions" as GitHubActions
    participant "AWS ECR" as AWSECR
    participant "Terraform CLI" as TerraformCLI
    participant "Amazon EKS Control Plane" as AmazonEKSControlPlane

    activate GitHubActions
    GitHubSCM->>GitHubActions: 1. 1. Trigger Workflow [on: push]
    GitHubActions->>GitHubActions: 2. 2. Execute CI Stage (Lint & Test)
    GitHubActions-->>GitHubActions: Success or Failure Status Code
    GitHubActions->>GitHubActions: 3. 3. Build Docker Image
    GitHubActions-->>GitHubActions: Locally built Docker image
    GitHubActions->>AWSECR: 4. 4. Push Docker Image
    AWSECR-->>GitHubActions: HTTP 200 OK
    GitHubActions->>GitHubActions: 5. 5. Scan Image for Vulnerabilities
    GitHubActions-->>GitHubActions: Scan report / Exit Code
    activate TerraformCLI
    GitHubActions->>TerraformCLI: 6. 6. Invoke Terraform Apply
    TerraformCLI-->>GitHubActions: Apply complete status
    TerraformCLI->>AmazonEKSControlPlane: 7. 7. Apply Kubernetes Manifest Change
    AmazonEKSControlPlane-->>TerraformCLI: HTTP 200 OK
    activate AmazonEKSControlPlane
    AmazonEKSControlPlane->>AmazonEKSControlPlane: 8. 8. Execute Rolling Update
    AmazonEKSControlPlane-->>AmazonEKSControlPlane: Deployment status updated
    AmazonEKSControlPlane->>AmazonEKSControlPlane: 8.1. 8a. Create new ReplicaSet with updated pod template
    AmazonEKSControlPlane->>AmazonEKSControlPlane: 8.2. 8b. Scale up new ReplicaSet and scale down old ReplicaSet
    AmazonEKSControlPlane->>AmazonEKSControlPlane: 8.3. 8c. Check Readiness Probes on new pods
    AmazonEKSControlPlane->>AmazonEKSControlPlane: 8.4. 8d. Terminate old pods gracefully
    TerraformCLI->>GitHubActions: 9. 9. Confirm Apply Success
    GitHubActions-->>TerraformCLI: Exit Code 0
    GitHubActions->>GitHubActions: 10. 10. Post-Deployment Notification

    note over GitHubSCM: Peer approval on the Pull Request is a manual gate that precedes this entire automated sequence, ...
    note over AmazonEKSControlPlane: Kubernetes native rollback: If the new pods fail their health checks for progressDeadlineSeconds,...

    deactivate AmazonEKSControlPlane
    deactivate TerraformCLI
    deactivate GitHubActions
