import { Router } from "express";
import RESPONSE from "../../configs/global.js";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import authenticate from "../../middlewares/authenticate.js";
import bookings from "../../models/bookings.js";
import constants from "../../configs/constants.js";
import moment from "moment";
const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    if (req.user.role == constants.ROLE.ADMIN) {
      return send(res, RESPONSE.NO_ACCESS);
    }
 
    let data;

    // vendor
    if (req.user.role == constants.ROLE.VENDOR) {
      data = await bookings.aggregate([
        {
          $match: {
            $expr: { $eq: ["$vendor_id", { $toObjectId: req.user.id }] },
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
        {
          $lookup: {
            from: "accounts",
            localField: "user_id",
            foreignField: "_id",
            as: "accountInfo",
          },
        },
        {
          $unwind: "$accountInfo",
        },
      ]);
    }

    // user
    if (req.user.role == constants.ROLE.CUSTOMER) {
      data = await bookings.aggregate([
        {
          $match: {
            $expr: { $eq: ["$user_id", { $toObjectId: req.user.id }] },
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
        {
          $lookup: {
            from: "accounts",
            localField: "vendor_id",
            foreignField: "_id",
            as: "accountInfo",
          },
        },
        {
          $unwind: "$accountInfo",
        },
        {
          $sort: { booked_on: -1 },
        },
      ]);
    }

    data = data.map((itm) => {
      return {
        bookin_id: itm._id,
        isactive: itm.isactive,
        booked_on: moment(itm.booked_on).format("LL"),
        isaccepted: itm.isaccepted,
        propertyInfo: {
          property_id: itm.propertyInfo._id,
          property_name: itm.propertyInfo.property_name,
          city: itm.propertyInfo.city,
          locality: itm.propertyInfo.locality,
          description: itm.propertyInfo.description,
          prop_status: itm.propertyInfo.prop_status,
          price: itm.propertyInfo.price,
          deposit: itm.propertyInfo.deposit,
          images: itm.propertyInfo.images.map((img) => {
            return process.env.AWS_URL + img;
          }),
        },
        accountInfo: {
          account_id: itm.accountInfo._id,
          name: itm.accountInfo.name,
          role: itm.accountInfo.role,
          email: itm.accountInfo.email,
          phone: itm.accountInfo.phone,
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
