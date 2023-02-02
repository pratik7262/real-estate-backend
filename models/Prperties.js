const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProertySchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
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
  price:{
    type:Number,
    required:true
  },
  area:{
    type:Number,
    required:true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});


const Properties= mongoose.model("properties", ProertySchema);

module.exports = Properties;
