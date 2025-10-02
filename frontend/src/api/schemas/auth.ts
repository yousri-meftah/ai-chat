
export interface User {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  aiSummary?: string;
  stats?: UserStats;
}

export interface UserStats {
  totalChats: number;
  messagesExchanged: number;
  favoriteModel: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  preferred_lang: 'en' | 'ar';
}

export interface UpdateProfileRequest {
  userId: string;
  name?: string;
  email?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}


export interface GetProfileResponse {
  user: {
    name: string;
    email: string;
    member_since: string; 
  };
  stats: {
    total_chats: number; 
    total_messages: number; 
    favorite_model: string; 
  };
  summary: string;
}
