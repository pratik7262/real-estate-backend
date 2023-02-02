const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

const PORT = 5000;

connectToMongo();

const app = express();

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

app.listen(PORT, () => {
  console.log(`listining at http://localhost:${PORT}`);
});
