import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Heart, Images, MessageCircleHeart, QrCode, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';
import { api } from '../../lib/api.js';
import { Memorial } from '../../types/index.js';

export const HomePage: React.FC = () => {
  const [featuredMemorials, setFeaturedMemorials] = useState<Memorial[]>([]);

  useEffect(() => {
    api.getPublicMemorials().then((res) => {
      if (res.success && res.data) setFeaturedMemorials(res.data.slice(0, 3));
    }).catch(() => undefined);
  }, []);

  const year = (value?: string | null) => value ? new Date(value).getFullYear() : null;

  return (
    <PublicLayout>
      <section className="relative flex min-h-[calc(100vh-84px)] items-center overflow-hidden bg-brand-primary px-4 py-20 text-brand-white sm:px-6 lg:px-8">
        <img src={featuredMemorials[0]?.mainPhotograph || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85'} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,45,33,.96)_0%,rgba(43,67,51,.88)_48%,rgba(43,67,51,.45)_100%)]" />
        <div className="absolute -right-28 top-16 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-3xl border border-brand-white/20 bg-brand-primary/35 p-7 shadow-[0_24px_70px_rgba(0,0,0,.24)] backdrop-blur-md sm:p-10 lg:p-14">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold-light">Palm &amp; Grace Memorials</p>
            <h1 className="font-serif text-5xl font-light leading-[1.02] text-brand-white sm:text-6xl lg:text-7xl">Honouring Lives.<br />Preserving Legacies.</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-brand-white/85 sm:text-lg">A beautifully considered digital memorial space where photographs, stories, voices and memories can remain together—with dignity, warmth and care.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/memorials" className="inline-flex min-h-12 items-center justify-center gap-2 bg-action-gold px-7 text-sm font-semibold text-brand-primary shadow-[0_10px_30px_rgba(255,185,0,.28)] transition-colors hover:bg-brand-gold-light">Explore a Memorial <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/our-story" className="inline-flex min-h-12 items-center justify-center gap-2 border border-brand-white/35 bg-brand-white/10 px-7 text-sm font-semibold text-brand-white backdrop-blur-lg transition-colors hover:bg-brand-white/20">Discover Palm &amp; Grace</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-white px-4 py-20 text-brand-charcoal sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">Every life leaves something worth preserving</p>
            <h2 className="font-serif text-4xl font-light leading-tight text-brand-primary sm:text-6xl">More than a place to remember.</h2>
            <p className="text-base leading-8 text-brand-charcoal/75 sm:text-lg">Photographs, stories, voices and memories are pieces of a life. When thoughtfully gathered, they become part of a legacy that families can return to and generations can come to know.</p>
            <p className="text-base leading-8 text-brand-charcoal/75">Each Palm &amp; Grace memorial is personal and cinematic—centred on one life, shaped by the people who knew them, and created with care.</p>
            <Link to="/our-story" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-primary underline decoration-brand-gold decoration-2 underline-offset-4">Our Story <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative border border-brand-gold/50 bg-brand-primary/10 p-3 shadow-[0_24px_60px_rgba(43,67,51,.14)] backdrop-blur-md">
            <img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85" alt="Leaves illuminated by gentle natural light" className="h-[460px] w-full object-cover" />
            <div className="absolute inset-x-8 bottom-8 border border-brand-white/25 bg-brand-primary/75 p-6 text-brand-white backdrop-blur-lg">
              <p className="font-serif text-2xl leading-snug">A life held in story, image, voice and memory.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-secondary px-4 py-20 text-brand-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-light">One life. One memorial.</p>
            <h2 className="font-serif text-4xl font-light text-brand-white sm:text-6xl">Every memorial should feel personal.</h2>
            <p className="mt-5 text-base leading-8 text-brand-white/80">Thoughtful visual directions provide a gentle foundation. The story, photography and personality of the person being remembered make each space entirely their own.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <article className="border border-brand-white/15 bg-brand-primary/80 p-7 shadow-[0_14px_40px_rgba(0,0,0,.16)] backdrop-blur-md"><BookOpen className="mb-5 h-6 w-6 text-brand-gold-light" /><h3 className="font-serif text-2xl text-brand-gold-light">Classic Dignity</h3><p className="mt-3 text-sm leading-7 text-brand-white/80">A refined, restrained atmosphere shaped around strength, character and enduring legacy.</p></article>
            <article className="border border-brand-white/15 bg-brand-primary/80 p-7 shadow-[0_14px_40px_rgba(0,0,0,.16)] backdrop-blur-md"><Sparkles className="mb-5 h-6 w-6 text-brand-gold" /><h3 className="font-serif text-2xl text-brand-gold-light">Grace &amp; Warmth</h3><p className="mt-3 text-sm leading-7 text-brand-white/80">A gentle, elegant atmosphere celebrating connection, warmth and a life beautifully lived.</p></article>
            <article className="border border-brand-white/15 bg-brand-primary/80 p-7 shadow-[0_14px_40px_rgba(0,0,0,.16)] backdrop-blur-md"><Heart className="mb-5 h-6 w-6 text-brand-gold-light" /><h3 className="font-serif text-2xl text-brand-gold-light">Gentle Wonder</h3><p className="mt-3 text-sm leading-7 text-brand-white/80">A tender, age-appropriate space centred on personality, wonder and the love that remains.</p></article>
          </div>
        </div>
      </section>

      <section className="bg-brand-primary px-4 py-20 text-brand-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-light">Created with care</p>
            <h2 className="font-serif text-4xl font-light sm:text-6xl">A guided and deeply personal experience.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [BookOpen, 'Their story, thoughtfully told', 'Life stories and meaningful details are brought together in a space that feels unmistakably personal.'],
              [Images, 'Memories held together', 'Photographs, video and voices remain alongside the words and moments that made a life unique.'],
              [MessageCircleHeart, 'Guided at every step', 'Families do not need to have everything prepared. We begin with a conversation and guide what comes next.'],
            ].map(([Icon, title, copy]) => {
              const CardIcon = Icon as typeof BookOpen;
              return <article key={title as string} className="border border-brand-white/18 bg-brand-white/[.08] p-7 shadow-[0_16px_45px_rgba(0,0,0,.12)] backdrop-blur-lg"><CardIcon className="mb-6 h-7 w-7 text-brand-gold" /><h3 className="mb-3 font-serif text-2xl text-brand-gold-light">{title as string}</h3><p className="text-sm leading-7 text-brand-white/72">{copy as string}</p></article>;
            })}
          </div>
        </div>
      </section>

      {featuredMemorials.length > 0 && (
        <section className="bg-brand-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">Lives remembered</p><h2 className="font-serif text-4xl text-brand-primary sm:text-5xl">Explore a Memorial</h2></div>
              <Link to="/memorials" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">View all memorials <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredMemorials.map((memorial) => (
                <Link key={memorial.id} to={`/memorial/${memorial.slug}`} className="group border border-brand-gold/35 bg-brand-gold-light/20 p-3 transition-transform duration-300 hover:-translate-y-1">
                  <img src={memorial.mainPhotograph} alt={memorial.preferredDisplayName || memorial.fullName} className="h-72 w-full object-cover" referrerPolicy="no-referrer" />
                  <div className="p-5"><p className="mb-2 text-xs uppercase tracking-[0.16em] text-brand-secondary">{year(memorial.dateOfBirth)}{year(memorial.dateOfBirth) && year(memorial.dateOfPassing) ? ' — ' : ''}{year(memorial.dateOfPassing)}</p><h3 className="font-serif text-2xl text-brand-primary group-hover:text-brand-secondary">{memorial.preferredDisplayName || memorial.fullName}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-brand-charcoal/65">{memorial.memorialLine || memorial.biography}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-brand-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <article className="border border-brand-gold/40 bg-brand-primary p-8 text-brand-white shadow-[0_18px_50px_rgba(43,67,51,.14)] sm:p-10">
            <Users className="mb-6 h-7 w-7 text-brand-gold" />
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-light">Our Care Partners</p>
            <h2 className="font-serif text-3xl font-light sm:text-4xl">Remembering well is often a shared act of care.</h2>
            <p className="mt-5 text-sm leading-7 text-brand-white/75">Palm &amp; Grace works alongside selected funeral homes and bereavement professionals who share our commitment to serving families with dignity, compassion and attention to detail.</p>
            <Link to="/our-care-partners" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold-light">Discover Our Care Partners <ArrowRight className="h-4 w-4" /></Link>
          </article>
          <article className="border border-brand-gold/40 bg-brand-gold-light/20 p-8 text-brand-charcoal shadow-[0_18px_50px_rgba(43,67,51,.08)] sm:p-10">
            <ShieldCheck className="mb-6 h-7 w-7 text-brand-secondary" />
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">Shared with care</p>
            <h2 className="font-serif text-3xl font-light text-brand-primary sm:text-4xl">A respectful place for memories and tributes.</h2>
            <p className="mt-5 text-sm leading-7 text-brand-charcoal/70">Friends and family can share a memory, while thoughtful moderation helps each memorial remain a dignified and trusted space.</p>
            <Link to="/memorials" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">Explore Memorials <ArrowRight className="h-4 w-4" /></Link>
          </article>
        </div>
      </section>

      <section className="bg-brand-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div className="flex min-h-72 items-center justify-center border border-brand-gold/50 bg-brand-gold-light/25 backdrop-blur-md">
            <div className="flex h-40 w-40 items-center justify-center border border-brand-gold/60 bg-brand-primary shadow-[0_16px_45px_rgba(43,67,51,.18)]"><QrCode className="h-24 w-24 text-brand-gold-light" /></div>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary">A connection that remains</p>
            <h2 className="font-serif text-4xl font-light text-brand-primary sm:text-6xl">From a service to the years that follow.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-charcoal font-medium">A discreet memorial QR code can connect printed service materials or a lasting place of remembrance to the stories, photographs and memories held online.</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-primary px-4 py-20 text-center text-brand-white sm:px-6 sm:py-24 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(237,211,154,.18),transparent_45%)]" />
        <div className="relative mx-auto max-w-3xl border border-brand-gold/45 bg-brand-secondary/80 p-8 shadow-[0_24px_70px_rgba(0,0,0,.18)] backdrop-blur-lg sm:p-12">
          <Heart className="mx-auto mb-6 h-7 w-7 text-brand-gold" />
          <h2 className="font-serif text-4xl font-light sm:text-6xl">Begin with a conversation.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-brand-white/78">Every person, family and story is different. You do not need to have everything prepared. This is simply the beginning.</p>
          <Link to="/begin-a-memorial" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-action-gold px-7 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-gold-light">Begin a Memorial <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </PublicLayout>
  );
};
