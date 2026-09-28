import React from 'react';

interface BrandLogoProps {
  variant?: 'vertical' | 'horizontal' | 'icon';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isHovered?: boolean;
}

/**
 * Palm & Grace Brand Logo Component
 * 
 * Uses the official brand system:
 * - Primary Dark Green (#2B4333) for text
 * - Brand Gold (#C6A565) for accent
 * - Cross symbol (☨) as emblem
 * 
 * Available variants:
 * - vertical: Logo + tagline stacked (for headers/footers)
 * - horizontal: Logo + tagline side-by-side (for wider spaces)
 * - icon: Just the emblem (for favicons, small spaces)
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'vertical',
  size = 'medium',
  className = '',
  isHovered = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-16 h-16';
      case 'medium':
      default:
        return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-2xl';
      case 'medium':
      default:
        return 'text-lg';
    }
  };

  const getTaglineSize = () => {
    switch (size) {
      case 'small':
        return 'text-[8px]';
      case 'large':
        return 'text-xs';
      case 'medium':
      default:
        return 'text-[10px]';
    }
  };

  // Icon variant: just the emblem
  if (variant === 'icon') {
    return (
      <div
        className={`${getSizeClasses()} rounded-full border-2 flex items-center justify-center transition-all ${
          isHovered
            ? 'bg-amber-50 border-amber-400 text-amber-700'
            : 'bg-stone-100 border-stone-300 text-stone-700'
        } ${className}`}
      >
        <span className={`font-serif font-bold ${getTextSize()}`}>☨</span>
      </div>
    );
  }

  // Vertical variant: emblem + name + tagline (stacked)
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        {/* Emblem */}
        <div
          className={`${getSizeClasses()} rounded-full border-2 flex items-center justify-center transition-all ${
            isHovered
              ? 'bg-amber-50 border-amber-400 text-amber-700'
              : 'bg-stone-100 border-stone-300 text-stone-700'
          }`}
        >
          <span className={`font-serif font-bold ${getTextSize()}`}>☨</span>
        </div>

        {/* Name */}
        <span
          className={`font-serif tracking-widest uppercase block transition-colors ${
            isHovered ? 'text-amber-700' : 'text-stone-900'
          } ${getTextSize()} font-semibold`}
        >
          PALM &amp; GRACE
        </span>

        {/* Tagline */}
        <span className={`uppercase tracking-widest text-amber-600 font-sans block ${getTaglineSize()}`}>
          The Digital Sanctuary
        </span>
      </div>
    );
  }

  // Horizontal variant: emblem + (name + tagline) side-by-side
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem */}
      <div
        className={`${getSizeClasses()} rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          isHovered
            ? 'bg-amber-50 border-amber-400 text-amber-700'
            : 'bg-stone-100 border-stone-300 text-stone-700'
        }`}
      >
        <span className={`font-serif font-bold ${getTextSize()}`}>☨</span>
      </div>

      {/* Text group */}
      <div className="flex flex-col">
        {/* Name */}
        <span
          className={`font-serif tracking-widest uppercase block transition-colors ${
            isHovered ? 'text-amber-700' : 'text-stone-900'
          } ${getTextSize()} font-semibold`}
        >
          PALM &amp; GRACE
        </span>

        {/* Tagline */}
        <span className={`uppercase tracking-widest text-amber-600 font-sans block -mt-1 ${getTaglineSize()}`}>
          The Digital Sanctuary
        </span>
      </div>
    </div>
  );
};
