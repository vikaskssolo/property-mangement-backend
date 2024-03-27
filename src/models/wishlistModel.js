import mongoose from "mongoose";

const Schema = mongoose.Schema;

const wishlistModel = new Schema({
  isactive: {
    type: Number,
    default: 1,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
  property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties",
    required: true,
  },
});

export default mongoose.model("wishlists", wishlistModel);
