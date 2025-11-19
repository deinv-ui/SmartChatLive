// src/services/api.ts
const API_URL: string = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as any).message || "Request failed");
  }

  return res.json();
}

// Types for API payloads
export interface UserData {
  username: string;
  password: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user?: { username: string; [key: string]: any };
  token: string;
}

// API functions
export function registerUser(userData: UserData): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(credentials: Credentials): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function fetchMessage(): Promise<any> {
  return request<any>("/");
}
