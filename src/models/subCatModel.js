import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subCatModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  isactive: {
    type: Number,
    default: 1,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
});

export default mongoose.model("subcategories", subCatModel);
