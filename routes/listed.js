const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Invested = require("../models/Invested");
const Listed = require("../models/Listed");

router.post("/listproperty", getUser, async (req, res) => {
  let resMSG = "Property Listed In Marketplace Successfully";
  try {
    const userId = req.user.id;
    let listedProperty = await Listed.findOne({
      user: userId,
      propertyId: req.body.propertyId,
    });

    let investedProperty = await Invested.findOne({
      user: userId,
      propertyId: req.body.propertyId,
    });

    if (investedProperty.units < req.body.units) {
      resMSG = resMSG = `You Can Sell ${investedProperty.units} Units `;
      res.send({ resMSG });
    } else {
      if (!listedProperty) {
        listedProperty = await Listed.create({
          user: userId,
          propertyId: req.body.propertyId,
          name: req.body.name,
          units: req.body.units,
          id:Date.now()+'-'+Math.random()
        });
        let remainingUnits = investedProperty.units - req.body.units;
        if (remainingUnits === 0) {
          await investedProperty.delete();
        } else {
          await investedProperty.updateOne({ units: remainingUnits });
        }

        res.json({ resMSG });
      } else {
        let remainingUnits = investedProperty.units - req.body.units;
        if (remainingUnits === 0) {
          await investedProperty.delete();
        } else {
          await investedProperty.updateOne({ units: remainingUnits });
        }
        let totalUnits = listedProperty.units + parseInt(req.body.units);
        await listedProperty.updateOne({
          units: totalUnits,
        });
        res.json({ resMSG });
      }
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
