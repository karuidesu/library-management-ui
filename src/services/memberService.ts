import { apiClient, type PaginatedResult } from "@/lib/api";
import { Member, REFERENCE_DATE } from "@/lib/data";

export interface UserFilters {
  search?: string;
  query?: string;
  name?: string;
  role?: string;
  role_id?: number;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

const ROLE_MAP: Record<string, number> = {
  admin: 1,
  administrator: 1,
  administrateur: 1,
  bibliothécaire: 2,
  bibliothecaire: 2,
  librarian: 2,
  staff: 2,
  membre: 3,
  member: 3,
  adherent: 3,
};

function normalizeUserFilters(
  filters?: UserFilters,
): Record<string, string | number | boolean | undefined> | undefined {
  if (!filters) return undefined;
  const { query, search, ...rest } = filters;
  return {
    ...rest,
    query: query ?? search,
  };
}

export function mapBackendUser(raw: any): Member {
  const name = raw.name || "Utilisateur sans nom";
  const initials = name
    .split(" ")
    .map((part: string) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "US";

  let roleLabel = "Membre";
  if (typeof raw.role === "object" && raw.role !== null) {
    roleLabel = raw.role.label || raw.role.name || "Membre";
  } else if (typeof raw.role === "string") {
    roleLabel = raw.role;
  }

  // Normalize to French role display
  const lowerRole = roleLabel.toLowerCase();
  if (lowerRole.includes("admin")) {
    roleLabel = "Admin";
  } else if (lowerRole.includes("lib") || lowerRole.includes("biblio")) {
    roleLabel = "Bibliothécaire";
  } else {
    roleLabel = "Membre";
  }

  const loansCount =
    raw.active_loans_count ??
    raw.borrowedCount ??
    raw.borrowed_count ??
    0;

  return {
    ...raw,
    id: String(raw.id),
    name,
    email: raw.email || undefined,
    gender: raw.gender === "M" ? "M" : "F",
    role: roleLabel,
    role_id: raw.role_id || (raw.role?.id) || 3,
    created_at: raw.created_at || raw.joinDate || REFERENCE_DATE,
    joinDate: raw.joinDate || raw.created_at || REFERENCE_DATE,
    avatar: initials,
    active_loans_count: loansCount,
    borrowedCount: loansCount,
    is_active: raw.is_active ?? true,
    last_access: raw.last_access || null,
  };
}

export const memberService = {
  async getMembers(filters?: UserFilters): Promise<Member[]> {
    const res = await apiClient.get<any>("/users", {
      params: normalizeUserFilters(filters),
    });

    if (Array.isArray(res)) {
      return res.map(mapBackendUser);
    }
    if (res && Array.isArray(res.items)) {
      return res.items.map(mapBackendUser);
    }
    return [];
  },

  async getMembersPaginated(filters?: UserFilters): Promise<PaginatedResult<Member>> {
    const res = await apiClient.get<any>("/users", {
      params: normalizeUserFilters(filters),
    });

    if (Array.isArray(res)) {
      const items = res.map(mapBackendUser);
      return {
        items,
        total: items.length,
        limit: filters?.limit ?? items.length,
        offset: filters?.offset ?? 0,
        pages: 1,
      };
    }

    if (res && Array.isArray(res.items)) {
      return {
        ...res,
        items: res.items.map(mapBackendUser),
      };
    }

    return {
      items: [],
      total: 0,
      limit: filters?.limit ?? 10,
      offset: filters?.offset ?? 0,
      pages: 0,
    };
  },

  async getMember(id: string | number): Promise<Member> {
    const res = await apiClient.get<any>(`/users/${id}`);
    return mapBackendUser(res);
  },

  async createMember(data: Partial<Member>): Promise<Member> {
    const cleanName = (data.name || "Nouveau Membre").trim();
    const cleanEmail =
      data.email?.trim() ||
      `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, ".")}.${Date.now().toString().slice(-4)}@agbale.local`;

    const rawRole = (data.role || "Membre").toLowerCase();
    const role_id = data.role_id || ROLE_MAP[rawRole] || 3;

    const payload = {
      name: cleanName,
      email: cleanEmail,
      password: (data as any).password || "Adherent2026!",
      role_id,
    };

    const res = await apiClient.post<any>("/auth/register", payload);
    return mapBackendUser(res);
  },

  async updateMember(id: string | number, data: Partial<Member>): Promise<Member> {
    const payload: Record<string, any> = {};
    if (data.name) payload.name = data.name;
    if (data.email) payload.email = data.email;
    if (data.role_id) payload.role_id = data.role_id;
    else if (data.role) {
      payload.role_id = ROLE_MAP[data.role.toLowerCase()] || 3;
    }
    if (data.is_active !== undefined) payload.is_active = data.is_active;

    const res = await apiClient.put<any>(`/users/${id}`, payload);
    return mapBackendUser(res);
  },

  async deleteMember(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  },
};
