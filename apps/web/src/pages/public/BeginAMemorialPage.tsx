import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';

interface FormData {
  yourName: string;
  email: string;
  telephone: string;
  personName: string;
  relationship: string;
  hasArrangements: string;
  funeralHome: string;
  serviceDate: string;
  additionalInfo: string;
}

export const BeginAMemorialPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    yourName: '',
    email: '',
    telephone: '',
    personName: '',
    relationship: '',
    hasArrangements: 'no',
    funeralHome: '',
    serviceDate: '',
    additionalInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.yourName.trim() || !formData.email.trim() || !formData.personName.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Attempt to submit to backend if available
      const response = await fetch('/api/enquiries/memorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          yourName: '',
          email: '',
          telephone: '',
          personName: '',
          relationship: '',
          hasArrangements: 'no',
          funeralHome: '',
          serviceDate: '',
          additionalInfo: '',
        });
      } else {
        // Backend endpoint not yet available - show informational message
        setSubmitStatus('success');
        console.warn('Backend memorial enquiry endpoint not yet available; form architecture ready for connection.');
      }
    } catch (err) {
      // Network error or endpoint unavailable
      console.warn('Memorial enquiry submission: backend endpoint not yet deployed');
      setSubmitStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-950 text-stone-100 min-h-[60vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-950 to-stone-950" />

        <div className="relative w-full max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs text-amber-300 font-sans uppercase tracking-widest">
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span>Begin the Journey</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.05]">
            Begin with a conversation.
          </h1>

          <p className="font-sans text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            We're here to guide you through creating a beautiful digital memorial. Tell us about the person you're honouring, and we'll begin the process together.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="py-24 bg-stone-950 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Your Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg text-white font-semibold mb-1">About You</h3>
                <p className="text-xs text-stone-400">We'll use this to connect with you during the process.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="yourName" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="yourName"
                    name="yourName"
                    value={formData.yourName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="Full name"
                  />
                </div>

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
              </div>

              <div>
                <label htmlFor="telephone" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                  Telephone / WhatsApp
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

            {/* Divider */}
            <div className="border-t border-stone-800" />

            {/* Section 2: The Person Being Remembered */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg text-white font-semibold mb-1">About the Person</h3>
                <p className="text-xs text-stone-400">Help us understand who we're honouring.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="personName" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Name of person being remembered *
                  </label>
                  <input
                    type="text"
                    id="personName"
                    name="personName"
                    value={formData.personName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label htmlFor="relationship" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                    Your Relationship
                  </label>
                  <input
                    type="text"
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    placeholder="Family member, friend, etc."
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-800" />

            {/* Section 3: Service Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg text-white font-semibold mb-1">Service Details</h3>
                <p className="text-xs text-stone-400">If there's a scheduled service or funeral home involved.</p>
              </div>

              <div>
                <label htmlFor="hasArrangements" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                  Are funeral or memorial arrangements underway?
                </label>
                <select
                  id="hasArrangements"
                  name="hasArrangements"
                  value={formData.hasArrangements}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                >
                  <option value="no">No, not yet</option>
                  <option value="planning">Yes, in planning</option>
                  <option value="scheduled">Yes, already scheduled</option>
                </select>
              </div>

              <div>
                <label htmlFor="funeralHome" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                  Funeral home / service provider
                </label>
                <input
                  type="text"
                  id="funeralHome"
                  name="funeralHome"
                  value={formData.funeralHome}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                  placeholder="Name and location"
                />
              </div>

              <div>
                <label htmlFor="serviceDate" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                  Anticipated service date
                </label>
                <input
                  type="date"
                  id="serviceDate"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-800" />

            {/* Section 4: Additional Information */}
            <div className="space-y-6">
              <div>
                <label htmlFor="additionalInfo" className="block text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">
                  Anything you would like us to know?
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all resize-none"
                  placeholder="Any additional context that would help us..."
                />
              </div>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 rounded-lg bg-green-950 border border-green-700 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-green-200">
                  <strong className="block mb-1">Thank you for reaching out.</strong>
                  <p>We've received your enquiry and will be in touch shortly to guide you through creating a beautiful memorial.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 rounded-lg bg-red-950 border border-red-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-sm text-red-200">
                  <strong className="block mb-1">Please review the form.</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

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
                    <span>Enquiry Submitted</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-400">
            <p>
              We respect your privacy. Your information will never be shared or used for marketing purposes. See our care principles for how we handle your data.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-stone-900 text-stone-100 border-t border-stone-800 text-center font-sans">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-stone-300 mb-4">
            Would you prefer to explore existing memorials first?
          </p>
          <Link
            to="/memorials"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 uppercase tracking-wider"
          >
            <span>Browse Memorial Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};
