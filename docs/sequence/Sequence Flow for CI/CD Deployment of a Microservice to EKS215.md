# 1 Overview

## 1.1 Diagram Id

SEQ-OF-001

## 1.2 Name

CI/CD Deployment of a Microservice to EKS

## 1.3 Description

The automated process of a developer's code change being built, tested, containerized, and safely deployed to the production Kubernetes cluster with zero downtime.

## 1.4 Type

🔹 OperationalFlow

## 1.5 Purpose

To enable rapid, reliable, and repeatable deployments of microservices, increasing development velocity and system stability.

## 1.6 Complexity

High

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

*No items available*

## 1.10 Key Interactions

- Developer opens a Pull Request on GitHub.
- GitHub Actions triggers a CI pipeline: runs linter (ESLint), executes unit/integration tests with >80% coverage check (Jest).
- Upon PR approval and merge to the main branch, the CD pipeline is triggered.
- GitHub Actions builds a new Docker image for the microservice.
- The image is pushed to AWS ECR.
- The pipeline runs automated vulnerability scanning on the new image (e.g., Trivy, Snyk).
- The pipeline uses Terraform to update the Kubernetes deployment manifest with the new image tag.
- Terraform applies the manifest to the EKS cluster, triggering a rolling update strategy.
- Kubernetes gracefully terminates old pods while starting new ones, ensuring zero downtime by respecting readiness probes.

## 1.11 Triggers

- A pull request is merged into the main branch of a microservice repository.

## 1.12 Outcomes

- The new version of the microservice is deployed and serving live traffic in the production environment.
- The deployment process is fully automated and auditable through GitHub Actions logs.

## 1.13 Business Rules

- All code must pass linting and testing stages with >80% coverage before being built (REQ-NFR-006).
- A formal code review with at least one peer approval is required for all pull requests (REQ-NFR-006).
- Automated vulnerability scanning of container images must be part of the pipeline (REQ-NFR-003).

## 1.14 Error Scenarios

- Unit tests fail, blocking the pipeline.
- Vulnerability scan detects a critical issue, halting the deployment.
- The new version of the pod fails its Kubernetes health checks, and the rolling update is automatically halted and rolled back.

## 1.15 Integration Points

- GitHub (Source Control), GitHub Actions (CI/CD), AWS ECR (Container Registry), Amazon EKS (Orchestration), Terraform (IaC).

# 2.0 Details

## 2.1 Diagram Id

SEQ-OF-001

## 2.2 Name

Implementation: CI/CD Deployment of a Microservice to EKS

## 2.3 Description

Provides the complete technical sequence for the automated build, test, containerization, and zero-downtime deployment of a microservice from a source code merge to the production Amazon EKS cluster. This sequence uses a GitOps-style approach with GitHub Actions and Terraform.

## 2.4 Participants

### 2.4.1 Source Control Management

#### 2.4.1.1 Repository Id

REPO-SCM

#### 2.4.1.2 Display Name

GitHub SCM

#### 2.4.1.3 Type

🔹 Source Control Management

#### 2.4.1.4 Technology

GitHub.com, Git

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #181717 |
| Stereotype | «SCM» |

### 2.4.2.0 CI/CD Platform

#### 2.4.2.1 Repository Id

TOOL-CICD

#### 2.4.2.2 Display Name

GitHub Actions

#### 2.4.2.3 Type

🔹 CI/CD Platform

#### 2.4.2.4 Technology

GitHub Actions Runner (Ubuntu)

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #2088FF |
| Stereotype | «CI/CD» |

### 2.4.3.0 Container Registry

#### 2.4.3.1 Repository Id

INFRA-ECR

#### 2.4.3.2 Display Name

AWS ECR

#### 2.4.3.3 Type

🔹 Container Registry

#### 2.4.3.4 Technology

Amazon Elastic Container Registry

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #FF9900 |
| Stereotype | «Registry» |

### 2.4.4.0 Infrastructure as Code

#### 2.4.4.1 Repository Id

TOOL-IAC

#### 2.4.4.2 Display Name

Terraform CLI

#### 2.4.4.3 Type

🔹 Infrastructure as Code

#### 2.4.4.4 Technology

Terraform v1.7+

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #7B42BC |
| Stereotype | «IaC» |

### 2.4.5.0 Container Orchestrator

#### 2.4.5.1 Repository Id

INFRA-EKS

#### 2.4.5.2 Display Name

Amazon EKS Control Plane

#### 2.4.5.3 Type

🔹 Container Orchestrator

#### 2.4.5.4 Technology

Kubernetes v1.29

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #232F3E |
| Stereotype | «Orchestrator» |

## 2.5.0.0 Interactions

### 2.5.1.0 Webhook Invocation

#### 2.5.1.1 Source Id

REPO-SCM

#### 2.5.1.2 Target Id

TOOL-CICD

#### 2.5.1.3 Message

1. Trigger Workflow [on: push]

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 Webhook Invocation

#### 2.5.1.6 Is Synchronous

❌ No

#### 2.5.1.7 Return Message



#### 2.5.1.8 Has Return

❌ No

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | POST (Webhook) |
| Parameters | Payload contains Git commit SHA, branch info, and ... |
| Authentication | GitHub Webhook with shared secret. |
| Error Handling | GitHub will retry webhook delivery on failure. GHA... |
| Performance | Sub-second delivery. |

### 2.5.2.0 Internal Process

#### 2.5.2.1 Source Id

TOOL-CICD

#### 2.5.2.2 Target Id

TOOL-CICD

#### 2.5.2.3 Message

2. Execute CI Stage (Lint & Test)

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 Internal Process

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

Success or Failure Status Code

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

❌ No

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Shell |
| Method | npm run lint; npm test -- --coverage |
| Parameters | Checks code style against ESLint rules and runs Je... |
| Authentication | N/A |
| Error Handling | If linting fails, tests fail, or coverage is below... |
| Performance | Depends on codebase size, typically 1-5 minutes. |

### 2.5.3.0 Containerization

#### 2.5.3.1 Source Id

TOOL-CICD

#### 2.5.3.2 Target Id

TOOL-CICD

#### 2.5.3.3 Message

3. Build Docker Image

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 Containerization

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

Locally built Docker image

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

❌ No

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Docker Engine API |
| Method | docker build -t <image_name>:<git_sha> . |
| Parameters | Uses the Dockerfile in the repository root. The im... |
| Authentication | N/A |
| Error Handling | Build fails if Dockerfile commands fail (e.g., mis... |
| Performance | Depends on image complexity and layer caching, typ... |

### 2.5.4.0 Image Push

#### 2.5.4.1 Source Id

TOOL-CICD

#### 2.5.4.2 Target Id

INFRA-ECR

#### 2.5.4.3 Message

4. Push Docker Image

#### 2.5.4.4 Sequence Number

4

#### 2.5.4.5 Type

🔹 Image Push

#### 2.5.4.6 Is Synchronous

✅ Yes

#### 2.5.4.7 Return Message

HTTP 200 OK

#### 2.5.4.8 Has Return

✅ Yes

#### 2.5.4.9 Is Activation

❌ No

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS (Docker Registry API v2) |
| Method | docker push <image_name>:<git_sha> |
| Parameters | The multi-layered container image. |
| Authentication | AWS IAM Role via OIDC. GitHub Actions runner assum... |
| Error Handling | Retries on transient network errors. Fails on auth... |
| Performance | Network-dependent, typically 1-3 minutes. |

### 2.5.5.0 Security Scan

#### 2.5.5.1 Source Id

TOOL-CICD

#### 2.5.5.2 Target Id

TOOL-CICD

#### 2.5.5.3 Message

5. Scan Image for Vulnerabilities

#### 2.5.5.4 Sequence Number

5

#### 2.5.5.5 Type

🔹 Security Scan

#### 2.5.5.6 Is Synchronous

✅ Yes

#### 2.5.5.7 Return Message

Scan report / Exit Code

#### 2.5.5.8 Has Return

✅ Yes

#### 2.5.5.9 Is Activation

❌ No

#### 2.5.5.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | CLI |
| Method | trivy image --exit-code 1 --severity CRITICAL,HIGH... |
| Parameters | Scans the newly pushed image against vulnerability... |
| Authentication | N/A |
| Error Handling | If a CRITICAL or HIGH severity vulnerability is fo... |
| Performance | Typically 1-2 minutes. |

### 2.5.6.0 IaC Execution

#### 2.5.6.1 Source Id

TOOL-CICD

#### 2.5.6.2 Target Id

TOOL-IAC

#### 2.5.6.3 Message

6. Invoke Terraform Apply

#### 2.5.6.4 Sequence Number

6

#### 2.5.6.5 Type

🔹 IaC Execution

#### 2.5.6.6 Is Synchronous

✅ Yes

#### 2.5.6.7 Return Message

Apply complete status

#### 2.5.6.8 Has Return

✅ Yes

#### 2.5.6.9 Is Activation

✅ Yes

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Shell |
| Method | terraform apply -auto-approve |
| Parameters | The image tag variable (`-var 'image_tag=<git_sha>... |
| Authentication | AWS IAM Role via OIDC assumed by the runner, with ... |
| Error Handling | Fails if Terraform cannot acquire state lock, or i... |
| Performance | Typically 1-3 minutes. |

### 2.5.7.0 API Request

#### 2.5.7.1 Source Id

TOOL-IAC

#### 2.5.7.2 Target Id

INFRA-EKS

#### 2.5.7.3 Message

7. Apply Kubernetes Manifest Change

#### 2.5.7.4 Sequence Number

7

#### 2.5.7.5 Type

🔹 API Request

#### 2.5.7.6 Is Synchronous

✅ Yes

#### 2.5.7.7 Return Message

HTTP 200 OK

#### 2.5.7.8 Has Return

✅ Yes

#### 2.5.7.9 Is Activation

❌ No

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS (Kubernetes API) |
| Method | PATCH /apis/apps/v1/namespaces/{ns}/deployments/{n... |
| Parameters | The request body contains a JSON patch updating th... |
| Authentication | Terraform's Kubernetes provider uses the assumed A... |
| Error Handling | Fails on authentication error or if the manifest i... |
| Performance | Sub-second. |

### 2.5.8.0 Internal Orchestration

#### 2.5.8.1 Source Id

INFRA-EKS

#### 2.5.8.2 Target Id

INFRA-EKS

#### 2.5.8.3 Message

8. Execute Rolling Update

#### 2.5.8.4 Sequence Number

8

#### 2.5.8.5 Type

🔹 Internal Orchestration

#### 2.5.8.6 Is Synchronous

✅ Yes

#### 2.5.8.7 Return Message

Deployment status updated

#### 2.5.8.8 Has Return

✅ Yes

#### 2.5.8.9 Is Activation

✅ Yes

#### 2.5.8.10 Nested Interactions

##### 2.5.8.10.1 State Change

###### 2.5.8.10.1.1 Source Id

INFRA-EKS

###### 2.5.8.10.1.2 Target Id

INFRA-EKS

###### 2.5.8.10.1.3 Message

8a. Create new ReplicaSet with updated pod template

###### 2.5.8.10.1.4 Sequence Number

8.1

###### 2.5.8.10.1.5 Type

🔹 State Change

###### 2.5.8.10.1.6 Is Synchronous

✅ Yes

###### 2.5.8.10.1.7 Has Return

❌ No

##### 2.5.8.10.2.0 Pod Scheduling

###### 2.5.8.10.2.1 Source Id

INFRA-EKS

###### 2.5.8.10.2.2 Target Id

INFRA-EKS

###### 2.5.8.10.2.3 Message

8b. Scale up new ReplicaSet and scale down old ReplicaSet

###### 2.5.8.10.2.4 Sequence Number

8.2

###### 2.5.8.10.2.5 Type

🔹 Pod Scheduling

###### 2.5.8.10.2.6 Is Synchronous

❌ No

###### 2.5.8.10.2.7 Has Return

❌ No

###### 2.5.8.10.2.8 Technical Details

####### 2.5.8.10.2.8.1 Parameters

Follows `strategy.rollingUpdate` parameters (e.g., `maxSurge`, `maxUnavailable`).

##### 2.5.8.10.3.0.0 Health Check

###### 2.5.8.10.3.1.0 Source Id

INFRA-EKS

###### 2.5.8.10.3.2.0 Target Id

INFRA-EKS

###### 2.5.8.10.3.3.0 Message

8c. Check Readiness Probes on new pods

###### 2.5.8.10.3.4.0 Sequence Number

8.3

###### 2.5.8.10.3.5.0 Type

🔹 Health Check

###### 2.5.8.10.3.6.0 Is Synchronous

✅ Yes

###### 2.5.8.10.3.7.0 Has Return

✅ Yes

###### 2.5.8.10.3.8.0 Technical Details

| Property | Value |
|----------|-------|
| Method | HTTP GET or TCP Socket check against pod's `/healt... |
| Error Handling | If a pod fails its readiness probe, it is not adde... |
| Performance | Checks occur based on `periodSeconds` and `initial... |

##### 2.5.8.10.4.0.0 Pod Termination

###### 2.5.8.10.4.1.0 Source Id

INFRA-EKS

###### 2.5.8.10.4.2.0 Target Id

INFRA-EKS

###### 2.5.8.10.4.3.0 Message

8d. Terminate old pods gracefully

###### 2.5.8.10.4.4.0 Sequence Number

8.4

###### 2.5.8.10.4.5.0 Type

🔹 Pod Termination

###### 2.5.8.10.4.6.0 Is Synchronous

❌ No

###### 2.5.8.10.4.7.0 Has Return

❌ No

###### 2.5.8.10.4.8.0 Technical Details

####### 2.5.8.10.4.8.1 Parameters

Sends SIGTERM signal, respects `terminationGracePeriodSeconds`.

### 2.5.9.0.0.0.0 Return Status

#### 2.5.9.1.0.0.0 Source Id

TOOL-IAC

#### 2.5.9.2.0.0.0 Target Id

TOOL-CICD

#### 2.5.9.3.0.0.0 Message

9. Confirm Apply Success

#### 2.5.9.4.0.0.0 Sequence Number

9

#### 2.5.9.5.0.0.0 Type

🔹 Return Status

#### 2.5.9.6.0.0.0 Is Synchronous

✅ Yes

#### 2.5.9.7.0.0.0 Return Message

Exit Code 0

#### 2.5.9.8.0.0.0 Has Return

✅ Yes

#### 2.5.9.9.0.0.0 Is Activation

❌ No

#### 2.5.9.10.0.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Shell |
| Method | N/A |
| Parameters | Terraform exits with code 0 after the Kubernetes A... |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | Immediate. |

### 2.5.10.0.0.0.0 Notification

#### 2.5.10.1.0.0.0 Source Id

TOOL-CICD

#### 2.5.10.2.0.0.0 Target Id

TOOL-CICD

#### 2.5.10.3.0.0.0 Message

10. Post-Deployment Notification

#### 2.5.10.4.0.0.0 Sequence Number

10

#### 2.5.10.5.0.0.0 Type

🔹 Notification

#### 2.5.10.6.0.0.0 Is Synchronous

❌ No

#### 2.5.10.7.0.0.0 Return Message



#### 2.5.10.8.0.0.0 Has Return

❌ No

#### 2.5.10.9.0.0.0 Is Activation

❌ No

#### 2.5.10.10.0.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | POST to Slack Webhook |
| Parameters | A message indicating successful deployment, includ... |
| Authentication | Webhook URL stored as a GitHub secret. |
| Error Handling | Failure to notify is non-critical and does not fai... |
| Performance | Sub-second. |

## 2.6.0.0.0.0.0 Notes

### 2.6.1.0.0.0.0 Content

#### 2.6.1.1.0.0.0 Content

Peer approval on the Pull Request is a manual gate that precedes this entire automated sequence, enforced by GitHub branch protection rules (REQ-NFR-006).

#### 2.6.1.2.0.0.0 Position

top-left

#### 2.6.1.3.0.0.0 Participant Id

REPO-SCM

#### 2.6.1.4.0.0.0 Sequence Number

0

### 2.6.2.0.0.0.0 Content

#### 2.6.2.1.0.0.0 Content

Kubernetes native rollback: If the new pods fail their health checks for `progressDeadlineSeconds`, the Deployment is marked as failed, and the old, stable ReplicaSet is retained, preventing a full service outage.

#### 2.6.2.2.0.0.0 Position

bottom-right

#### 2.6.2.3.0.0.0 Participant Id

INFRA-EKS

#### 2.6.2.4.0.0.0 Sequence Number

8

## 2.7.0.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | The GitHub Actions runner requires an IAM Role wit... |
| Performance Targets | The primary performance goal is zero-downtime. Thi... |
| Error Handling Strategy | The pipeline is designed to fail fast. A failure i... |
| Testing Considerations | Unit and integration tests are run in the CI stage... |
| Monitoring Requirements | The Kubernetes Deployment manifest must include re... |
| Deployment Considerations | This sequence describes a rolling update. For more... |

