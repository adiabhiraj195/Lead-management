import axios, { AxiosError } from "axios";
import {
  ApiResponse,
  ApiErrorResponse,
  GetLeadsParams,
  Lead,
  LeadStatus,
  Pagination,
} from "./types";
import {
  createLeadSchema,
  updateLeadStatusSchema,
  getLeadsQuerySchema,
  CreateLeadFormData,
} from "./validations";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export class ApiRequestError extends Error {
  status?: number;
  details?: { field: string; message: string }[];

  constructor(
    message: string,
    status?: number,
    details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

// Global response interceptor for normalized error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data?.error) {
      const errData = error.response.data.error;
      return Promise.reject(
        new ApiRequestError(errData.message, errData.status, errData.details)
      );
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiRequestError("Request timed out. Please verify your connection.")
      );
    }
    if (!error.response) {
      return Promise.reject(
        new ApiRequestError(
          "Unable to connect to the server. Please verify the backend is running."
        )
      );
    }
    return Promise.reject(
      new ApiRequestError(error.message || "An unexpected error occurred.")
    );
  }
);

/**
 * Fetch leads with optional search query & pagination.
 * Query parameters are validated via Zod before sending.
 */
export async function fetchLeadsApi(params?: GetLeadsParams): Promise<{
  leads: Lead[];
  pagination: Pagination;
}> {
  // Validate query params with Zod
  const validated = getLeadsQuerySchema.parse(params ?? {});

  const queryParams: Record<string, string | number> = {
    page: validated.page,
    limit: validated.limit,
  };
  if (validated.search) {
    queryParams.search = validated.search;
  }

  const res = await apiClient.get<ApiResponse<Lead[]>>("/leads", {
    params: queryParams,
  });

  return {
    leads: res.data.data,
    pagination: res.data.pagination || {
      page: validated.page,
      limit: validated.limit,
      total: res.data.data.length,
      totalPages: 1,
    },
  };
}

/**
 * Create a new lead.
 * Validates payload strictly with Zod before placing it in the API payload.
 */
export async function createLeadApi(
  data: CreateLeadFormData
): Promise<Lead> {
  // Enforce Zod validation before API dispatch
  const validatedPayload = createLeadSchema.parse(data);

  const res = await apiClient.post<ApiResponse<Lead>>(
    "/leads",
    validatedPayload
  );
  return res.data.data;
}

/**
 * Update the status of an existing lead.
 * Validates lead ID and status strictly with Zod before placing in API payload.
 */
export async function updateLeadStatusApi(
  id: string,
  status: LeadStatus
): Promise<Lead> {
  // Enforce Zod validation before API dispatch
  const validated = updateLeadStatusSchema.parse({ id, status });

  const res = await apiClient.patch<ApiResponse<Lead>>(
    `/leads/${validated.id}/status`,
    { status: validated.status }
  );
  return res.data.data;
}

