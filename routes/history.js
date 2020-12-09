const express = require('express');
const History = require('../schemas/history');
const Car = require('../schemas/car');
const Device = require('../schemas/device');
const moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const router = express.Router();

router.get('/history_list',isNotLoggedIn ,async (req, res, next) => {
   const CID = req.decoded.CID;
   const CNU = req.decoded.CNU;
   try {
       const historys = await History.find({"CID" : 123});
       console.log(historys.VID)
       const cars = await Car.find({"_id" : historys.VID});
       const devices = await Device.find({"_id" : historys.DID});
       console.log(cars.CN);
       const combined = {historys, cars, devices};
    //   console.log(combined);
    //   console.log(cars.CN);
       res.render('history_list', {combined, moment});
   } catch (err) {
       console.error(err);
       next(err);
   }
});

router.get('/history_chart',isNotLoggedIn ,async (req, res, next) => {
    const CID = req.decoded.CID;
   const CNU = req.decoded.CNU;
    try {
        const historys = await History.findOne({ CID });
        res.render('history_chart', {historys});
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;