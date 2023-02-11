const jwt = require("jsonwebtoken");

require('dotenv').config();

const getUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please Authenticate using valid token " });
  }
  try {
    const data = jwt.verify(token,process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send();
  }
};

module.exports = getUser;
