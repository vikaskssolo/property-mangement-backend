import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import constants from "../../configs/constants.js";
import propertyModel from "../../models/propertyModel.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    let pipeline = [];
    const properties = parseInt(req.query.properties);

    if (!properties || properties < 1 || properties > 3) {
      const updatedResponse = setErrorResponseMsg(
        RESPONSE.INVALID_DATA,
        "properties"
      );
      return send(res, updatedResponse);
    }

    if (properties == 1) {
      pipeline.push(
        {
          $match: {
            isactive: constants.CONTENT_STATE.IS_ACTIVE,
            prop_status: constants.PROP_STATUS.READY_TO_BUY,
          },
        },
        {
          $sort: { posted_on: -1 },
        }
      );
    }
    if (properties == 2) {
      pipeline.push(
        {
          $match: {
            isactive: constants.CONTENT_STATE.IS_ACTIVE,
            prop_status: constants.PROP_STATUS.UPCOMMING,
          },
        },
        {
          $sort: { posted_on: -1 },
        }
      );
    }
    if (properties == 3) {
      pipeline.push(
        {
          $match: {
            isactive: constants.CONTENT_STATE.IS_ACTIVE,
          },
        },
        {
          $sample: { size: 8 },
        }
      );
    }

    let data = await propertyModel.aggregate(pipeline);

    data = data.map((itm) => {
      return {
        _id: itm._id,
        property_name: itm.property_name,
        city: itm.city,
        locality: itm.locality,
        description: itm.description,
        prop_status: itm.prop_status,
        price: itm.price,
        deposit: itm.deposit,
        images: itm.images.map((img) => {
          return process.env.AWS_URL + img;
        }),
      };
    });

    return send(res, RESPONSE.SUCCESS, data);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
