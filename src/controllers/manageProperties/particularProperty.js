import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import authenticate from "../../middlewares/authenticate.js";
import constants from "../../configs/constants.js";
import propertyModel from "../../models/propertyModel.js";
import moments from "moment";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const { property_id } = req.query;

    if (!property_id || property_id == "") {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "Property id"
      );
      return send(res, updatedResponse);
    }

    let data = await propertyModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$_id", { $toObjectId: property_id }],
          },
          isactive: constants.CONTENT_STATE.IS_ACTIVE,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategory",
          foreignField: "_id",
          as: "subcategoryInfo",
        },
      },
      {
        $unwind: "$subcategoryInfo",
      },
      {
        $lookup: {
          from: "accounts",
          localField: "listedby",
          foreignField: "_id",
          as: "listedby",
        },
      },
      {
        $unwind: "$listedby",
      },
      // {
      //   $sort: { posted_on: -1 },
      // },
    ]);

    data = data.map((itm) => {
      return {
        _id: itm._id,
        property_name: itm.property_name,
        city: itm.city,
        locality: itm.locality,
        bedrooms: itm.bedrooms,
        balconies: itm.balconies,
        bathrooms: itm.bathrooms,
        description: itm.description,
        posted_on: moments(itm.posted_on).format("LL"),
        prop_status: itm.prop_status,
        lift: itm.lift,
        parking: itm.parking,
        age: itm.age,
        flooring: itm.flooring,
        price: itm.price,
        deposit: itm.deposit,
        pay_on_month: itm.pay_on_month,
        images: itm.images.map((img) => {
          return process.env.AWS_URL + img;
        }),
        categoryInfo: {
          _id: itm.categoryInfo._id,
          name: itm.categoryInfo.name,
        },
        subcategoryInfo: {
          _id: itm.subcategoryInfo._id,
          name: itm.subcategoryInfo.name,
        },
        listedby: {
          _id: itm.listedby._id,
          name: itm.listedby.name,
          email: itm.listedby.email,
          phoen: itm.listedby.phone
        }
      };
    });

    return send(res, RESPONSE.SUCCESS, data);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
