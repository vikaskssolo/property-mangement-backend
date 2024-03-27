import { Router } from "express";
import { send, setErrorResponseMsg } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import authenticate from "../../../middlewares/authenticate.js";
import categoryModel from "../../../models/categoryModel.js";
import subCategoryModel from "../../../models/subCatModel.js";
import constants from "../../../configs/constants.js";
const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { sub_cat_name, category_id } = req.body;

    if (!sub_cat_name || sub_cat_name == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Subcategory name"
      );
      return send(res, updatedResponse);
    }
    if (!category_id || category_id == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Category Id"
      );
      return send(res, updatedResponse);
    }

    const catInfo = await categoryModel.find({
      _id: category_id,
      isactive: constants.CONTENT_STATE.IS_ACTIVE,
    });
    if (!catInfo.length) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.NOT_MATCH,
        "Category Id"
      );
      return send(res, updatedResponse);
    }

    await subCategoryModel.create({
      name: sub_cat_name,
      category: category_id,
    });
    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
