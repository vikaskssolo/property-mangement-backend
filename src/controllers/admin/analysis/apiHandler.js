import { Router } from "express";
import analysis from "./bookingsData.js";
import count from "./counts.js";
const router = Router();

router.use("/analysis", analysis);
router.use("/analysis/count", count);

export default router;