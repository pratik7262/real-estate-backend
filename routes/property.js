const Properties = require("../models/Prperties");
const express = require("express");
const router = express.Router();
// const multer=require('multer')
// const upload=multer({dest:'uploads/'})
const User = require("../models/User");
const upload = require("../middleware/upload");
const getUser = require("../middleware/fetchUser");
const History = require("../models/History");

//Route 1: Fetch User Specific Pending Properties
router.get("/specificpendingproperties", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const properties = await Properties.find({
      user: userId,
      approved: false,
    });
    res.json({ properties });
  } catch (error) {
    res.json({ error });
  }
});

//Route 2: Fetch User Specific Approved Properties
router.get("/specificapprovedproperties", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const properties = await Properties.find({ user: userId, approved: true });
    res.json({ properties });
  } catch (error) {
    res.json({ error });
  }
});

//Route 3: Fetch All The Approved Properties
router.get("/approvedproperties", async (req, res) => {
  try {
    const properties = await Properties.find({ approved: true, notSold: true });
    res.json({ properties });
  } catch (error) {
    res.json({ error });
  }
});

//Route 4: Route For Approve Or Reject Property
router.get("/pendingproperties", async (req, res) => {
  try {
    const properties = await Properties.find({ approved: false });
    res.json({ properties });
  } catch (error) {
    res.json({ error });
  }
});

//Route 5: Route For Adding Property
router.post("/addproperty", upload.single("img"), getUser, async (req, res) => {
  let success = false;
  let resMSG = "Property added successfully";
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });
    const id =
      req.body.country.slice(0, 2) +
      req.body.city.slice(0, 2) +
      req.body.zipCode;
    const newProperty = await Properties.create({
      user: userId,
      userName: user.name,
      id: id,
      type: req.body.type,
      subtype: req.body.subtype,
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      price: req.body.price,
      units: req.body.price / 100,
      area: req.body.area,
      rentalIncome: req.body.rentalIncome,
      country: req.body.country,
      city: req.body.city,
      zipCode: req.body.zipCode,
      img: req.file.path,
    });
    await History.create({
      user: userId,
      userName: user.name,
      propertyId: newProperty._id,
      genaratedPropertyId: id,
      added: id,
      price: 100,
      units: req.body.price / 100,
      id: userId + Date.now() + Math.floor(Math.random() * 9000000000) + "id",
    });
    success = true;

    res.json({ success, resMSG });
  } catch (error) {
    resMSG='Please Add Fields Properly'
    res.json({ resMSG});
  }
});

//Route 6: Route For Approve Pending Properties
router.get("/approveproperty/:id", async (req, res) => {
  let resMSG= "Property Approved" 
  try {
    const propertyId = req.params.id;
    const pendingProperty = await Properties.findOne({ _id: propertyId });
    await pendingProperty.updateOne({ approved: true });

    res.json({resMSG});
  } catch (error) {
    resMSG='Some Error Occured'
    res.status(400).json({resMSG});
  }
});

// Route 7:Route For Getting Information About Perticular Proprty
router.get("/propertyinfo/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Properties.findOne({ _id: propertyId });

    res.json(property);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/issold/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Properties.findOne({ _id: propertyId });
    let sold = !property.notSold;
    res.json({ sold });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/deleteProperty/:id", async (req, res) => {
  let resMSG = "Some Error Occured";
  try {
    const propertyId = req.params.id;
    const property = await Properties.deleteOne({ _id: propertyId });
    resMSG = "Property Removed Successfully";
    res.json({ resMSG });
  } catch (error) {
    resMSG='Some Error Occured'
    res.status(400).json({ resMSG });
  }
});

module.exports = router;
