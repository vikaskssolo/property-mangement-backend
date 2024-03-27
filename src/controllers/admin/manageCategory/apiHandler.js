import { Router } from "express";
import addCat from "./addCategories.js";
import listCat from "./listCategories.js";
import updateCat from "./updateCategory.js";
import deleteCat from "./deleteCategory.js";
const router = Router();

router.use("/manage/add", addCat);
router.use("/manage/list", listCat);
router.use("/manage/update", updateCat);
router.use("/manage/delete", deleteCat);

export default router;