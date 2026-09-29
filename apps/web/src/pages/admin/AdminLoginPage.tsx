import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { BrandLogo } from '../../components/public/BrandLogo.js';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(import.meta.env.DEV ? 'admin@palmgrace.com' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'ChangeMeOnFirstLogin2026!' : '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(res.error || 'Invalid administrator credentials');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden antialiased">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex min-h-24 w-full max-w-[310px] items-center justify-center rounded-2xl bg-header-silver px-5 py-3 shadow-sm">
            <BrandLogo
              variant="horizontal"
              size="medium"
              className="w-full max-w-[260px] [&_img]:w-full [&_img]:min-w-0 [&_img]:rounded-none"
            />
          </div>
          <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">
            Administrator Sanctuary Access
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-stone-800/90 border border-stone-700/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xs">
          <h2 className="text-base font-medium text-stone-200 mb-6">
            Sign In to Manage Memorials
          </h2>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@palmgrace.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-900/80 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-900/80 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-2.5 px-4 bg-action-gold hover:bg-brand-gold-light text-stone-950 font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {import.meta.env.DEV && <div className="mt-6 pt-4 border-t border-stone-700/60 text-center"><p className="text-[11px] text-stone-400">Local development credentials are pre-filled for evaluation.</p></div>}
        </div>
      </div>
    </div>
  );
};
