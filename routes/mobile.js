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
  const {CN} = req.body;
    try {
        const carone = await Car.findOne({"CN" : CN});
        const companyone = await Company.findOne({"_id" : carone.CID});
        const deviceone = await Device.findOne({"CID" : companyone._id});
        const historys = await History.find({"VID" : carone._id});
        res.render('QR', {carone, companyone, deviceone, historys, moment});
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;

