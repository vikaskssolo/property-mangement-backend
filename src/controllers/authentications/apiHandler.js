import { Router } from "express";
import signUp from "./signUp.js";
import signin from "./signin.js";
import editProfile from "./editProfile.js";
const router = Router();

router.use("/signup", signUp);
router.use("/signin", signin);
router.use("/edit", editProfile);

export default router;
