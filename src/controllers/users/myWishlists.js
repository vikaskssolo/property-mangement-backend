import { Router } from "express";
import RESPONSE from "../../configs/global.js";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import authenticate from "../../middlewares/authenticate.js";
import wishlist from "../../models/wishlistModel.js";
import constants from "../../configs/constants.js";
const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.CUSTOMER) {
      return send(res, RESPONSE.NO_ACCESS);
    }

    let data = await wishlist.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$user_id", { $toObjectId: req.user.id }],
          },
          isactive: constants.CONTENT_STATE.IS_ACTIVE,
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "property_id",
          foreignField: "_id",
          as: "propertyInfo",
        },
      },
      {
        $unwind: "$propertyInfo",
      },
    ]);

    data = data.map((itm) => {
      return {
        _id: itm._id,
        isactive: itm.isactive,
        propertyInfo: {
          _id: itm.propertyInfo._id,
          property_name: itm.propertyInfo.property_name,
          city: itm.propertyInfo.city,
          locality: itm.propertyInfo.locality,
          images: itm.propertyInfo.images.map((img) => {
            return process.env.AWS_URL + img;
          }),
        },
      };
    });

    return send(res, RESPONSE.SUCCESS, data);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
