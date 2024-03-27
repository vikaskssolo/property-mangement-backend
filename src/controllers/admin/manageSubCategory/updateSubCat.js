import { Router } from "express";
import { send, setErrorResponseMsg } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import authenticate from "../../../middlewares/authenticate.js";
import subCategoryModel from "../../../models/subCatModel.js";
const router = Router();

router.put("/:id", authenticate, async (req, res) => {
  try {
    const { sub_cat_name } = req.body;
    const id = req.params.id;
    let updates = {};

    if (sub_cat_name || sub_cat_name == "") updates.name = sub_cat_name;

    await subCategoryModel.updateMany({ _id: id }, [{ $set: updates }]);
    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
