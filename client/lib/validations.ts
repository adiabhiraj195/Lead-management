import { z } from "zod";

export const leadStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
]);

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email address is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(30, "Phone number cannot exceed 30 characters"),
  status: leadStatusEnum.default("NEW"),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;

export const updateLeadStatusSchema = z.object({
  id: z.string().uuid("Invalid lead ID format"),
  status: leadStatusEnum,
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;

export const getLeadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
});

export type GetLeadsQueryInput = z.infer<typeof getLeadsQuerySchema>;

/**
 * Helper to convert ZodError into a flat map of field -> message
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && typeof key === "string" && !formatted[key]) {
      formatted[key] = issue.message;
    }
  }
  return formatted;
}

