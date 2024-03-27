import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import commentModel from "../../models/commentModel.js";
import constants from "../../configs/constants.js";
import RESPONSE from "../../configs/global.js";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.ADMIN) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    const { comment, property_id } = req.body;

    if (!comment || comment == undefined) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Comment"
      );
      return send(res, updatedResponse);
    }
    if (!property_id || property_id == undefined) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "property_id"
      );
      return send(res, updatedResponse);
    }

    await commentModel.create({
      comment: comment,
      posted_on: new Date(),
      property: property_id,
    });
    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
export default router;
