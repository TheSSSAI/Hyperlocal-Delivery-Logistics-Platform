# @platform/ui-components

This library contains the shared, reusable UI components for the Hyperlocal Delivery Platform's frontends. It enforces a consistent Design System across all client applications (Customer, Rider, Vendor, Admin).

## Overview

The primary responsibility of this repository is to provide a single source of truth for UI elements. It promotes code reuse, accelerates UI development, and ensures that branding and user experience are uniform across both React (web) and React Native (mobile) applications.

This project is built with:
- **React & React Native** for cross-platform components
- **TypeScript** for type safety
- **Styled-components** for themeable, CSS-in-JS styling
- **Storybook** for component development and documentation
- **Jest & React Testing Library** for unit and integration testing
- **ESLint & Prettier** for code quality and consistency
- **GitHub Actions** for CI/CD

## Installation

This is a private package. Ensure you have access to the organization's package registry and your `.npmrc` file is configured correctly.

```bash
npm install @platform/ui-components
```

## Usage

Components are exported from the root of the package.

### Example: Button Component

```tsx
import { Button } from '@platform/ui-components';

const MyComponent = () => (
  <Button
    variant="primary"
    size="medium"
    onClick={() => alert('Button Clicked!')}
    isLoading={false}
    disabled={false}
  >
    Click Me
  </Button>
);
```

### Example: FormGroup with TextInput

```tsx
import { FormGroup, TextInput } from '@platform/ui-components';
import { useState } from 'react';

const MyForm = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue.length < 5) {
      setError('Name must be at least 5 characters long.');
    } else {
      setError(undefined);
    }
  };

  return (
    <FormGroup label="Your Name" error={error}>
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder="Enter your full name"
        hasError={!!error}
      />
    </FormGroup>
  );
};
```

## Development

To work on this component library locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/platform-ui-components.git
    cd platform-ui-components
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run Storybook:**
    This will start a local development server for viewing and developing components in isolation.
    ```bash
    npm run storybook
    ```
    Open `http://localhost:6006` in your browser.

### Scripts

-   `npm run build`: Compiles the library for production.
-   `npm run lint`: Lints the codebase for errors and style issues.
-   `npm test`: Runs all unit and integration tests with coverage reports.
-   `npm run storybook`: Starts the Storybook development server.

## Contribution

All contributions must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Code must pass all linting and testing checks before being merged.

1.  Create a new branch: `git checkout -b feat/new-component-name`
2.  Make your changes.
3.  Ensure all tests pass: `npm test`
4.  Commit your changes following the Conventional Commits guide.
5.  Push to your branch and open a pull request.