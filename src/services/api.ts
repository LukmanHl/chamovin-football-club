import { CompanySettings, Player, TravelPackage, NewsArticle, Inquiry, AuditLog, OwnerProfile, GalleryItem } from '../types/index';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('chm_admin_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('chm_admin_token', token);
  } else {
    localStorage.removeItem('chm_admin_token');
  }
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  const contentType = res.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = data?.error || res.statusText || 'An error occurred';
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetchJson<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getCurrentUser: () => fetchJson<{ user: any }>('/auth/me'),

  logout: async () => {
    try {
      await fetchJson('/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchJson<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Settings
  getSettings: () => fetchJson<CompanySettings>('/settings'),
  updateSettings: (settings: Partial<CompanySettings>) =>
    fetchJson<CompanySettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),

  // Image Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetchJson<{ url: string; filename: string }>('/upload', {
      method: 'POST',
      body: formData
    });
  },

  // Players
  getPlayers: () => fetchJson<Player[]>('/players'),
  getPlayerById: (id: string) => fetchJson<Player>(`/players/${id}`),
  createPlayer: (player: Partial<Player>) =>
    fetchJson<Player>('/players', {
      method: 'POST',
      body: JSON.stringify(player)
    }),
  updatePlayer: (id: string, updates: Partial<Player>) =>
    fetchJson<Player>(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
  deletePlayer: (id: string) =>
    fetchJson<{ success: boolean }>(`/players/${id}`, {
      method: 'DELETE'
    }),

  // Travel Packages
  getPackages: () => fetchJson<TravelPackage[]>('/packages'),
  createPackage: (pkg: Partial<TravelPackage>) =>
    fetchJson<TravelPackage>('/packages', {
      method: 'POST',
      body: JSON.stringify(pkg)
    }),
  updatePackage: (id: string, updates: Partial<TravelPackage>) =>
    fetchJson<TravelPackage>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
  deletePackage: (id: string) =>
    fetchJson<{ success: boolean }>(`/packages/${id}`, {
      method: 'DELETE'
    }),

  // News
  getNews: () => fetchJson<NewsArticle[]>('/news'),
  getNewsById: (idOrSlug: string) => fetchJson<NewsArticle>(`/news/${idOrSlug}`),
  createNews: (article: Partial<NewsArticle>) =>
    fetchJson<NewsArticle>('/news', {
      method: 'POST',
      body: JSON.stringify(article)
    }),
  updateNews: (id: string, updates: Partial<NewsArticle>) =>
    fetchJson<NewsArticle>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),
  deleteNews: (id: string) =>
    fetchJson<{ success: boolean }>(`/news/${id}`, {
      method: 'DELETE'
    }),

  // Inquiries
  submitInquiry: (data: {
    type: Inquiry['type'];
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    countryOfResidence?: string;
    details: Record<string, any>;
    company_fax?: string; // honeypot
  }) =>
    fetchJson<{ success: boolean; refNumber: string; message: string }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getInquiries: (type?: string, status?: string) => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    return fetchJson<Inquiry[]>(`/inquiries?${params.toString()}`);
  },

  updateInquiry: (id: string, updates: {
    status?: Inquiry['status'];
    read?: boolean;
    followUpDate?: string | null;
    newNote?: { text: string; author: string };
  }) =>
    fetchJson<Inquiry>(`/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }),

  deleteInquiry: (id: string) =>
    fetchJson<{ success: boolean }>(`/inquiries/${id}`, {
      method: 'DELETE'
    }),

  // Admin stats & logs
  getAdminStats: () => fetchJson<any>('/admin/stats'),
  getAdminLogs: () => fetchJson<AuditLog[]>('/admin/logs'),

  // Supabase Data Sync
  syncSupabase: () =>
    fetchJson<{
      success: boolean;
      message: string;
      counts?: {
        players: number;
        packages: number;
        news: number;
        inquiries: number;
        settings: number;
        owner?: number;
        gallery?: number;
      };
    }>('/admin/supabase/sync', {
      method: 'POST'
    }),

  pullSupabase: () =>
    fetchJson<{
      success: boolean;
      message: string;
      counts?: {
        players: number;
        packages: number;
        news: number;
        gallery?: number;
      };
    }>('/admin/supabase/pull', {
      method: 'POST'
    }),

  // Owner Profile
  getOwnerProfile: () => fetchJson<OwnerProfile>('/owner-profile'),
  updateOwnerProfile: (data: Partial<OwnerProfile>) =>
    fetchJson<OwnerProfile>('/owner-profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Media Gallery
  getGallery: () => fetchJson<GalleryItem[]>('/gallery'),
  createGalleryItem: (data: Omit<GalleryItem, 'id'>) =>
    fetchJson<GalleryItem>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateGalleryItem: (id: string, data: Partial<GalleryItem>) =>
    fetchJson<GalleryItem>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteGalleryItem: (id: string) =>
    fetchJson<{ success: boolean }>(`/gallery/${id}`, {
      method: 'DELETE'
    })
};
