import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import accountsModel from "../../models/accountsModel.js";
import constants from "../../configs/constants.js";
import authenticate from "../../middlewares/authenticate.js";
const router = Router();

router.put("/", authenticate, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updates = {};

    if (name || name != "") updates.name = name;

    if (email || email != "") {
      const emailPattern = String(email).match(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      );
      if (
        !emailPattern ||
        emailPattern.length <= 0 ||
        email.indexOf(" ") >= 0
      ) {
        const updated_response = setErrorResponseMsg(
          RESPONSE.INVALID_DATA,
          "Email"
        );
        return send(res, updated_response);
      } else {
        updates.email = email;
      }
    }

    if (phone || phone != "") {
      const phoneNumberPattern = String(phone).match(/^\+\d{10,15}$/);
      if (
        !phoneNumberPattern ||
        phoneNumberPattern.length <= 0 ||
        String(phone).indexOf(" ") >= 0
      ) {
        const updated_response = setErrorResponseMsg(
          RESPONSE.INVALID_DATA,
          "Phone no."
        );
        return send(res, updated_response);
      } else {
        updates.phone = phone;
      }
    }

    await accountsModel.updateMany({ _id: req.user.id }, [{ $set: updates }]);

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
