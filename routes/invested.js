const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Invested = require("../models/Invested");
const Listed = require("../models/Listed");
const Properties = require("../models/Prperties");
const Rental = require("../models/Rental");
const User = require("../models/User");
const Holding = require("../models/Holding");
const History = require("../models/History");

router.post("/invest", getUser, async (req, res) => {
  // try {
  const userId = req.user.id;
  const id =
    Date.now() + "-" + Math.random() + "@" + Math.floor(Math.random() * 900000);
  let resMSG = "Invested In Property Successfully";
  let investedProperty = await Invested.findOne({
    user: userId,
    propertyId: req.body.propertyId,
    price: 100,
  });

  let rental = await Rental.findOne({
    user: userId,
    propertyId: req.body.propertyId,
  });

  let holding = await Holding.findOne({
    user: userId,
    propertyId: req.body.propertyId,
  });

  const property = await Properties.findOne({ _id: req.body.propertyId });
  const user = await User.findOne({ _id: userId });

  if (property.units < req.body.units) {
    resMSG = `Sorry Only ${property.units} Units Are Available`;
    res.send({ resMSG });
  } else {
    let remainingUnits = property.units - req.body.units;
    if (!investedProperty) {
      let totalUnits = property.price / 100;
      investedProperty = await Invested.create({
        user: userId,
        propertyId: req.body.propertyId,
        userName: user.name,
        name: req.body.name,
        genaratedPropertyId: property.id,
        units: req.body.units,
        id: id,
      });

      await History.create({
        user: userId,
        userName: user.name,
        propertyId: req.body.propertyId,
        genaratedPropertyId: property.id,
        invested: property.id,
        price: 100,
        units: req.body.units,
        id:userId+Date.now()+Math.floor(Math.random() * 9000000000)+'id'
      });

      rental = await Rental.create({
        user: userId,
        userName: user.name,
        propertyId: req.body.propertyId,
        units: req.body.units,
        id: id,
        title: req.body.name,
        genaratedId: property.id,
        rentalIncomePerSecPerUnit:
          property.rentalIncome / (30 * 86400 * totalUnits),
        investedDocumentId: investedProperty._id,
        unpaid: true,
      });

      holding = await Holding.create({
        user: userId,
        propertyId: req.body.propertyId,
        userName: user.name,
        name: req.body.name,
        genaratedPropertyId: property.id,
        type: property.type,
        subtype: property.subtype,
        area: property.area,
        city: property.city,
        country: property.country,
        investments: [
          { units: req.body.units, price: 100, id: investedProperty.id },
        ],
      });

      if (remainingUnits === 0) {
        await property.updateOne({ notSold: false });
        await property.updateOne({ units: 0 });
        let holdings = await Holding.find({ propertyId: req.body.propertyId });
        holdings.forEach(async (element) => {
          await element.updateOne({ isSold: true });
        });
        await holding.updateOne({ isSold: true });
        let rentals = await Rental.find({
          propertyId: req.body.propertyId,
        });
        rentals.forEach(async (element) => {
          await element.updateOne({ investedDate: Date.now() });
        });
        await rental.updateOne({ investedDate: Date.now() });
      } else {
        await property.updateOne({ units: remainingUnits });
      }

      res.json({ resMSG, investedProperty });
    } else {
      let totalUnits = investedProperty.units + parseInt(req.body.units);
      if (remainingUnits === 0) {
        await property.updateOne({ notSold: false });
        let holdings = await Holding.find({ propertyId: req.body.propertyId });
        holdings.forEach(async (element) => {
          await element.updateOne({ isSold: true });
        });
        await holding.updateOne({ isSold: true });
        await property.updateOne({ units: 0 });
        let rentals = await Rental.find({
          propertyId: req.body.propertyId,
        });
        rentals.forEach(async (element) => {
          await element.updateOne({ investedDate: Date.now() });
        });
        await rental.updateOne({ investedDate: Date.now() });
      } else {
        await property.updateOne({ units: remainingUnits });
      }
      await investedProperty.updateOne({
        units: totalUnits,
      });
      await rental.updateOne({
        units: totalUnits,
      });

      await History.create({
        user: userId,
        userName: user.name,
        propertyId: req.body.propertyId,
        genaratedPropertyId: property.id,
        invested:property.id,
        price: 100,
        units: req.body.units,
        id:userId+Date.now()+Math.floor(Math.random() * 9000000000)+'id'
      });

      holding.investments.forEach(async (ele) => {
        if (ele.price === 100) {
          let newElement = {
            date: ele.date,
            units: totalUnits,
            price: 100,
            id: ele.id,
          };
          let newInvestment = holding.investments;
          let index = holding.investments.indexOf(ele);
          if (index !== -1) {
            newInvestment.splice(index, 1);
            newInvestment.push(newElement);
            await holding.updateOne({ investments: newInvestment });
          }
        }
      });

      res.json({ resMSG });
    }
  }
  // } catch (error) {
  //   res.json();
  // }
});

router.get("/specificinvestedproperty", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const investedProperty = await Invested.find({
      user: userId,
      isZero: false,
    });
    res.json({ investedProperty });
  } catch (error) {
    res.json({ error });
  }
});

router.post("/investinlistedproperty", getUser, async (req, res) => {
  let resMSG = "Invested In Property Successfully";
  // try {
  const userId = req.user.id;
  const id =
    Date.now() + "-" + Math.random() + "@" + Math.floor(Math.random() * 900000);
  let investedProperty = await Invested.findOne({
    user: userId,
    propertyId: req.body.propertyId,
    price: req.body.price,
  });

  let holding = await Holding.findOne({
    user: userId,
    propertyId: req.body.propertyId,
  });

  const listedProperty = await Listed.findOne({
    propertyId: req.body.propertyId,
    user: req.body.sellerId,
    price: req.body.price,
  });

  let sellerRental = await Rental.findOne({
    user: req.body.sellerId,
    propertyId: req.body.propertyId,
  });

  let sellersInvestedDocument = await Invested.findOne({
    _id: sellerRental.investedDocumentId,
  });

  let investedDate = sellerRental.investedDate;
  let soldDate = Date.now();
  let time = Math.abs(soldDate - investedDate);
  let holdingSec = Math.ceil(time / 1000);

  const user = await User.findById(userId)
  


  const property = await Properties.findById(req.body.propertyId);

  if (listedProperty.units < req.body.units) {
    resMSG = `Sorry Only ${listedProperty.units} Units Are Available`;
    res.send({ resMSG });
  } else {
    if (!investedProperty) {
      investedProperty = await Invested.create({
        user: userId,
        propertyId: req.body.propertyId,
        genaratedPropertyId: listedProperty.genaratedPropertyId,
        name: req.body.name,
        userName: user.name,
        price: req.body.price,
        units: req.body.units,
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
        genaratedPropertyId: listedProperty.genaratedPropertyId,
        invested: listedProperty.genaratedPropertyId,
        price: req.body.price,
        units: req.body.units,
        id:userId+Date.now()+Math.floor(Math.random() * 9000000000)+'id'
      });

      if (!holding) {
        holding = await Holding.create({
          user: userId,
          propertyId: req.body.propertyId,
          userName: user.name,
          name: req.body.name,
          genaratedPropertyId: property.id,
          type: property.type,
          subtype: property.subtype,
          area: property.area,
          city: property.city,
          country: property.country,
          investments: [
            {
              units: req.body.units,
              price: req.body.price,
              id: investedProperty.id,
            },
          ],
        });
      } else {
        let newInvestment = holding.investments;
        let newElement = {
          date: Date.now(),
          price: req.body.price,
          units: req.body.units,
          id: investedProperty.id,
        };
        newInvestment.push(newElement);
        await holding.updateOne({ investments: newInvestment });
      }

      const buyersRental = await Rental.create({
        user: userId,
        propertyId: req.body.propertyId,
        investedDate: Date.now(),
        userName: user.name,
        unpaid: true,
        id: id,
        title: investedProperty.name,
        genaratedId: investedProperty.genaratedPropertyId,
        units: req.body.units,
        rentalIncomePerSecPerUnit: sellerRental.rentalIncomePerSecPerUnit,
        investedDocumentId: investedProperty._id,
      });

      let remainingUnits = listedProperty.units - req.body.units;
      if (remainingUnits === 0) {
        await listedProperty.deleteOne();
        let rentalIncome =
          sellerRental.rentalIncomePerSecPerUnit * holdingSec * req.body.units;
        await sellerRental.updateOne({ soldDate: Date.now() });
        await sellerRental.updateOne({
          units: sellersInvestedDocument.units + remainingUnits,
        });
        sellersInvestedDocument.units + remainingUnits;
        await sellerRental.updateOne({
          rentalIncome: sellerRental.rentalIncome + rentalIncome,
        });
        res.json({ resMSG });
      } else {
        await listedProperty.updateOne({ units: remainingUnits });
        sellersInvestedDocument.units + remainingUnits;
        let rentalIncome =
          sellerRental.rentalIncomePerSecPerUnit * holdingSec * req.body.units;
        await sellerRental.updateOne({ soldDate: Date.now() });
        await sellerRental.updateOne({
          units: sellersInvestedDocument.units + remainingUnits,
        });
        sellersInvestedDocument.units + remainingUnits;
        await sellerRental.updateOne({
          rentalIncome: sellerRental.rentalIncome + rentalIncome,
        });
        res.json({ resMSG });
      }
    } else {
      let totalUnits = investedProperty.units + parseInt(req.body.units);
      await investedProperty.updateOne({
        units: totalUnits,
      });
      const buyersRental = await Rental.create({
        user: userId,
        propertyId: req.body.propertyId,
        id: id,
        investedDate: Date.now(),
        userName: user.name,
        unpaid: true,
        title: investedProperty.name,
        genaratedId: investedProperty.genaratedPropertyId,
        units: req.body.units,
        rentalIncomePerSecPerUnit: sellerRental.rentalIncomePerSecPerUnit,
        investedDocumentId: investedProperty._id,
      });

      holding.investments.forEach(async (ele) => {
        if (ele.price === investedProperty.price) {
          let newInvestment = holding.investments;
          let newElement = {
            date: ele.date,
            units: totalUnits,
            price: ele.price,
            id: ele.id,
          };
          let index = holding.investments.indexOf(ele);
          if (index !== -1) {
            newInvestment.splice(index, 1);
            newInvestment.push(newElement);
            await holding.updateOne({ investments: newInvestment });
          }
        }
      });

      let remainingUnits = listedProperty.units - req.body.units;
      if (remainingUnits === 0) {
        await listedProperty.deleteOne();
        let rentalIncome =
          sellerRental.rentalIncomePerSecPerUnit * holdingSec * req.body.units;
        await sellerRental.updateOne({ soldDate: Date.now() });
        await sellerRental.updateOne({
          units: sellersInvestedDocument.units + remainingUnits,
        });
        sellersInvestedDocument.units + remainingUnits;
        await sellerRental.updateOne({
          rentalIncome: sellerRental.rentalIncome + rentalIncome,
        });
        res.json({ resMSG });
      } else {
        await listedProperty.updateOne({ units: remainingUnits });
        let rentalIncome =
          sellerRental.rentalIncomePerSecPerUnit * holdingSec * req.body.units;
        await sellerRental.updateOne({ soldDate: Date.now() });
        await sellerRental.updateOne({
          units: sellersInvestedDocument.units + remainingUnits,
        });
        await sellerRental.updateOne({
          rentalIncome: sellerRental.rentalIncome + rentalIncome,
        });

        await History.create({
          user: userId,
          userName: user.name,
          propertyId: req.body.propertyId,
          genaratedPropertyId: listedProperty.genaratedPropertyId,
          invested: listedProperty.genaratedPropertyId,
          price: req.body.price,
          units: req.body.units,
          id:userId+Date.now()+Math.floor(Math.random() * 9000000000)+'id'
        });
        res.json({ resMSG });
      }
    }
  }
  // } catch (error) {
  //   res.json({ error });
  // }
});

module.exports = router;
