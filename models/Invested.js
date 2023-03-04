const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvestedSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  propertyId: {
    type: mongoose.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  genaratedPropertyId: {
    type: String,
  },
  userName: {
    type: String,
  },
  price: {
    type: Number,
    default: 100,
  },
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  units: {
    type: Number,
  },
  rentalId: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("invested", InvestedSchema);
