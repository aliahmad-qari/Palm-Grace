/**
 * Accessibility Utilities for Palm & Grace
 * 
 * Centralized helpers for:
 * - Reduced motion preferences
 * - Focus management
 * - Keyboard navigation
 * - ARIA labels and semantics
 * - Color contrast compliance
 */

/**
 * CSS class for reduced motion support
 * Apply to elements that should respect prefers-reduced-motion
 */
export const reduceMotionClass = '@media (prefers-reduced-motion: reduce)';

/**
 * Check if user prefers reduced motion
 * Returns true if user has set prefers-reduced-motion: reduce
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Listen for changes to prefers-reduced-motion preference
 * @param callback - Function to call when preference changes
 * @returns Function to unsubscribe from changes
 */
export const onReducedMotionChange = (callback: (prefersReduced: boolean) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleChange = (e: MediaQueryListEvent) => callback(e.matches);
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
};

/**
 * Conditional animation duration based on prefers-reduced-motion
 * @param normalDuration - Duration in ms when motion is allowed
 * @param reducedDuration - Duration in ms when motion is reduced (typically 0)
 */
export const getAnimationDuration = (
  normalDuration: number,
  reducedDuration: number = 0
): number => {
  return prefersReducedMotion() ? reducedDuration : normalDuration;
};

/**
 * Accessible focus ring styling
 * Provides visible focus indicator for keyboard navigation
 */
export const focusRingClasses = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400';

/**
 * Skip to main content link styling
 * Should be positioned absolutely and visible on focus
 */
export const skipLinkClasses = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-2 focus:bg-amber-400 focus:text-stone-950 focus:font-bold';

/**
 * Screen reader only text (visually hidden but available to assistive tech)
 * Use for context that sighted users can infer from visual design
 */
export const srOnlyClasses = 'sr-only';

/**
 * Accessible button styling with focus and reduced motion support
 */
export const accessibleButtonClasses = `${focusRingClasses} transition-all`;

/**
 * ARIA labels for common patterns
 */
export const ariaLabels = {
  closeButton: 'Close dialog',
  openMenu: 'Open navigation menu',
  closeMenu: 'Close navigation menu',
  loadingSpinner: 'Loading',
  successMessage: 'Success message',
  errorMessage: 'Error message',
  warningMessage: 'Warning message',
  expandableSection: 'Toggle section',
  externalLink: 'Opens in new window',
};

/**
 * Color contrast ratio checker (basic implementation)
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
 * 
 * @param foreground - Hex color (e.g., '#000000')
 * @param background - Hex color (e.g., '#ffffff')
 * @returns Contrast ratio
 */
export const getContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG AA standard
 * @param foreground - Hex color
 * @param background - Hex color
 * @param isLargeText - If true, requires 3:1; if false, requires 4.5:1
 */
export const meetsWCAGAA = (foreground: string, background: string, isLargeText: boolean = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Check if contrast ratio meets WCAG AAA standard
 * @param foreground - Hex color
 * @param background - Hex color
 * @param isLargeText - If true, requires 4.5:1; if false, requires 7:1
 */
export const meetsWCAGAAA = (foreground: string, background: string, isLargeText: boolean = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Keyboard event helpers for common patterns
 */
export const keyboardEvents = {
  isEnter: (e: React.KeyboardEvent): boolean => e.key === 'Enter',
  isSpace: (e: React.KeyboardEvent): boolean => e.key === ' ',
  isEscape: (e: React.KeyboardEvent): boolean => e.key === 'Escape',
  isArrowUp: (e: React.KeyboardEvent): boolean => e.key === 'ArrowUp',
  isArrowDown: (e: React.KeyboardEvent): boolean => e.key === 'ArrowDown',
  isArrowLeft: (e: React.KeyboardEvent): boolean => e.key === 'ArrowLeft',
  isArrowRight: (e: React.KeyboardEvent): boolean => e.key === 'ArrowRight',
  isTab: (e: React.KeyboardEvent): boolean => e.key === 'Tab',
};

/**
 * Get computed style for reduced motion preference
 * Use in inline styles when Tailwind utilities aren't available
 */
export const getMotionStyle = (
  normalStyle: React.CSSProperties,
  reducedMotionStyle: React.CSSProperties = {}
): React.CSSProperties => {
  return prefersReducedMotion() ? reducedMotionStyle : normalStyle;
};

export default {
  prefersReducedMotion,
  onReducedMotionChange,
  getAnimationDuration,
  focusRingClasses,
  skipLinkClasses,
  srOnlyClasses,
  accessibleButtonClasses,
  ariaLabels,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  keyboardEvents,
  getMotionStyle,
};
