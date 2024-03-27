import { Router } from "express";
import { send, setErrorResponseMsg } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import authenticate from "../../../middlewares/authenticate.js";
import categoryModel from "../../../models/categoryModel.js";
const router = Router();

router.put("/:id", authenticate, async (req, res) => {
  try {
    const { cat_name } = req.body;
    const id = req.params.id;
    let updates = {};

    if (cat_name || cat_name != "") updates.name = cat_name;

    await categoryModel.updateMany({ _id: id }, [{ $set: updates }]);

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
