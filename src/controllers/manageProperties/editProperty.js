import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import authenticate from "../../middlewares/authenticate.js";
import constants from "../../configs/constants.js";
import propertyModel from "../../models/propertyModel.js";
import moments from "moment";
const router = Router();

router.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.VENDOR) {
      return send(res, RESPONSE.NO_ACCESS);
    }

    const {
      property_name,
      city,
      locality,
      description,
      // prop_status,
      age,
      flooring,
      price,
      //   category,
      //   subcategory,
    } = req.body;

    const updates = {};
    const id = req.params.id;

    if (property_name || property_name != "")
      updates.property_name = property_name;
    if (city || city != "") updates.city = city;
    if (locality || locality != "") updates.locality = locality;
    if (description || description != "") updates.description = description;
    if (age || age != "") updates.age = age;
    if (flooring || flooring != "") updates.flooring = flooring;
    if (price || price != "") updates.price = price;

    await propertyModel.updateMany({ _id: id }, [{ $set: updates }]);

    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
