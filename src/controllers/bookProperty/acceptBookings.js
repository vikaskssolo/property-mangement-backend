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

router.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.VENDOR) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    const id = req.params.id;

    let bookingData = await bookings.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: id }] },
        },
      },
    ]);

    let propData = await property.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: bookingData[0].property_id }] },
        },
      },
    ]);

    let userData = await accounts.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: bookingData[0].user_id }] },
        },
      },
    ]);

    await bookings.updateMany({ _id: id }, [
      { $set: { isaccepted: constants.BOOKING_STATUS.ACCEPTED } },
    ]);

    // mail
    let subject = "Your Booking is Accepted 🥳";
    let text = `Congrats! Your dream Property ${propData[0].property_name}, worth ₹ ${propData[0].price}, is now yours.`;
    await sendMyMail(userData[0].email, subject, text);

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
