import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import replyModel from "../../models/cmtRplyModel.js";
import constants from "../../configs/constants.js";
import RESPONSE from "../../configs/global.js";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.VENDOR) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    const { reply, comment_id } = req.body;

    if (!reply || reply == undefined) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "reply"
      );
      return send(res, updatedResponse);
    }
    if (!comment_id || comment_id == undefined) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "comment_id"
      );
      return send(res, updatedResponse);
    }

    await replyModel.create({
      replycmt: reply,
      posted_on: new Date(),
      comment: comment_id,
    });
    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});
export default router;
