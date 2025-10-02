# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-009 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Adds a New Product to Catalog |
| As A User Story | As a registered and approved Vendor, I want to acc... |
| User Persona | Vendor (Store Owner/Manager) |
| Business Value | Enables vendors to populate their digital storefro... |
| Functional Area | Vendor-Facing Features |
| Story Theme | Vendor Inventory & Catalog Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful Product Creation (Happy Path)

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The vendor is logged into their dashboard and navigates to the 'Add Product' page

### 3.1.5 When

The vendor fills in all required fields (Name, Description, Price, Stock Quantity, Category) with valid data, uploads a valid image, and clicks 'Save Product'

### 3.1.6 Then

The system successfully creates the new product associated with the vendor's store, the uploaded image is stored in S3, a success notification ('Product added successfully') is displayed, and the vendor is redirected to their product list where the new item is visible at the top.

### 3.1.7 Validation Notes

Verify the product record exists in the database with the correct vendor_id. Verify the image is accessible via its URL from S3. Verify the product appears correctly in the vendor's product list UI.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Attempt to Save with Missing Required Fields

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

The vendor is on the 'Add Product' page

### 3.2.5 When

The vendor attempts to save the form without providing a 'Product Name', 'Price', or 'Stock Quantity'

### 3.2.6 Then

The form submission is blocked, and an inline validation error message (e.g., 'This field is required') appears next to each empty required field.

### 3.2.7 Validation Notes

Test each required field individually and in combination to ensure validation triggers correctly.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to Save with Invalid Data Types

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

The vendor is on the 'Add Product' page

### 3.3.5 When

The vendor enters non-numeric text in the 'Price' field or a non-integer in the 'Stock Quantity' field and attempts to save

### 3.3.6 Then

The form submission is blocked, and an inline validation error message appears (e.g., 'Price must be a valid number', 'Stock must be a whole number').

### 3.3.7 Validation Notes

Test with text, decimals in stock, and special characters.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to Save with Out-of-Range Numeric Values

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

The vendor is on the 'Add Product' page

### 3.4.5 When

The vendor enters a negative number for 'Price' or 'Stock Quantity' and attempts to save

### 3.4.6 Then

The form submission is blocked, and an inline validation error message appears (e.g., 'Price cannot be negative', 'Stock cannot be negative').

### 3.4.7 Validation Notes

Test with -1, -100, and other negative values.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Invalid Image Upload

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

The vendor is on the 'Add Product' page

### 3.5.5 When

The vendor attempts to upload a file that is not a supported image format (e.g., .pdf, .docx) or exceeds the maximum file size (e.g., 5MB)

### 3.5.6 Then

The system rejects the file upload and displays a clear error message to the user, such as 'Invalid file type. Please upload a JPG or PNG.' or 'File size exceeds the 5MB limit.'

### 3.5.7 Validation Notes

Verify the list of supported MIME types (image/jpeg, image/png) is enforced. Verify the file size limit is checked before server-side processing.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Create a Product with Zero Stock

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

The vendor is on the 'Add Product' page

### 3.6.5 When

The vendor fills all fields correctly but sets the 'Stock Quantity' to 0 and saves

### 3.6.6 Then

The product is created successfully, and its derived stock status is immediately set to 'Out of Stock' as per REQ-FUN-011.

### 3.6.7 Validation Notes

Verify the product is visible in the vendor's catalog but is marked as 'Out of Stock' and cannot be added to a customer's cart (covered in CUS-015).

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Add Product' form accessible from the vendor dashboard.
- Text input for 'Product Name'.
- Text area for 'Product Description'.
- Numeric input for 'Price' with currency symbol (₹) displayed.
- Numeric (integer) input for 'Stock Quantity'.
- Dropdown select for 'Category' (populated from vendor's categories).
- File upload component for 'Product Image' with a preview of the selected image.
- Primary 'Save Product' button.
- Secondary 'Cancel' button or link to return to the product list.

## 4.2.0 User Interactions

- Inline validation messages appear on blur or on submission attempt for invalid fields.
- The 'Save Product' button should be disabled until all required fields are filled.
- A loading indicator should be displayed while the image is uploading and the form is submitting.
- Upon successful submission, a toast notification or success message is displayed.

## 4.3.0 Display Requirements

- Clear labels for all form fields.
- Help text or tooltips indicating constraints (e.g., 'Max 5MB, JPG/PNG only' for image upload).

## 4.4.0 Accessibility Needs

- All form fields must have associated `<label>` tags for screen readers.
- Validation error messages must be programmatically associated with their respective inputs.
- The UI must be navigable using a keyboard.
- Complies with WCAG 2.1 Level AA standards as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VND-001

### 5.1.2 Rule Description

Product price must be a positive number greater than zero.

### 5.1.3 Enforcement Point

Server-side validation upon form submission.

### 5.1.4 Violation Handling

API returns a 400 Bad Request error with a clear message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VND-002

### 5.2.2 Rule Description

Stock quantity must be a non-negative integer (0 or greater).

### 5.2.3 Enforcement Point

Server-side validation upon form submission.

### 5.2.4 Violation Handling

API returns a 400 Bad Request error with a clear message.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-VND-003

### 5.3.2 Rule Description

A product must be assigned to a category.

### 5.3.3 Enforcement Point

Server-side validation upon form submission.

### 5.3.4 Violation Handling

API returns a 400 Bad Request error if category_id is missing or invalid.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-004

#### 6.1.1.2 Dependency Reason

Vendor must be able to log in to access the dashboard where this feature resides.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-008

#### 6.1.2.2 Dependency Reason

The 'Add Product' form requires a category selection dropdown. The ability to manage categories must exist first.

## 6.2.0.0 Technical Dependencies

- Backend API endpoint for product creation (e.g., POST /api/v1/vendor/products).
- AWS S3 bucket configured for public-read access for product images.
- Database schema for the 'products' table must be finalized and migrated.
- IAM role/policy allowing the backend service to write objects to the S3 bucket.

## 6.3.0.0 Data Dependencies

- Requires the authenticated vendor's ID to associate the product correctly.
- Requires a list of the vendor's existing categories to populate the selection dropdown.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- API response time for form submission (excluding image upload time) should be under 500ms (P95) as per REQ-FUN-001 precedent.
- Image uploads should be optimized; consider client-side resizing for very large images before upload.

## 7.2.0.0 Security

- All user-provided text (name, description) must be sanitized on the backend to prevent XSS attacks.
- The API endpoint must be protected and verify that the authenticated user is a Vendor and can only add products to their own store.
- Uploaded files must be scanned for malware, and only specific MIME types should be allowed.
- Follows OWASP Top 10 practices as per REQ-NFR-003.

## 7.3.0.0 Usability

- The form should be intuitive and require minimal instruction.
- Error feedback must be clear, immediate, and helpful.

## 7.4.0.0 Accessibility

- Must meet WCAG 2.1 Level AA as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The vendor web dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge) as per REQ-INT-001.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Handling multipart/form-data for file uploads on the backend.
- Integration with AWS S3 for image storage, including credentials management and URL generation.
- Potential need for an asynchronous image processing pipeline (e.g., using SQS and Lambda) to create thumbnails and optimize images without blocking the API response.
- Implementing robust, user-friendly validation on both client and server sides.

## 8.3.0.0 Technical Risks

- Misconfiguration of S3 bucket permissions could lead to security vulnerabilities.
- Handling large image uploads could impact server performance if not managed correctly.
- Ensuring transactional integrity when writing to the database and uploading to S3.

## 8.4.0.0 Integration Points

- AWS S3 for file storage.
- PostgreSQL database for storing product metadata.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Create a product with all valid data.
- Attempt to create a product with each required field missing.
- Attempt to create a product with invalid data types for price and stock.
- Test image upload with valid formats (JPG, PNG), invalid formats (PDF, TXT), and oversized files.
- Verify that a vendor cannot create a product for another vendor's store (API-level test).

## 9.3.0.0 Test Data Needs

- A test account with the 'Vendor' role.
- At least one pre-existing category for the test vendor.
- Sample image files: a valid JPG < 5MB, a valid PNG < 5MB, a file > 5MB, a non-image file (.txt).

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E testing as per REQ-NFR-006.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are met and have been manually verified.
- Unit and integration tests are written and achieve >= 80% code coverage as per REQ-NFR-006.
- End-to-end (E2E) tests for the happy path and key error conditions are passing.
- Code has been peer-reviewed and merged into the main branch.
- API documentation (OpenAPI) for the new endpoint is created/updated.
- Security checks (input sanitization, authorization) have been implemented and verified.
- The feature is deployed to the staging environment and passes QA validation.
- The feature meets all relevant non-functional requirements (performance, accessibility).

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for vendors and a blocker for most customer-facing functionality. It should be prioritized in an early sprint.
- Requires both frontend and backend development effort, which can be parallelized after the API contract is defined.

## 11.4.0.0 Release Impact

This feature is critical for the initial pilot launch. The platform cannot launch without the ability for vendors to add products.

