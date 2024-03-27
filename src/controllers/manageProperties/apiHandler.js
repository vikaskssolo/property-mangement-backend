import { Router } from "express";
import postProperties from "./postProperties.js";
import myProperties from "./listProperties.js";
import deleteProperties from "./deleteProperties.js";
import particularProperty from "./particularProperty.js";
import editProperty from "./editProperty.js";
import changeStatus from "./changeStatus.js";
import searchAndFilter from "./searchAndFilter.js";
import listByCategory from "./listByCategory.js";
import propertyListUser from "./propertyListUser.js";
const router = Router();

router.use("/manage/post", postProperties);
router.use("/manage/list", myProperties);
router.use("/manage/delete", deleteProperties);
router.use("/manage/list/particular", particularProperty);
router.use("/manage/edit", editProperty);
router.use("/manage/edit/status", changeStatus);
router.use("/seach/filter", searchAndFilter);
router.use("/list/bycat", listByCategory);
router.use("/user/list", propertyListUser);

export default router;
