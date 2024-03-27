import { Router } from "express";
import addSubCat from "./addSubCategories.js";
import listSubCategory from "./listSubCategory.js";
import updateSubCat from "./updateSubCat.js";
import deleteSubCat from "./deleteSubCat.js";
const router = Router();

router.use("/manage/add", addSubCat);
router.use("/manage/list", listSubCategory);
router.use("/manage/update", updateSubCat);
router.use("/manage/delete", deleteSubCat);

export default router;