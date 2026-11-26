import { apiClient, setAuthToken } from "@/lib/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  role?: { id?: number; label?: string; name?: string } | string | null;
  role_id?: number;
  is_active?: boolean;
  avatar?: string;
  gender?: "M" | "F";
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

export const USER_STORAGE_KEY = "agbale:user";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>("/auth/login-json", credentials);
    setAuthToken(res.access_token);
    if (typeof window !== "undefined" && res.user) {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
        window.dispatchEvent(new CustomEvent("agbale:auth-changed"));
      } catch {
        // Storage might be disabled
      }
    }
    return res;
  },

  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent("agbale:auth-changed"));
    } catch {
      // Storage might be disabled
    }
  },

  async getMe(): Promise<AuthUser> {
    const user = await apiClient.get<AuthUser>("/users/me");
    if (user) {
      authService.setUser(user);
    }
    return user;
  },

  logout() {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent("agbale:auth-changed"));
      } catch {
        // Storage might be disabled
      }
    }
  },
};
