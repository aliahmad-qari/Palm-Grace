import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, AlertCircle, Loader2, Users, Briefcase } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';

interface PartnershipFormData {
  organisationName: string;
  contactPerson: string;
  role: string;
  email: string;
  telephone: string;
  location: string;
  enquiry: string;
  website: string;
}

export const OurCarePartnersPage: React.FC = () => {
  const [formData, setFormData] = useState<PartnershipFormData>({
    organisationName: '',
    contactPerson: '',
    role: '',
    email: '',
    telephone: '',
    location: '',
    enquiry: '',
    website: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.organisationName.trim() || !formData.contactPerson.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Attempt to submit to backend if available
      const response = await fetch('/api/enquiries/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({
          organisationName: '',
          contactPerson: '',
          role: '',
          email: '',
          telephone: '',
          location: '',
          enquiry: '',
          website: '',
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'We could not receive your enquiry just now. Please try again shortly.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage('We could not connect just now. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* HERO SECTION */}
      <section className="pg-enquiry-hero relative overflow-hidden bg-stone-950 text-stone-100 min-h-[60vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="pg-enquiry-hero-overlay absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-950 to-stone-950" />

        <div className="relative w-full max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs text-amber-300 font-sans uppercase tracking-widest">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>Our Care Partners</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.05]">
            Remembering well is often a shared act of care.
          </h1>

          <p className="font-sans text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Palm &amp; Grace works alongside selected funeral homes and bereavement professionals who share our commitment to serving families with dignity, compassion and attention to detail.
          </p>
        </div>
      </section>

      {/* PARTNERSHIP VALUE */}
      <section className="pg-partner-value py-24 bg-stone-900 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              Care that continues
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
              Thoughtful support around a funeral or memorial service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-semibold mb-1">A considered introduction</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Care Partners can introduce families to Palm &amp; Grace as part of the wider support surrounding a funeral or memorial service.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-semibold mb-1">A guided family process</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    We guide each family with warmth and clarity, so they do not need to have every story, photograph or detail prepared at the outset.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-semibold mb-1">Memories held together</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    Each personal memorial brings stories, photographs, voices and memories together with dignity and care.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-semibold mb-1">A shared commitment</h3>
                  <p className="text-sm text-stone-300 leading-relaxed">
                    We build relationships with professionals who share our commitment to compassionate service and thoughtful remembrance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM SECTION */}
      <section className="pg-enquiry-form py-24 bg-stone-950 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 mb-12">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight mb-3">
                Explore a Partnership
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                If your funeral home would like to explore becoming a Palm &amp; Grace Care Partner, we would be pleased to begin a conversation.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-8">
            <div className="absolute -left-[10000px]" aria-hidden="true">
              <label htmlFor="partner-website">Website</label>
              <input id="partner-website" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </div>
            {/* Organisation Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="organisationName" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Funeral Home / Organisation Name *
                  </label>
                  <input
                    type="text"
                    id="organisationName"
                    name="organisationName"
                    value={formData.organisationName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="Organisation name"
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="Director, Manager, etc."
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Location / Service Area
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="City, region, or service area"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-800" />

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Telephone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-800" />

            {/* Enquiry */}
            <div className="space-y-6">
              <div>
                <label htmlFor="enquiry" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                  What would you like to explore with Palm & Grace?
                </label>
                <textarea
                  id="enquiry"
                  name="enquiry"
                  value={formData.enquiry}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all resize-none"
                  placeholder="Tell us about your service offerings and how you see digital memorials fitting into your family care process..."
                />
              </div>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 rounded-lg bg-green-950 border border-green-700 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-green-200">
                  <strong className="block mb-1">Thank you for your interest.</strong>
                  <p>We've received your partnership enquiry and will be in touch to discuss opportunities for collaboration.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 rounded-lg bg-red-950 border border-red-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-red-200">
                  <strong className="block mb-1">{errorMessage === 'Please fill in all required fields.' ? 'Please review the form.' : 'We could not send your enquiry.'}</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <p className="text-xs leading-6 text-stone-300">Your enquiry is sent privately to Palm &amp; Grace and is not published. Read our <Link to="/privacy" className="text-brand-gold-light underline underline-offset-4">Privacy Notice</Link>.</p>
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="w-full min-h-12 px-6 bg-amber-400 hover:bg-amber-300 disabled:bg-stone-700 disabled:text-stone-400 text-stone-950 rounded-md shadow-md transition-all flex items-center justify-center gap-2 font-sans text-sm font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Conversation Started</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Explore a Partnership</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-400">
            <p>
              We respect your confidentiality. Your information will be used only to discuss potential partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pg-enquiry-cta py-16 bg-stone-900 text-stone-100 border-t border-stone-800 text-center font-sans">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-sm text-stone-300">
            Interested in providing Palm & Grace memorials to your families?
          </p>
          <Link
            to="/our-story"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 uppercase tracking-wider"
          >
            <span>Learn Our Story</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};
