const mongoose = require("mongoose");
require('dotenv').config();
mongoose.set("strictQuery", true);
const mongoURI =process.env.MONGO_URI
const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
