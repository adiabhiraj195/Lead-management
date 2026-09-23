import { Request, Response, NextFunction } from "express";
import * as leadService from "../services/lead.service";

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

