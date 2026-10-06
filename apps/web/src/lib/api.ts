import {
  AdminUser,
  Memorial,
  Tribute,
  MemorialMedia,
  PublicationStatus,
  TemplateType,
  TributeStatus
} from '../types/index.js';
import { buildMemorialUrl } from './memorialUrl.js';

const TOKEN_KEY = 'palm_grace_admin_token';
let publicMemorialsCache: Promise<{ success: boolean; data?: Memorial[]; error?: string; [key: string]: any }> | null = null;
let publicMemorialsCacheExpiresAt = 0;

/**
 * Get the API base URL
 * - Development: Uses vite proxy (relative URLs like /api/...)
 * - Production: Uses environment variable VITE_API_URL or relative (for same-origin proxying)
 */
function getApiBaseUrl(): string {
  // Production uses the existing Vercel /api proxy from vercel.json. Keeping
  // browser requests same-origin avoids cross-origin preflight failures while
  // the API remains hosted on Render.
  if (import.meta.env.PROD) {
    return '';
  }

  // Local development may explicitly target a remote API when required.
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return '';
}

const API_BASE_URL = getApiBaseUrl();

export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

export function getCanonicalMemorialUrl(slug: string): string {
  const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL;
  const fallbackOrigin = import.meta.env.PROD
    ? 'https://palm-grace-web.vercel.app'
    : window.location.origin;

  return buildMemorialUrl(slug, configuredSiteUrl, fallbackOrigin);
}

export const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage unavailable
    }
  },
  remove: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage unavailable
    }
  },
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; [key: string]: any }> {
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const fullUrl = apiUrl(endpoint);
    const request = () => fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'include',
      });

    let res = await request();
    let rawBody = await res.text();

    // Render can return an empty gateway response while a sleeping service is
    // waking up. Retry auth once; login is safe to repeat and this avoids an
    // intermittent first-attempt failure without retrying arbitrary writes.
    const isAuthRequest = endpoint === '/api/auth/login' || endpoint === '/api/auth/session';
    const isTransientResponse = !rawBody.trim() || [502, 503, 504].includes(res.status);
    if (isAuthRequest && isTransientResponse) {
      res = await request();
      rawBody = await res.text();
    }

    let body: Record<string, any> = {};
    if (rawBody.trim()) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return {
          success: false,
          error: `The server returned an invalid response (${res.status}). Please try again shortly.`,
        };
      }
    }

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('/api/auth/login')) {
        tokenStorage.remove();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
      return {
        success: false,
        error: body.error || (
          !rawBody.trim()
            ? `The server is temporarily unavailable (${res.status}). Please try again shortly.`
            : `Request failed with status ${res.status}`
        ),
        details: body.details,
      };
    }

    if (!rawBody.trim()) {
      return {
        success: false,
        error: 'The server returned an empty response. Please try again shortly.',
      };
    }

    return {
      success: true,
      ...body,
    };
  } catch (err: any) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    return {
      success: false,
      error: err.message || 'Network communication error',
    };
  }
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; admin?: AdminUser; error?: string }> {
    const res = await apiRequest<{ token: string; admin: AdminUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.token) {
      tokenStorage.set(res.token);
    }
    return res as any;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      tokenStorage.remove();
    }
  },

  async getSession(): Promise<{ success: boolean; authenticated: boolean; user?: AdminUser }> {
    const token = tokenStorage.get();
    if (!token) return { success: false, authenticated: false };

    const res = await apiRequest<{ session: { user: AdminUser } }>('/api/auth/session');
    if (res.success && res.session?.user) {
      return { success: true, authenticated: true, user: res.session.user };
    }
    return { success: false, authenticated: false };
  },

  // Memorials (Admin)
  async getAdminMemorials(params: { search?: string; status?: PublicationStatus; template?: TemplateType } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.template) query.set('template', params.template);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<Memorial[]>(`/api/admin/memorials${queryString}`);
  },

  async getAdminMemorial(id: string) {
    return apiRequest<Memorial>(`/api/admin/memorials/${id}`);
  },

  async createMemorial(payload: Partial<Memorial>) {
    return apiRequest<Memorial>('/api/admin/memorials', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateMemorial(id: string, payload: Partial<Memorial>) {
    return apiRequest<Memorial>(`/api/admin/memorials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async publishMemorial(id: string, publish: boolean) {
    return apiRequest<Memorial>(`/api/admin/memorials/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ publish }),
    });
  },

  async updateMemorialStatus(id: string, publicationStatus: PublicationStatus) {
    return apiRequest<Memorial>(`/api/admin/memorials/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ publicationStatus }),
    });
  },

  async deleteMemorial(id: string) {
    return apiRequest(`/api/admin/memorials/${id}`, {
      method: 'DELETE',
    });
  },

  // Tributes (Admin)
  async getAdminTributes(status?: TributeStatus) {
    const query = status ? `?status=${status}` : '';
    return apiRequest<Tribute[]>(`/api/admin/tributes${query}`);
  },

  async approveTribute(id: string) {
    return apiRequest<Tribute>(`/api/admin/tributes/${id}/approve`, {
      method: 'PATCH',
    });
  },

  async rejectTribute(id: string) {
    return apiRequest<Tribute>(`/api/admin/tributes/${id}/reject`, {
      method: 'PATCH',
    });
  },

  async updateTribute(id: string, data: { visitorName?: string; relationship?: string | null; message?: string; contributorEmail?: string | null; status?: TributeStatus }) {
    return apiRequest<Tribute>(`/api/admin/tributes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteTribute(id: string) {
    return apiRequest(`/api/admin/tributes/${id}`, {
      method: 'DELETE',
    });
  },

  // Media (Admin)
  async getMediaConfig() {
    return apiRequest<{ cloudName: string; apiKey: string; folder: string; isConfigured: boolean }>(
      '/api/admin/media/config'
    );
  },

  async getUploadSignature() {
    return apiRequest<{
      timestamp: number;
      folder: string;
      apiKey: string;
      cloudName: string;
      signature: string;
    }>('/api/admin/media/sign-upload', {
      method: 'POST',
    });
  },

  async getMediaUploadSignature(mediaType: 'PHOTO' | 'VIDEO') {
    return apiRequest<{
      timestamp: number;
      folder: string;
      apiKey: string;
      cloudName: string;
      signature: string;
      resourceType?: 'image' | 'video';
    }>('/api/admin/media/sign-upload', {
      method: 'POST',
      body: JSON.stringify({ mediaType }),
    });
  },

  async addMedia(payload: {
    memorialId: string;
    url: string;
    cloudinaryPublicId?: string | null;
    caption?: string | null;
    sortOrder?: number;
    mediaType?: 'PHOTO' | 'VIDEO';
  }) {
    return apiRequest<MemorialMedia>('/api/admin/media', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async reorderMedia(memorialId: string, items: { id: string; sortOrder: number }[]) {
    return apiRequest('/api/admin/media/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ memorialId, items }),
    });
  },

  async deleteMedia(id: string) {
    return apiRequest(`/api/admin/media/${id}`, {
      method: 'DELETE',
    });
  },

  // Public Memorials
  async getPublicMemorials(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    if (search) return apiRequest<Memorial[]>(`/api/memorials${query}`);
    if (!publicMemorialsCache || Date.now() >= publicMemorialsCacheExpiresAt) {
      publicMemorialsCache = apiRequest<Memorial[]>('/api/memorials?summary=1');
      publicMemorialsCacheExpiresAt = Date.now() + 15_000;
      publicMemorialsCache.then(result => {
        if (!result.success) publicMemorialsCache = null;
      });
    }
    return publicMemorialsCache;
  },

  async getPublicMemorial(slug: string) {
    return apiRequest<Memorial>(`/api/memorials/${slug}`);
  },

  async submitTribute(slug: string, payload: { visitorName: string; message: string; relationship?: string | null; contributorEmail?: string | null }) {
    return apiRequest<{ id: string; status: string; message: string }>(`/api/memorials/${slug}/tributes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
