const express = require('express');
//schema
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
const History = require('../schemas/history');
const moment = require('moment');
//Router or MiddleWare
const router = express.Router();

//Mobile QR Code Page
router.post('/QR', async (req, res, next) => {
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  const {CN} = req.body;
  const exCN = await Car.findOne({"CN" : CN});
    try {
      if (!exCN) {
        return res.redirect('/mobile_con?exist=true');
      }
      else {
        const carone = await Car.findOne({"CN" : CN});
        const companyone = await Company.findOne({"_id" : carone.CID});
        const deviceone = await Device.findOne({"CID" : companyone._id});
        const kmoment = await moment().add('9', 'h'); //현재 한국 시간
        const find_month = await {'$gte' : kmoment.add('-1', 'M').format('YYYY-MM-DD hh:mm:ss')}; //kmoment 1개월 전
        
        const historys = await History.find({"VID" : carone._id, "ET": find_month}).sort({"ET":-1});
        const historyone = await History.findOne({"VID" : carone._id}).sort({"ET":-1}).limit(1);
        res.render('QR', {carone, companyone, deviceone, historys, historyone, moment});
      }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;

