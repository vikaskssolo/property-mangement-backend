import { Router } from "express";
import { send, setErrorResponseMsg } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import accountsModel from "../../../models/accountsModel.js";
import constants from "../../../configs/constants.js";
import authenticate from "../../../middlewares/authenticate.js";
const router = Router();

router.put("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.ADMIN) {
      return send(res, RESPONSE.NO_ACCESS);
    }

    const vendor_id = req.query.vendor_id;
    const verify_status = req.body.verify_status;
    const updates = {};

    if (!vendor_id || vendor_id == "") {
      const updated_response = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "vendor id"
      );
      return send(res, updated_response);
    }

    if (
      verify_status == constants.VERIFY_STATUS.APPROVED ||
      verify_status == constants.VERIFY_STATUS.REJECTED
    )
      updates.verify_status = verify_status;

    await accountsModel.findByIdAndUpdate(vendor_id, updates);

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
