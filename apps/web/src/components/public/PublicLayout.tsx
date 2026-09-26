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
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};
