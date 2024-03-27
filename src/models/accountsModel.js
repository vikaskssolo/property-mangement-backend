import mongoose from "mongoose";

const accountModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isactive: {
    type: Number,
    default: 1,
  },
  verify_status: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("accounts", accountModel);
