const Properties = require("../models/Prperties");
const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");

//Route 1: Fetch User Specific Property Info Login Required
router.get("/specificproperties", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const properties = await Properties.find({ user: userId });
    res.json({ properties });
  } catch (error) {
    res.json({ error });
  }
});

//Route 2: Fetch All The Approved Properties
router.get("/approvedproperties", async (req, res) => {
  try {
    const properties = await Properties.find({ approved: true });
    res.json({ properties });
  } catch (error) {
    res.json({ error });
  }
});

//Route 3: Route For Approve Or Reject Property
router.get("/pendingproperties", async (req, res) => {
  try {
    const properties = await Properties.find({ approved: false });
    res.json({ properties });
  } catch (error) {
    res.json({ error });
  }
});

//Route 4: Route For Adding Property
router.post("/addproperty", getUser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const newProperty = await Properties.create({
      user: userId,
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      price: req.body.price,
      area: req.body.area,
    });
    success = true;
    res.json({ success, newProperty });
  } catch (error) {
    res.json({ error });
  }
});

router.get("/approveproperty/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const pendingProperty = await Properties.findOne({ _id: propertyId });
    await pendingProperty.updateOne({ approved: true });

    res.json({ msg: "Property Approved" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
