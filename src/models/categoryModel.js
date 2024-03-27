import mongoose from "mongoose";

const categoryModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isactive: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("categories", categoryModel);
