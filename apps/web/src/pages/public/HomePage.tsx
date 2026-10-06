import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BookOpen, Heart, Images, MessageCircleHeart, QrCode, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';
import { api, apiUrl } from '../../lib/api.js';
import { calendarYear } from '../../lib/calendarDate.js';
import { Memorial } from '../../types/index.js';

export const HomePage: React.FC = () => {
  const [featuredMemorials, setFeaturedMemorials] = useState<Memorial[]>([]);

  useEffect(() => {
    api.getPublicMemorials().then((res) => {
      if (res.success && res.data) setFeaturedMemorials(res.data.slice(0, 3));
    }).catch(() => undefined);
  }, []);

  const year = calendarYear;

  return (
    <PublicLayout>
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-brand-primary px-5 pb-24 pt-32 text-brand-white sm:px-8 sm:pb-28 sm:pt-36 lg:px-12 lg:pt-40">
        <img src="/homepage image.png" alt="A peaceful coastline illuminated by warm evening light" className="absolute inset-0 h-full w-full scale-[1.015] object-cover object-center motion-safe:animate-[pg-hero-reveal_1.4s_ease-out_both]" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,28,21,.82)_0%,rgba(24,39,29,.58)_45%,rgba(24,39,29,.16)_76%),linear-gradient(0deg,rgba(12,22,16,.64)_0%,transparent_45%,rgba(12,22,16,.18)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1360px]">
          <div className="max-w-[760px] motion-safe:animate-[pg-content-rise_1s_.15s_ease-out_both]">
            <p className="mb-5 text-[.68rem] font-semibold uppercase tracking-[0.32em] text-brand-gold-light sm:text-xs">Extraordinary lives</p>
            <h1 className="max-w-4xl font-serif text-[clamp(2.8rem,6.2vw,6.25rem)] font-light leading-[.92] tracking-[-.03em] text-brand-white">Honouring Lives.<br />Preserving Legacies.</h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-brand-white/88 sm:text-base sm:leading-8">A beautifully considered digital memorial space where photographs, stories, voices and memories can remain together—with dignity, warmth and care.</p>
            <div className="mt-8 flex flex-col gap-3 min-[390px]:flex-row sm:mt-10">
              <Link to="/memorials" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-sm bg-[#334936] px-8 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(0,0,0,.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-brand-gold">Explore a Memorial <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/our-story" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-sm border border-brand-white/65 bg-brand-white/92 px-8 text-sm font-semibold text-brand-primary backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:bg-brand-white">Discover Palm &amp; Grace</Link>
            </div>
          </div>
        </div>
        <p className="absolute bottom-7 left-5 hidden max-w-[230px] border-l border-brand-gold-light/80 pl-4 text-[.58rem] font-semibold uppercase leading-4 tracking-[.24em] text-brand-white/75 sm:block lg:left-12">A lasting place<br />for the people who matter most.</p>
        <a href="#meaning" className="absolute bottom-6 right-5 flex flex-col items-center gap-2 text-[.55rem] font-semibold uppercase tracking-[.26em] text-brand-white/78 transition-colors hover:text-brand-gold-light sm:right-8 lg:right-12" aria-label="Scroll to explore the Palm and Grace story">
          <span className="grid h-9 w-6 place-items-center rounded-full border border-brand-white/55"><ArrowDown className="h-3.5 w-3.5 motion-safe:animate-bounce" /></span>
          <span>Scroll to explore</span>
        </a>
      </section>

      <section id="meaning" className="scroll-mt-24 bg-brand-white px-4 py-20 text-brand-charcoal sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-secondary">Every life leaves something worth preserving</p>
            <h2 className="font-serif text-4xl font-light leading-tight text-brand-primary sm:text-6xl">More than a place to remember.</h2>
            <p className="text-base leading-8 text-brand-charcoal/75 sm:text-lg">Photographs, stories, voices and memories are pieces of a life. When thoughtfully gathered, they become part of a legacy that families can return to and generations can come to know.</p>
            <p className="text-base leading-8 text-brand-charcoal/75">Each Palm &amp; Grace memorial is personal and cinematic—centred on one life, shaped by the people who knew them, and created with care.</p>
            <Link to="/our-story" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-primary underline decoration-brand-gold decoration-2 underline-offset-4">Our Story <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-brand-gold/50 bg-brand-primary/10 p-3 shadow-[0_24px_60px_rgba(43,67,51,.14)] backdrop-blur-md">
            <img src="/Golden Memories by the Lake.png" alt="A family photo album and flowers beside a peaceful lake at golden hour" className="h-[460px] w-full rounded-2xl object-cover" />
            <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-brand-white/25 bg-brand-primary/75 p-6 text-brand-white backdrop-blur-lg">
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
            <article className="rounded-2xl border border-brand-white/15 bg-brand-primary/80 p-7 shadow-[0_14px_40px_rgba(0,0,0,.16)] backdrop-blur-md"><BookOpen className="mb-5 h-6 w-6 text-brand-gold-light" /><h3 className="font-serif text-2xl text-brand-gold-light">Classic Dignity</h3><p className="mt-3 text-sm leading-7 text-brand-white/80">A refined, restrained atmosphere shaped around strength, character and enduring legacy.</p></article>
            <article className="rounded-2xl border border-brand-white/15 bg-brand-primary/80 p-7 shadow-[0_14px_40px_rgba(0,0,0,.16)] backdrop-blur-md"><Sparkles className="mb-5 h-6 w-6 text-brand-gold" /><h3 className="font-serif text-2xl text-brand-gold-light">Grace &amp; Warmth</h3><p className="mt-3 text-sm leading-7 text-brand-white/80">A gentle, elegant atmosphere celebrating connection, warmth and a life beautifully lived.</p></article>
            <article className="rounded-2xl border border-brand-white/15 bg-brand-primary/80 p-7 shadow-[0_14px_40px_rgba(0,0,0,.16)] backdrop-blur-md"><Heart className="mb-5 h-6 w-6 text-brand-gold-light" /><h3 className="font-serif text-2xl text-brand-gold-light">Gentle Wonder</h3><p className="mt-3 text-sm leading-7 text-brand-white/80">A tender, age-appropriate space centred on personality, wonder and the love that remains.</p></article>
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
              return <article key={title as string} className="rounded-2xl border border-brand-white/18 bg-brand-white/[.08] p-7 shadow-[0_16px_45px_rgba(0,0,0,.12)] backdrop-blur-lg"><CardIcon className="mb-6 h-7 w-7 text-brand-gold" /><h3 className="mb-3 font-serif text-2xl text-brand-gold-light">{title as string}</h3><p className="text-sm leading-7 text-brand-white/72">{copy as string}</p></article>;
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
                <Link key={memorial.id} to={`/memorial/${memorial.slug}`} className="group overflow-hidden rounded-2xl border border-brand-gold/35 bg-brand-gold-light/20 p-3 shadow-[0_14px_35px_rgba(43,67,51,.08)] transition-transform duration-300 hover:-translate-y-1">
                  <img src={memorial.mainPhotograph} alt={memorial.preferredDisplayName || memorial.fullName} className="h-72 w-full rounded-xl object-cover" style={{ objectPosition: `${memorial.portraitPositionX ?? 50}% ${memorial.portraitPositionY ?? 50}%` }} referrerPolicy="no-referrer" />
                  <div className="p-5"><p className="mb-2 text-xs uppercase tracking-[0.16em] text-brand-secondary">{year(memorial.dateOfBirth)}{year(memorial.dateOfBirth) && year(memorial.dateOfPassing) ? ' — ' : ''}{year(memorial.dateOfPassing)}</p><h3 className="font-serif text-2xl text-brand-primary group-hover:text-brand-secondary">{memorial.preferredDisplayName || memorial.fullName}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-brand-charcoal/65">{memorial.memorialLine || memorial.biography}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-brand-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-brand-gold/40 bg-brand-primary p-8 text-brand-white shadow-[0_18px_50px_rgba(43,67,51,.14)] sm:p-10">
            <Users className="mb-6 h-7 w-7 text-brand-gold" />
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-light">Our Care Partners</p>
            <h2 className="font-serif text-3xl font-light sm:text-4xl">Remembering well is often a shared act of care.</h2>
            <p className="mt-5 text-sm leading-7 text-brand-white/75">Palm &amp; Grace works alongside selected funeral homes and bereavement professionals who share our commitment to serving families with dignity, compassion and attention to detail.</p>
            <div className="mt-7 flex justify-center"><Link to="/our-care-partners" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-gold-light/65 px-6 text-sm font-semibold text-brand-gold-light transition-colors hover:bg-brand-white/10">Discover Our Care Partners <ArrowRight className="h-4 w-4" /></Link></div>
          </article>
          <article className="rounded-2xl border border-brand-gold/40 bg-brand-gold-light/20 p-8 text-brand-charcoal shadow-[0_18px_50px_rgba(43,67,51,.08)] sm:p-10">
            <ShieldCheck className="mb-6 h-7 w-7 text-brand-secondary" />
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">Shared with care</p>
            <h2 className="font-serif text-3xl font-light text-brand-primary sm:text-4xl">A respectful place for memories and tributes.</h2>
            <p className="mt-5 text-sm leading-7 text-brand-charcoal/70">Friends and family can share a memory, while thoughtful moderation helps each memorial remain a dignified and trusted space.</p>
            <Link to="/memorials" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">Explore Memorials <ArrowRight className="h-4 w-4" /></Link>
          </article>
        </div>
      </section>

      {featuredMemorials[0] && <section className="bg-brand-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div className="flex min-h-80 items-center justify-center border border-brand-gold/45 bg-brand-gold-light/20 p-8 shadow-[0_20px_55px_rgba(43,67,51,.1)]">
            <div className="w-full max-w-xs border border-brand-primary/15 bg-brand-primary p-6 text-center shadow-[0_16px_45px_rgba(43,67,51,.2)]">
              <div className="bg-white p-3">
                <img
                  src={apiUrl(`/api/memorials/${featuredMemorials[0].slug}/qr?format=png`)}
                  alt="Scan to open an example Palm & Grace memorial"
                  className="mx-auto aspect-square w-full max-w-48 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold-light">Scan to enter a memorial</p>
            </div>
          </div>
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary">A connection that remains</p>
            <h2 className="font-serif text-4xl font-light leading-tight text-brand-primary sm:text-6xl">From a service to the years that follow.</h2>
            <p className="mt-5 text-base leading-8 text-brand-charcoal/75 sm:text-lg">A discreet memorial QR code can connect printed service materials or a lasting place of remembrance to the stories, photographs and memories held online.</p>
            <p className="mt-4 text-sm leading-7 text-brand-charcoal/65">A simple scan keeps the memorial close, whether it appears on a service card, keepsake, plaque or family remembrance.</p>
          </div>
        </div>
      </section>}

      <section className="relative overflow-hidden bg-brand-primary px-4 py-20 text-center text-brand-white sm:px-6 sm:py-24 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(237,211,154,.18),transparent_45%)]" />
        <div className="relative mx-auto max-w-3xl border border-brand-gold/45 bg-brand-secondary/80 p-8 shadow-[0_24px_70px_rgba(0,0,0,.18)] backdrop-blur-lg sm:p-12">
          <Heart className="mx-auto mb-6 h-7 w-7 text-brand-gold" />
          <h2 className="font-serif text-4xl font-light sm:text-6xl">Begin with a conversation.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-brand-white/78">Every person, family and story is different. You do not need to have everything prepared. This is simply the beginning.</p>
          <Link to="/begin-a-memorial" className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded bg-brand-gold-light px-8 text-sm font-semibold text-brand-primary shadow-[0_10px_30px_rgba(255,185,0,.18)] transition-colors hover:bg-brand-gold-light">Begin a Memorial <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </PublicLayout>
  );
};
