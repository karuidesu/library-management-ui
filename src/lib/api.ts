import { env } from "@/lib/config";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  pages: number;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Get the stored JWT authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(env.authTokenKey);
  } catch {
    return null;
  }
}

/**
 * Set or remove the stored JWT authentication token
 */
export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(env.authTokenKey, token);
    } else {
      localStorage.removeItem(env.authTokenKey);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Base fetch wrapper with auth header injection and error normalization
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${env.apiUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = getAuthToken();
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    // Nettoyer le jeton en cas de 401 (non authentifié / expiré)
    if (response.status === 401 && typeof window !== "undefined") {
      setAuthToken(null);
      try {
        localStorage.removeItem("agbale:user");
      } catch {
        // Storage might be disabled
      }
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?expired=1";
      }
    }

    let errorData: unknown;
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

    try {
      errorData = await response.json();
      if (typeof errorData === "object" && errorData !== null) {
        const obj = errorData as Record<string, unknown>;
        if (typeof obj.detail === "string") {
          errorMessage = obj.detail;
        } else if (Array.isArray(obj.detail)) {
          errorMessage = obj.detail
            .map((item) =>
              typeof item === "object" && item && "msg" in item
                ? String((item as { msg: unknown }).msg)
                : String(item),
            )
            .join(", ");
        } else if (typeof obj.message === "string") {
          errorMessage = obj.message;
        } else if (typeof obj.error === "string") {
          errorMessage = obj.error;
        }
      }
    } catch {
      // Body is not JSON
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};

