const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Invested = require("../models/Invested");
const Listed = require("../models/Listed");
const Properties = require("../models/Prperties");

router.post("/invest", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let resMSG = "Invested In Property Successfully";
    let investedProperty = await Invested.findOne({
      user: userId,
      propertyId: req.body.propertyId,
    });
   
    const property = await Properties.findOne({ _id: req.body.propertyId });
  
    if (property.units < req.body.units) {
      resMSG = `Sorry Only ${property.units} Units Are Available`;
      res.send({ resMSG });
    } else {
      let remainingUnits = property.units - req.body.units;
      if (!investedProperty) {
        if (remainingUnits === 0) {
          await property.updateOne({ notSold: false });
          await property.updateOne({ units: 0 });
        } else {
          await property.updateOne({ units: remainingUnits });
        }
        investedProperty = await Invested.create({
          user: userId,
          propertyId: req.body.propertyId,
          name: req.body.name,
          units: req.body.units,
          id:Date.now()+'-'+Math.random()
        });

        res.json({ resMSG, investedProperty });
      } else {
        let totalUnits = investedProperty.units + parseInt(req.body.units);
        if (remainingUnits === 0) {
          await property.updateOne({ notSold: false });
          await property.updateOne({ units: 0 });
        } else {
          await property.updateOne({ units: remainingUnits });
        }
        await investedProperty.updateOne({
          units: totalUnits,
        });
        await investedProperty.updateOne({});

        res.json({ resMSG });
      }
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
  let resMSG = "Invested In Property Successfully";
  try {
    const userId = req.user.id;
    let investedProperty = await Invested.findOne({
      user: userId,
      propertyId: req.body.propertyId,
    });
    const listedProperty = await Listed.findOne({
      propertyId: req.body.propertyId,
      user: req.body.sellerId,
    });
    if (listedProperty.units < req.body.units) {
      resMSG = `Sorry Only ${listedProperty.units} Units Are Available`;
      res.send({ resMSG });
    } else {
      if (!investedProperty) {
        investedProperty = await Invested.create({
          user: userId,
          propertyId: req.body.propertyId,
          name: req.body.name,
          units: req.body.units,
          id:Date.now()+'-'+Math.random()
        });
        let remainingUnits = listedProperty.units - req.body.units;
        if (remainingUnits === 0) {
          listedProperty.deleteOne();
          res.json({ resMSG });
        } else {
          await listedProperty.updateOne({ units: remainingUnits });
          res.json({ resMSG });
        }
      } else {
        let totalUnits = investedProperty.units + parseInt(req.body.units);
        await investedProperty.updateOne({
          units: totalUnits,
        });
        let remainingUnits = listedProperty.units - req.body.units;
        if (remainingUnits === 0) {
          listedProperty.deleteOne();
          res.json({ resMSG });
        } else {
          await listedProperty.updateOne({ units: remainingUnits });
          res.json({ resMSG });
        }
      }
    }
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
