import React from 'react';
import { PublicHeader } from './PublicHeader.js';
import { PublicFooter } from './PublicFooter.js';

interface PublicLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-stone-100 antialiased selection:bg-amber-300 selection:text-stone-900">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      <PublicHeader />
      <main id="main-content" className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};
