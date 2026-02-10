import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  user_name: string;
  password: string;
  group?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  email: string;
  user_name: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/accounts/login/', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<void> {
    await api.post('/accounts/register/', data);
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  },

  isCreator(): boolean {
    return localStorage.getItem('user_role') === 'CREATOR';
  },
};
