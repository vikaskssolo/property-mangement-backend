import { Router } from "express";
import authenticate from "../../../middlewares/authenticate.js";
import { send } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import propertyModel from "../../../models/propertyModel.js";
import bookings from "../../../models/bookings.js";
import constants from "../../../configs/constants.js";
const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.ADMIN) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    let propertyData = await propertyModel.find();

    let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < propertyData.length; i++) {
      let id = propertyData[i]._id;
      const bookData = await bookings.aggregate([
        {
          $match: {
            property_id: id,
            isactive: constants.CONTENT_STATE.IS_ACTIVE,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$booked_on" } },
            count: { $sum: 1 },
          },
        },
      ]);

      for (let j = 0; j < bookData.length; j++) {
        let data = bookData[j];
        let monthIndex = new Date(data._id).getMonth();
        counts[monthIndex] += data.count;
      }
    }

    return send(res, RESPONSE.SUCCESS, { bookingsData: counts });
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
