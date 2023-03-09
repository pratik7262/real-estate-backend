const mongoose = require("mongoose");
const { Schema } = mongoose;

const RentalSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  userName: { type: String },
  units: { type: Number },
  propertyId: {
    type: mongoose.Types.ObjectId,
  },
  investedDocumentId: {
    type: mongoose.Types.ObjectId,
  },
  genaratedId: {
    type: String,
  },
  investedDate: {
    type: Date,
  },
  id: { type: String },
  soldDate: {
    type: Date,
  },
  unpaid: {
    type: Boolean,
  },
  rentalIncomePerSecPerUnit: {
    type: Number,
  },
  paidRentalIncome: { type: Number, default: 0 },
  rentalIncome: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("rental", RentalSchema);
