import { TemplateType } from '../../types/index.js';

export interface MemorialTemplateDesign {
  id: TemplateType;
  label: string;
  tagline: string;
  badgeText: string;

  // Background and base structural styling
  rootBg: string;
  heroGradient: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;

  // Typography color hierarchies
  headingColor: string;
  bodyTextColor: string;
  mutedTextColor: string;

  // Accents and interactive tokens
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  badgeStyle: string;

  // Portrait styling
  portraitBorder: string;
  portraitGlow: string;
  portraitShape: string;
  heroSpacing: string;
  storyMeasure: string;
  headingStyle: string;

  // Section dividers & containers
  dividerColor: string;
  subtleBoxBg: string;
  subtleBoxBorder: string;

  // Form & button tokens
  inputBg: string;
  inputBorder: string;
  buttonPrimary: string;
  buttonSecondary: string;

  // Symbolic atmospheric motif
  motifType: 'structured' | 'flowing' | 'gentle';
}

export const TEMPLATE_DESIGNS: Record<TemplateType, MemorialTemplateDesign> = {
  MALE: {
    id: 'MALE',
    label: 'Classic Dignity',
    tagline: 'Structured composition, quiet contrast, and enduring dignity.',
    badgeText: 'Classic Dignity',

    rootBg: 'bg-slate-950',
    heroGradient: 'bg-radial from-slate-950 via-slate-900 to-slate-950',
    cardBg: 'bg-slate-900/85',
    cardBorder: 'border-slate-800/90',
    cardHoverBorder: 'hover:border-amber-400/40',

    headingColor: 'text-slate-100',
    bodyTextColor: 'text-slate-300',
    mutedTextColor: 'text-slate-400',

    accentColor: 'text-amber-300',
    accentBorder: 'border-amber-400/50',
    accentBg: 'bg-amber-400/10',
    badgeStyle: 'bg-slate-900/90 border-slate-700/80 text-amber-200',

    portraitBorder: 'border-slate-700/80',
    portraitGlow: 'shadow-[0_0_35px_rgba(30,41,59,0.5)]',
    portraitShape: 'rounded-md',
    heroSpacing: 'space-y-6',
    storyMeasure: 'max-w-3xl',
    headingStyle: 'tracking-tight',

    dividerColor: 'border-slate-800/80',
    subtleBoxBg: 'bg-slate-900/60',
    subtleBoxBorder: 'border-slate-800/80',

    inputBg: 'bg-slate-900',
    inputBorder: 'border-slate-700 focus:border-amber-400 focus:ring-amber-400',
    buttonPrimary: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold',
    buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',

    motifType: 'structured',
  },

  FEMALE: {
    id: 'FEMALE',
    label: 'Grace & Botanical',
    tagline: 'Flowing composition, generous spacing, and warm restraint.',
    badgeText: 'Grace & Botanical',

    rootBg: 'bg-stone-950',
    heroGradient: 'bg-radial from-stone-950 via-stone-900 to-stone-950',
    cardBg: 'bg-stone-900/85',
    cardBorder: 'border-stone-800/90',
    cardHoverBorder: 'hover:border-brand-gold/50',

    headingColor: 'text-stone-100',
    bodyTextColor: 'text-stone-300',
    mutedTextColor: 'text-stone-400',

    accentColor: 'text-brand-gold-light',
    accentBorder: 'border-brand-gold/50',
    accentBg: 'bg-brand-gold/10',
    badgeStyle: 'bg-stone-900/90 border-brand-gold/40 text-brand-gold-light',

    portraitBorder: 'border-stone-700/80',
    portraitGlow: 'shadow-[0_0_35px_rgba(41,37,36,0.6)]',
    portraitShape: 'rounded-[42%_42%_48%_48%]',
    heroSpacing: 'space-y-8',
    storyMeasure: 'max-w-2xl',
    headingStyle: 'tracking-normal italic',

    dividerColor: 'border-stone-800/80',
    subtleBoxBg: 'bg-stone-900/60',
    subtleBoxBorder: 'border-stone-800/80',

    inputBg: 'bg-stone-900',
    inputBorder: 'border-stone-700 focus:border-brand-gold focus:ring-brand-gold',
    buttonPrimary: 'bg-brand-gold hover:bg-brand-gold-light text-brand-primary font-bold',
    buttonSecondary: 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700',

    motifType: 'flowing',
  },

  CHILD: {
    id: 'CHILD',
    label: 'Gentle Remembrance',
    tagline: 'Restrained composition centred on personality, family photographs, and the love that remains.',
    badgeText: 'Gentle Remembrance',

    rootBg: 'bg-brand-primary',
    heroGradient: 'bg-gradient-to-b from-brand-secondary via-brand-primary to-brand-primary',
    cardBg: 'bg-brand-secondary/45',
    cardBorder: 'border-brand-gold/25',
    cardHoverBorder: 'hover:border-amber-200/40',

    headingColor: 'text-brand-white',
    bodyTextColor: 'text-brand-white/85',
    mutedTextColor: 'text-brand-gold-light/75',

    accentColor: 'text-amber-200',
    accentBorder: 'border-amber-200/50',
    accentBg: 'bg-amber-300/10',
    badgeStyle: 'bg-brand-primary/90 border-brand-gold/35 text-brand-gold-light',

    portraitBorder: 'border-brand-gold/45',
    portraitGlow: 'shadow-[0_18px_45px_rgba(0,0,0,0.25)]',
    portraitShape: 'rounded-3xl',
    heroSpacing: 'space-y-7',
    storyMeasure: 'max-w-2xl',
    headingStyle: 'tracking-normal',

    dividerColor: 'border-brand-gold/30',
    subtleBoxBg: 'bg-brand-secondary/30',
    subtleBoxBorder: 'border-brand-gold/20',

    inputBg: 'bg-brand-primary/80',
    inputBorder: 'border-brand-gold/35 focus:border-brand-gold focus:ring-brand-gold',
    buttonPrimary: 'bg-brand-gold hover:bg-brand-gold-light text-brand-primary font-bold',
    buttonSecondary: 'bg-brand-secondary hover:bg-brand-primary text-brand-white border border-brand-gold/25',

    motifType: 'gentle',
  },
};

const MEMORIAL_PALETTE: Omit<MemorialTemplateDesign, 'id' | 'label' | 'tagline' | 'badgeText' | 'motifType'> = {
  rootBg: 'bg-stone-950',
  heroGradient: 'bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950',
  cardBg: 'bg-stone-900/85',
  cardBorder: 'border-stone-700/80',
  cardHoverBorder: 'hover:border-amber-300/50',
  headingColor: 'text-stone-100',
  bodyTextColor: 'text-stone-300',
  mutedTextColor: 'text-stone-400',
  accentColor: 'text-amber-300',
  accentBorder: 'border-amber-400/50',
  accentBg: 'bg-amber-400/10',
  badgeStyle: 'bg-stone-900/90 border-stone-700/80 text-amber-200',
  portraitBorder: 'border-stone-700/80',
  portraitGlow: 'shadow-[0_0_35px_rgba(28,25,23,0.6)]',
  portraitShape: 'rounded-full',
  heroSpacing: 'space-y-6',
  storyMeasure: 'max-w-3xl',
  headingStyle: 'tracking-tight',
  dividerColor: 'border-stone-700/80',
  subtleBoxBg: 'bg-stone-900/60',
  subtleBoxBorder: 'border-stone-700/80',
  inputBg: 'bg-stone-900',
  inputBorder: 'border-stone-700 focus:border-amber-400 focus:ring-amber-400',
  buttonPrimary: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold',
  buttonSecondary: 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700',
};

/**
 * Resolves the visual template presentation for any memorial record.
 * Guarantees a valid, high-fidelity design theme without duplicating data logic.
 */
export function resolveMemorialTemplate(templateType?: TemplateType | null): MemorialTemplateDesign {
  const template = templateType && TEMPLATE_DESIGNS[templateType]
    ? TEMPLATE_DESIGNS[templateType]
    : TEMPLATE_DESIGNS.MALE;

  return { ...MEMORIAL_PALETTE, ...template };
}
