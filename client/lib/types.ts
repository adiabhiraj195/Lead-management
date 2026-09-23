export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  pagination?: Pagination;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    status: number;
    details?: ApiErrorDetail[];
    stack?: string;
  };
}

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export interface UpdateLeadStatusPayload {
  id: string;
  status: LeadStatus;
}

