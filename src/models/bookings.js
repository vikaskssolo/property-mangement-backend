import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookingsModel = new Schema({
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
  vendor_id: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
  booked_on: {
    type: Date,
    required: true,
  },
  isaccepted: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("bookings", bookingsModel);
