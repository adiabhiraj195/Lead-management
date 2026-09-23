import { Router } from "express";
import healthRouter from "./health.route";
import leadRouter from "./lead.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/leads", leadRouter);

export default router;

