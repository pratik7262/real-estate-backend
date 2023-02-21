const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProertySchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
  },
  units: { type: Number },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
  },
  id: {                   //genrated id
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  img: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  notSold: {
    type: Boolean,
    default: true,
  },
});

const Properties = mongoose.model("properties", ProertySchema);

module.exports = Properties;
