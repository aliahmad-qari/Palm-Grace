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
  motifType: 'classical' | 'botanical' | 'celestial';
}

export const TEMPLATE_DESIGNS: Record<TemplateType, MemorialTemplateDesign> = {
  MALE: {
    id: 'MALE',
    label: 'Classic Dignity',
    tagline: 'Stately architectural presence, deep slate elegance, and enduring reverence.',
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

    dividerColor: 'border-slate-800/80',
    subtleBoxBg: 'bg-slate-900/60',
    subtleBoxBorder: 'border-slate-800/80',

    inputBg: 'bg-slate-900',
    inputBorder: 'border-slate-700 focus:border-amber-400 focus:ring-amber-400',
    buttonPrimary: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold',
    buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',

    motifType: 'classical',
  },

  FEMALE: {
    id: 'FEMALE',
    label: 'Grace & Botanical',
    tagline: 'Warm champagne tones, poetic serenity, and delicate rose floral warmth.',
    badgeText: 'Grace & Botanical',

    rootBg: 'bg-stone-950',
    heroGradient: 'bg-radial from-stone-950 via-stone-900 to-stone-950',
    cardBg: 'bg-stone-900/85',
    cardBorder: 'border-stone-800/90',
    cardHoverBorder: 'hover:border-rose-300/40',

    headingColor: 'text-stone-100',
    bodyTextColor: 'text-stone-300',
    mutedTextColor: 'text-stone-400',

    accentColor: 'text-rose-200',
    accentBorder: 'border-rose-300/50',
    accentBg: 'bg-rose-400/10',
    badgeStyle: 'bg-stone-900/90 border-stone-700/80 text-rose-200',

    portraitBorder: 'border-stone-700/80',
    portraitGlow: 'shadow-[0_0_35px_rgba(41,37,36,0.6)]',

    dividerColor: 'border-stone-800/80',
    subtleBoxBg: 'bg-stone-900/60',
    subtleBoxBorder: 'border-stone-800/80',

    inputBg: 'bg-stone-900',
    inputBorder: 'border-stone-700 focus:border-rose-300 focus:ring-rose-300',
    buttonPrimary: 'bg-rose-300 hover:bg-rose-200 text-stone-950 font-bold',
    buttonSecondary: 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700',

    motifType: 'botanical',
  },

  CHILD: {
    id: 'CHILD',
    label: 'Gentle Celestial',
    tagline: 'Tender starlight undertones, gentle rounded warmth, and profound sensitivity.',
    badgeText: 'Gentle Celestial',

    rootBg: 'bg-sky-950',
    heroGradient: 'bg-radial from-sky-950 via-sky-900/80 to-sky-950',
    cardBg: 'bg-sky-900/60',
    cardBorder: 'border-sky-800/80',
    cardHoverBorder: 'hover:border-amber-200/40',

    headingColor: 'text-sky-50',
    bodyTextColor: 'text-sky-100',
    mutedTextColor: 'text-sky-300',

    accentColor: 'text-amber-200',
    accentBorder: 'border-amber-200/50',
    accentBg: 'bg-amber-300/10',
    badgeStyle: 'bg-sky-900/90 border-sky-700/80 text-amber-200',

    portraitBorder: 'border-sky-700/80',
    portraitGlow: 'shadow-[0_0_35px_rgba(12,74,110,0.5)]',

    dividerColor: 'border-sky-800/70',
    subtleBoxBg: 'bg-sky-900/40',
    subtleBoxBorder: 'border-sky-800/60',

    inputBg: 'bg-sky-950/80',
    inputBorder: 'border-sky-700 focus:border-amber-200 focus:ring-amber-200',
    buttonPrimary: 'bg-amber-300 hover:bg-amber-200 text-stone-950 font-bold',
    buttonSecondary: 'bg-sky-900 hover:bg-sky-850 text-sky-100 border border-sky-700',

    motifType: 'celestial',
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

  return { ...template, ...MEMORIAL_PALETTE };
}
