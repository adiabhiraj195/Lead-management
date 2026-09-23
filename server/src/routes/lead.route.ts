import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { createLeadSchema } from "../schemas/lead.schema";
import { createLeadHandler } from "../controllers/lead.controller";

const router = Router();

router.post("/", validateBody(createLeadSchema), createLeadHandler);

export default router;

