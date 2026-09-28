import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { HomePage } from './pages/public/HomePage.js';
import { MemorialDirectoryPage } from './pages/public/MemorialDirectoryPage.js';
import { PublicMemorialViewPage } from './pages/public/PublicMemorialViewPage.js';
import { OurStoryPage } from './pages/public/OurStoryPage.js';
import { BeginAMemorialPage } from './pages/public/BeginAMemorialPage.js';
import { OurCarePartnersPage } from './pages/public/OurCarePartnersPage.js';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminMemorialsListPage } from './pages/admin/AdminMemorialsListPage.js';
import { AdminMemorialEditorPage } from './pages/admin/AdminMemorialEditorPage.js';
import { AdminTributesPage } from './pages/admin/AdminTributesPage.js';
import { AdminMediaPage } from './pages/admin/AdminMediaPage.js';
import { Loader2 } from 'lucide-react';

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
      </BrowserRouter>
    </AuthProvider>
  );
}
