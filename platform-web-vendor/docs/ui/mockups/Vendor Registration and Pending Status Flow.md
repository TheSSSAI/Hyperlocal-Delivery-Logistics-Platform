# 1 Diagram Info

## 1.1 Diagram Name

Vendor Registration and Pending Status Flow

## 1.2 Diagram Type

flowchart

## 1.3 Purpose

To visualize the end-to-end user journey for a new vendor registering on the platform, including OTP verification, form submission, and the subsequent "pending verification" status on login, based on user stories VND-001 and VND-002.

## 1.4 Target Audience

- developers
- product managers
- QA engineers
- UX designers

## 1.5 Complexity Level

medium

## 1.6 Estimated Review Time

3-5 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | flowchart TD
    subgraph "New Vendor Registration... |
| Syntax Validation | Mermaid syntax verified and tested |
| Rendering Notes | Optimized for both light and dark themes. The diag... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- Prospective Vendor
- Frontend Application
- Backend System
- SMS Gateway

## 3.2 Key Processes

- Form Submission
- OTP Verification
- Document Upload
- Account Creation
- Status Check on Login

## 3.3 Decision Points

- Is mobile number unique?
- Is OTP correct?
- Are all fields valid?
- What is user status on login?

## 3.4 Success Paths

- Successful registration submission leading to pending status
- Successful login redirecting to pending status screen

## 3.5 Error Scenarios

- Duplicate mobile number
- Invalid OTP
- Incomplete form submission

## 3.6 Edge Cases Covered

- User logging in while their application is still pending review

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | A flowchart detailing the vendor registration proc... |
| Color Independence | Information is conveyed through shapes, text label... |
| Screen Reader Friendly | All nodes have clear, descriptive text labels that... |
| Print Compatibility | Diagram renders clearly in black and white, mainta... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | Diagram scales appropriately for different screen ... |
| Theme Compatibility | Works with default, dark, and neutral themes due t... |
| Performance Notes | The diagram is of medium complexity and should ren... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During development, testing, and product reviews of the vendor onboarding and authentication features.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear map of the user flow, including a... |
| Designers | Validates the user experience journey from initial... |
| Product Managers | Offers a concise overview of the entire feature, e... |
| Qa Engineers | Defines a comprehensive set of test cases, includi... |

## 6.3 Maintenance Notes

This diagram should be updated if any steps are added or removed from the registration form, or if the logic for handling pending users on login is changed.

## 6.4 Integration Recommendations

Embed this diagram in the project's technical documentation for the User Management/Onboarding module and link it directly from the relevant user stories (VND-001, VND-002).

# 7.0 Validation Checklist

- ✅ All critical user paths documented
- ✅ Error scenarios and recovery paths included
- ✅ Decision points clearly marked with conditions
- ✅ Mermaid syntax validated and renders correctly
- ✅ Diagram serves intended audience needs
- ✅ Visual hierarchy supports easy comprehension
- ✅ Styling enhances rather than distracts from content
- ✅ Accessible to users with different visual abilities

