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
    const { name, role, email, phone, password, cnfrm_pwd } = req.body;

    if (!name || name == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Name"
      );
      return send(res, updatedResponse);
    }
    if (!role || role == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Role"
      );
      return send(res, updatedResponse);
    }

    if (!email || email == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Email"
      );
      return send(res, updatedResponse);
    }
    const emailPattern = String(email).match(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    );
    if (!emailPattern || emailPattern.length <= 0 || email.indexOf(" ") >= 0) {
      const updated_response = setErrorResponseMsg(
        RESPONSE.INVALID_DATA,
        "Email"
      );
      return send(res, updated_response);
    }

    if (!phone || phone == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Phone no."
      );
      return send(res, updatedResponse);
    }
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
    }

    if (!password || password == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Password"
      );
      return send(res, updatedResponse);
    }
    const passwordPattern = String(password).match(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,32}$/
    );
    if (
      !passwordPattern ||
      passwordPattern.length <= 0 ||
      password.indexOf(" ") >= 0
    ) {
      const updated_response = setErrorResponseMsg(
        RESPONSE.INVALID_DATA,
        "Password"
      );
      return send(res, updated_response);
    }

    if (password !== cnfrm_pwd) {
      const updated_response = setErrorResponseMsg(
        RESPONSE.NOT_MATCH,
        "Password & Confirm password"
      );
      return send(res, updated_response);
    }

    const emailAlreadyExist = await accountsModel.findOne({
      email: email,
      isactive: constants.CONTENT_STATE.IS_ACTIVE,
    });
    if (emailAlreadyExist) {
      const updated_response = setErrorResponseMsg(
        RESPONSE.ALREADY_EXIST,
        "Email"
      );
      return send(res, updated_response);
    }
    const phoneAlreadyExist = await accountsModel.findOne({
      phone: phone,
      isactive: constants.CONTENT_STATE.IS_ACTIVE,
    });
    if (phoneAlreadyExist) {
      const updated_response = setErrorResponseMsg(
        RESPONSE.ALREADY_EXIST,
        "Phone"
      );
      return send(res, updated_response);
    }

    const userData = await accountsModel.create({
      name: name,
      role:
        role == constants.ROLE.VENDOR
          ? constants.ROLE.VENDOR
          : constants.ROLE.CUSTOMER,
      email: email,
      phone: phone,
      password: await bcrypt.hash(password, constants.SALTROUND),
      verify_status:
        role == constants.ROLE.VENDOR
          ? constants.VERIFY_STATUS.PENDING
          : constants.VERIFY_STATUS.APPROVED,
      created_at: new Date().getTime(),
    });

    let token = null;
    if (role != constants.ROLE.VENDOR) {
      token = await jwtTokenCreation(
        userData._id,
        userData.name,
        userData.role,
        userData.email,
        userData.phone
      );
    }

    return send(res, RESPONSE.SUCCESS, {
      role: userData.role,
      access_token: token ?? "Account need to verify",
    });
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
