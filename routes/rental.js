const express = require("express");
const router = express.Router();
const getUser = require("../middleware/fetchUser");
const Rental = require("../models/Rental");

router.get("/specificrentalincome", getUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const rental = await Rental.find({ user: userId });
    res.json({ rental });
  } catch (error) {
    res.json({ error });
  }
});

router.get("/allrental", async (req, res) => {
    try {
      const rental = await Rental.find({ unpaid:true });
      res.json({ rental });
    } catch (error) {
      res.json({ error });
    }
  });

  router.post('/pay',async(req , res )=>{
    let resMsg='Rent Paid Succesfully'
    //  try {
      let rental=await Rental.findById(req.body.id)
     
      await rental.updateOne({ rentalIncome:0})
      await rental.updateOne({investedDate:Date.now()});
      let newRentalIncome=req.body.currentRentalIncome+rental.paidRentalIncome
      console.log(newRentalIncome,rental.paidRentalIncome,req.body.currentRentalIncome)
      await rental.updateOne({paidRentalIncome:newRentalIncome})
      if(rental.units===0){
        await rental.deleteOne();
      }
      res.json({resMsg})
    //  } catch (err) {
    //   resMsg='Some Error Occured'
    //   res.json({resMsg})
    //  }
  })


module.exports = router;
