const { body, validationResult } = require("express-validator");
const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post(
  "/",
  [
    body("name", "Enter A Valid Name").isLength({ min: 3 }),
    body("email", "Enter A Valid Email").isEmail(),
    body("password",'Enter A Password Of Min * Charecters').isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  }
);

module.exports = router;
