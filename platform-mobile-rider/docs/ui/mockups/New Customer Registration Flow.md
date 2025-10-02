# 1 Diagram Info

## 1.1 Diagram Name

New Customer Registration Flow

## 1.2 Diagram Type

sequenceDiagram

## 1.3 Purpose

To visually document the end-to-end technical sequence for a new customer registering on the platform via the mobile application, covering OTP generation, verification, user creation, and session initiation.

## 1.4 Target Audience

- developers
- QA engineers
- product managers
- system architects

## 1.5 Complexity Level

medium

## 1.6 Estimated Review Time

5 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | sequenceDiagram
    actor CustomerMobileApp as "Cu... |
| Syntax Validation | Mermaid syntax verified and tested |
| Rendering Notes | Optimized for clarity, showing the interaction bet... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- Customer Mobile App
- Identity & Access Service
- Redis Cache
- AWS SNS
- PostgreSQL Database

## 3.2 Key Processes

- Mobile number validation and duplicate check
- OTP generation, hashing, and storage
- OTP delivery via SMS
- OTP verification
- User record creation
- JWT generation and secure storage

## 3.3 Decision Points

- Is the mobile number unique?
- Is the submitted OTP valid and not expired?

## 3.4 Success Paths

- User provides a unique number, receives an OTP, verifies it correctly, and is logged in.

## 3.5 Error Scenarios

- User provides a mobile number that is already registered.
- User submits an incorrect or expired OTP.

## 3.6 Edge Cases Covered

- The diagram's notes allude to rate limiting and account lockout mechanisms which handle abuse scenarios.
- The flow implicitly handles a user abandoning the process after receiving an OTP, as the OTP will expire in Redis.

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | Sequence diagram of the new customer registration ... |
| Color Independence | Information is conveyed through sequential flow an... |
| Screen Reader Friendly | All participants and messages have descriptive tex... |
| Print Compatibility | Diagram uses standard shapes and lines that render... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | Diagram scales well for both wide and narrow viewp... |
| Theme Compatibility | Works with default, dark, and neutral themes. |
| Performance Notes | The diagram is of low complexity and renders quick... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During development and testing of the customer registration feature, for security reviews of the authentication flow, and for onboarding new developers to the team.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear, step-by-step guide for implement... |
| Designers | Validates the user flow and helps identify points ... |
| Product Managers | Offers a visual confirmation that all business and... |
| Qa Engineers | Outlines the complete testable flow, including suc... |

## 6.3 Maintenance Notes

Update this diagram if the authentication flow changes, if a different SMS provider is used, or if the token generation strategy is modified.

## 6.4 Integration Recommendations

Embed this diagram in the technical design document for the Identity & Access service and within the epic/story description in the project management tool (e.g., Jira).

# 7.0 Validation Checklist

- ✅ All critical user paths documented
- ✅ Error scenarios and recovery paths included
- ✅ Decision points clearly marked with conditions
- ✅ Mermaid syntax validated and renders correctly
- ✅ Diagram serves intended audience needs
- ✅ Visual hierarchy supports easy comprehension
- ✅ Styling enhances rather than distracts from content
- ✅ Accessible to users with different visual abilities

