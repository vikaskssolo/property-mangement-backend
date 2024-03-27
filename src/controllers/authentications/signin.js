import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import accountsModel from "../../models/accountsModel.js";
import bcrypt from "bcrypt";
import constants from "../../configs/constants.js";
import jwtTokenCreation from "../../middlewares/jwtTokenCreation.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Email/Phone"
      );
      return send(res, updatedResponse);
    }
    if (!password || password == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Password"
      );
      return send(res, updatedResponse);
    }

    const userData = await accountsModel.findOne({
      isactive: constants.CONTENT_STATE.IS_ACTIVE,
      // verify_status: constants.VERIFY_STATUS.APPROVED,
      $or: [{ email: username }, { phone: username }],
    });

    if (userData && userData.verify_status != constants.VERIFY_STATUS.APPROVED) {
      return send(res, RESPONSE.NEED_TO_VERIFY);
    }

    if (userData && (await bcrypt.compare(password, userData.password))) {
      const token = await jwtTokenCreation(
        userData._id,
        userData.name,
        userData.role,
        userData.email,
        userData.phone
      );

      return send(res, RESPONSE.SUCCESS, {
        role: userData.role,
        access_token: token,
      });
    } else {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.NOT_MATCH,
        "Email/Phone and Password"
      );
      return send(res, updatedResponse);
    }
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
