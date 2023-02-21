const mongoose = require("mongoose");
const { Schema } = mongoose;

const ListedSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },

  propertyId: {
    type: mongoose.Types.ObjectId,
  },
  genaratedPropertyId: {
    type: String,
  },
  userName: {
    type: String,
  },
  price: {
    type: Number,
  },
  oldPrice: {
    type: Number,
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
  key: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("listed", ListedSchema);
