sequenceDiagram
    actor "Rider Mobile App" as RiderMobileApp
    participant "Rider Logistics Service" as RiderLogisticsService

    activate RiderLogisticsService
    RiderMobileApp->>RiderLogisticsService: 1. 1. Fetch assigned task details and initial route
    RiderLogisticsService-->>RiderMobileApp: 2. Respond with task details (vendor/customer info, POD type) and optimized route to vendor
    RiderMobileApp->>RiderMobileApp: 2. 3. Render 'DeliveryTaskScreen' and display navigation to Vendor using Mapbox SDK
    RiderMobileApp->>RiderLogisticsService: 3. 4. Rider taps 'Arrived at Store'. Send status update.
    RiderLogisticsService-->>RiderMobileApp: 5. Acknowledge status update (200 OK)
    RiderMobileApp->>RiderLogisticsService: 4. 6. Rider taps 'Picked Up'. Send status update.
    RiderLogisticsService-->>RiderMobileApp: 7. Acknowledge status update (200 OK)
    RiderMobileApp->>RiderMobileApp: 5. 8. Update UI to display navigation to Customer
    RiderMobileApp->>RiderLogisticsService: 6. 9. Rider taps 'Arrived at Destination'. Send status update.
    RiderLogisticsService-->>RiderMobileApp: 10. Acknowledge status update (200 OK)
    RiderMobileApp->>RiderMobileApp: 7. 11. Rider initiates POD. App checks required POD type (Photo or OTP) from task data.
    RiderMobileApp->>RiderLogisticsService: 8. 12a. [IF PHOTO] Capture photo, upload image, and submit POD.
    RiderLogisticsService-->>RiderMobileApp: 13a. Respond with image URL and confirmation (201 Created)
    RiderMobileApp->>RiderLogisticsService: 9. 12b. [IF OTP] Rider enters 4-digit OTP from customer. Submit for validation.
    RiderLogisticsService-->>RiderMobileApp: 13b. Respond with validation result (200 OK or 400 Invalid OTP)
    RiderMobileApp->>RiderLogisticsService: 10. 14. Rider taps 'Delivered' after successful POD. Send final status update.
    RiderLogisticsService-->>RiderMobileApp: 15. Acknowledge final status, marking task complete (200 OK)
    RiderMobileApp->>RiderMobileApp: 11. 16. Display 'Delivery Complete' confirmation and return to task list/home screen.

    note over RiderLogisticsService: Backend Responsibility: Upon receiving each status update (e.g., 'PICKED_UP', 'DELIVERED'), the L...
    note over RiderMobileApp: State Management: The Rider App must maintain the current state of the delivery task robustly (e....

    deactivate RiderLogisticsService
