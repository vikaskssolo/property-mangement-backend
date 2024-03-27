import { Router } from "express";
import bookMyProperty from "./bookMyProperties.js";
import bookedProperies from "./listBookings.js";
import acceptBookings from "./acceptBookings.js";
const router = Router();

router.use("/bookings/add", bookMyProperty);
router.use("/bookings/list", bookedProperies);
router.use("/bookings/accept", acceptBookings);

export default router;
