import { create } from "zustand";
import { loginUser, registerUser } from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      set({ user: data.user || { username: credentials.username }, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await registerUser(userData);
      localStorage.setItem("token", data.token);
      set({ user: data.user || { username: userData.username }, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
