// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const tokenSchema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: "user",
//     required: true,
//   },
//   token: {
//     type: String,
//     required: true,
//   },
// });

// const Token = mongoose.model("token", tokenSchema);

// module.exports = Token;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const TokenSchema = new Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId
   },
   TokenSchema:{
    type:String
   }
});

const Token = mongoose.model("token", TokenSchema);

module.exports =Token;
