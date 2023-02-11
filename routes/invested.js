const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Invested = require("../models/Invested");
const Listed = require("../models/Listed");
const Properties = require("../models/Prperties");

router.post("/invest", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let investedProperty = await Invested.findOne({
      user: userId,
      id: req.body.id,
    });
    const property = await Properties.findOne({ _id: req.body.id });
    if (!investedProperty) {
      investedProperty = await Invested.create({
        user: userId,
        id: req.body.id,
        name: req.body.name,
        units: req.body.units,
      });
      let remainingUnits = property.units - req.body.units;
      //ToDo:if remaining units==0
      await property.updateOne({ units: remainingUnits });
      const resMSG = "Invested In Property Successfully";
      res.json({ resMSG, investedProperty });
    } else {
      const resMSG = "Invested In Property Successfully";
      let totalUnits = investedProperty.units + req.body.units;
      await Invested.updateOne({
        user: userId,
        id: req.body.id,
        units: totalUnits,
      });
      //ToDo:if remaining units==0
      let remainingUnits = property.units - req.body.units;
      await property.updateOne({ units: remainingUnits });
      res.json({ resMSG });
    }
  } catch (error) {
    res.json();
  }
});

router.get("/specificinvestedproperty", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const investedProperty = await Invested.find({ user: userId });
    res.json({ investedProperty });
  } catch (error) {
    res.json({ error });
  }
});

router.post("/investinlistedproperty", getUser, async (req, res) => {
  // try {
    const userId = req.user.id;
    let investedProperty = await Invested.findOne({
      user: userId,
      id: req.body.id,
    });
    const listedProperty = await Listed.findOne({
      id: req.body.id,
      user: req.body.sellerId,
    });
    if (!investedProperty) {
      investedProperty = await Invested.create({
        user: userId,
        id: req.body.id,
        name: req.body.name,
        units: req.body.units,
      });
      let remainingUnits = listedProperty.units - req.body.units;
      //To Do:If remaining Units Become Zero
      await listedProperty .updateOne({ units: remainingUnits });
      const resMSG = "Invested In Property Successfully";
      res.json({ resMSG, investedProperty });
    } else {
      const resMSG = "Invested In Property Successfully";
      let totalUnits = investedProperty.units + req.body.units;
      await investedProperty.updateOne({
        units: totalUnits,
      });
      let remainingUnits = listedProperty.units - req.body.units;
      //To Do:If remaining Units Become Zero
      await listedProperty.updateOne({ units: remainingUnits });
      res.json({ resMSG });
    }
  // } catch (error) {
  //   res.json({error});
  // }
});

module.exports = router;