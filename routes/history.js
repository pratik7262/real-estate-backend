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

  router.get("/getspecifichistory",getUser, async (req, res) => {
    try {
      let userId=req.user.id
      let history = await History.find({user:userId})
      res.json({ history });
    } catch (error) {
      res.json({ error });
    }
  });
  
  module.exports=router