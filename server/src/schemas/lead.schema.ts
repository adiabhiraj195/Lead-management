import { z } from "zod";
import { LeadStatus } from "@prisma/client";

export const createLeadSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  email: z
    .string({ message: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  phone: z
    .string({ message: "Phone is required" })
    .trim()
    .min(1, "Phone is required"),
  status: z
    .nativeEnum(LeadStatus, {
      message: `Status must be one of: ${Object.values(LeadStatus).join(", ")}`,
    })
    .optional()
    .default(LeadStatus.NEW),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const getLeadsQuerySchema = z.object({
  page: z.coerce
    .number({ message: "Page must be a number" })
    .int({ message: "Page must be an integer" })
    .min(1, { message: "Page must be at least 1" })
    .default(1),
  limit: z.coerce
    .number({ message: "Limit must be a number" })
    .int({ message: "Limit must be an integer" })
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit cannot exceed 100" })
    .default(10),
  search: z.string().trim().optional(),
});

export type GetLeadsQuery = z.infer<typeof getLeadsQuerySchema>;

export const leadIdParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid lead ID format" }),
});

export type LeadIdParam = z.infer<typeof leadIdParamSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus, {
    message: `Status must be one of: ${Object.values(LeadStatus).join(", ")}`,
  }),
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
