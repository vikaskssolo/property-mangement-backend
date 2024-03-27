import mongoose from "mongoose";

const Schema = mongoose.Schema;

const replycmtModel = new Schema({
  replycmt: {
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
  comment: {
    type: Schema.Types.ObjectId,
    ref: "comments",
    required: true,
  },
});

export default mongoose.model("replycomment", replycmtModel);
