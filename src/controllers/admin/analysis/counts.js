import { Router } from "express";
import authenticate from "../../../middlewares/authenticate.js";
import { send } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import propertyModel from "../../../models/propertyModel.js";
import accounts from "../../../models/accountsModel.js";
import constants from "../../../configs/constants.js";
const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.ADMIN) {
      return send(res, RESPONSE.NO_ACCESS);
    }

    let userCount = await accounts.aggregate([
      {
        $match: {
          isactive: constants.CONTENT_STATE.IS_ACTIVE,
          role: constants.ROLE.CUSTOMER,
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    let vendorCount = await accounts.aggregate([
      {
        $match: {
          isactive: constants.CONTENT_STATE.IS_ACTIVE,
          role: constants.ROLE.VENDOR,
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    let propertyCount = await propertyModel.aggregate([
      {
        $match: {
          isactive: constants.CONTENT_STATE.IS_ACTIVE,
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    return send(res, RESPONSE.SUCCESS, {
      totalUser: userCount[0].count,
      totalVendor: vendorCount[0].count,
      totalProperty: propertyCount[0].count,
    });
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
