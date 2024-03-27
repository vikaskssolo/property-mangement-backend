import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import constants from "../../configs/constants.js";
import propertyModel from "../../models/propertyModel.js";
import moments from "moment";
const router = Router();

router.get("/", async (req, res) => {
  try {
    let query = {};
    const prop_status = parseInt(req.query.prop_status);
    const { cattegory_id, subcat_id } = req.query;

    if (!cattegory_id || cattegory_id == undefined) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "cattegory_id"
      );
      return send(res, updatedResponse);
    }
    if (!subcat_id || subcat_id == undefined) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.REQUIRED_PARAMS,
        "subcat_id"
      );
      return send(res, updatedResponse);
    }

    query.isactive = constants.CONTENT_STATE.IS_ACTIVE;
    if (prop_status) query.prop_status = prop_status;
    query.$expr = {
      $and: {
        $eq: ["$category", { $toObjectId: cattegory_id }],
        $eq: ["$subcategory", { $toObjectId: subcat_id }],
      },
    };

    let data = await propertyModel.aggregate([
      {
        $match: query,
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
        $sort: { posted_on: -1 },
      },
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
      };
    });

    return send(res, RESPONSE.SUCCESS, data);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
