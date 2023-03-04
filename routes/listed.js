const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Invested = require("../models/Invested");
const Listed = require("../models/Listed");
const Rental = require("../models/Rental");
const User = require("../models/User");

router.post("/listproperty", getUser, async (req, res) => {
  let resMSG = "Property Listed In Marketplace Successfully";
  // try {
  const userId = req.user.id;
  let listedProperty = await Listed.findOne({
    user: userId,
    propertyId: req.body.propertyId,
    price: req.body.price,
  });

  let investedProperty = await Invested.findOne({
    id: req.body.id,
  });

 



  const user = await User.findOne({ _id: userId });

  if (investedProperty.units < req.body.units) {
    resMSG = resMSG = `You Can Sell ${investedProperty.units} Units `;
    res.send({ resMSG });
  } else {
    if (!listedProperty) {
      listedProperty = await Listed.create({
        user: userId,
        userName: user.name,
        propertyId: req.body.propertyId,
        name: req.body.name,
        units: req.body.units,
        genaratedPropertyId: investedProperty.genaratedPropertyId,
        price: req.body.price,
        oldPrice: investedProperty.price,
        id:
          Date.now() +
          "-" +
          Math.random() +
          "@" +
          Math.floor(Math.random() * 900000),
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
  // } catch (error) {
  //   res.json({ error });
  // }
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
  } catch (error) {
    res.json({ error });
  }
});

router.post("/deleteListedProperty", getUser, async (req, res) => {
  let resMSG = "Some Error Occured";
  try {
    const userId = req.user.id;
    let listedProperty = await Listed.findOne({ _id: req.body.id });

    let investedProperty = await Invested.findOne({
      user: userId,
      propertyId: listedProperty.propertyId,
      price: listedProperty.oldPrice,
    });

    if (!investedProperty) {
      investedProperty = await Invested.create({
        user: userId,
        propertyId: listedProperty.propertyId,
        genaratedPropertyId: listedProperty.genaratedPropertyId,
        name: listedProperty.name,
        userName: listedProperty.userName,
        price: listedProperty.oldPrice,
        units: listedProperty.units,
        id:
          Date.now() +
          "-" +
          Math.random() +
          "@" +
          Math.floor(Math.random() * 900000),
      });
      await listedProperty.deleteOne();
    } else {
      let actualUnits = investedProperty.units + listedProperty.units;
      await investedProperty.updateOne({ units: actualUnits });
      await listedProperty.deleteOne();
    }

    resMSG = "Property Removed Successfully";
    res.json({ resMSG });
  } catch (error) {
    res.status(400).json({ resMSG });
  }
});

module.exports = router;
