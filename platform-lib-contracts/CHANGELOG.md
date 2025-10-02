# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release of the `@hyperlocal/contracts` library.
- **Common Contracts**:
  - `ApiErrorResponse`, `PagedResponse<T>` for standardized API responses.
  - `AddressContract`, `MoneyContract` for common value objects.
  - `BaseEvent` for consistent event metadata (`correlationId`, `timestamp`, etc.).
- **Enums**:
  - `OrderStatus`, `PaymentMethod`, `PodType`, `UserRole`.
- **DTOs**:
  - Initial DTOs for Orders, Users, and Products.
- **Events**:
  - Initial event contracts including `OrderPlacedEvent`, `PaymentSucceededEvent`, and `UserRegisteredEvent`.
- **Project Setup**:
  - TypeScript, ESLint, Prettier, and Jest configuration.
  - CI/CD workflows for validation and automated publishing.