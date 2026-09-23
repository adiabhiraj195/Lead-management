"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  fetchLeadsApi,
  createLeadApi,
  updateLeadStatusApi,
  ApiRequestError,
} from "@/lib/api-client";
import { GetLeadsParams, LeadStatus } from "@/lib/types";
import { CreateLeadFormData } from "@/lib/validations";

export function useLeads(params: GetLeadsParams = {}) {
  const { page = 1, limit = 10, search = "" } = params;

  return useQuery({
    queryKey: ["leads", { page, limit, search: search.trim() }],
    queryFn: () =>
      fetchLeadsApi({
        page,
        limit,
        search: search.trim() || undefined,
      }),
    placeholderData: keepPreviousData,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadFormData) => createLeadApi(data),
    onSuccess: () => {
      // Invalidate all leads queries to refresh current view
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLeadStatusApi(id, status),
    onSuccess: () => {
      // Invalidate queries so lists and details reflect the updated status
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export { ApiRequestError };

