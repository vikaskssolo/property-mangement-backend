import { Router } from "express";
import RESPONSE from "../../configs/global.js";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import authenticate from "../../middlewares/authenticate.js";
import bookings from "../../models/bookings.js";
import property from "../../models/propertyModel.js";
import accounts from "../../models/accountsModel.js";
import constants from "../../configs/constants.js";
import sendMyMail from "../../middlewares/sendMail.js";
const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.CUSTOMER) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    const { property_id } = req.body;

    if (!property_id || property_id == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Property id"
      );
      return send(res, updatedResponse);
    }

    let bookData = await bookings.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: ["$property_id", { $toObjectId: property_id }] } },
            { $expr: { $eq: ["$user_id", { $toObjectId: req.user.id }] } },
            { isactive: constants.CONTENT_STATE.IS_ACTIVE },
          ],
        },
      },
    ]);
    if (bookData.length) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.ALREADY_EXIST,
        "Bookings"
      );
      return send(res, updatedResponse);
    }

    let propData = await property.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: property_id }] },
          prop_status: constants.PROP_STATUS.READY_TO_BUY,
        },
      },
    ]);

    let userData = await accounts.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: propData[0].listedby }] },
        },
      },
    ]);

    if (propData.length) {
      // dao
      await bookings.create({
        user_id: req.user.id,
        property_id: property_id,
        vendor_id: propData[0].listedby,
        booked_on: new Date(),
      });

      // mail
      let subject = "Property is Booked! 🏡";
      let text = `${req.user.name} has Booked Your property ${propData[0].property_name}, Confirm in the Dashboard`;
      let to = userData[0].email;
      await sendMyMail(to, subject, text);
    } else {
      return send(res, RESPONSE.READY_TO_BOOK);
    }

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
