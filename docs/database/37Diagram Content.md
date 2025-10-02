erDiagram
    User {
        Guid userId PK
        VARCHAR mobileNumber UK
        VARCHAR email UK
        VARCHAR userType
        VARCHAR status
    }

    CustomerProfile {
        Guid customerProfileId PK
        Guid userId FK
        VARCHAR firstName
        VARCHAR lastName
    }

    Address {
        Guid addressId PK
        Guid userId FK
        VARCHAR addressLine1
        VARCHAR city
        GEOGRAPHY location
    }

    UserConsent {
        Guid userConsentId PK
        Guid userId FK
        VARCHAR consentType
        BOOLEAN isGranted
    }

    AuditLog {
        BIGSERIAL auditLogId PK
        Guid adminId FK
        VARCHAR action
        JSONB changedData
    }

    SystemConfiguration {
        VARCHAR configKey PK
        Guid updatedBy FK
        TEXT configValue
    }

    User ||--o{ CustomerProfile : "has one"
    User ||--|{ Address : "has many"
    User ||--|{ UserConsent : "gives"
    User ||--|{ AuditLog : "creates"
    User ||--|{ SystemConfiguration : "updates"