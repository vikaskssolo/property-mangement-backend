import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import commentModel from "../../models/commentModel.js";
import replyModel from "../../models/cmtRplyModel.js";
import constants from "../../configs/constants.js";
import RESPONSE from "../../configs/global.js";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const { property_id } = req.query;
    if (!property_id || property_id == undefined) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "property_id"
      );
      return send(res, updatedResponse);
    }

    let data = await commentModel.aggregate([
      {
        $lookup: {
          from: "replycomments",
          let: { commentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$comment", "$$commentId"],
                },
                isactive: constants.CONTENT_STATE.IS_ACTIVE,
              },
            },
          ],
          as: "replies",
        },
      },
      {
        $match: {
          $expr: { $eq: ["$property", { $toObjectId: property_id }] },
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
