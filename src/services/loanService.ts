import { apiClient, type PaginatedResult } from "@/lib/api";
import { ActiveLoan, getCoverByCategory, REFERENCE_DATE } from "@/lib/data";

export interface BorrowRequest {
  user_id: number | string;
  book_id: number | string;
  return_due_date?: string;
  loan_duration_days?: number;
}

export interface ReturnRequest {
  transaction_id?: number | string;
  loan_id?: number | string;
  book_id?: number | string;
  user_id?: number | string;
  new_state_id?: number;
  new_state_name?: string;
}

export function mapBackendTransaction(raw: any): ActiveLoan {
  const dueRaw = raw.return_due_date || raw.due_date || raw.dueDate || REFERENCE_DATE;
  const borrowRaw = raw.borrow_date || raw.borrowDate || REFERENCE_DATE;

  const due = typeof dueRaw === "string" ? dueRaw.slice(0, 10) : REFERENCE_DATE;
  const borrow = typeof borrowRaw === "string" ? borrowRaw.slice(0, 10) : REFERENCE_DATE;

  const borrowerName =
    raw.borrower?.name || raw.borrower_name || raw.borrower || "Adhérent";
  const bookTitle = raw.book?.title || raw.book_title || raw.bookTitle || "Livre";
  const bookAuthor =
    raw.book?.author || raw.book_author || raw.bookAuthor || "Auteur";
  const bookCategory =
    raw.book?.category?.name ||
    (typeof raw.book?.category === "string" ? raw.book.category : null) ||
    raw.category ||
    "Fiction";

  const coverStyle = getCoverByCategory(bookCategory);

  return {
    ...raw,
    id: String(raw.id),
    book_id: String(raw.book_id ?? raw.book?.id),
    book_title: bookTitle,
    book_author: bookAuthor,
    category: bookCategory,
    cover_color: raw.book?.cover_color || coverStyle.gradient,
    cover_accent: raw.book?.cover_accent || coverStyle.accent,
    cover_emoji: raw.book?.cover_emoji || coverStyle.emoji,
    member_id: String(raw.user_id ?? raw.borrower?.id),
    user_id: String(raw.user_id ?? raw.borrower?.id),
    borrower: borrowerName,
    borrower_name: borrowerName,
    borrower_initials:
      raw.borrower_initials || borrowerName.slice(0, 2).toUpperCase(),
    borrower_gender: raw.borrower_gender || "F",
    borrow_date: borrow,
    due_date: due,
    return_due_date: due,

    // camelCase aliases
    bookId: String(raw.book_id ?? raw.book?.id),
    bookTitle,
    bookAuthor,
    coverColor: raw.book?.cover_color || coverStyle.gradient,
    coverEmoji: raw.book?.cover_emoji || coverStyle.emoji,
    memberId: String(raw.user_id ?? raw.borrower?.id),
    borrowerInitials:
      raw.borrower_initials || borrowerName.slice(0, 2).toUpperCase(),
    borrowerGender: raw.borrower_gender || "F",
    borrowDate: borrow,
    dueDate: due,
  };
}

export const loanService = {
  async getLoans(params?: {
    user_id?: number | string;
    book_id?: number | string;
    status?: "active" | "returned" | "overdue";
    is_active?: boolean;
    is_overdue?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ActiveLoan[]> {
    const res = await apiClient.get<any>("/loans", {
      params: {
        user_id: params?.user_id,
        book_id: params?.book_id,
        status: params?.status ?? (params?.is_active !== false ? "active" : undefined),
        limit: params?.limit ?? 50,
        offset: params?.offset ?? 0,
      },
    });

    if (Array.isArray(res)) {
      return res.map(mapBackendTransaction);
    }
    if (res && Array.isArray(res.items)) {
      return res.items.map(mapBackendTransaction);
    }
    return [];
  },

  async getLoansPaginated(params?: {
    user_id?: number | string;
    book_id?: number | string;
    status?: "active" | "returned" | "overdue";
    is_active?: boolean;
    is_overdue?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResult<ActiveLoan>> {
    const res = await apiClient.get<any>("/loans", {
      params: {
        user_id: params?.user_id,
        book_id: params?.book_id,
        status: params?.status ?? (params?.is_active !== false ? "active" : undefined),
        limit: params?.limit ?? 20,
        offset: params?.offset ?? 0,
      },
    });

    if (Array.isArray(res)) {
      const items = res.map(mapBackendTransaction);
      return {
        items,
        total: items.length,
        limit: params?.limit ?? items.length,
        offset: params?.offset ?? 0,
        pages: 1,
      };
    }

    if (res && Array.isArray(res.items)) {
      return {
        ...res,
        items: res.items.map(mapBackendTransaction),
      };
    }

    return {
      items: [],
      total: 0,
      limit: params?.limit ?? 20,
      offset: params?.offset ?? 0,
      pages: 0,
    };
  },

  async borrowBook(payload: BorrowRequest): Promise<ActiveLoan> {
    const formattedDueDate = payload.return_due_date
      ? payload.return_due_date.includes("T")
        ? payload.return_due_date
        : `${payload.return_due_date}T23:59:59Z`
      : undefined;

    const res = await apiClient.post<any>("/loans/borrow", {
      user_id: Number(payload.user_id),
      book_id: Number(payload.book_id),
      return_due_date: formattedDueDate,
    });

    const tx = res?.transaction || res;
    return mapBackendTransaction(tx);
  },

  async returnBook(payload: ReturnRequest): Promise<unknown> {
    const transactionId = payload.transaction_id ?? payload.loan_id;

    return apiClient.post("/loans/return", {
      transaction_id: transactionId ? Number(transactionId) : undefined,
      book_id: payload.book_id ? Number(payload.book_id) : undefined,
      new_state_id: payload.new_state_id ? Number(payload.new_state_id) : undefined,
      new_state_name: payload.new_state_name,
    });
  },
};
