import jwt from "jsonwebtoken";
import { send } from "../helper/responseHelper.js";
import RESPONSE from "../configs/global.js";

const authenticate = (req, res, next) => {
  const token = req.headers["access_token"];

  if (!token) {
    return send(res, RESPONSE.TOKEN_REQUIRED);
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKENKEY);
    req.user = decoded;
  } catch (err) {
    return send(res, RESPONSE.INVALID_TOKEN);
  }
  return next();
};

export default authenticate;
