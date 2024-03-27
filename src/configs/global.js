const RESPONSE = {
  SUCCESS: {
    code: 200,
    message: "Everything worked as expected",
  },
  REQUIRED_PARAMS: {
    code: 201,
    message: "is required parameter!",
  },
  INVALID_DATA: {
    code: 202,
    message: "is invalid input format",
  },
  NOT_MATCH: {
    code: 203,
    message: "is not match",
  },
  ALREADY_EXIST: {
    code: 204,
    message: "is already exist",
  },
  NO_ACCESS: {
    code: 205,
    message: "You didn't have permission to access this API",
  },
  NEED_TO_VERIFY: {
    code: 206,
    message: "Your account need to verification & It's takes some time",
  },
  MULTER_ERROR: {
    code: 207,
    message: "",
  },
  READY_TO_BOOK: {
    code: 208,
    message: "Only Ready to Buy Properties can Book!",
  },
  TOKEN_REQUIRED: {
    code: 400,
    message: "Authentication token is required",
  },
  INVALID_TOKEN: {
    code: 401,
    message: "Authentication token is invalid",
  },
  UNKNOWN_ERROR: {
    code: 500,
    message: "Something went wrong!",
  },
};

export default RESPONSE;
