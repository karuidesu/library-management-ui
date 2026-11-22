import { apiClient, type PaginatedResult } from "@/lib/api";
import { Member } from "@/lib/data";

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

function normalizeUserFilters(
  filters?: UserFilters,
): Record<string, string | number | boolean | undefined> | undefined {
  if (!filters) return undefined;
  const { query, search, ...rest } = filters;
  return {
    ...rest,
    search: search ?? query,
  };
}

export const memberService = {
  async getMembers(filters?: UserFilters): Promise<Member[]> {
    const res = await apiClient.get<Member[] | PaginatedResult<Member>>("/users", {
      params: normalizeUserFilters(filters),
    });

    if (Array.isArray(res)) {
      return res;
    }
    if (res && Array.isArray(res.items)) {
      return res.items;
    }
    return [];
  },

  async getMembersPaginated(filters?: UserFilters): Promise<PaginatedResult<Member>> {
    const res = await apiClient.get<Member[] | PaginatedResult<Member>>("/users", {
      params: normalizeUserFilters(filters),
    });

    if (Array.isArray(res)) {
      return {
        items: res,
        total: res.length,
        limit: filters?.limit ?? res.length,
        offset: filters?.offset ?? 0,
        pages: 1,
      };
    }
    return res;
  },

  async getMember(id: string | number): Promise<Member> {
    return apiClient.get<Member>(`/users/${id}`);
  },

  async createMember(data: Partial<Member>): Promise<Member> {
    return apiClient.post<Member>("/auth/register", data);
  },

  async updateMember(id: string | number, data: Partial<Member>): Promise<Member> {
    return apiClient.put<Member>(`/users/${id}`, data);
  },
};
