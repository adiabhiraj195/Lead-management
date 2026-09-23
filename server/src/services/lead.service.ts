import prisma from "../lib/prisma";
import { CreateLeadInput, GetLeadsQuery } from "../schemas/lead.schema";
import { LeadStatus, Prisma } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";

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

export const getLeads = async (query: GetLeadsQuery) => {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.LeadWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateLeadStatus = async (id: string, status: LeadStatus) => {
  const existingLead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!existingLead) {
    throw new AppError("Lead not found", 404);
  }

  return await prisma.lead.update({
    where: { id },
    data: { status },
  });
};
