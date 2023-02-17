const mongoose = require("mongoose");
const { Schema } = mongoose;

const ListedSchema = new Schema({
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
  key: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("listed", ListedSchema);
