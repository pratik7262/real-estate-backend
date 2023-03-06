const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser=require('body-parser')
require('dotenv').config();

const port=process.env.PORT||5000

connectToMongo();

const app = express();
app.use('/uploads',express.static('uploads'))
app.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
  })
);


app.use(express.json());

//available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/property", require("./routes/property"));
app.use("/api/invested", require("./routes/invested"));
app.use("/api/listed", require("./routes/listed"));
app.use("/api/rental", require("./routes/rental"));
app.use("/api/holding", require("./routes/holding"));

app.listen(port, () => {
  console.log(`listining at http://localhost:${port}`);
});
