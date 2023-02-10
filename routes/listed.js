const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Invested = require("../models/Invested");
const Listed = require("../models/Listed");

router.post("/listproperty", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let listedProperty = await Listed.findOne({
      user: userId,
      id: req.body.id,
    });

    let investedProperty = await Invested.findOne({
      user: userId,
      id: req.body.id,
    });

    if (!listedProperty) {
      listedProperty = await Listed.create({
        user: userId,
        id: req.body.id,
        name: req.body.name,
        units: req.body.units,
      });
      let remainingUnits = investedProperty.units - req.body.units;
      //To Do:If remaining Units Become Zero
      await investedProperty.updateOne({ units: remainingUnits });
      const resMSG = "Property Listed In Marketplace Successfully";
      res.json({ resMSG });
    } else {
      let remainingUnits = investedProperty.units - req.body.units;
      //To Do:If remaining Units Become Zero
      await investedProperty.updateOne({ units: remainingUnits });
      const resMSG = "Property Listed In Marketplace Successfully";
      let totalUnits = listedProperty.units + req.body.units;
      await Listed.updateOne({
        user: userId,
        id: req.body.id,
        units: totalUnits,
      });
      res.json({ resMSG });
    }
  } catch (error) {
    res.json({ error });
  }
});

router.get("/specificlistedproperty", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const listedProperty = await Listed.find({ user: userId });
    res.json({ listedProperty });
  } catch (error) {
    res.json({ error });
  }
});

router.get("/alllistedproperty", async (req, res) => {
  try {
    const listedProperty = await Listed.find({ key: true });
    res.json({ listedProperty });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
