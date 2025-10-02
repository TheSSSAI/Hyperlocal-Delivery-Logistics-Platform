import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/theme';

/**
 * Storybook preview configuration.
 * This file configures global settings, parameters, and decorators for all stories.
 *
 * - Decorators: Wraps every story with necessary providers. Here, we use ThemeProvider
 *   to inject the design system theme into our styled-components, ensuring they render
 *   correctly.
 * - Parameters: Configures global behavior for addons.
 *   - `actions`: Automatically creates mock callbacks for props matching the regex,
 *     allowing interaction logging in the 'Actions' tab.
 *   - `controls`: Configures how props are displayed and manipulated in the 'Controls' tab.
 *   - `backgrounds`: Defines a default set of background colors for stories.
 *   - `a11y`: Configures the accessibility addon to run checks on all stories.
 */
const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: theme.colors.background.default },
        { name: 'dark', value: theme.colors.background.inverse },
      ],
    },
    // Accessibility addon configuration
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default preview;