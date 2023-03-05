const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Rental = require("../models/Rental");

router.get("/specificrentalincome", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const rental = await Rental.find({ user: userId });
    res.json({ rental });
  } catch (error) {
    res.json({ error });
  }
});

router.get("/allrental", async (req, res) => {
    try {
      const rental = await Rental.find({ unpaid:true });
      res.json({ rental });
    } catch (error) {
      res.json({ error });
    }
  });


module.exports = router;
