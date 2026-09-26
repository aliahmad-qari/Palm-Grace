'use client';

import type { Memorial, Tribute, MemorialMedia, AdminUser, DashboardSummary, TemplateType, PublicationStatus } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Type-safe API client for Palm & Grace backend
 * Handles HTTP-Only cookies automatically (no localStorage needed)
 * All requests include credentials for cookie transmission
 */

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  details?: string;
  [key: string]: any;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T & ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Include credentials to automatically send/receive HTTP-Only cookies
      credentials: 'include',
    });

    const body = await response.json();

    if (!response.ok) {
      // 401: Redirect to login (handled by middleware/layout)
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return {
          success: false,
          error: 'Unauthorized - redirecting to login',
          ...body,
        } as T & ApiResponse<T>;
      }

      return {
        success: false,
        error: body.error || `Request failed: ${response.status}`,
        details: body.details,
        ...body,
      } as T & ApiResponse<T>;
    }

    return {
      success: true,
      ...body,
    } as T & ApiResponse<T>;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    } as T & ApiResponse<T>;
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest<{ authenticated: boolean; admin: AdminUser }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    ),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  getSession: () =>
    apiRequest<{ authenticated: boolean; session: { user: AdminUser; role: string; activeAt: string } }>(
      '/auth/session'
    ),

  getMe: () =>
    apiRequest<{ authenticated: boolean; admin: AdminUser }>('/auth/me'),
};

/**
 * Memorial API - Public
 */
export const memorialsPublicAPI = {
  list: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<Memorial[]>(`/memorials${params}`);
  },

  getBySlug: (slug: string) =>
    apiRequest<Memorial>(`/memorials/${slug}`),

  submitTribute: (slug: string, visitorName: string, message: string) =>
    apiRequest<Tribute>(`/memorials/${slug}/tributes`, {
      method: 'POST',
      body: JSON.stringify({ visitorName, message }),
    }),
};

/**
 * Memorial API - Admin
 */
export const memorialsAdminAPI = {
  list: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<Memorial[]>(`/admin/memorials${params}`);
  },

  create: (data: Omit<Memorial, 'id' | 'createdAt' | 'updatedAt' | 'media' | 'tributes'>) =>
    apiRequest<Memorial>('/admin/memorials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: string) =>
    apiRequest<Memorial>(`/admin/memorials/${id}`),

  update: (id: string, data: Partial<Memorial>) =>
    apiRequest<Memorial>(`/admin/memorials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ id: string }>(`/admin/memorials/${id}`, {
      method: 'DELETE',
    }),

  generateQR: (id: string, format: 'svg' | 'png' = 'svg') =>
    fetch(`${API_URL}/admin/memorials/${id}/qr?format=${format}`, {
      credentials: 'include',
    }).then(res => res.blob()),
};

/**
 * Tribute API - Admin
 */
export const tributesAdminAPI = {
  list: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return apiRequest<Tribute[]>(`/admin/tributes${params}`);
  },

  approve: (id: string) =>
    apiRequest<Tribute>(`/admin/tributes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'APPROVED' }),
    }),

  reject: (id: string) =>
    apiRequest<Tribute>(`/admin/tributes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'REJECTED' }),
    }),

  delete: (id: string) =>
    apiRequest<{ id: string }>(`/admin/tributes/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Media API - Admin
 */
export const mediaAdminAPI = {
  // Get Cloudinary upload signature from backend
  getUploadSignature: (folder: string) =>
    apiRequest<{
      signature: string;
      timestamp: number;
      folder: string;
      cloudName: string;
      uploadPreset?: string;
    }>('/admin/media/signature', {
      method: 'POST',
      body: JSON.stringify({ folder }),
    }),

  // Save uploaded media to gallery
  saveMedia: (memorialId: string, url: string, cloudinaryPublicId: string | null = null, caption: string | null = null) =>
    apiRequest<MemorialMedia>('/admin/media', {
      method: 'POST',
      body: JSON.stringify({
        memorialId,
        url,
        cloudinaryPublicId,
        caption,
      }),
    }),

  // Reorder gallery items
  reorderMedia: (memorialId: string, items: { id: string; sortOrder: number }[]) =>
    apiRequest('/admin/media/reorder', {
      method: 'PUT',
      body: JSON.stringify({
        memorialId,
        items,
      }),
    }),

  // Delete media item
  deleteMedia: (id: string) =>
    apiRequest<{ id: string }>(`/admin/media/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * Dashboard API
 */
export const dashboardAPI = {
  getSummary: async (): Promise<DashboardSummary> => {
    const memorials = await memorialsAdminAPI.list();
    const tributes = await tributesAdminAPI.list();

    if (!memorials.success || !tributes.success) {
      return {
        total: 0,
        drafts: 0,
        published: 0,
        pendingTributes: 0,
      };
    }

    const totalMemorials = memorials.data?.length || 0;
    const draftMemorials = memorials.data?.filter(m => m.publicationStatus === 'DRAFT').length || 0;
    const publishedMemorials = memorials.data?.filter(m => m.publicationStatus === 'PUBLISHED').length || 0;
    const pendingTributes = tributes.data?.filter(t => t.status === 'PENDING').length || 0;

    return {
      total: totalMemorials,
      drafts: draftMemorials,
      published: publishedMemorials,
      pendingTributes,
    };
  },
};

/**
 * Health check
 */
export const healthAPI = {
  check: () =>
    apiRequest('/health'),
};

export default {
  auth: authAPI,
  memorials: memorialsAdminAPI,
  memorialsPublic: memorialsPublicAPI,
  tributes: tributesAdminAPI,
  media: mediaAdminAPI,
  dashboard: dashboardAPI,
  health: healthAPI,
};
