const express = require('express');
const session = require('express-session');
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Devicedelete = require('../schemas/device_delete');
const Car = require('../schemas/car');
const Cardelete = require('../schemas/car_delete');
const Worker = require('../schemas/worker');
const Workerdelete = require('../schemas/worker_delete');
const History = require('../schemas/history');
var moment = require('moment');
const { isNotLoggedIn } = require('./middleware');
const router = express.Router();

// 일반 삭제
router.post('/ajax/delete_one', isNotLoggedIn, async (req, res, next) => {
    const { division, select, CID } = req.body;
    console.log(division+"/"+select+"/"+CID);
    try {
        if(division == "device") {
            const deviceone = await Device.findOne({ "CID" : CID, "MAC" : select });
            await Devicedelete.create({
                "CID" : deviceone.CID,
                "MD" : deviceone.MD,
                "VER" : deviceone.VER,
                "NN" : deviceone.NN,
                "MAC" : deviceone.MAC
            });
            await Device.remove({ "CID" : CID, "MAC" : select });
            return res.send({ result: true });
        }
        else if(division == "car") {
            const carone = await Car.findOne({ "CID" : CID, "CN" : select });
            await Cardelete.create({
                "CID" : carone.CID,
                "CC" : carone.CC,
                "CPN" : carone.CPN,
            });
            await Car.remove({ "CID" : CID, "CN" : select });
            return res.send({ result: true });
        }
        else if(division == "worker") {
            const workerone = await Worker.findOne({ "CID" : CID, "EM" : select });
            await Workerdelete.create({
                "CID" : workerone.CID,
                "WN" : workerone.WN,
                "PN" : workerone.PN,
                "GID" : workerone.GID,
                "EM" : workerone.EM,
                "PU" : workerone.PU,
                "AU" : workerone.AU,
                "AC" :workerone.AC
            });
            await Worker.remove({ "CID" : CID, "EM" : select });
            return res.send({ result: true });
        }
        else if(division == "history") {
            await History.remove({ "CID" : CID, "_id" : select });
            return res.send({ result: true });
        }
    } catch (err) {
        res.send({ result : false });
        console.error(err);
        next(err);
    }
});

// 선택 삭제
router.post('/ajax/delete_check', isNotLoggedIn, async (req, res, next) => {
    var select = req.body["select[]"];
    const { division, CID } = req.body;
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    const listCompany = await Company.findOne({ "_id" : CID });
    const listCNU = listCompany.CNU;
    
    if(!select) {
        res.send({ result : false });
    }
    else {
        if(division == 'device') {
            if(typeof(select) == 'string') {
                const deviceone = await Device.findOne({ "CID" : CID, "MAC" : select});
                await Devicedelete.create({
                    "CID" : deviceone.CID,
                    "MD" : deviceone.MD,
                    "VER" : deviceone.VER,
                    "NN" : deviceone.NN,
                    "MAC" : deviceone.MAC
                });
                await Device.remove({ "CID" : CID, "MAC" : select });
            }
            else {
                for(var i = 0; i < select.length; i ++) {
                    var deviceone = await Device.findOne({ "CID" : CID, "MAC" : select[i]});   
                    await Devicedelete.create({
                        "CID" : deviceone.CID,
                        "MD" : deviceone.MD,
                        "VER" : deviceone.VER,
                        "NN" : deviceone.NN,
                        "MAC" : deviceone.MAC
                    });
                    await Device.remove({ "CID" : CID, "MAC" : select[i] });
                }
            }
            return res.send({ result : true });
        }
        else if(division == 'car') {
            if (typeof(select) == 'string') {
                const carone = await Car.findOne({ "CID" : CID, "CN" : select });
                await Cardelete.create({
                    "CID" : carone.CID,
                    "CN" : carone.CN,
                    "CPN" : carone.CPN,
                });
                await Car.remove({ "CID" : CID, "CN" : select });
            }
            else {
                for(var i = 0; i < select.length; i++){
                    var carone = await Car.findOne({ "CID" : CID, "CN" : select[i] });  
                    await Cardelete.create({
                        "CID" : carone.CID,
                        "CN" : carone.CN,
                        "CPN" : carone.CPN,
                    });
                    await Car.remove({ "CID" : CID, "CN" : select[i] });
                }
            }
            await Company.where({"CNU" : listCNU})
                .update({ "CUA" : CUA }).setOptions({runValidators : true})
                .exec();
            return res.send({ result : true });
        }
        else if(division == 'worker') {
            if(typeof(select) == 'string') {
                const workerone = await Worker.findOne({ "CID" : CID, "EM" : select });
                await Workerdelete.create({
                    "CID" : workerone.CID,
                    "WN" : workerone.WN,
                    "PN" : workerone.PN,
                    "GID" : workerone.GID,
                    "EM" : workerone.EM,
                    "PU" : workerone.PU,
                    "AU" : workerone.AU,
                    "AC" :workerone.AC
                });
                await Worker.remove({ "CID" : CID,  "EM" : select });
            }
            else {
                for(var i=0; i < select.length; i++){
                    const workerone = await Worker.findOne({ "CID" : CID, "EM" : select[i] });
                    await Workerdelete.create({
                        "CID" : workerone.CID,
                        "WN" : workerone.WN,
                        "PN" : workerone.PN,
                        "GID" : workerone.GID,
                        "EM" : workerone.EM,
                        "PU" : workerone.PU,
                        "AU" : workerone.AU,
                        "AC" :workerone.AC
                    });
                    await Worker.remove({ "CID" : CID,  "EM" : select[i] });                
                }
            }
            return res.send({ result : true });
        }
        else if(division == 'history') {
            if(typeof(select) == 'string') {
                await History.remove({ "CID" : CID,  "_id" : select });
            }
            else {
                for(var i=0; i < select.length; i++){
                    await History.remove({ "CID" : CID,  "_id" : select[i] });
                }
            }
            return res.send({ result : true });
        }
    }
});

module.exports = router;