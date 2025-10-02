import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { Theme } from './theme.types';

/**
 * The complete theme object that aggregates all design tokens.
 * This object is intended to be used with the styled-components `ThemeProvider`.
 * It provides a single source of truth for colors, spacing, and typography
 * across all components in the library and consuming applications.
 *
 * Conforms to the `Theme` interface to ensure type safety.
 */
export const theme: Theme = {
  colors,
  spacing,
  typography,
};

// Re-exporting the Theme type for convenience in consuming applications
// and for typing styled-components' DefaultTheme.
export type { Theme } from './theme.types';