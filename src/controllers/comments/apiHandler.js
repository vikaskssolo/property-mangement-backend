import { Router } from "express";
import addComment from "./postComments.js";
import listComments from "./listComments.js";
import reply from "./replyCmt.js";
const router = Router();

router.use("/manage/post", addComment);
router.use("/manage/list", listComments);
router.use("/manage/reply", reply);

export default router;
