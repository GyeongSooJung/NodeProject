//Express
const express = require('express');
const router = express.Router();
//Module
var moment = require('moment');
//Schemas
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');
//Middleware
const { isNotLoggedIn } = require('./middleware');

// -- Start Code -- //

// 일반 삭제
router.post('/ajax/delete_one', isNotLoggedIn, async (req, res, next) => {
    const { division, select, CID } = req.body;
    
    try {
        if(division == "device") {
            const deviceone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Device,{ "CID" : CID, "MAC" : select },{});
            await modelQuery(QUERY.Create,COLLECTION_NAME.Devicedelete,{
                "CID" : deviceone.CID,
                "MD" : deviceone.MD,
                "VER" : deviceone.VER,
                "NN" : deviceone.NN,
                "MAC" : deviceone.MAC
            },{});
            await modelQuery(QUERY.Remove,COLLECTION_NAME.Device,{ "CID" : CID, "MAC" : select },{});
            return res.send({ result : 'success' });
        }
        else if(division == "car") {
            const carone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Car,{ "CID" : CID, "CN" : select },{});
            await modelQuery(QUERY.Create,COLLECTION_NAME.Cardelete,{
                "CID" : carone.CID,
                "CC" : carone.CC,
                "CPN" : carone.CPN,
            },{});
            await modelQuery(QUERY.Remove,COLLECTION_NAME.Car,{ "CID" : CID, "CN" : select },{});
            return res.send({ result : 'success' });
        }
        else if(division == "worker") {
            const workerone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Worker,{ "CID" : CID, "EM" : select },{});
            await modelQuery(QUERY.Create,COLLECTION_NAME.Workerdelete,{
                "CID" : workerone.CID,
                "WN" : workerone.WN,
                "PN" : workerone.PN,
                "GID" : workerone.GID,
                "EM" : workerone.EM,
                "PU" : workerone.PU,
                "AU" : workerone.AU,
                "AC" :workerone.AC
            },{});
            await modelQuery(QUERY.Remove,COLLECTION_NAME.Worker,{ "CID" : CID, "EM" : select },{});
            return res.send({ result : 'success' });
        }
        else if(division == "history") {
            await modelQuery(QUERY.Remove,COLLECTION_NAME.History,{ "CID" : CID, "_id" : select },{});
            return res.send({ result : 'success' });
        }
    } catch (err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

// 선택 삭제
router.post('/ajax/delete_check', isNotLoggedIn, async (req, res, next) => {
    var select = req.body["select[]"];
    const { division, CID } = req.body;
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    const listCompany = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ "_id" : CID },{});
    const listCNU = listCompany.CNU;
    
    if(!select) {
        res.send({ result : 'fail' });
    }
    else {
        if(division == 'device') {
            if(typeof(select) == 'string') {
                const deviceone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Device,{ "CID" : CID, "MAC" : select},{});
                await modelQuery(QUERY.Create,COLLECTION_NAME.Devicedelete,{
                    "CID" : deviceone.CID,
                    "MD" : deviceone.MD,
                    "VER" : deviceone.VER,
                    "NN" : deviceone.NN,
                    "MAC" : deviceone.MAC
                },{});
                await modelQuery(QUERY.Remove,COLLECTION_NAME.Device,{ "CID" : CID, "MAC" : select },{});
            }
            else {
                for(var i = 0; i < select.length; i ++) {
                    const deviceone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Device,{ "CID" : CID, "MAC" : select[i]},{});
                    await modelQuery(QUERY.Create,COLLECTION_NAME.Devicedelete,{
                        "CID" : deviceone.CID,
                        "MD" : deviceone.MD,
                        "VER" : deviceone.VER,
                        "NN" : deviceone.NN,
                        "MAC" : deviceone.MAC
                    },{});
                    await modelQuery(QUERY.Remove,COLLECTION_NAME.Device,{ "CID" : CID, "MAC" : select[i] },{});
                }
            }
            return res.send({ result : 'success' });
        }
        else if(division == 'car') {
            if (typeof(select) == 'string') {
                const carone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Car,{ "CID" : CID, "CN" : select },{});
                await modelQuery(QUERY.Create,COLLECTION_NAME.Cardelete,{
                    "CID" : carone.CID,
                    "CN" : carone.CN,
                    "CPN" : carone.CPN,
                },{});
                await modelQuery(QUERY.History,COLLECTION_NAME.Car,{ "CID" : CID, "CN" : select },{});
            }
            else {
                for(var i = 0; i < select.length; i++) {
                    var carone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Car,{ "CID" : CID, "CN" : select[i] },{});
                    await modelQuery(QUERY.Create,COLLECTION_NAME.Cardelete,{
                        "CID" : carone.CID,
                        "CN" : carone.CN,
                        "CPN" : carone.CPN,
                    },{});
                    await modelQuery(QUERY.Remove,COLLECTION_NAME.Car,{ "CID" : CID, "CN" : select[i] },{});
                }
            }
                await modelQuery(QUERY.Update,COLLECTION_NAME.Company,{where : {"CNU" : listCNU}, update : { "CUA" : CUA }},{});
            return res.send({ result : 'success' });
        }
        else if(division == 'worker') {
            if(typeof(select) == 'string') {
                const workerone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Worker,{ "CID" : CID, "EM" : select },{});
                await modelQuery(QUERY.Create,COLLECTION_NAME.Workerdelete,{
                    "CID" : workerone.CID,
                    "WN" : workerone.WN,
                    "PN" : workerone.PN,
                    "GID" : workerone.GID,
                    "EM" : workerone.EM,
                    "PU" : workerone.PU,
                    "AU" : workerone.AU,
                    "AC" :workerone.AC
                },{});
                await modelQuery(QUERY.Remove,COLLECTION_NAME.Worker,{ "CID" : CID,  "EM" : select },{});
            }
            else {
                for(var i=0; i < select.length; i++){   
                    const workerone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Worker,{ "CID" : CID, "EM" : select[i] },{});
                    await modelQuery(QUERY.Create,COLLECTION_NAME.Workerdelete,{
                        "CID" : workerone.CID,
                        "WN" : workerone.WN,
                        "PN" : workerone.PN,
                        "GID" : workerone.GID,
                        "EM" : workerone.EM,
                        "PU" : workerone.PU,
                        "AU" : workerone.AU,
                        "AC" :workerone.AC
                    },{});
                    await modelQuery(QUERY.Remove,COLLECTION_NAME.Worker,{ "CID" : CID,  "EM" : select[i] },{});
                }
            }
            return res.send({ result : 'success' });
        }
        else if(division == 'history') {
            if(typeof(select) == 'string') {
                await modelQuery(QUERY.Remove,COLLECTION_NAME.History,{ "CID" : CID,  "_id" : select },{});
            }
            else {
                for(var i=0; i < select.length; i++) {
                    await modelQuery(QUERY.Remove,COLLECTION_NAME.History,{ "CID" : CID,  "_id" : select[i] },{});
                }
            }
            return res.send({ result : 'success' });
        }
    }
});

module.exports = router;