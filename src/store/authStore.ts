import { create } from 'zustand';

// El token JWT se guarda en memoria mientras la app está abierta.
// En producción usaría expo-secure-store para persistirlo entre sesiones,
// pero para esta fase es suficiente con el estado en memoria.

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://noteflow-api-y6uh.vercel.app/api';

interface AuthState {
  token: string | null;
  user: { id: string; username: string } | null;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al iniciar sesión');
      set({ token: data.token, user: data.user });
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al registrarse');
      // Tras registrarse, hacer login automático
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error ?? 'Error al iniciar sesión');
      set({ token: loginData.token, user: loginData.user });
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => set({ token: null, user: null, error: null }),
}));
