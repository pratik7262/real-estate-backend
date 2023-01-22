const { body, validationResult } = require("express-validator");
const express = require("express");
const User = require("../models/User");
const router = express.Router();

//Create User Endpont login not required
router.post(
  "/createUser",
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
      user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });

      res.json(user);
    } catch (error) {
        res.json(error)
    }
  }
);

module.exports = router;
