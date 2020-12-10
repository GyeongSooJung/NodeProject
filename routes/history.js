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
      const cars = await Car.find({"CID" : CID});
      const devices = await Device.find({"CID" : CID});
       console.log(cars);
       console.log(devices);
       res.render('history_list', {cars, devices, moment});
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