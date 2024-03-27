import { Router } from "express";
import { send, setErrorResponseMsg } from "../../../helper/responseHelper.js";
import RESPONSE from "../../../configs/global.js";
import subCategoryModel from "../../../models/subCatModel.js";
import constants from "../../../configs/constants.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    let { category_id } = req.query;
    let data = await subCategoryModel.aggregate([
      {
        $match: {
          $expr: { $eq: ["$category", { $toObjectId: category_id }] },
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
        $group: {
          _id: "$categoryInfo",
          subCategories: {
            $push: {
              _id: "$_id",
              name: "$name",
              isactive: "$isactive",
            },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          subCategories: 1,
          _id: 0,
        },
      },
    ]);

    return send(res, RESPONSE.SUCCESS, data);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
