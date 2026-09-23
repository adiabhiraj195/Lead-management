import prisma from "../lib/prisma";
import { CreateLeadInput } from "../schemas/lead.schema";

export const createLead = async (data: CreateLeadInput) => {
  return await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
    },
  });
};

