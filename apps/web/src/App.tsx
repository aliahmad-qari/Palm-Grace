import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { HomePage } from './pages/public/HomePage.js';
import { Loader2 } from 'lucide-react';

// Only the homepage loads eagerly; every other route is code-split so the
// first paint ships the smallest possible bundle.
const MemorialDirectoryPage = lazy(() => import('./pages/public/MemorialDirectoryPage.js').then(m => ({ default: m.MemorialDirectoryPage })));
const PublicMemorialViewPage = lazy(() => import('./pages/public/PublicMemorialViewPage.js').then(m => ({ default: m.PublicMemorialViewPage })));
const OurStoryPage = lazy(() => import('./pages/public/OurStoryPage.js').then(m => ({ default: m.OurStoryPage })));
const BeginAMemorialPage = lazy(() => import('./pages/public/BeginAMemorialPage.js').then(m => ({ default: m.BeginAMemorialPage })));
const OurCarePartnersPage = lazy(() => import('./pages/public/OurCarePartnersPage.js').then(m => ({ default: m.OurCarePartnersPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.js').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.js').then(m => ({ default: m.AdminDashboardPage })));
const AdminMemorialsListPage = lazy(() => import('./pages/admin/AdminMemorialsListPage.js').then(m => ({ default: m.AdminMemorialsListPage })));
const AdminMemorialEditorPage = lazy(() => import('./pages/admin/AdminMemorialEditorPage.js').then(m => ({ default: m.AdminMemorialEditorPage })));
const AdminTributesPage = lazy(() => import('./pages/admin/AdminTributesPage.js').then(m => ({ default: m.AdminTributesPage })));
const AdminMediaPage = lazy(() => import('./pages/admin/AdminMediaPage.js').then(m => ({ default: m.AdminMediaPage })));

const RouteFallback: React.FC = () => (
  <div className="min-h-screen bg-brand-primary flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
  </div>
);

/**
 * Route guard for administrator pages
 */
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-stone-200">
        <Loader2 className="w-8 h-8 text-amber-300 animate-spin mb-3" />
        <span className="font-serif text-lg tracking-wider text-stone-300">PALM &amp; GRACE</span>
        <span className="text-xs text-stone-500 font-mono mt-1">Verifying Administrator Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
          {/* Public Sanctuary Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/memorials" element={<MemorialDirectoryPage />} />
          <Route path="/memorial/:slug" element={<PublicMemorialViewPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/begin-a-memorial" element={<BeginAMemorialPage />} />
          <Route path="/our-care-partners" element={<OurCarePartnersPage />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Console */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/memorials"
            element={
              <RequireAdmin>
                <AdminMemorialsListPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/memorials/new"
            element={
              <RequireAdmin>
                <AdminMemorialEditorPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/memorials/:id/edit"
            element={
              <RequireAdmin>
                <AdminMemorialEditorPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/tributes"
            element={
              <RequireAdmin>
                <AdminTributesPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/media"
            element={
              <RequireAdmin>
                <AdminMediaPage />
              </RequireAdmin>
            }
          />

          {/* 404 Catch All -> Return to Sanctuary Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
