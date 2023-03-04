const mongoose = require("mongoose");
const { Schema } = mongoose;

const RentalSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  units: { type: Number },
  propertyId: {
    type: mongoose.Types.ObjectId,
  },
  investedDocumentId: {
    type: mongoose.Types.ObjectId,
  },
  investedDate: {
    type: Date,
  },
  soldDate: {
    type: Date,
  },
  rentalIncomePerSecPerUnit: {
    type: Number,
  },
  rentalIncome: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("rental", RentalSchema);
