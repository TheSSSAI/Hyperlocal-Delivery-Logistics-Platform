sequenceDiagram
    actor "Customer Mobile App" as CustomerMobileApp
    participant "Identity & Access Service" as IdentityAccessService
    participant "Redis Cache" as RedisCache
    participant "AWS SNS" as AWSSNS
    participant "PostgreSQL Database" as PostgreSQLDatabase

    CustomerMobileApp->>CustomerMobileApp: 1. User enters mobile number in RegistrationScreen and taps 'Send OTP'
    CustomerMobileApp->>CustomerMobileApp: 2. Update UI State: Show loading spinner, disable button
    activate IdentityAccessService
    CustomerMobileApp->>IdentityAccessService: 3. POST /api/v1/auth/register/otp
    IdentityAccessService-->>CustomerMobileApp: 200 OK or Error (400, 409, 429)
    IdentityAccessService->>IdentityAccessService: 3.1. Validate DTO against Indian mobile number format (e.g., /^[6-9]\d{9}$/)
    IdentityAccessService-->>IdentityAccessService: isValid: boolean
    IdentityAccessService->>PostgreSQLDatabase: 3.2. SELECT 1 FROM users WHERE mobileNumber = $1
    PostgreSQLDatabase-->>IdentityAccessService: Row count (0 or 1)
    IdentityAccessService->>IdentityAccessService: 3.3. Generate 6-digit OTP and hash it (e.g., with bcrypt)
    IdentityAccessService-->>IdentityAccessService: otpHash: string
    IdentityAccessService->>RedisCache: 3.4. SETEX otp:${mobileNumber} 300 ${otpHash}
    RedisCache-->>IdentityAccessService: OK
    IdentityAccessService->>AWSSNS: 3.5. publish(PhoneNumber, Message)
    AWSSNS-->>IdentityAccessService: messageId or error
    CustomerMobileApp->>CustomerMobileApp: 4. On 200 OK, update UI: Show OTP input, start 5-min timer
    CustomerMobileApp->>CustomerMobileApp: 5. User enters OTP and taps 'Verify & Register'
    CustomerMobileApp->>IdentityAccessService: 6. POST /api/v1/auth/register/verify
    IdentityAccessService-->>CustomerMobileApp: 201 Created with JWTs or Error (400)
    IdentityAccessService->>RedisCache: 6.1. GET otp:${mobileNumber}
    RedisCache-->>IdentityAccessService: otpHash or null
    IdentityAccessService->>IdentityAccessService: 6.2. Compare submitted OTP with stored hash
    IdentityAccessService-->>IdentityAccessService: isMatch: boolean
    IdentityAccessService->>PostgreSQLDatabase: 6.3. BEGIN TRANSACTION; INSERT User; INSERT CustomerProfile; COMMIT;
    PostgreSQLDatabase-->>IdentityAccessService: New User object
    IdentityAccessService->>RedisCache: 6.4. DEL otp:${mobileNumber}
    RedisCache-->>IdentityAccessService: OK
    IdentityAccessService->>IdentityAccessService: 6.5. Generate JWT access and refresh tokens for the new user
    IdentityAccessService-->>IdentityAccessService: { accessToken, refreshToken }
    CustomerMobileApp->>CustomerMobileApp: 7. On 201 Created, securely store tokens (Keychain/Keystore)
    CustomerMobileApp->>CustomerMobileApp: 8. Update global state and navigate to HomeScreen

    note over IdentityAccessService: Security: OTPs must be hashed in storage (Redis) and have a short expiry (5 minutes). The system ...
    note over CustomerMobileApp: User Experience: The frontend must provide clear, real-time feedback for loading states, success,...

    deactivate IdentityAccessService
