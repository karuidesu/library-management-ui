import { apiClient, type PaginatedResult } from "@/lib/api";
import { Book, getCoverByCategory } from "@/lib/data";

export interface BookFilters {
  search?: string;
  query?: string;
  category?: string;
  category_id?: number;
  state_id?: number;
  limit?: number;
  offset?: number;
}

export interface CategoryItem {
  id: number;
  name: string;
  books_count?: number;
}

export interface StateItem {
  id: number;
  name: string;
  label?: string;
}

// Category fallback dictionary
const DEFAULT_CATEGORY_MAP: Record<string, number> = {
  "fiction": 1,
  "roman": 1,
  "non-fiction": 2,
  "science": 3,
  "histoire": 4,
  "history": 4,
  "philosophie": 5,
  "philosophy": 5,
  "fantastique": 6,
  "fantasy": 6,
  "jeunesse": 7,
  "children & youth": 7,
  "technologie": 8,
  "technology": 8,
  "informatique": 8,
  "biographie": 9,
  "biography": 9,
};

let cachedCategories: CategoryItem[] | null = null;

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

export function mapBackendBook(raw: any): Book {
  const categoryName =
    typeof raw.category === "object" && raw.category !== null
      ? raw.category.name
      : typeof raw.category === "string"
        ? raw.category
        : "Fiction";

  const cover = getCoverByCategory(categoryName);

  const rawStateName =
    typeof raw.state === "object" && raw.state !== null
      ? raw.state.label || raw.state.name
      : typeof raw.status === "string"
        ? raw.status
        : "";

  let status: Book["status"] = "Disponible";
  const lowerState = (rawStateName || "").toLowerCase();
  if (lowerState.includes("borrow") || lowerState.includes("emprunt") || raw.is_borrowed) {
    status = "Emprunté";
  } else if (lowerState.includes("damag") || lowerState.includes("endommag")) {
    status = "Endommagé";
  } else if (lowerState.includes("lost") || lowerState.includes("perdu")) {
    status = "Perdu";
  }

  return {
    ...raw,
    id: String(raw.id),
    title: raw.title || "Sans titre",
    author: raw.author || "Auteur inconnu",
    isbn: raw.isbn || "",
    category: categoryName,
    category_id: raw.category_id || raw.category?.id || 1,
    state_id: raw.state_id || raw.state?.id || 1,
    status,
    publication_year: raw.publication_year ?? raw.year ?? 2024,
    copies: raw.copies ?? 1,
    description: raw.description || "",
    cover_color: raw.cover_color || raw.coverColor || cover.gradient,
    cover_accent: raw.cover_accent || raw.coverAccent || cover.accent,
    cover_emoji: raw.cover_emoji || raw.coverEmoji || cover.emoji,
  };
}

export const bookService = {
  async getCategories(): Promise<CategoryItem[]> {
    if (cachedCategories && cachedCategories.length > 0) {
      return cachedCategories;
    }
    try {
      const res = await apiClient.get<CategoryItem[]>("/categories");
      if (Array.isArray(res)) {
        cachedCategories = res;
        return res;
      }
    } catch {
      // Fallback
    }
    return Object.entries(DEFAULT_CATEGORY_MAP).map(([name, id]) => ({ id, name }));
  },

  async getBooks(filters?: BookFilters): Promise<Book[]> {
    const res = await apiClient.get<any>("/books", {
      params: normalizeBookFilters(filters),
    });

    if (Array.isArray(res)) {
      return res.map(mapBackendBook);
    }
    if (res && Array.isArray(res.items)) {
      return res.items.map(mapBackendBook);
    }
    return [];
  },

  async getBooksPaginated(filters?: BookFilters): Promise<PaginatedResult<Book>> {
    const res = await apiClient.get<any>("/books", {
      params: normalizeBookFilters(filters),
    });

    if (Array.isArray(res)) {
      const items = res.map(mapBackendBook);
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
        items: res.items.map(mapBackendBook),
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

  async getBook(id: string | number): Promise<Book> {
    const res = await apiClient.get<any>(`/books/${id}`);
    return mapBackendBook(res);
  },

  async createBook(data: Partial<Book>): Promise<Book> {
    // Resolve category_id if missing
    let category_id = data.category_id;
    if (!category_id && data.category) {
      const normalizedCat = data.category.trim().toLowerCase();
      category_id = DEFAULT_CATEGORY_MAP[normalizedCat];

      if (!category_id) {
        try {
          const cats = await this.getCategories();
          const match = cats.find(
            (c) => c.name.toLowerCase() === normalizedCat,
          );
          if (match) category_id = match.id;
        } catch {
          // Ignore
        }
      }
    }

    if (!category_id) {
      category_id = 1; // Default to Fiction
    }

    const cover = getCoverByCategory(data.category || "Fiction");

    const payload = {
      title: data.title,
      author: data.author,
      isbn: data.isbn?.replace(/[-\s]/g, ""),
      category_id,
      state_id: data.state_id || 1,
      publication_year: data.publication_year || data.year || 2024,
      copies: data.copies || 1,
      description: data.description || "",
      cover_color: data.cover_color || data.coverColor || cover.gradient,
      cover_accent: data.cover_accent || data.coverAccent || cover.accent,
      cover_emoji: data.cover_emoji || data.coverEmoji || cover.emoji,
    };

    const res = await apiClient.post<any>("/books", payload);
    return mapBackendBook(res);
  },

  async updateBook(id: string | number, data: Partial<Book>): Promise<Book> {
    const payload: Record<string, any> = {};
    if (data.title) payload.title = data.title;
    if (data.author) payload.author = data.author;
    if (data.isbn) payload.isbn = data.isbn.replace(/[-\s]/g, "");
    if (data.category_id) payload.category_id = data.category_id;
    if (data.publication_year) payload.publication_year = data.publication_year;
    if (data.copies !== undefined) payload.copies = data.copies;
    if (data.description !== undefined) payload.description = data.description;

    const res = await apiClient.put<any>(`/books/${id}`, payload);
    return mapBackendBook(res);
  },

  async deleteBook(id: string | number): Promise<void> {
    return apiClient.delete<void>(`/books/${id}`);
  },
};
