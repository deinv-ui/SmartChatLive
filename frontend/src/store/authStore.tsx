// src/store/authStore.ts
import { create } from "zustand";
import { loginUser, registerUser, UserData, Credentials, AuthResponse } from "../services/api.js";

interface User {
  id: number;
  email: string;
  user_type: string;
  [key: string]: any;
}

interface AuthState {
  user: User;
  token: string;
  loading: boolean;
  error: string | null;

  login: (credentials: Credentials) => Promise<boolean>;
  register: (userData: UserData) => Promise<boolean>;
  logout: () => void;
}

// Fallback user when no real user yet
const defaultUser: User = { id: 0, email: "", user_type: "user" };

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultUser,
  token: localStorage.getItem("token") || "",
  loading: false,
  error: null,

  login: async (credentials: Credentials) => {
    set({ loading: true, error: null });
    try {
      const data: AuthResponse = await loginUser(credentials);
      const loggedInUser: User = data.user || { id: 0, email: credentials.email, user_type: "user" };
      localStorage.setItem("token", data.token);
      set({ user: loggedInUser, token: data.token, loading: false });
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
      const registeredUser: User = data.user || { id: 0, email: userData.email, user_type: userData.user_type || "user" };
      localStorage.setItem("token", data.token);
      set({ user: registeredUser, token: data.token, loading: false });
      return true;
    } catch (err: any) {
      set({ error: err?.message || "Registration failed", loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: defaultUser, token: "" });
  },
}));
