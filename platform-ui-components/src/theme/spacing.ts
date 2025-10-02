/**
 * Defines the application's spacing scale based on a 4px grid system.
 * These tokens are used for margins, paddings, and other layout-related styles
 * to ensure a consistent and harmonious design.
 * Using a scale promotes consistency and reduces magic numbers in the codebase.
 */
export const spacing = {
  space0: '0px',
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '20px',
  space6: '24px',
  space7: '28px',
  space8: '32px',
  space9: '36px',
  space10: '40px',
  space11: '44px',
  space12: '48px',
  space14: '56px',
  space16: '64px',
  space20: '80px',
  space24: '96px',
  space28: '112px',
  space32: '128px',
  space36: '144px',
  space40: '160px',
  space44: '176px',
  space48: '192px',
  space52: '208px',
  space56: '224px',
  space60: '240px',
  space64: '256px',
};

export type Spacing = typeof spacing;