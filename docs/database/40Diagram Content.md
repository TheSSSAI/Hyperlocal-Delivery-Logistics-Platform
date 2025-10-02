erDiagram
    RiderProfile {
        Guid riderProfileId PK
        VARCHAR firstName
        VARCHAR lastName
        BOOLEAN isOnline
    }

    DeliveryTask {
        Guid deliveryTaskId PK
        Guid riderId FK
        VARCHAR status
        DateTimeOffset deliveredAt
    }

    ProofOfDelivery {
        Guid podId PK
        Guid deliveryTaskId FK
        VARCHAR podType
    }

    RiderLocationHistory {
        BIGSERIAL locationId PK
        Guid riderId FK
        DateTimeOffset timestamp
    }

    OperationalZone {
        Guid zoneId PK
        VARCHAR name
        BOOLEAN isActive
    }

    RiderProfile ||--o{ DeliveryTask : "performs"
    RiderProfile ||--o{ RiderLocationHistory : "has"
    DeliveryTask |o--|| ProofOfDelivery : "requires"