import { Router } from "express";
import { send } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import accountsModel from "../../../models/accountsModel.js";
import constants from "../../../configs/constants.js";
import authenticate from "../../../middlewares/authenticate.js";
const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.ADMIN) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    // let query = {};
    let filter = parseInt(req.query.status);
    // query.isactive = CONTENT_STATE.IS_ACTIVE;
    // query.role = ROLE.VENDOR;
    // if (filter) query.verify_status = filter;

    // let data = await accountsModel.find(query);

    let pipeline = [];
    pipeline.push({ $sort: { created_at: -1 } });

    pipeline.push({
      $match: {
        isactive: constants.CONTENT_STATE.IS_ACTIVE,
        role: constants.ROLE.VENDOR,
      },
    });

    if (filter) {
      pipeline.push({
        $match: {
          verify_status: filter,
        },
      });
    }

    let data = await accountsModel.aggregate(pipeline).exec();

    data = data.map((itm) => ({
      vendor_id: itm._id,
      name: itm.name,
      role: itm.role,
      email: itm.email,
      phone: itm.phone,
      verify_status: itm.verify_status,
    }));
    return send(res, RESPONSE.SUCCESS, data);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
