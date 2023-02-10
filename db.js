const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const mongoURI =
  "mongodb+srv://realEstate:MHf40SCQRQE4DoVC@cluster0.3tphinl.mongodb.net/realEstate?retryWrites=true&w=majority"; //mongo uri

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
