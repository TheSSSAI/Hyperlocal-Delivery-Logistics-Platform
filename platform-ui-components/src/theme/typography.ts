/**
 * Defines the application's typography scale and styles.
 * These tokens provide consistent font sizes, weights, and line heights
 * for different text elements across the platform.
 * Using 'rem' units for font sizes improves accessibility by respecting
 * the user's browser font size settings.
 */
export const typography = {
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Poppins, sans-serif',
    monospace: 'Menlo, monospace',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.6,
    heading: 1.2,
  },
  fontSizes: {
    // Using a type scale for consistency
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px (base)
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  styles: {
    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    bodyLarge: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '1.125rem',
      lineHeight: 1.6,
    },
    body: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    bodySmall: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
};

export type Typography = typeof typography;