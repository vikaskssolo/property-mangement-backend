import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentModel = new Schema({
  comment: {
    type: String,
    required: true,
  },
  isactive: {
    type: Number,
    default: 1,
  },
  posted_on: {
    type: Date,
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "properties",
    required: true,
  },
});

export default mongoose.model("comments", commentModel);
