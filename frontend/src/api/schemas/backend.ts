// ============== INPUT SCHEMAS (requests to backend)

export type Lang = 'en' | 'ar';
export type AIModel = 'gemini' | 'groq' | 'mistral';

export interface SendMessageIn {
  chat_id: number | null;
  content: string;
  model: AIModel;
  lang?: Lang;
}

export interface CreateChatIn {
  title?: string | null;
}

// ============== OUTPUT SCHEMAS : responses from backend

export interface SendMessageOut {
  chat_id: number;
  chat_title?: string;
  user_message: { // Still think this is useless , i will remove it later i guess 
    id: number;
    content: string;
    lang?: Lang;
  };
  assistant_message: {
    id: number;
    content: string;
    model: AIModel;
    lang?: Lang;
  };
}

export interface ChatSummaryOut {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
  model?: AIModel;
}

export interface ChatDetailOut {
  id: number;
  title?: string;
  model?: AIModel;
  messages: Array<{
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
    model?: AIModel;
    lang?: Lang;
  }>;
}


