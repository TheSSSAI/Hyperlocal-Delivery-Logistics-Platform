# 1 Pipelines

## 1.1 Backend Microservice CI/CD Pipeline

### 1.1.1 Id

pl-backend-service-001

### 1.1.2 Name

Backend Microservice CI/CD Pipeline

### 1.1.3 Description

Builds, tests, scans, and deploys a Node.js microservice to the Amazon EKS cluster. Complies with REQ-NFR-006, REQ-NFR-003, and REQ-DEP-001.

### 1.1.4 Stages

#### 1.1.4.1 Build and Unit Test

##### 1.1.4.1.1 Name

Build and Unit Test

##### 1.1.4.1.2 Steps

- npm install
- npm run lint
- npm run test -- --coverage

##### 1.1.4.1.3 Environment

###### 1.1.4.1.3.1 Node Env

test

##### 1.1.4.1.4.0 Quality Gates

###### 1.1.4.1.4.1 Unit & Integration Test Gate

####### 1.1.4.1.4.1.1 Name

Unit & Integration Test Gate

####### 1.1.4.1.4.1.2 Criteria

- All Jest tests passed

####### 1.1.4.1.4.1.3 Blocking

✅ Yes

###### 1.1.4.1.4.2.0 Code Coverage Gate

####### 1.1.4.1.4.2.1 Name

Code Coverage Gate

####### 1.1.4.1.4.2.2 Criteria

- Jest coverage >= 80%

####### 1.1.4.1.4.2.3 Blocking

✅ Yes

#### 1.1.4.2.0.0.0 Security Analysis

##### 1.1.4.2.1.0.0 Name

Security Analysis

##### 1.1.4.2.2.0.0 Steps

- npm audit --audit-level=critical
- snyk-container-scan --file=Dockerfile

##### 1.1.4.2.3.0.0 Environment

###### 1.1.4.2.3.1.0 Fail On

critical

##### 1.1.4.2.4.0.0 Quality Gates

- {'name': 'Vulnerability Scan Gate', 'criteria': ['zero critical CVEs in dependencies', 'zero critical CVEs in container base image'], 'blocking': True}

#### 1.1.4.3.0.0.0 Build and Push Container Image

##### 1.1.4.3.1.0.0 Name

Build and Push Container Image

##### 1.1.4.3.2.0.0 Steps

- docker build -t $ECR_REPO/$SERVICE_NAME:$IMAGE_TAG .
- aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO
- docker push $ECR_REPO/$SERVICE_NAME:$IMAGE_TAG

##### 1.1.4.3.3.0.0 Environment

###### 1.1.4.3.3.1.0 Ecr Repo

123456789012.dkr.ecr.ap-south-1.amazonaws.com

#### 1.1.4.4.0.0.0 Deploy to Staging

##### 1.1.4.4.1.0.0 Name

Deploy to Staging

##### 1.1.4.4.2.0.0 Steps

- sed -i 's/IMAGE_PLACEHOLDER/$ECR_REPO\/$SERVICE_NAME:$IMAGE_TAG/g' k8s/deployment-staging.yaml
- kubectl apply -f k8s/deployment-staging.yaml --context staging-eks-cluster
- run-db-migrations --env staging

##### 1.1.4.4.3.0.0 Environment

###### 1.1.4.4.3.1.0 Kube Namespace

staging

#### 1.1.4.5.0.0.0 End-to-End Testing on Staging

##### 1.1.4.5.1.0.0 Name

End-to-End Testing on Staging

##### 1.1.4.5.2.0.0 Steps

- npm install
- npm run cypress:run -- --env environment=staging

##### 1.1.4.5.3.0.0 Environment

###### 1.1.4.5.3.1.0 Cypress Base Url

🔗 [https://staging.api.platform.com](https://staging.api.platform.com)

##### 1.1.4.5.4.0.0 Quality Gates

- {'name': 'E2E Test Gate', 'criteria': ['All Cypress tests passed'], 'blocking': True}

#### 1.1.4.6.0.0.0 Manual Approval for Production

##### 1.1.4.6.1.0.0 Name

Manual Approval for Production

##### 1.1.4.6.2.0.0 Steps

- Require-Manual-Approval --reason 'Staging deployment verified and E2E tests passed. Ready for production rollout.'

##### 1.1.4.6.3.0.0 Environment

*No data available*

#### 1.1.4.7.0.0.0 Deploy to Production

##### 1.1.4.7.1.0.0 Name

Deploy to Production

##### 1.1.4.7.2.0.0 Steps

- sed -i 's/IMAGE_PLACEHOLDER/$ECR_REPO\/$SERVICE_NAME:$IMAGE_TAG/g' k8s/deployment-production.yaml
- kubectl apply -f k8s/deployment-production.yaml --context production-eks-cluster
- run-db-migrations --env production

##### 1.1.4.7.3.0.0 Environment

###### 1.1.4.7.3.1.0 Kube Namespace

production

#### 1.1.4.8.0.0.0 Post-Deployment Health Check

##### 1.1.4.8.1.0.0 Name

Post-Deployment Health Check

##### 1.1.4.8.2.0.0 Steps

- run-smoke-tests --env production
- monitor-prometheus-query --query 'api_error_rate_percent{job="$SERVICE_NAME"} > 1' --for 5m

##### 1.1.4.8.3.0.0 Environment

###### 1.1.4.8.3.1.0 Rollback On Failure

true

## 1.2.0.0.0.0.0 Frontend Web Application CI/CD Pipeline

### 1.2.1.0.0.0.0 Id

pl-frontend-webapp-002

### 1.2.2.0.0.0.0 Name

Frontend Web Application CI/CD Pipeline

### 1.2.3.0.0.0.0 Description

Builds, tests, scans, and deploys a React web application (Vendor/Admin Dashboard) to AWS S3 and invalidates CloudFront cache.

### 1.2.4.0.0.0.0 Stages

#### 1.2.4.1.0.0.0 Build and Unit Test

##### 1.2.4.1.1.0.0 Name

Build and Unit Test

##### 1.2.4.1.2.0.0 Steps

- npm install
- npm run lint
- npm run test -- --coverage
- npm run build

##### 1.2.4.1.3.0.0 Environment

###### 1.2.4.1.3.1.0 Node Env

production

##### 1.2.4.1.4.0.0 Quality Gates

- {'name': 'Unit Test & Coverage Gate', 'criteria': ['All Jest tests passed', 'Code coverage >= 80%'], 'blocking': True}

#### 1.2.4.2.0.0.0 Security Analysis

##### 1.2.4.2.1.0.0 Name

Security Analysis

##### 1.2.4.2.2.0.0 Steps

- npm audit --audit-level=critical

##### 1.2.4.2.3.0.0 Environment

*No data available*

##### 1.2.4.2.4.0.0 Quality Gates

- {'name': 'Dependency Vulnerability Gate', 'criteria': ['zero critical CVEs in dependencies'], 'blocking': True}

#### 1.2.4.3.0.0.0 Deploy to Staging S3

##### 1.2.4.3.1.0.0 Name

Deploy to Staging S3

##### 1.2.4.3.2.0.0 Steps

- aws s3 sync ./dist s3://$STAGING_S3_BUCKET/ --delete
- aws cloudfront create-invalidation --distribution-id $STAGING_CF_ID --paths '/*'

##### 1.2.4.3.3.0.0 Environment

###### 1.2.4.3.3.1.0 Aws Region

ap-south-1

#### 1.2.4.4.0.0.0 End-to-End Testing on Staging

##### 1.2.4.4.1.0.0 Name

End-to-End Testing on Staging

##### 1.2.4.4.2.0.0 Steps

- npm install
- npm run cypress:run -- --env environment=staging

##### 1.2.4.4.3.0.0 Environment

###### 1.2.4.4.3.1.0 Cypress Base Url

🔗 [https://staging.vendor.platform.com](https://staging.vendor.platform.com)

##### 1.2.4.4.4.0.0 Quality Gates

- {'name': 'E2E Test Gate', 'criteria': ['All Cypress tests passed'], 'blocking': True}

#### 1.2.4.5.0.0.0 Manual Approval for Production

##### 1.2.4.5.1.0.0 Name

Manual Approval for Production

##### 1.2.4.5.2.0.0 Steps

- Require-Manual-Approval --reason 'Staging deployment and tests are successful.'

##### 1.2.4.5.3.0.0 Environment

*No data available*

#### 1.2.4.6.0.0.0 Deploy to Production S3

##### 1.2.4.6.1.0.0 Name

Deploy to Production S3

##### 1.2.4.6.2.0.0 Steps

- aws s3 sync ./dist s3://$PRODUCTION_S3_BUCKET/ --delete
- aws cloudfront create-invalidation --distribution-id $PRODUCTION_CF_ID --paths '/*'

##### 1.2.4.6.3.0.0 Environment

###### 1.2.4.6.3.1.0 Aws Region

ap-south-1

# 2.0.0.0.0.0.0 Configuration

| Property | Value |
|----------|-------|
| Artifact Repository | Amazon ECR for containers, Amazon S3 for frontend ... |
| Default Branch | main |
| Retention Policy | Retain build artifacts and logs for 90 days |
| Notification Channel | slack#devops-alerts |

