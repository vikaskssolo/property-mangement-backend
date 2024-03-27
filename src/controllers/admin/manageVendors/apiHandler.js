import { Router } from "express";
import acceptVendorRequest from "./acceptVendorRequest.js";
import listVendorRequest from "./listVendorRequest.js";
const router = Router();

router.use("/accept/vendor", acceptVendorRequest);
router.use("/vendor/list", listVendorRequest);

export default router;
