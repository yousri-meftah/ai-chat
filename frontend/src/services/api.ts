import type { AIModel, SendMessageIn, SendMessageOut, ChatDetailOut, ChatSummaryOut } from '@/api/schemas/backend';

import type {
  LoginRequest,
  SignupRequest,
  GetProfileResponse,
} from '@/api/schemas/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      // Force redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}


export const authApi = {
  /**
   * Login user
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<{ access_token: string; token_type: string }> => {
    return apiRequest<{ access_token: string; token_type: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
  },

  /**
   * Sign up new user
   * POST /auth/signup
   */
  signup: async (
    data: SignupRequest
  ): Promise<{ access_token: string; token_type: string }> => {
    return apiRequest<{ access_token: string; token_type: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        preferred_lang: data.preferred_lang || 'en',
      }),
    });
  },


  logout: async (): Promise<void> => {
    await apiRequest<void>('/auth/logout', { method: 'POST' });
  },

  /**
   * Get current user profile
   * GET /auth/profile
   */
  getProfile: async (): Promise<GetProfileResponse> => {
  const raw = await apiRequest<GetProfileResponse>('/auth/profile');
  return raw;
},
};

// ============= Chat API =============

export const chatApi = {
  // GET /chats - list user chats
  listChats: async (): Promise<{ items: ChatSummaryOut[] }> => {
    return apiRequest<{ items: ChatSummaryOut[] }>('/chats');
  },

  // POST /chats - create chat (title optional)
  createChat: async (title?: string): Promise<{ id: number; title: string }> => {
    return apiRequest<{ id: number; title: string }>('/chats', {
      method: 'POST',
      body: JSON.stringify({ title: title ?? null }),
    });
  },

  // GET /chats/{chat_id} - get chat details
  getChat: async (chatId: string | number): Promise<ChatDetailOut> => {
    return apiRequest<ChatDetailOut>(`/chats/${chatId}`);
  },

  // DELETE /chats/{chat_id} - delete a chat by id
  deleteChat: async (chatId: string | number): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/chats/${chatId}`, {
      method: 'DELETE',
    });
  },

  // POST /messages/send - send message (chat_id optional -> creates chat)
  sendMessage: async (payload: SendMessageIn): Promise<SendMessageOut> => {
    return apiRequest<SendMessageOut>('/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        chat_id: payload.chat_id,
        content: payload.content,
        model: payload.model,
        lang: payload.lang,
      }),
    });
  },
};
