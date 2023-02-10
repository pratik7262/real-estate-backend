const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvestedSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },
  id:{
    type: mongoose.Types.ObjectId,
  },
  name:{
    type:String
  },
  units:{
    type:Number
  },
});

module.exports = mongoose.model("invested",InvestedSchema);
