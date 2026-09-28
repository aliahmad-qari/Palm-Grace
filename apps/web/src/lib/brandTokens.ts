/**
 * Palm & Grace Brand Design Tokens
 * 
 * Centralized source of truth for all design system constants:
 * - Official brand colors (primary green, gold, neutrals)
 * - Typography scale and font families
 * - Spacing scale
 * - Motion/animation utilities
 * - Responsive breakpoints
 * - Semantic color tokens (success, error, warning, info)
 */

export const brandColors = {
  // Primary Brand Colors
  primary: {
    green: '#2B4333',       // Primary dark green
    darkGreen: '#1a2d23',   // Darker shade for depth
    lightGreen: '#3d5a45',  // Lighter shade for accents
  },
  
  // Accent & Gold
  accent: {
    gold: '#C6A565',        // Brand gold
    darkGold: '#a68451',    // Darker gold
    lightGold: '#d9b883',   // Lighter gold
  },
  
  // Neutrals
  neutral: {
    darkest: '#0f0f0f',     // Almost black
    dark: '#1f2937',        // Dark gray (stone-900 equiv)
    medium: '#6b7280',      // Medium gray
    light: '#f3f4f6',       // Light gray (stone-100 equiv)
    lightest: '#fafbfc',    // Almost white
  },
  
  // Semantic Colors
  semantic: {
    success: '#059669',     // Emerald
    error: '#dc2626',       // Red
    warning: '#f59e0b',     // Amber
    info: '#0ea5e9',        // Sky blue
  },
  
  // Stone Palette (for body, backgrounds)
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716b',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0f0f0f',
  },
  
  // Amber Palette (for accents)
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
};

export const typography = {
  // Font Families
  families: {
    serif: "'Cormorant Garamond', 'Georgia', serif",
    sans: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
  },
  
  // Font Sizes (px)
  sizes: {
    xs: '0.75rem',        // 12px
    sm: '0.875rem',       // 14px
    base: '1rem',         // 16px
    lg: '1.125rem',       // 18px
    xl: '1.25rem',        // 20px
    '2xl': '1.5rem',      // 24px
    '3xl': '1.875rem',    // 30px
    '4xl': '2.25rem',     // 36px
    '5xl': '3rem',        // 48px
  },
  
  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.15em',
  },
};

export const spacing = {
  // Spacing Scale (rem)
  xs: '0.25rem',        // 4px
  sm: '0.5rem',         // 8px
  md: '1rem',           // 16px
  lg: '1.5rem',         // 24px
  xl: '2rem',           // 32px
  '2xl': '2.5rem',      // 40px
  '3xl': '3rem',        // 48px
  '4xl': '4rem',        // 64px
};

export const breakpoints = {
  xs: '320px',
  sm: '375px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
};

export const motion = {
  // Animation Durations (ms)
  durations: {
    instant: '0ms',
    fastest: '50ms',
    faster: '100ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '1000ms',
  },
  
  // Easing Functions
  easing: {
    linear: 'cubic-bezier(0, 0, 1, 1)',
    ease: 'cubic-bezier(0.25, 0.25, 0.75, 0.75)',
    in: 'cubic-bezier(0.42, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.58, 1)',
    inOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
};

/**
 * Utility functions for consistent brand styling
 */

/**
 * Creates a CSS transition string using brand motion tokens
 * @param properties - CSS properties to animate (e.g., 'colors', 'all')
 * @param duration - Duration key from motion.durations
 * @param easing - Easing key from motion.easing
 */
export const createTransition = (
  properties: string = 'all',
  duration: keyof typeof motion.durations = 'base',
  easing: keyof typeof motion.easing = 'ease'
): string => {
  return `${properties} ${motion.durations[duration]} ${motion.easing[easing]}`;
};

/**
 * Creates a Tailwind-compatible class string for transitions
 * (Used when Tailwind utilities are unavailable)
 */
export const transitionClasses = {
  all: `transition-all ${createTransition('all', 'base', 'ease')}`,
  colors: `transition-colors ${createTransition('colors', 'base', 'ease')}`,
  opacity: `transition-opacity ${createTransition('opacity', 'base', 'ease')}`,
  transform: `transition-transform ${createTransition('transform', 'base', 'ease')}`,
};

/**
 * Applies opacity to a hex color (useful for secondary colors)
 * @param hex - Hex color code
 * @param opacity - Opacity value (0-1)
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Brand-aware color palette for common UI states
 */
export const colorPalette = {
  // Text colors
  text: {
    primary: brandColors.primary.green,       // Main text
    secondary: brandColors.neutral.medium,    // Secondary text
    inverted: brandColors.neutral.lightest,   // On dark bg
    muted: brandColors.neutral.light,         // Disabled/muted text
  },
  
  // Background colors
  background: {
    primary: brandColors.neutral.lightest,    // Main bg
    secondary: brandColors.stone[50],         // Alternate bg
    dark: brandColors.stone[900],             // Dark mode
    accent: brandColors.accent.lightGold,     // Accent bg
  },
  
  // Border colors
  border: {
    light: brandColors.stone[200],            // Light borders
    standard: brandColors.stone[300],         // Standard borders
    dark: brandColors.stone[600],             // Dark borders
    accent: brandColors.accent.gold,          // Accent borders
  },
  
  // Interaction states
  interaction: {
    hover: brandColors.accent.gold,           // Hover state
    active: brandColors.primary.green,        // Active/pressed state
    focus: brandColors.accent.darkGold,       // Focus ring
    disabled: brandColors.neutral.light,      // Disabled state
  },
};

/**
 * Reduced motion CSS media query helper
 * Use for animations that should respect user's motion preferences
 */
export const prefersReducedMotion = '@media (prefers-reduced-motion: reduce)';

/**
 * Dark mode media query helper
 * Use for dark mode aware styling
 */
export const prefersDarkMode = '@media (prefers-color-scheme: dark)';

/**
 * Semantic token for focus ring styling (accessibility)
 */
export const focusRingStyle = {
  outline: `2px solid ${brandColors.accent.gold}`,
  outlineOffset: '2px',
};

export default {
  brandColors,
  typography,
  spacing,
  breakpoints,
  motion,
  colorPalette,
  focusRingStyle,
};
