erDiagram
    User {
        Guid userId PK
    }
    CustomerProfile {
        Guid customerProfileId PK
    }
    VendorProfile {
        Guid vendorProfileId PK
    }
    RiderProfile {
        Guid riderProfileId PK
    }
    Address {
        Guid addressId PK
    }
    OperationalZone {
        Guid zoneId PK
    }
    VendorBusinessHour {
        Guid businessHourId PK
    }
    VendorLicense {
        Guid licenseId PK
    }
    ProductCategory {
        Guid productCategoryId PK
    }
    Product {
        Guid productId PK
    }
    Order {
        Guid orderId PK
    }
    OrderItem {
        Guid orderItemId PK
    }
    OrderStatusHistory {
        Guid orderStatusHistoryId PK
    }
    Payment {
        Guid paymentId PK
    }
    DeliveryTask {
        Guid deliveryTaskId PK
    }
    ProofOfDelivery {
        Guid podId PK
    }
    RiderLocationHistory {
        BIGSERIAL locationId PK
    }
    RatingReview {
        Guid ratingReviewId PK
    }
    ChatMessage {
        Guid chatMessageId PK
    }
    SupportTicket {
        Guid supportTicketId PK
    }
    AuditLog {
        BIGSERIAL auditLogId PK
    }
    FinancialTransaction {
        Guid financialTransactionId PK
    }
    Payout {
        Guid payoutId PK
    }
    UserConsent {
        Guid userConsentId PK
    }
    SystemConfiguration {
        VARCHAR configKey PK
    }

    User ||--o| CustomerProfile : "has profile"
    User ||--o| VendorProfile : "has profile"
    User ||--o| RiderProfile : "has profile"
    User ||--o{ Address : "maintains"
    User ||--o{ Order : "places (as Customer)"
    User ||--o{ Order : "fulfills (as Vendor)"
    User ||--o{ DeliveryTask : "performs (as Rider)"
    User ||--o{ RiderLocationHistory : "has location history (as Rider)"
    User ||--o{ RatingReview : "writes (as Reviewer)"
    User ||--o{ RatingReview : "receives (as Reviewee)"
    User ||--o{ ChatMessage : "sends"
    User ||--o{ SupportTicket : "creates"
    User ||--o{ SupportTicket : "is assigned (as Admin)"
    User ||--o{ AuditLog : "performs actions recorded in"
    User ||--o{ Payout : "receives"
    User ||--|{ UserConsent : "gives"
    User ||--o{ SystemConfiguration : "updates (as Admin)"

    VendorProfile ||--|| Address : "has primary address"
    VendorProfile ||--o{ VendorBusinessHour : "has business hours"
    VendorProfile ||--o{ VendorLicense : "has licenses"
    VendorProfile ||--o{ ProductCategory : "has product categories"
    VendorProfile ||--o{ Product : "sells"

    ProductCategory ||--o{ Product : "contains"

    Order ||--|{ OrderItem : "contains"
    Order ||--|{ OrderStatusHistory : "has history of"
    Order ||--o{ Payment : "has payments for"
    Order ||--|| DeliveryTask : "creates"
    Order ||--o{ RatingReview : "is subject of"
    Order ||--o{ ChatMessage : "is context for"
    Order ||--o{ FinancialTransaction : "generates"

    Product ||--o{ OrderItem : "is item in"
    Address ||--o{ Order : "delivers to"
    DeliveryTask ||--o| ProofOfDelivery : "has proof of"
    Payout ||--o{ FinancialTransaction : "generates"