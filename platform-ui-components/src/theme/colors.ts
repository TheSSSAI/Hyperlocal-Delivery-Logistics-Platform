/**
 * Defines the application's color palette based on the Design System.
 * These tokens are used by the styled-components ThemeProvider to ensure
 * a consistent look and feel across all components.
 *
 * The color palette is designed with accessibility in mind, aiming for
 * WCAG 2.1 AA contrast ratios for common text-on-background combinations.
 */
export const colors = {
  // Primary color for main actions, links, and highlights.
  primary: {
    light: '#65A3FF',
    main: '#3366FF',
    dark: '#0033CC',
    contrastText: '#FFFFFF',
  },

  // Secondary color for complementary actions and information.
  secondary: {
    light: '#FFD699',
    main: '#FFA500',
    dark: '#CC8400',
    contrastText: '#FFFFFF',
  },

  // Danger color for destructive actions and error states.
  danger: {
    light: '#FF6B6B',
    main: '#E53E3E',
    dark: '#B83232',
    contrastText: '#FFFFFF',
  },

  // Warning color for alerts and actions that require caution.
  warning: {
    light: '#FFD166',
    main: '#F5A623',
    dark: '#C4851C',
    contrastText: '#1A202C', // Dark text for better contrast on yellow
  },

  // Success color for positive feedback and successful actions.
  success: {
    light: '#5EE0A0',
    main: '#00C853',
    dark: '#00A042',
    contrastText: '#FFFFFF',
  },

  // Background colors for different layers of the UI.
  background: {
    default: '#F7FAFC', // Main app background
    paper: '#FFFFFF', // Surfaces like cards, modals
    overlay: 'rgba(0, 0, 0, 0.5)', // Backdrop for modals
  },

  // Text colors for different levels of emphasis.
  text: {
    primary: '#1A202C', // Main text color
    secondary: '#4A5568', // Lighter text for subheadings, descriptions
    disabled: '#A0AEC0', // For disabled elements
    placeholder: '#A0AEC0',
    link: '#3366FF', // Link color
  },

  // Neutral color scale for borders, dividers, and UI elements.
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    grey50: '#F7FAFC',
    grey100: '#EDF2F7',
    grey200: '#E2E8F0',
    grey300: '#CBD5E0',
    grey400: '#A0AEC0',
    grey500: '#718096',
    grey600: '#4A5568',
    grey700: '#2D3748',
    grey800: '#1A202C',
    grey900: '#171923',
  },

  // Border color
  border: {
    default: '#E2E8F0',
    focus: '#3366FF',
    error: '#E53E3E',
  },
};

export type Colors = typeof colors;