# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Pipeline Engine

GitHub Actions

## 1.3 Artifact Repository

Amazon ECR (Docker Images), Amazon S3 (Other Artifacts)

## 1.4 Target Environments

- Development
- Staging
- Production

## 1.5 Key Requirements

- REQ-TEC-001 (Technology Stack)
- REQ-DEP-001 (Deployment Environment)
- REQ-NFR-006 (Testing & Code Quality)
- REQ-NFR-003 (Security Scanning)
- REQ-TRN-001 (Phased Rollout)

# 2.0 Pipelines

## 2.1 Backend Microservice CI/CD Pipeline (Template)

### 2.1.1 Id

PIPELINE-BACKEND-SVC-001

### 2.1.2 Name

Backend Microservice CI/CD Pipeline (Template)

### 2.1.3 Description

A standardized pipeline for building, testing, securing, and deploying any Node.js/NestJS microservice to the EKS cluster. This pipeline promotes immutable Docker images across Staging and Production environments.

### 2.1.4 Trigger

#### 2.1.4.1 Type

🔹 Git Push/Tag

#### 2.1.4.2 Details

Triggered on push to the `main` branch for Staging deployment. Triggered on creation of a git tag matching `v*.*.*` for Production deployment.

### 2.1.5.0 Stages

#### 2.1.5.1 1. Build and Analyze

##### 2.1.5.1.1 Name

1. Build and Analyze

##### 2.1.5.1.2 Purpose

Compile the application, run quality checks, and perform security analysis on the source code.

##### 2.1.5.1.3 Steps

###### 2.1.5.1.3.1 Checkout Code

####### 2.1.5.1.3.1.1 Name

Checkout Code

####### 2.1.5.1.3.1.2 Tool

GitHub Actions (actions/checkout@v4)

####### 2.1.5.1.3.1.3 Details

Clones the specific branch or tag that triggered the workflow.

###### 2.1.5.1.3.2.0 Install Dependencies

####### 2.1.5.1.3.2.1 Name

Install Dependencies

####### 2.1.5.1.3.2.2 Tool

npm

####### 2.1.5.1.3.2.3 Details

Executes `npm ci` to install dependencies from `package-lock.json` for a reproducible build.

###### 2.1.5.1.3.3.0 Run Code Quality Checks

####### 2.1.5.1.3.3.1 Name

Run Code Quality Checks

####### 2.1.5.1.3.3.2 Tool

ESLint & Prettier

####### 2.1.5.1.3.3.3 Details

Enforces consistent coding style and identifies potential issues as per REQ-NFR-006. The build fails if checks do not pass.

###### 2.1.5.1.3.4.0 Run Unit & Integration Tests

####### 2.1.5.1.3.4.1 Name

Run Unit & Integration Tests

####### 2.1.5.1.3.4.2 Tool

Jest

####### 2.1.5.1.3.4.3 Details

Executes all unit and integration tests. Generates a code coverage report. As per REQ-NFR-006.

###### 2.1.5.1.3.5.0 Static Application Security Testing (SAST)

####### 2.1.5.1.3.5.1 Name

Static Application Security Testing (SAST)

####### 2.1.5.1.3.5.2 Tool

GitHub CodeQL (or similar)

####### 2.1.5.1.3.5.3 Details

Scans source code for security vulnerabilities like injection flaws to adhere to OWASP Top 10 practices (REQ-NFR-003).

###### 2.1.5.1.3.6.0 Dependency Vulnerability Scan

####### 2.1.5.1.3.6.1 Name

Dependency Vulnerability Scan

####### 2.1.5.1.3.6.2 Tool

npm audit (or Snyk/Dependabot)

####### 2.1.5.1.3.6.3 Details

Scans `package-lock.json` for known vulnerabilities in third-party packages, as required by REQ-NFR-003.

###### 2.1.5.1.3.7.0 Compile TypeScript

####### 2.1.5.1.3.7.1 Name

Compile TypeScript

####### 2.1.5.1.3.7.2 Tool

TypeScript Compiler (tsc)

####### 2.1.5.1.3.7.3 Details

Transpiles the TypeScript codebase into JavaScript for the runtime environment.

##### 2.1.5.1.4.0.0 Artifacts Produced

- Compiled JavaScript Code
- Test Reports (JUnit XML)
- Code Coverage Report (LCOV)

#### 2.1.5.2.0.0.0 2. Package and Scan Artifact

##### 2.1.5.2.1.0.0 Name

2. Package and Scan Artifact

##### 2.1.5.2.2.0.0 Purpose

Create an immutable Docker image, push it to the container registry, and scan it for vulnerabilities.

##### 2.1.5.2.3.0.0 Steps

###### 2.1.5.2.3.1.0 Build Docker Image

####### 2.1.5.2.3.1.1 Name

Build Docker Image

####### 2.1.5.2.3.1.2 Tool

Docker

####### 2.1.5.2.3.1.3 Details

Builds a Docker image based on the project's Dockerfile, packaging the compiled code and production dependencies. The image is tagged with the Git commit SHA for immutability.

###### 2.1.5.2.3.2.0 Push Docker Image to ECR

####### 2.1.5.2.3.2.1 Name

Push Docker Image to ECR

####### 2.1.5.2.3.2.2 Tool

AWS CLI

####### 2.1.5.2.3.2.3 Details

Authenticates with Amazon Elastic Container Registry (ECR) and pushes the tagged Docker image.

###### 2.1.5.2.3.3.0 Scan Container Image

####### 2.1.5.2.3.3.1 Name

Scan Container Image

####### 2.1.5.2.3.3.2 Tool

Amazon ECR Image Scanning (Trivy)

####### 2.1.5.2.3.3.3 Details

Initiates a vulnerability scan on the newly pushed image to check for OS and package vulnerabilities, as required by REQ-NFR-003.

##### 2.1.5.2.4.0.0 Artifacts Produced

- Versioned Docker Image in ECR

#### 2.1.5.3.0.0.0 3. Quality Gate: Pre-Deployment

##### 2.1.5.3.1.0.0 Name

3. Quality Gate: Pre-Deployment

##### 2.1.5.3.2.0.0 Purpose

Automatically verify that the build meets all quality and security standards before any deployment.

##### 2.1.5.3.3.0.0 Steps

###### 2.1.5.3.3.1.0 Verify Test Coverage

####### 2.1.5.3.3.1.1 Name

Verify Test Coverage

####### 2.1.5.3.3.1.2 Tool

Custom Script / GitHub Action

####### 2.1.5.3.3.1.3 Details

Parses the coverage report and fails the pipeline if coverage is below the 80% threshold mandated by REQ-NFR-006.

###### 2.1.5.3.3.2.0 Verify Security Scan Results

####### 2.1.5.3.3.2.1 Name

Verify Security Scan Results

####### 2.1.5.3.3.2.2 Tool

Custom Script / GitHub Action

####### 2.1.5.3.3.2.3 Details

Checks the results from SAST, dependency, and container scans. Fails the pipeline if any 'CRITICAL' or 'HIGH' severity vulnerabilities are found.

##### 2.1.5.3.4.0.0 Artifacts Produced

*No items available*

#### 2.1.5.4.0.0.0 4. Deploy to Staging

##### 2.1.5.4.1.0.0 Name

4. Deploy to Staging

##### 2.1.5.4.2.0.0 Purpose

Automatically deploy the new container image to the isolated Staging environment for end-to-end testing.

##### 2.1.5.4.3.0.0 Steps

###### 2.1.5.4.3.1.0 Configure Kubernetes CLI

####### 2.1.5.4.3.1.1 Name

Configure Kubernetes CLI

####### 2.1.5.4.3.1.2 Tool

kubectl

####### 2.1.5.4.3.1.3 Details

Sets up `kubectl` context to connect to the Staging EKS cluster.

###### 2.1.5.4.3.2.0 Update Kubernetes Manifests

####### 2.1.5.4.3.2.1 Name

Update Kubernetes Manifests

####### 2.1.5.4.3.2.2 Tool

kustomize (or similar)

####### 2.1.5.4.3.2.3 Details

Updates the Kubernetes deployment manifest to use the new Docker image tag (commit SHA).

###### 2.1.5.4.3.3.0 Apply to Staging Cluster

####### 2.1.5.4.3.3.1 Name

Apply to Staging Cluster

####### 2.1.5.4.3.3.2 Tool

kubectl apply

####### 2.1.5.4.3.3.3 Details

Applies the updated manifests to the Staging EKS cluster, triggering a rolling update of the service pods. This aligns with REQ-DEP-001.

##### 2.1.5.4.4.0.0 Artifacts Produced

*No items available*

#### 2.1.5.5.0.0.0 5. End-to-End Testing

##### 2.1.5.5.1.0.0 Name

5. End-to-End Testing

##### 2.1.5.5.2.0.0 Purpose

Validate the functionality and integration of the deployed service in a live-like environment.

##### 2.1.5.5.3.0.0 Steps

- {'name': 'Run Cypress E2E Tests', 'tool': 'Cypress', 'details': 'Executes the automated end-to-end test suite against the Staging environment endpoints, as specified in REQ-NFR-006.'}

##### 2.1.5.5.4.0.0 Artifacts Produced

- E2E Test Results and Videos/Screenshots

#### 2.1.5.6.0.0.0 6. Deploy to Production

##### 2.1.5.6.1.0.0 Name

6. Deploy to Production

##### 2.1.5.6.2.0.0 Purpose

Promote the tested and validated container image to the Production environment after manual approval.

##### 2.1.5.6.3.0.0 Steps

###### 2.1.5.6.3.1.0 Manual Approval Gate

####### 2.1.5.6.3.1.1 Name

Manual Approval Gate

####### 2.1.5.6.3.1.2 Tool

GitHub Actions (Environments)

####### 2.1.5.6.3.1.3 Details

The pipeline pauses and requires manual approval from a designated approver before proceeding to production. This provides a control point for business coordination.

###### 2.1.5.6.3.2.0 Configure Kubernetes CLI

####### 2.1.5.6.3.2.1 Name

Configure Kubernetes CLI

####### 2.1.5.6.3.2.2 Tool

kubectl

####### 2.1.5.6.3.2.3 Details

Switches the `kubectl` context to connect to the Production EKS cluster.

###### 2.1.5.6.3.3.0 Apply to Production Cluster

####### 2.1.5.6.3.3.1 Name

Apply to Production Cluster

####### 2.1.5.6.3.3.2 Tool

kubectl apply

####### 2.1.5.6.3.3.3 Details

Applies the same manifests used in Staging (with production-specific configurations) to the Production EKS cluster, promoting the exact same immutable Docker image that was validated.

###### 2.1.5.6.3.4.0 Verify Deployment Health

####### 2.1.5.6.3.4.1 Name

Verify Deployment Health

####### 2.1.5.6.3.4.2 Tool

kubectl rollout status

####### 2.1.5.6.3.4.3 Details

Monitors the status of the rolling update to ensure the new pods become healthy before considering the deployment successful.

##### 2.1.5.6.4.0.0 Artifacts Produced

*No items available*

### 2.1.6.0.0.0.0 Rollback Strategy

| Property | Value |
|----------|-------|
| Trigger | Manual trigger or automated via monitoring alerts ... |
| Method | Execute `kubectl rollout undo deployment/<service-... |
| Database | Database migrations are applied before the applica... |

## 2.2.0.0.0.0.0 Frontend Web Application CI/CD Pipeline

### 2.2.1.0.0.0.0 Id

PIPELINE-FRONTEND-WEB-001

### 2.2.2.0.0.0.0 Name

Frontend Web Application CI/CD Pipeline

### 2.2.3.0.0.0.0 Description

A standardized pipeline for building, testing, and deploying the React.js web dashboards (Vendor, Admin) as a containerized application to EKS.

### 2.2.4.0.0.0.0 Trigger

#### 2.2.4.1.0.0.0 Type

🔹 Git Push/Tag

#### 2.2.4.2.0.0.0 Details

Identical trigger logic to the backend pipeline for consistency.

### 2.2.5.0.0.0.0 Stages

#### 2.2.5.1.0.0.0 1. Build and Analyze

##### 2.2.5.1.1.0.0 Name

1. Build and Analyze

##### 2.2.5.1.2.0.0 Purpose

Run quality checks and build the static web assets.

##### 2.2.5.1.3.0.0 Steps

###### 2.2.5.1.3.1.0 Checkout and Install

####### 2.2.5.1.3.1.1 Name

Checkout and Install

####### 2.2.5.1.3.1.2 Tool

GitHub Actions & npm

####### 2.2.5.1.3.1.3 Details

Clones repo and runs `npm ci`.

###### 2.2.5.1.3.2.0 Run Quality & Test Checks

####### 2.2.5.1.3.2.1 Name

Run Quality & Test Checks

####### 2.2.5.1.3.2.2 Tool

ESLint, Prettier, Jest

####### 2.2.5.1.3.2.3 Details

Runs linting, formatting, and unit tests with an 80% coverage check, as per REQ-NFR-006.

###### 2.2.5.1.3.3.0 Build Static Assets

####### 2.2.5.1.3.3.1 Name

Build Static Assets

####### 2.2.5.1.3.3.2 Tool

Vite

####### 2.2.5.1.3.3.3 Details

Executes `vite build` to create optimized static HTML, CSS, and JavaScript files for production.

##### 2.2.5.1.4.0.0 Artifacts Produced

- Static Web Assets

#### 2.2.5.2.0.0.0 2. Package and Deploy

##### 2.2.5.2.1.0.0 Name

2. Package and Deploy

##### 2.2.5.2.2.0.0 Purpose

Package the static assets into a Docker image with a web server and deploy it.

##### 2.2.5.2.3.0.0 Steps

###### 2.2.5.2.3.1.0 Build Docker Image

####### 2.2.5.2.3.1.1 Name

Build Docker Image

####### 2.2.5.2.3.1.2 Tool

Docker

####### 2.2.5.2.3.1.3 Details

Builds a lightweight Docker image (e.g., using Nginx) to serve the static assets produced in the previous step.

###### 2.2.5.2.3.2.0 Push and Scan Image

####### 2.2.5.2.3.2.1 Name

Push and Scan Image

####### 2.2.5.2.3.2.2 Tool

AWS CLI & ECR Scanning

####### 2.2.5.2.3.2.3 Details

Pushes the image to ECR and scans for vulnerabilities, mirroring the backend pipeline process.

###### 2.2.5.2.3.3.0 Deploy to Staging & Production

####### 2.2.5.2.3.3.1 Name

Deploy to Staging & Production

####### 2.2.5.2.3.3.2 Tool

kubectl

####### 2.2.5.2.3.3.3 Details

Follows the same automated deployment to Staging, E2E testing (Cypress), manual approval, and promotion to Production as the backend pipeline.

##### 2.2.5.2.4.0.0 Artifacts Produced

- Versioned Docker Image in ECR

### 2.2.6.0.0.0.0 Rollback Strategy

| Property | Value |
|----------|-------|
| Trigger | Manual trigger. |
| Method | Identical to backend: `kubectl rollout undo`. |
| Database | N/A |

## 2.3.0.0.0.0.0 Infrastructure (Terraform) CI Pipeline

### 2.3.1.0.0.0.0 Id

PIPELINE-INFRA-IAC-001

### 2.3.2.0.0.0.0 Name

Infrastructure (Terraform) CI Pipeline

### 2.3.3.0.0.0.0 Description

A pipeline to validate and apply infrastructure changes using Terraform. Ensures that infrastructure modifications are peer-reviewed and safely applied.

### 2.3.4.0.0.0.0 Trigger

#### 2.3.4.1.0.0.0 Type

🔹 Git Push/Pull Request

#### 2.3.4.2.0.0.0 Details

Triggered on pull requests to `main` to run validation, and on push to `main` to run the apply workflow.

### 2.3.5.0.0.0.0 Stages

#### 2.3.5.1.0.0.0 1. Validate (On Pull Request)

##### 2.3.5.1.1.0.0 Name

1. Validate (On Pull Request)

##### 2.3.5.1.2.0.0 Purpose

Validate the correctness and syntax of Terraform code before it is merged.

##### 2.3.5.1.3.0.0 Steps

###### 2.3.5.1.3.1.0 Checkout Code

####### 2.3.5.1.3.1.1 Name

Checkout Code

####### 2.3.5.1.3.1.2 Tool

GitHub Actions

####### 2.3.5.1.3.1.3 Details

Checks out the feature branch.

###### 2.3.5.1.3.2.0 Initialize Terraform

####### 2.3.5.1.3.2.1 Name

Initialize Terraform

####### 2.3.5.1.3.2.2 Tool

Terraform

####### 2.3.5.1.3.2.3 Details

Runs `terraform init` to initialize the backend and providers.

###### 2.3.5.1.3.3.0 Validate Configuration

####### 2.3.5.1.3.3.1 Name

Validate Configuration

####### 2.3.5.1.3.3.2 Tool

Terraform

####### 2.3.5.1.3.3.3 Details

Runs `terraform validate` to check for syntax errors.

###### 2.3.5.1.3.4.0 Generate Plan

####### 2.3.5.1.3.4.1 Name

Generate Plan

####### 2.3.5.1.3.4.2 Tool

Terraform

####### 2.3.5.1.3.4.3 Details

Runs `terraform plan` to generate an execution plan. The plan is posted as a comment on the pull request for peer review.

##### 2.3.5.1.4.0.0 Artifacts Produced

- Terraform Plan Output

#### 2.3.5.2.0.0.0 2. Apply (On Merge to Main)

##### 2.3.5.2.1.0.0 Name

2. Apply (On Merge to Main)

##### 2.3.5.2.2.0.0 Purpose

Apply the approved infrastructure changes to the target AWS environment.

##### 2.3.5.2.3.0.0 Steps

###### 2.3.5.2.3.1.0 Generate and Save Plan

####### 2.3.5.2.3.1.1 Name

Generate and Save Plan

####### 2.3.5.2.3.1.2 Tool

Terraform

####### 2.3.5.2.3.1.3 Details

Runs `terraform plan -out=tfplan` to create a final, definitive plan artifact.

###### 2.3.5.2.3.2.0 Manual Approval Gate

####### 2.3.5.2.3.2.1 Name

Manual Approval Gate

####### 2.3.5.2.3.2.2 Tool

GitHub Actions

####### 2.3.5.2.3.2.3 Details

Requires manual approval before applying potentially destructive infrastructure changes.

###### 2.3.5.2.3.3.0 Apply Plan

####### 2.3.5.2.3.3.1 Name

Apply Plan

####### 2.3.5.2.3.3.2 Tool

Terraform

####### 2.3.5.2.3.3.3 Details

Runs `terraform apply "tfplan"` to execute the saved plan, ensuring that only the reviewed changes are applied.

##### 2.3.5.2.4.0.0 Artifacts Produced

*No items available*

### 2.3.6.0.0.0.0 Rollback Strategy

| Property | Value |
|----------|-------|
| Trigger | Manual. |
| Method | Requires a new Terraform commit to revert the chan... |
| Database | N/A |

