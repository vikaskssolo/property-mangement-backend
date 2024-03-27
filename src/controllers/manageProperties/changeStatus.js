import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import authenticate from "../../middlewares/authenticate.js";
import constants from "../../configs/constants.js";
import propertyModel from "../../models/propertyModel.js";
import wishlistModel from "../../models/wishlistModel.js";
import accountsModel from "../../models/accountsModel.js";
import sendMyMail from "../../middlewares/sendMail.js";
const router = Router();

router.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.VENDOR) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    const prop_status = parseInt(req.body.prop_status);

    const updates = {};
    const id = req.params.id;

    // if (prop_status || prop_status < 5) updates.prop_status = prop_status;
    if (typeof prop_status !== "undefined" && !isNaN(parseInt(prop_status)))
      updates.prop_status = prop_status;

    let wishlistData = await wishlistModel.aggregate([
      {
        $match: {
          $expr: { $eq: ["$property_id", { $toObjectId: id }] },
          isactive: constants.CONTENT_STATE.IS_ACTIVE,
        },
      },
    ]);

    let userData = [];
    for (let i = 0; i < wishlistData.length; i++) {
      let userArr = await accountsModel.aggregate([
        {
          $match: {
            $expr: { $eq: ["$_id", { $toObjectId: wishlistData[i].user_id }] },
          },
        },
      ]);
      userData = userData.concat(userArr[0].email);
    }

    await propertyModel.updateOne({ _id: id }, [{ $set: updates }]);

    if (prop_status == constants.PROP_STATUS.READY_TO_BUY){
    let to = userData;
    let text = "Hurry Up!, You're wishlishted property is now ready to book";
    let subject = "Dream Property is ready to Buy 🏡";
    await sendMyMail(to, subject, text);
    }

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
