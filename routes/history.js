const express = require('express');
const History = require('../schemas/history');
const Car = require('../schemas/car');
const Device = require('../schemas/device');
const Process = require('../schemas/process');
const moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const router = express.Router();





router.get('/history_chart/:_id',isNotLoggedIn ,async (req, res, next) => {
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    try {
        const historyone = await History.findOne({"_id" : req.params._id});
        const processone = await Process.find({"HID" : req.params._id});
        console.log(historyone);
        console.log(processone);
        res.render('history_chart', processone, moment);
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;