// Types
export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Card {
  id: string;
  category: string;
  template: string;
  colorCount: number;
  duration?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface DrawnCard {
  id: string;
  card: Card;
  assignedColors: Color[];
  drawnAt: string;
  content: string;
}

export interface GameSession {
  id: string;
  colors: Color[];
  drawnCards: DrawnCard[];
  createdAt: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// API Base URL
const API_BASE = '/api';

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Hálózati hiba',
    };
  }
}

// Cards API
export const cardsApi = {
  getAll: () => fetchApi<{ cards: Card[]; total: number }>('/cards'),

  getCategories: () => fetchApi<Record<string, { name: string; emoji: string; color: string }>>('/cards/categories'),

  getRandom: (params?: { category?: string; colorCount?: number; excludeIds?: string[] }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.colorCount) searchParams.set('colorCount', params.colorCount.toString());
    if (params?.excludeIds?.length) searchParams.set('excludeIds', params.excludeIds.join(','));

    const query = searchParams.toString();
    return fetchApi<Card>(`/cards/random${query ? `?${query}` : ''}`);
  },

  draw: (colors: Color[], excludeIds?: string[], category?: string) =>
    fetchApi<DrawnCard>('/cards/draw', {
      method: 'POST',
      body: JSON.stringify({ colors, excludeIds, category }),
    }),

  getStats: () =>
    fetchApi<{
      total: number;
      byCategory: Record<string, number>;
      byDifficulty: Record<string, number>;
    }>('/cards/stats'),
};

// Sessions API
export const sessionsApi = {
  create: (colors: Color[]) =>
    fetchApi<GameSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ colors }),
    }),

  get: (id: string) => fetchApi<GameSession>(`/sessions/${id}`),

  updateColors: (id: string, colors: Color[]) =>
    fetchApi<GameSession>(`/sessions/${id}/colors`, {
      method: 'PUT',
      body: JSON.stringify({ colors }),
    }),

  addCard: (id: string, drawnCard: DrawnCard) =>
    fetchApi<GameSession>(`/sessions/${id}/cards`, {
      method: 'POST',
      body: JSON.stringify({ drawnCard }),
    }),

  getHistory: (id: string) =>
    fetchApi<{ cards: DrawnCard[]; total: number }>(`/sessions/${id}/history`),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/sessions/${id}`, {
      method: 'DELETE',
    }),

  end: (id: string) =>
    fetchApi<GameSession>(`/sessions/${id}/end`, {
      method: 'POST',
    }),
};

// Health check
export const healthApi = {
  check: () => fetchApi<{ status: string; timestamp: string }>('/health'),
};
