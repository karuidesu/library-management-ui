"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import { currentUser, type Member } from "@/lib/data";
import {
  authService,
  USER_STORAGE_KEY,
  type AuthUser,
  type LoginCredentials,
} from "@/services/auth";

function getRoleLabel(role: AuthUser["role"]): string {
  if (!role) return "Membre";
  if (typeof role === "string") return role;
  if (typeof role === "object") {
    return role.name || role.label || "Membre";
  }
  return "Membre";
}

function getInitials(name: string): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("agbale:auth-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("agbale:auth-changed", callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(USER_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

export function useAuth() {
  const router = useRouter();
  const rawUser = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const parsedUser = React.useMemo<AuthUser | null>(() => {
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, [rawUser]);

  const token = typeof window !== "undefined" ? getAuthToken() : null;
  const isAuthenticated = Boolean(token && parsedUser);

  const user: AuthUser = React.useMemo(() => {
    if (parsedUser) {
      return {
        ...parsedUser,
        avatar: parsedUser.avatar || getInitials(parsedUser.name),
      };
    }
    return {
      id: "id" in currentUser ? String((currentUser as Record<string, unknown>).id) : "USR-1",
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      avatar: currentUser.avatar || "SC",
      gender: currentUser.gender,
      phone: currentUser.phone,
    };
  }, [parsedUser]);

  const roleName = getRoleLabel(user.role);

  const login = React.useCallback(async (credentials: LoginCredentials) => {
    const res = await authService.login(credentials);
    return res;
  }, []);

  const logout = React.useCallback(() => {
    authService.logout();
    router.push("/login");
  }, [router]);

  const updateUser = React.useCallback(
    (updates: Partial<AuthUser>) => {
      const updated = { ...user, ...updates };
      authService.setUser(updated);
    },
    [user],
  );

  return {
    user,
    roleName,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };
}
