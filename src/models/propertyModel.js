import mongoose from "mongoose";

const Schema = mongoose.Schema;

const propertyModel = new Schema({
  property_name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    default: false,
  },
  balconies: {
    type: Number,
    default: false,
  },
  bathrooms: {
    type: Number,
    default: false,
  },
  images: {
    data: Buffer,
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  posted_on: {
    type: Date,
    required: true,
  },
  prop_status: {
    type: Number,
    required: true,
  },
  lift: {
    type: Number,
    default: false,
  },
  parking: {
    type: Number,
    default: false,
  },
  age: {
    type: String,
    required: true,
  },
  flooring: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    default: false,
  },
  pay_on_month: {
    type: Number,
    default: false,
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
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "subcategories",
    required: true,
  },
  listedby: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
});

export default mongoose.model("properties", propertyModel);