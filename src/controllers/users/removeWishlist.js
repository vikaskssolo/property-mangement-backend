import { Router } from "express";
import RESPONSE from "../../configs/global.js";
import { send, setErrorResponseMsg } from "../../helper/responseHelper.js";
import authenticate from "../../middlewares/authenticate.js";
import wishlist from "../../models/wishlistModel.js";
import constants from "../../configs/constants.js";
const router = Router();

router.delete("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role != constants.ROLE.CUSTOMER) {
      return send(res, RESPONSE.NO_ACCESS);
    }
    const id = req.params.id;
    await wishlist.updateOne({ _id: id }, [
      { $set: { isactive: constants.CONTENT_STATE.NOT_AVTIVE } },
    ]);
    return send(res, RESPONSE.SUCCESS);
  } catch (err) {
    console.log(err.message);
    return send(res, RESPONSE.UNKNOWN_ERROR);
  }
});

export default router;
