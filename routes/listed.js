const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const History = require("../models/History");
const Holding = require("../models/Holding");
const Invested = require("../models/Invested");
const Listed = require("../models/Listed");
const Properties = require("../models/Prperties");
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

  let holding = await Holding.findOne({
    user: userId,
    propertyId: req.body.propertyId,
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

      await History.create({
        user: userId,
        userName: user.name,
        propertyId: req.body.propertyId,
        genaratedPropertyId: investedProperty.genaratedPropertyId,
        listed: investedProperty.genaratedPropertyId,
        price: req.body.price,
        units: req.body.units,
        id: userId + Date.now() + Math.floor(Math.random() * 9000000000) + "id",
      });

      let remainingUnits = investedProperty.units - req.body.units;
      if (remainingUnits === 0) {
        holding.investments.forEach(async (ele) => {
          if (ele.price === investedProperty.price) {
            let newInvestment = holding.investments;
            let index = holding.investments.indexOf(ele);
            if (index !== -1) {
              newInvestment.splice(index, 1);
              await holding.updateOne({ investments: newInvestment });
            }
          }
        });
        await investedProperty.updateOne({ units: 0, isZero: true });
      } else {
        await investedProperty.updateOne({ units: remainingUnits });
        holding.investments.forEach(async (ele) => {
          if (ele.price === investedProperty.price) {
            let newInvestment = holding.investments;
            let newElement = {
              date: ele.date,
              units: remainingUnits,
              price: ele.price,
              id: investedProperty.id,
            };
            let index = holding.investments.indexOf(ele);
            if (index !== -1) {
              newInvestment.splice(index, 1);
              newInvestment.push(newElement);
              await holding.updateOne({ investments: newInvestment });
            }
          }
        });
      }

      res.json({ resMSG });
    } else {
      let remainingUnits = investedProperty.units - req.body.units;
      if (remainingUnits === 0) {
        holding.investments.forEach(async (ele) => {
          if (ele.price === investedProperty.price) {
            let newInvestment = holding.investments;
            let index = holding.investments.indexOf(ele);
            if (index !== -1) {
              newInvestment.splice(index, 1);
              await holding.updateOne({ investments: newInvestment });
            }
          }
        });
        await investedProperty.updateOne({ units: 0, isZero: true });
      } else {
        await investedProperty.updateOne({ units: remainingUnits });
        holding.investments.forEach(async (ele) => {
          if (ele.price === investedProperty.price) {
            let newInvestment = holding.investments;
            let newElement = {
              date: ele.date,
              units: remainingUnits,
              price: ele.price,
              id: investedProperty.id,
            };
            let index = holding.investments.indexOf(ele);
            if (index !== -1) {
              newInvestment.splice(index, 1);
              newInvestment.push(newElement);
              await holding.updateOne({ investments: newInvestment });
            }
          }
        });
      }
      let totalUnits = listedProperty.units + parseInt(req.body.units);
      await listedProperty.updateOne({
        units: totalUnits,
      });

      await History.create({
        user: userId,
        userName: user.name,
        propertyId: req.body.propertyId,
        genaratedPropertyId: investedProperty.genaratedPropertyId,
        listed: investedProperty.genaratedPropertyId,
        price: req.body.price,
        units: req.body.units,
        id: userId + Date.now() + Math.floor(Math.random() * 9000000000) + "id",
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

router.post("/deleteListedProperty", getUser, async (req, res) => {
  let resMSG = "Some Error Occured";
  try {
  const userId = req.user.id;
  let listedProperty = await Listed.findById(req.body.id);

  let investedProperty = await Invested.findOne({
    user: userId,
    propertyId: listedProperty.propertyId,
    price: listedProperty.oldPrice,
  });

  let property = await Properties.findById(listedProperty.propertyId);

  let holding = await Holding.findOne({
    user: userId,
    propertyId: listedProperty.propertyId,
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

    if (!holding) {
      holding = await Holding.create({
        user: userId,
        propertyId: listedProperty.propertyId,
        userName: listedProperty.userName,
        name: listedProperty.name,
        genaratedPropertyId: property.id,
        type: property.type,
        subtype: property.subtype,
        area: property.area,
        city: property.city,
        country: property.country,
        investments: [
          {
            date: Date.now(),
            units: listedProperty.units,
            price: listedProperty.oldPrice,
            id: investedProperty.id,
          },
        ],
      });
    } else if (holding.investments.length !== 0) {
      let newInvestment = holding.investments;
      let eleNotAvl = false;
      holding.investments.forEach(async (ele, index) => {
        if (ele.price === listedProperty.oldPrice) {
          let newElement = {
            units: ele.units + parseInt(listedProperty.units),
            price: ele.price,
            id: ele.id,
          };
          let index = holding.investments.indexOf(ele);
          if (index !== -1) {
            newInvestment.splice(index, 1);
            newInvestment.push(newElement);
            await holding.updateOne({ investments: newInvestment });
          }
          return;
        } else if (ind === holding.investments.length - 1) {
          let newElement = {
            date: Date.now(),
            units: listedProperty.units,
            price: listedProperty.oldPrice,
            id: investedProperty.id,
          };
          newInvestment.push(newElement);
          await holding.updateOne({ investments: newInvestment });
        }
      });
      if (eleNotAvl) {
      }
    } else {
      let newInvestment = holding.investments;
      let newElement = {
        date: Date.now(),
        units: listedProperty.units,
        price: listedProperty.oldPrice,
        id: investedProperty.id,
      };
      newInvestment.push(newElement);
      await holding.updateOne({ investments: newInvestment });
    }

    await listedProperty.deleteOne();
  } else {
    let actualUnits = investedProperty.units + listedProperty.units;
    await investedProperty.updateOne({ units: actualUnits });

    if (holding.investments.length !== 0) {
      let newInvestment = holding.investments;

      holding.investments.forEach(async (ele, ind) => {
        if (ele.price === listedProperty.oldPrice) {
          let newElement = {
            units: ele.units + parseInt(listedProperty.units),
            price: ele.price,
            id: ele.id,
          };
          let index = holding.investments.indexOf(ele);
          if (index !== -1) {
            newInvestment.splice(index, 1);
            newInvestment.push(newElement);
            await holding.updateOne({ investments: newInvestment });
          }
          return;
        } else if (ind === holding.investments.length - 1) {
          let newElement = {
            date: Date.now(),
            units: listedProperty.units,
            price: listedProperty.oldPrice,
            id: investedProperty.id,
          };
          newInvestment.push(newElement);
          await holding.updateOne({ investments: newInvestment });
        }
      });
    } else {
      let newInvestment = holding.investments;
      let newElement = {
        date: Date.now(),
        units: listedProperty.units,
        price: listedProperty.oldPrice,
        id: investedProperty.id,
      };
      newInvestment.push(newElement);
      await holding.updateOne({ investments: newInvestment });
    }
    await listedProperty.deleteOne();
  }

  resMSG = "Property Removed Successfully";
  res.json({ resMSG });
  } catch (error) {
    res.status(400).json({ resMSG });
  }
});

module.exports = router;
