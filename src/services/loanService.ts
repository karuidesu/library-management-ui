import { apiClient, type PaginatedResult } from "@/lib/api";
import { ActiveLoan } from "@/lib/data";

export interface BorrowRequest {
  user_id: number;
  book_id: number;
  return_due_date?: string;
}

export interface ReturnRequest {
  transaction_id?: number;
  loan_id?: number;
  book_id?: number;
  new_state_id?: number;
  new_state_name?: string;
}

export const loanService = {
  async getLoans(params?: {
    user_id?: number;
    book_id?: number;
    is_active?: boolean;
    is_overdue?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ActiveLoan[]> {
    const res = await apiClient.get<ActiveLoan[] | PaginatedResult<ActiveLoan>>("/loans", {
      params: params as Record<string, string | number | boolean | undefined>,
    });

    if (Array.isArray(res)) {
      return res;
    }
    if (res && Array.isArray(res.items)) {
      return res.items;
    }
    return [];
  },

  async getLoansPaginated(params?: {
    user_id?: number;
    book_id?: number;
    is_active?: boolean;
    is_overdue?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResult<ActiveLoan>> {
    const res = await apiClient.get<ActiveLoan[] | PaginatedResult<ActiveLoan>>("/loans", {
      params: params as Record<string, string | number | boolean | undefined>,
    });

    if (Array.isArray(res)) {
      return {
        items: res,
        total: res.length,
        limit: params?.limit ?? res.length,
        offset: params?.offset ?? 0,
        pages: 1,
      };
    }
    return res;
  },

  async borrowBook(payload: BorrowRequest): Promise<unknown> {
    return apiClient.post("/loans/borrow", payload);
  },

  async returnBook(payload: ReturnRequest): Promise<unknown> {
    return apiClient.post("/loans/return", payload);
  },
};
