const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://pratik7262:a5UOKMvYRZpVP6eM@cluster0.8o2xkrk.mongodb.net/realEstate?retryWrites=true&w=majority"; //mongo uri

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongo;
