import { Router } from "express";
import { send, setErrorResponseMsg } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import authenticate from "../../../middlewares/authenticate.js";
import categoryModel from "../../../models/categoryModel.js";
const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { cat_name } = req.body;

    if (!cat_name || cat_name == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Category name"
      );
      return send(res, updatedResponse);
    }

    await categoryModel.create({
      name: cat_name,
    });
    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
