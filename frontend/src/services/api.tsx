const API_URL: string = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/** Generic fetch helper */
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
    throw new Error((error as any).error || "Request failed");
  }

  return res.json();
}

// --------------------
// Payload Types
// --------------------
export interface UserData {
  email: string;
  password: string;
  user_type?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: {
    id: number;
    username: string;
    email: string;
    user_type: string;
  };
  token: string;
}

// --------------------
// API Calls
// --------------------
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

export function fetchMessages(): Promise<any> {
  return request<any>("/");
}
