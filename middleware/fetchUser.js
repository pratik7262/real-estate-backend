const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

const getUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    req.status(401).send({ error: "Please Authenticate using valid token " });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    req.status(401).send({ error: "Please Authenticate using valid token " });
  }
};

module.exports = getUser;