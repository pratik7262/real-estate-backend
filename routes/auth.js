const { body, validationResult } = require("express-validator");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = require("../config");

//Create User Endpont login not required
router.post(
  "/signup",
  [
    body("name", "Enter A Valid Name").isLength({ min: 3 }),
    body("email", "Enter A Valid Email").isEmail(),
    body("password", "Enter A Password Of Min * Charecters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          err: "Please Enter Unique Email User With This Email Already Exist",
        });
      }

      let salt = await bcrypt.genSalt(5);
      let seccPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: seccPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      res.json(error);
    }
  }
);

router.post(
  "/signin",
  [
    body("email", "Enter A Valid Email").isEmail(),
    body("password", "Enter A Password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          err: "Please Enter Valid Credentials",
        });
      }

      const passwordCompare =await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({
          err: "Please Enter Valid Credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (error) {
      res.json(error);
    }
  }
);

module.exports = router;
