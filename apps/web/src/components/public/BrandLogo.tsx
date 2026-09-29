import React from 'react';
import horizontalLogo from '../../assets/brand/palm-grace-horizontal-header-transparent.png';
import verticalLogo from '../../assets/brand/palm-grace-vertical-header-transparent.png';
import emblemLogo from '../../assets/brand/palm-grace-emblem-transparent.png';

interface BrandLogoProps {
  variant?: 'vertical' | 'horizontal' | 'icon';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isHovered?: boolean;
}

const assets = {
  horizontal: horizontalLogo,
  vertical: verticalLogo,
  icon: emblemLogo,
};

const dimensions = {
  horizontal: {
    small: 'w-44 min-w-[176px]',
    medium: 'w-56 min-w-[224px]',
    large: 'w-72 min-w-[288px]',
  },
  vertical: {
    small: 'w-28 min-w-[112px]',
    medium: 'w-40 min-w-[160px]',
    large: 'w-52 min-w-[208px]',
  },
  icon: {
    small: 'w-[52px] min-w-[52px]',
    medium: 'w-16 min-w-16',
    large: 'w-20 min-w-20',
  },
};

/** Exact web derivatives of the supplied client logo masters. */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'medium',
  className = '',
}) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    data-logo-variant={variant}
  >
    <img
      src={assets[variant]}
      alt={variant === 'icon' ? 'Palm & Grace Memorials' : 'Palm & Grace Memorials - Honouring Lives. Preserving Legacies.'}
        className={`${dimensions[variant][size]} h-auto max-w-full object-contain`}
    />
  </span>
);
