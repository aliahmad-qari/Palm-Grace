import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Mail, Phone } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';
import { publicContactEmail, publicContactPhoneDisplay, publicContactPhoneHref, publicContactWhatsAppHref } from '../../lib/publicContact.js';

export const OurStoryPage: React.FC = () => {
  const contactEmail = publicContactEmail;

  return (
    <PublicLayout>
      <section className="relative flex min-h-[64vh] items-center overflow-hidden bg-brand-primary px-4 py-20 text-brand-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/35 via-brand-primary to-brand-primary" />
        <div className="relative mx-auto w-full max-w-4xl space-y-7 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold-light">
            <Heart className="h-4 w-4" aria-hidden="true" /><span>Our Story</span>
          </div>
          <h1 className="font-serif text-4xl font-light leading-[1.08] text-white sm:text-6xl lg:text-7xl drop-shadow-lg">Our Story</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white font-medium sm:text-lg drop-shadow-md">Palm &amp; Grace began with a wish to keep the stories, photographs and voices of those we love together.</p>
        </div>
      </section>

      <section className="bg-brand-white px-4 py-20 text-brand-charcoal sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="max-w-3xl space-y-6 text-base leading-8 text-brand-charcoal sm:text-lg">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-secondary">Why Palm &amp; Grace exists</span>
            <h2 className="font-serif text-3xl leading-tight text-brand-primary sm:text-5xl">Honouring Lives. Preserving Legacies.</h2>
            <p>When someone we love dies, we often find ourselves looking for the things that bring them close again. A photograph we had forgotten. A recording of their voice. A story someone shares that makes us smile and say, “That was just like them.”</p>
            <p>Over time, those memories can become scattered. Photographs stay on different phones, stories go unwritten, and the younger members of a family may know a name without ever knowing much about the person behind it.</p>
            <p>Palm &amp; Grace began with a wish to keep those pieces together.</p>
            <p>We create digital memorials that give families a place to tell a loved one’s story in their own way. Alongside photographs and significant moments, there is room for the everyday things: what they enjoyed, how they made people feel, the sayings everyone remembers and the habits that were entirely their own.</p>
            <p>These details matter. They help children and grandchildren come to know someone they may never have met. They give friends a place to share what they remember. And they offer families somewhere to return when they want to spend a little time with those memories.</p>
            <p>We know that putting a life into words can be difficult. You may have a full album and no idea where to begin, or just one photograph and a few things you want people to know. We will listen, help you gather what matters and work with you to create a memorial that feels right for your loved one.</p>
            <p>There is no single way a memorial should look or sound. Some families choose scripture; others choose a favourite saying or words of their own. Some have many stories to share; others prefer something simple. Our role is to take care with what you entrust to us and keep the person you love at the heart of it.</p>
            <p>Whether your loss is recent or many years have passed, you are welcome to begin with a conversation.</p>
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
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"><a className="break-all text-brand-gold-light underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a><a href={publicContactPhoneHref} className="text-brand-gold-light underline underline-offset-4">{publicContactPhoneDisplay}</a><a href={publicContactWhatsAppHref} target="_blank" rel="noopener noreferrer" className="text-brand-gold-light underline underline-offset-4">WhatsApp</a></div>
          <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center">
            <Link to="/begin-a-memorial" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand-gold px-6 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-gold-light"><Heart className="h-4 w-4" aria-hidden="true" /> Begin a Memorial</Link>
            <a href={`mailto:${contactEmail}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-brand-gold/70 px-6 text-sm font-semibold text-brand-white transition-colors hover:bg-brand-white/10"><Mail className="h-4 w-4 text-brand-gold-light" aria-hidden="true" /> Contact Palm &amp; Grace</a>
            <a href={publicContactPhoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-brand-gold/70 px-6 text-sm font-semibold text-brand-white transition-colors hover:bg-brand-white/10"><Phone className="h-4 w-4 text-brand-gold-light" aria-hidden="true" /> Call Us</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
