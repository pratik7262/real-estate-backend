const { body, validationResult } = require("express-validator");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
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
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success: success,
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
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ success, authToken });
    } catch (error) {
      res.json({ success, error });
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
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: success, err: "Please Enter Valid Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success: success, err: "Please Enter Valid Credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success: success, authToken });
    } catch (error) {
      res.json({ success, error });
    }
  }
);

router.post("/fetchuser", getUser, async (req, res) => {
  let success=false
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    success=true
    res.status(200).send({success, user});
  } catch (error) {
    res.status(400).send({success,error});
  }
});

module.exports = router;
