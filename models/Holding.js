const mongoose = require("mongoose");
const { Schema } = mongoose;

const HoldingSchema = new Schema({
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
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  subtype: {
    type: String,
  },
  area: {
    type: Number,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  investments: [
    {
      date: {
        type: Date,
        default: Date.now,
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
    },
  ],
});

module.exports = mongoose.model("holding", HoldingSchema);
