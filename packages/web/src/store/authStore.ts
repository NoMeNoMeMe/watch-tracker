import { create } from 'zustand';
import type { AuthResponse } from '../types';

interface AuthState {
  user: AuthResponse['user'] | null;
  userId: AuthResponse['user']['id'] | null;
  accessToken: AuthResponse['accessToken'] | null;
  isAuthenticated: boolean;
  handleAuthSuccess: (response: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userId: null,
  accessToken: null,
  isAuthenticated: false,
  handleAuthSuccess: (response: AuthResponse) => {
    // Optionally, persist the token in localStorage or cookies here
    set({ user: response.user, accessToken: response.accessToken, userId: response.user.id, isAuthenticated: true });
  },
  logout: () => {
     // Clear localStorage as well as the Zustand state
     localStorage.removeItem('accessToken');
     localStorage.removeItem('userId');
     localStorage.removeItem('user');
     set({
       user: null,
       accessToken: null,
       userId: null,
       isAuthenticated: false,
     });
   },
}));
