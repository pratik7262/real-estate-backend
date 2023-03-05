const mongoose = require("mongoose");
const { Schema } = mongoose;

let id =
  Date.now() + "-" + Math.random() + "@" + Math.floor(Math.random() * 900000);

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
  id: { type: String, default: id },
  soldDate: {
    type: Date,
  },
  unpaid:{
    type:Boolean
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
