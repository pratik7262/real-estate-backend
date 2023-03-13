const mongoose = require("mongoose");
const { Schema } = mongoose;

const HistorySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userName: {
    type: String,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  genaratedPropertyId: {
    type: String,
  },
  added: {
    type: String,
    default: "-",
  },
  invested: {
    type: String,
    default: "-",
  },
  listed: {
    type: String,
    default: "-",
  },
  units: {
    type: Number,
  },
  price: {
    type: Number,
  },
  id: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("history", HistorySchema);
