/**
 * Palm & Grace Brand System
 * Centralized design tokens and color palette
 */

export const brandColors = {
  // Primary Greens
  primaryGreen: '#2B4333',      // Deep forest green
  secondaryGreen: '#495C40',    // Muted sage green

  // Golds/Accents
  gold: '#C6A565',              // Warm gold
  lightGold: '#EDD39A',         // Light gold accent

  // Neutrals
  white: '#FFFFFF',
  charcoal: '#333333',
  black: '#000000',

  // Stone palette (existing Tailwind base)
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
    950: '#0f0e0d',
  },

  // Semantic
  accent: '#C6A565',            // Same as gold for consistency
  accentLight: '#EDD39A',
  background: '#0f0e0d',        // stone-950
  surface: '#1c1917',           // stone-900
  surfaceLight: '#292524',      // stone-800
  border: '#44403c',            // stone-700
  text: '#f5f5f4',              // stone-100
  textMuted: '#a8a29e',         // stone-400
};

export const brandTypography = {
  // Font families
  serif: '"Cormorant Garamond", serif',     // Headings, emotional copy
  sans: '"Plus Jakarta Sans", sans-serif',  // Body, UI
  mono: '"Courier New", monospace',         // Technical/codes

  // Scale (Tailwind-based)
  scales: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  // Letter spacing (for sophisticated look)
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',  // Used for headings
    widest: '0.1em',  // Used for labels/caps
  },
};

export const brandSpacing = {
  // Breathing room
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
};

export const brandMotion = {
  // Respect prefers-reduced-motion
  transition: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },

  // Reduced motion variants
  prefersReduced: '@media (prefers-reduced-motion: reduce)',
};

/**
 * CSS class utilities for common brand patterns
 * (Can be used inline or in component styles)
 */
export const brandClasses = {
  // Container width
  container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',

  // Hero section
  heroContainer: 'py-24 sm:py-32 lg:py-40',

  // Section spacing
  sectionSpacing: 'py-24 border-t border-stone-800',

  // Heading styles
  headingLarge: 'font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight',
  headingMedium: 'font-serif text-2xl sm:text-3xl text-white tracking-tight',
  headingSmall: 'font-serif text-lg sm:text-xl text-white font-semibold',

  // Body text
  bodyBase: 'font-sans text-base text-stone-200 leading-relaxed',
  bodySmall: 'font-sans text-sm text-stone-300 leading-relaxed',
  bodyXSmall: 'font-sans text-xs text-stone-400 leading-relaxed',

  // Labels/captions
  label: 'text-xs uppercase tracking-widest text-amber-300 font-semibold',

  // Button primary
  buttonPrimary: 'min-h-12 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-sans text-sm font-semibold',

  // Button secondary
  buttonSecondary: 'min-h-12 px-6 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-md transition-colors flex items-center justify-center gap-2 font-sans text-sm font-semibold',

  // Input field
  inputField: 'w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-sans text-sm transition-all',

  // Card
  card: 'bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-lg hover:border-amber-400/60 transition-all',
};
