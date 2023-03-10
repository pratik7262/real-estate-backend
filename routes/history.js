const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const History=require('../models/History')

router.get("/gethistory", async (req, res) => {
    try {
      let history = await History.find({  });
      res.json({ history });
    } catch (error) {
      res.json({ error });
    }
  });
  
  module.exports=router