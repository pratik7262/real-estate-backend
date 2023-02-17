const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvestedSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  propertyId: {
    type: mongoose.Types.ObjectId,
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
});

module.exports = mongoose.model("invested", InvestedSchema);
