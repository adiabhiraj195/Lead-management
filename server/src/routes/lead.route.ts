import { Router } from "express";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middleware/validate";
import {
  createLeadSchema,
  getLeadsQuerySchema,
  leadIdParamSchema,
  updateLeadStatusSchema,
} from "../schemas/lead.schema";
import {
  createLeadHandler,
  getLeadsHandler,
  updateLeadStatusHandler,
} from "../controllers/lead.controller";

const router = Router();

router.get("/", validateQuery(getLeadsQuerySchema), getLeadsHandler);
router.post("/", validateBody(createLeadSchema), createLeadHandler);
router.patch(
  "/:id/status",
  validateParams(leadIdParamSchema),
  validateBody(updateLeadStatusSchema),
  updateLeadStatusHandler
);

export default router;
