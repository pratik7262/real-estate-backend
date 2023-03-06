const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Holding = require("../models/Holding");

router.get("/getholdings", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let holdings = await Holding.find({ user: userId });
    res.json({ holdings });
  } catch (error) {
    res.json({ error });
  }
});

module.exports=router