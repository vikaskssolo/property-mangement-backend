import { Router } from "express";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import RESPONSE from "../../configs/global.js";
import authenticate from "../../middlewares/authenticate.js";
import constants from "../../configs/constants.js";
import propertyModel from "../../models/propertyModel.js";
import subCatModel from "../../models/subCatModel.js";
import uploads from "../../middlewares/uploads.js";
import multer from "multer";
import s3Upload from "../../middlewares/s3Uploads.js";
const assetUpload = uploads.array("images", 5);
const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    assetUpload(req, res, async function (err) {
      if (!req.files) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Property Image"
        );
        return send(res, updatedResponse);
      } else if (err instanceof multer.MulterError) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.MULTER_ERROR,
          err.message
        );
        return send(res, updatedResponse);
      }

      if (req.user.role != constants.ROLE.VENDOR) {
        return send(res, RESPONSE.NO_ACCESS);
      }

      const {
        property_name,
        city,
        locality,
        description,
        prop_status,
        age,
        flooring,
        price,
        category,
        subcategory,
      } = req.body;

      if (!property_name || property_name == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Property name"
        );
        return send(res, updatedResponse);
      }
      if (!city || city == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "City"
        );
        return send(res, updatedResponse);
      }
      if (!locality || locality == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Locality"
        );
        return send(res, updatedResponse);
      }
      if (!description || description == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Description"
        );
        return send(res, updatedResponse);
      }
      if (!prop_status || prop_status == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "prop_status"
        );
        return send(res, updatedResponse);
      }
      if (!age || age == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Age"
        );
        return send(res, updatedResponse);
      }
      if (!flooring || flooring == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Flooring"
        );
        return send(res, updatedResponse);
      }
      if (!price || price == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Price"
        );
        return send(res, updatedResponse);
      }
      if (!category || category == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Category"
        );
        return send(res, updatedResponse);
      }
      if (!subcategory || subcategory == undefined) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.REQUIRED_PARAMS,
          "Subcategory"
        );
        return send(res, updatedResponse);
      }

      let subCat = await subCatModel.findOne({
        _id: subcategory,
        category: category,
      });
      if (subCat === null) {
        const updatedResponse = setErrorResponseMsg(
          RESPONSE.NOT_MATCH,
          "Category and Subcategory"
        );
        return send(res, updatedResponse);
      }

      // aws s3 image
      // await s3Upload(req.files.originalname, req.files.buffer);
      let filename = [];
      for (let i = 0; i < req.files.length; i++) {
        let data = await s3Upload(
          req.files[i].originalname,
          req.files[i].buffer
        );
        filename.push(data.key);
      }

      await propertyModel.create({
        ...req.body,
        posted_on: new Date(),
        listedby: req.user.id,
        images: filename,
      });

      return send(res, RESPONSE.SUCCESS);
    });
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
