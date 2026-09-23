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

