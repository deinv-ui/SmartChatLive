import { create } from "zustand";
import { loginUser, registerUser, UserData, Credentials, AuthResponse } from "../services/api.js";

interface AuthState {
  user: { id: number; email: string; user_type: string; [key: string]: any } | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (credentials: Credentials) => Promise<boolean>;
  register: (userData: UserData) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  login: async (credentials: Credentials) => {
    set({ loading: true, error: null });
    try {
      const data: AuthResponse = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      set({
        user: data.user || { id: 0, username: credentials.email, email: credentials.email, user_type: "user" },
        token: data.token,
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err?.message || "Login failed", loading: false });
      return false;
    }
  },

  register: async (userData: UserData) => {
    set({ loading: true, error: null });
    try {
      const data: AuthResponse = await registerUser(userData);
      localStorage.setItem("token", data.token);
      set({
        user: data.user || { id: 0, email: userData.email, user_type: userData.user_type || "user" },
        token: data.token,
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err?.message || "Registration failed", loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
