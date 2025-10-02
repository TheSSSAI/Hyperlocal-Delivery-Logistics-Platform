# 1 Diagram Info

## 1.1 Diagram Name

User Registration and Admin Approval Flow

## 1.2 Diagram Type

flowchart

## 1.3 Purpose

To visualize the end-to-end user registration journey for Customers, Vendors, and Riders, from initial sign-up to the final approval or rejection by a platform administrator. This diagram covers the state transitions, key decision points, and notifications involved in the onboarding process.

## 1.4 Target Audience

- developers
- product managers
- QA engineers
- operations team

## 1.5 Complexity Level

medium

## 1.6 Estimated Review Time

3-5 minutes

# 2.0 Mermaid Implementation

| Property | Value |
|----------|-------|
| Mermaid Code | flowchart TD
    subgraph User Registration Flow
 ... |
| Syntax Validation | Mermaid syntax verified and tested |
| Rendering Notes | Optimized for top-to-bottom flow. Subgraphs are us... |

# 3.0 Diagram Elements

## 3.1 Actors Systems

- New User (Customer/Vendor/Rider)
- Client Application
- Backend Service
- Notification Service
- Administrator
- Admin Dashboard

## 3.2 Key Processes

- Mobile number uniqueness check
- OTP verification
- Account creation in 'pending_verification' state
- Admin review
- Status update to 'active' or 'rejected'
- User notification of outcome

## 3.3 Decision Points

- Is mobile number already registered?
- Is the submitted OTP correct?
- Administrator's decision to Approve or Reject

## 3.4 Success Paths

- User successfully registers, is approved, and gains full access.

## 3.5 Error Scenarios

- User attempts to register with an existing mobile number.
- User enters an incorrect OTP.

## 3.6 Edge Cases Covered

- The diagram implies the need to handle OTP expiry and resend logic, though not explicitly drawn to maintain clarity.

# 4.0 Accessibility Considerations

| Property | Value |
|----------|-------|
| Alt Text | A flowchart showing the two main stages of user on... |
| Color Independence | Information is conveyed through flow, labels, and ... |
| Screen Reader Friendly | All nodes have clear, descriptive text labels. |
| Print Compatibility | Diagram uses distinct shapes and clear text, makin... |

# 5.0 Technical Specifications

| Property | Value |
|----------|-------|
| Mermaid Version | 10.0+ compatible |
| Responsive Behavior | The vertical layout is suitable for both wide and ... |
| Theme Compatibility | Standard Mermaid shapes and colors are used, which... |
| Performance Notes | The diagram is of medium complexity and should ren... |

# 6.0 Usage Guidelines

## 6.1 When To Reference

During the development, testing, and review of the user registration (CUS-001, VND-001, RDR-001) and admin approval (ADM-003, ADM-004) features. Useful for onboarding new developers to the user lifecycle process.

## 6.2 Stakeholder Value

| Property | Value |
|----------|-------|
| Developers | Provides a clear overview of the required state tr... |
| Designers | Validates the user journey from the user's and adm... |
| Product Managers | Confirms the business logic for the onboarding fun... |
| Qa Engineers | Defines the end-to-end test flow, including happy ... |

## 6.3 Maintenance Notes

This diagram should be updated if any steps are added to the registration process (e.g., email verification) or if the admin approval workflow changes.

## 6.4 Integration Recommendations

Embed this diagram in the technical documentation for the Identity & Access service and within the parent epics for user onboarding.

# 7.0 Validation Checklist

- ✅ All critical user paths documented
- ✅ Error scenarios and recovery paths included
- ✅ Decision points clearly marked with conditions
- ✅ Mermaid syntax validated and renders correctly
- ✅ Diagram serves intended audience needs
- ✅ Visual hierarchy supports easy comprehension
- ✅ Styling enhances rather than distracts from content
- ✅ Accessible to users with different visual abilities

