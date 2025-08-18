import { useState, useEffect } from 'react';
import type { User, AuthResponse } from '../types';
import { useAuthStore } from '../store/authStore';

interface UseAuthReturn {
  userId: number | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  handleAuthSuccess: (authData: AuthResponse) => void;
  handleLogout: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
     user,
     userId,
     accessToken,
     isAuthenticated,
     handleAuthSuccess,
     logout,
   } = useAuthStore();

  // Check for existing auth on mount
  // On mount, check for an existing auth session in localStorage.
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUserId = localStorage.getItem('userId');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUserId && storedUser) {
      // Instead of duplicating state, we use the store's action.
      handleAuthSuccess({
        user: JSON.parse(storedUser),
        accessToken: storedToken,
      });
    }
  }, [handleAuthSuccess]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Login failed:\n' + (errorData.message || JSON.stringify(errorData)));
      }

      const data = await response.json();
      // Expecting the login response structure to have user and token
      if (!data.user || !data.token) {
        throw new Error('Invalid login response structure');
      }

      const authData: AuthResponse = {
        user: data.user,
        accessToken: data.token
      };

      // Update Zustand store using the action
      handleAuthSuccess(authData);
      // Persist to localStorage
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('userId', authData.user.id.toString());
      localStorage.setItem('user', JSON.stringify(authData.user));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
     setLoading(true);
     setError(null);

     try {
       const regResponse = await fetch(`${baseUrl}/auth/register`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ username, password })
       });

       if (!regResponse.ok) {
         const errorData = await regResponse.json();
         throw new Error('Registration failed:\n' + (errorData.message || JSON.stringify(errorData)));
       }

       // Auto-login after successful registration
       const loginResponse = await fetch(`${baseUrl}/auth/login`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ username, password })
       });

       if (!loginResponse.ok) {
         const errorData = await loginResponse.json();
         throw new Error('Login after registration failed:\n' + (errorData.message || JSON.stringify(errorData)));
       }

       const loginData = await loginResponse.json();

       if (!loginData.user || !loginData.token) {
         throw new Error('Invalid login response structure');
       }

       const authData: AuthResponse = {
         user: loginData.user,
         accessToken: loginData.token
       };

       handleAuthSuccess(authData);
       localStorage.setItem('accessToken', authData.accessToken);
       localStorage.setItem('userId', authData.user.id.toString());
       localStorage.setItem('user', JSON.stringify(authData.user));

       return true;
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Registration failed');
       return false;
     } finally {
       setLoading(false);
     }
   };

  return {
    userId,
    accessToken,
    isAuthenticated,
    user,
    loading,
    error,
    handleAuthSuccess,
    handleLogout: logout,
    login,
    register
  };
};
