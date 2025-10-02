# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-011 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Deletes a Product from Catalog |
| As A User Story | As a Vendor, I want to permanently remove a produc... |
| User Persona | Vendor user responsible for managing their store's... |
| Business Value | Ensures catalog accuracy, which improves the custo... |
| Functional Area | Vendor-Facing Features |
| Story Theme | Vendor Inventory & Catalog Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

VND-011-AC-01

### 3.1.2 Scenario

Successful Deletion of a Product

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a vendor is logged into their dashboard and is viewing their product list

### 3.1.5 When

the vendor clicks the 'Delete' action for a product that is not part of any active orders, and confirms the deletion in the confirmation modal

### 3.1.6 Then

the system shall perform a soft delete on the product record (e.g., set an 'is_deleted' flag to true or populate a 'deleted_at' timestamp).

### 3.1.7 And

the product shall no longer be visible or searchable in the customer-facing application.

### 3.1.8 Validation Notes

Verify via UI that the product disappears. Verify via API call to the customer-facing product endpoint that the product is not returned. Verify in the database that the product record is marked as deleted and not physically removed.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

VND-011-AC-02

### 3.2.2 Scenario

Vendor Cancels the Deletion

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a vendor is logged into their dashboard and has opened the delete confirmation modal for a product

### 3.2.5 When

the vendor clicks the 'Cancel' button or closes the modal

### 3.2.6 Then

the deletion process shall be aborted.

### 3.2.7 And

the product shall remain visible in the vendor's product list.

### 3.2.8 Validation Notes

Verify in the UI that the product remains in the list. Check the database to ensure no changes were made to the product record.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

VND-011-AC-03

### 3.3.2 Scenario

Attempt to Delete a Product in an Active Order

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a vendor is logged into their dashboard and is viewing their product list

### 3.3.5 And

the product shall remain active and visible in the vendor's product list.

### 3.3.6 When

the vendor attempts to delete that product

### 3.3.7 Then

the system shall prevent the deletion.

### 3.3.8 Validation Notes

Requires setting up an active order with the target product. Attempt the delete action and verify the error message and that the product record remains unchanged.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

VND-011-AC-04

### 3.4.2 Scenario

Deleting a Product Preserves Historical Order Data

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a product was part of a previously completed or cancelled order

### 3.4.5 When

a vendor successfully deletes that product

### 3.4.6 Then

the historical order details for the completed/cancelled order shall remain intact and correctly reference the product's information (name, price at time of sale, etc.).

### 3.4.7 Validation Notes

Check the order history view for a past order containing the now-deleted product. All details should still be displayed correctly. This validates the soft-delete approach.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

VND-011-AC-05

### 3.5.2 Scenario

API Security for Delete Operation

### 3.5.3 Scenario Type

Security

### 3.5.4 Given

a user is authenticated

### 3.5.5 When

they make an API call to delete a product

### 3.5.6 Then

the system must verify that the user has the 'Vendor' role and owns the product they are attempting to delete.

### 3.5.7 And

if the user is not the owner or does not have the correct role, the API must return a '403 Forbidden' or '404 Not Found' status code.

### 3.5.8 Validation Notes

Use an API testing tool to attempt deletion of a product belonging to Vendor B while authenticated as Vendor A. The request must fail.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Delete' icon or button for each product in the vendor's product list.
- A confirmation modal dialog.
- A 'Confirm Delete' button within the modal.
- A 'Cancel' button within the modal.
- A toast notification for success and error messages.

## 4.2.0 User Interactions

- Clicking 'Delete' opens the confirmation modal.
- The modal must clearly identify the product being deleted (e.g., 'Are you sure you want to delete [Product Name]?').
- The modal must state that the action is permanent/irreversible from the UI.
- Clicking 'Confirm Delete' triggers the delete API call.
- Clicking 'Cancel' closes the modal with no action.

## 4.3.0 Display Requirements

- Upon successful deletion, the product list should update in real-time to remove the deleted item.
- Error messages must be clear and user-friendly.

## 4.4.0 Accessibility Needs

- The delete button must have an accessible name (e.g., aria-label='Delete [Product Name]').
- The confirmation modal must be keyboard-navigable and trap focus.
- Notifications should be announced by screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-VND-DEL-01', 'rule_description': "A product cannot be deleted if it is part of any active order. An active order is defined as any order not in a 'Delivered' or 'Cancelled' state.", 'enforcement_point': 'Backend API, before executing the delete operation.', 'violation_handling': 'The API request is rejected with an error code and a descriptive message. The frontend displays this message to the vendor.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-009

#### 6.1.1.2 Dependency Reason

The ability to add a product must exist before the ability to delete it can be implemented.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-004

#### 6.1.2.2 Dependency Reason

Vendor must be able to log in to access the product management dashboard.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-017

#### 6.1.3.2 Dependency Reason

The Order Lifecycle Management system must be in place to check for a product's presence in active orders.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint (e.g., DELETE /api/v1/vendor/products/{productId}) must be created.
- The database schema for products must support soft deletion (e.g., a 'deleted_at' column).
- An internal API or mechanism for the 'Vendor & Catalog' service to query the 'Order Management' service about active orders containing a specific product ID.

## 6.3.0.0 Data Dependencies

- Requires existing product data for a vendor to perform the delete action.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for the delete request must be under 200ms (P95), as per REQ-NFR-001.
- The UI update after deletion should feel instantaneous to the user.

## 7.2.0.0 Security

- The delete endpoint must be protected and require Vendor role authentication.
- The endpoint must enforce ownership, preventing a vendor from deleting another vendor's products (Authorization).
- This aligns with REQ-NFR-003 and REQ-USR-001.

## 7.3.0.0 Usability

- The deletion process must include a confirmation step to prevent accidental data loss.
- Feedback (success/error) must be immediate and clear.

## 7.4.0.0 Accessibility

- All UI elements must comply with WCAG 2.1 Level AA standards, as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported modern web browsers for the Vendor web dashboard.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- The primary complexity is the cross-service communication required to check for the product in active orders before deletion.
- This requires a robust and reliable internal API contract between the 'Vendor & Catalog' service and the 'Order Management' service.
- Ensuring the soft-delete logic correctly preserves data for historical reporting and order views.

## 8.3.0.0 Technical Risks

- Potential for latency or failure in the cross-service call to check active orders. A circuit breaker pattern (REQ-DEP-002) should be considered.
- Inconsistent data if the soft-delete is not handled properly across all related data models.

## 8.4.0.0 Integration Points

- Vendor & Catalog Service: Owns the product data and the delete logic.
- Order Management Service: Must expose an endpoint to check if a product ID exists in any active orders.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify successful soft deletion of a product not in any orders.
- Verify deletion is blocked for a product in an active order.
- Verify a user can cancel the deletion from the confirmation modal.
- Verify that deleting a product does not corrupt historical order data.
- Verify that a vendor cannot delete another vendor's product (API level test).

## 9.3.0.0 Test Data Needs

- A test vendor account with multiple products.
- At least one product that is part of an active order.
- At least one product that is part of a completed order.
- At least one product that is not part of any order.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E tests.
- Postman or a similar tool for API-level security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with at least 80% coverage for the new logic.
- E2E tests for the happy path and key error conditions are implemented and passing.
- The feature is compliant with security (RBAC) and performance (latency) NFRs.
- API documentation (OpenAPI) for the new/modified endpoint is updated.
- The feature has been manually verified by a QA engineer.
- No regressions are introduced in catalog management or order history functionalities.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story depends on the existence of an API in the Order Management service. The team should confirm this dependency can be met before starting work.
- This is a fundamental CRUD operation for catalog management and should be prioritized early in the development of vendor features.

## 11.4.0.0 Release Impact

This is a core feature for vendors to manage their catalogs. Its absence would be a significant gap in functionality.

