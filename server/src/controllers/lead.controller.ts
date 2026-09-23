import { Request, Response, NextFunction } from "express";
import * as leadService from "../services/lead.service";
import { GetLeadsQuery } from "../schemas/lead.schema";

export const createLeadHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { leads, pagination } = await leadService.getLeads(
      req.query as unknown as GetLeadsQuery
    );
    res.status(200).json({
      success: true,
      data: leads,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const updatedLead = await leadService.updateLeadStatus(id, status);
    res.status(200).json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};
