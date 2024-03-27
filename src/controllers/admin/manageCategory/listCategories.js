import { Router } from "express";
import { send, setErrorResponseMsg } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import categoryModel from "../../../models/categoryModel.js";
import constants from "../../../configs/constants.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    let data = await categoryModel.aggregate([
      {
        $match: {
          isactive: constants.CONTENT_STATE.IS_ACTIVE,
        },
      },
    ]);
    return send(res, RESPONSE.SUCCESS, data);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
