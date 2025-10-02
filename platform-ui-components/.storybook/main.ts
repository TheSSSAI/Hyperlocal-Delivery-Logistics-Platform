import type { StorybookConfig } from '@storybook/react-webpack5';

/**
 * Main Storybook configuration file.
 * This file configures the Storybook instance, including:
 * - Where to find component stories.
 * - Which addons to use for enhancing the development experience.
 * - The framework configuration (React with Webpack 5).
 * - Settings for automatic documentation generation.
 */
const config: StorybookConfig = {
  // Specifies the glob patterns to find all story files in the project.
  // This includes both .stories.tsx for components and .mdx for documentation.
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  // Configures the addons that enhance Storybook's functionality.
  addons: [
    '@storybook/addon-links', // Enables linking between stories.
    '@storybook/addon-essentials', // A curated set of essential addons (Actions, Backgrounds, Controls, etc.).
    '@storybook/addon-interactions', // Enables testing user interactions with a play function.
    '@storybook/addon-a11y', // Critical for enforcing accessibility standards as per REQ-1-086.
  ],

  // Specifies the framework and its options.
  // We are using React with Webpack 5 as the bundler.
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  // Configures how documentation is generated.
  // 'autodocs: 'tag'' automatically generates a documentation page for each component
  // that has the 'autodocs' tag in its story file.
  docs: {
    autodocs: 'tag',
  },
};

export default config;