import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Heart, Mail, Users } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';

export const OurStoryPage: React.FC = () => {
  const contactEmail = import.meta.env.VITE_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <PublicLayout>
      <section className="relative flex min-h-[64vh] items-center overflow-hidden bg-brand-primary px-4 py-20 text-brand-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/35 via-brand-primary to-brand-primary" />
        <div className="relative mx-auto w-full max-w-4xl space-y-7 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold-light">
            <Heart className="h-4 w-4" aria-hidden="true" /><span>Our Story</span>
          </div>
          <h1 className="font-serif text-4xl font-light leading-[1.08] text-white sm:text-6xl lg:text-7xl drop-shadow-lg">Our Story</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white font-medium sm:text-lg drop-shadow-md">Every life leaves something worth preserving. Palm &amp; Grace was created from a belief that remembrance deserves more than a fleeting place in time.</p>
        </div>
      </section>

      <section className="bg-brand-white px-4 py-20 text-brand-charcoal sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="max-w-3xl space-y-6">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-secondary">Why Palm &amp; Grace exists</span>
            <h2 className="font-serif text-3xl leading-tight text-brand-primary sm:text-5xl">Honouring Lives. Preserving Legacies.</h2>
            <p className="text-base leading-8 text-brand-charcoal font-medium">Photographs, stories, voices and memories are pieces of a life. When thoughtfully gathered, they become part of a legacy that families can return to and generations can come to know.</p>
            <p className="text-base leading-8 text-brand-charcoal font-medium">We create beautifully considered digital memorial spaces where those pieces can remain together, with dignity, warmth and care.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-brand-gold/35 bg-brand-gold-light/15 p-7">
              <BookOpen className="mb-5 h-6 w-6 text-brand-secondary" aria-hidden="true" />
              <h3 className="mb-3 font-serif text-xl text-brand-primary">A life, thoughtfully told</h3>
              <p className="text-sm leading-7 text-brand-charcoal font-medium">Stories, photographs, voices and memories are brought together in a personal, cinematic experience centred on one life.</p>
            </article>
            <article className="rounded-2xl border border-brand-gold/35 bg-brand-gold-light/15 p-7">
              <Heart className="mb-5 h-6 w-6 text-brand-secondary" aria-hidden="true" />
              <h3 className="mb-3 font-serif text-xl text-brand-primary">Guided with care</h3>
              <p className="text-sm leading-7 text-brand-charcoal font-medium">Families do not need to have everything prepared. We guide each step gently, making space for their pace and their memories.</p>
            </article>
            <article className="rounded-2xl border border-brand-gold/35 bg-brand-gold-light/15 p-7">
              <Users className="mb-5 h-6 w-6 text-brand-secondary" aria-hidden="true" />
              <h3 className="mb-3 font-serif text-xl text-brand-primary">Care that is shared</h3>
              <p className="text-sm leading-7 text-brand-charcoal font-medium">We work alongside selected funeral homes and bereavement professionals who share our commitment to serving families with dignity.</p>
            </article>
          </div>

          <div className="flex justify-center pt-2">
            <Link to="/our-care-partners" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-gold bg-brand-primary px-7 text-sm font-semibold text-brand-white shadow-[0_12px_30px_rgba(43,67,51,.16)] transition-all hover:-translate-y-0.5 hover:bg-brand-secondary">Discover Our Care Partners <ArrowRight className="h-4 w-4 text-brand-gold-light" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-brand-primary px-4 py-20 text-center text-brand-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-7">
          <h2 className="font-serif text-3xl sm:text-5xl drop-shadow-lg">Begin with a conversation.</h2>
          <p className="mx-auto max-w-xl text-base leading-7 text-white font-medium drop-shadow-md">Have a question, or simply need to speak with us? We would be pleased to hear from you.</p>
          {contactEmail ? <a className="inline-block break-all text-sm text-brand-gold-light underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a> : <p className="text-xs text-brand-white/65">Our public contact email will appear here once it has been confirmed.</p>}
          <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center">
            <Link to="/begin-a-memorial" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand-gold px-6 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-gold-light"><Heart className="h-4 w-4" aria-hidden="true" /> Begin a Memorial</Link>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-brand-gold/70 px-6 text-sm font-semibold text-brand-white transition-colors hover:bg-brand-white/10"><Mail className="h-4 w-4 text-brand-gold-light" aria-hidden="true" /> Contact Palm &amp; Grace</a>
            ) : (
              <span aria-disabled="true" className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-brand-white/25 px-6 text-sm font-semibold text-brand-white/55"><Mail className="h-4 w-4" aria-hidden="true" /> Contact Palm &amp; Grace</span>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
