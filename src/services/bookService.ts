import { apiClient, type PaginatedResult } from "@/lib/api";
import { Book } from "@/lib/data";

export interface BookFilters {
  search?: string;
  query?: string;
  category?: string;
  category_id?: number;
  state_id?: number;
  limit?: number;
  offset?: number;
}

function normalizeBookFilters(
  filters?: BookFilters,
): Record<string, string | number | boolean | undefined> | undefined {
  if (!filters) return undefined;
  const { query, search, ...rest } = filters;
  return {
    ...rest,
    search: search ?? query,
  };
}

export const bookService = {
  async getBooks(filters?: BookFilters): Promise<Book[]> {
    const res = await apiClient.get<Book[] | PaginatedResult<Book>>("/books", {
      params: normalizeBookFilters(filters),
    });

    if (Array.isArray(res)) {
      return res;
    }
    if (res && Array.isArray(res.items)) {
      return res.items;
    }
    return [];
  },

  async getBooksPaginated(filters?: BookFilters): Promise<PaginatedResult<Book>> {
    const res = await apiClient.get<Book[] | PaginatedResult<Book>>("/books", {
      params: normalizeBookFilters(filters),
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

  async getBook(id: string | number): Promise<Book> {
    return apiClient.get<Book>(`/books/${id}`);
  },

  async createBook(data: Partial<Book>): Promise<Book> {
    return apiClient.post<Book>("/books", data);
  },

  async updateBook(id: string | number, data: Partial<Book>): Promise<Book> {
    return apiClient.put<Book>(`/books/${id}`, data);
  },

  async deleteBook(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/books/${id}`);
  },
};
