import 'styled-components';

export interface ColorShades {
  light: string;
  main: string;
  dark: string;
  contrastText: string;
}

export interface Colors {
  primary: ColorShades;
  secondary: ColorShades;
  error: ColorShades;
  warning: ColorShades;
  info: ColorShades;
  success: ColorShades;
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  common: {
    black: string;
    white: string;
  };
  grey: {
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };
}

export interface Spacing {
  space0: string; // 0px
  space1: string; // 4px
  space2: string; // 8px
  space3: string; // 12px
  space4: string; // 16px
  space5: string; // 20px
  space6: string; // 24px
  space7: string; // 28px
  space8: string; // 32px
  space10: string; // 40px
  space12: string; // 48px
  space16: string; // 64px
}

export interface TypographyVariant {
  fontSize: string;
  fontWeight: number;
  lineHeight: number | string;
  letterSpacing?: string;
}

export interface Typography {
  fontFamily: string;
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  h4: TypographyVariant;
  h5: TypographyVariant;
  h6: TypographyVariant;
  subtitle1: TypographyVariant;
  subtitle2: TypographyVariant;
  body1: TypographyVariant;
  body2: TypographyVariant;
  button: TypographyVariant;
  caption: TypographyVariant;
  overline: TypographyVariant;
}

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndex: {
    modal: number;
    tooltip: number;
  };
}

// Augment the DefaultTheme interface from styled-components
// This allows for type-safe access to theme properties in any styled component
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}