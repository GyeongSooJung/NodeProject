const express = require('express');
const session = require('express-session');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Device = require('../schemas/device');
const Devicedelete = require('../schemas/device_delete')
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const path = require('path');
const router = express.Router();

const Mongoose = require('mongoose');

//장비 등록
  //DB에 등록
router.post('/device_join', isNotLoggedIn,async (req, res, next) => {
  const { MD, MAC, VER, NN, CA, UA, UT } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    
  try {
    const exDevice = await Device.findOne({ "MAC" : MAC });
    const check = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
    const UN = 0;
    if (check.test(MAC) == true) {
      if(!exDevice) {
        await Device.create({
            CID, MD, VER, MAC, NN, UN
        });
        // return res.redirect('/device_list');
        return res.send({ status: 'success' });
      }
      else {
        // return res.redirect('/device_join?exist=true');
        return res.send({ status: 'exist' });
      }
    }
    else {
      // return res.redirect('/device_join?type=true');
      return res.send({ status: 'type' });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

//장비 수정
  //DB
router.post('/device_edit/upreg/:MAC', isNotLoggedIn, async (req, res, next) => {
    const { MD, VER, NN, MAC } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;

    try {
      await Device.where({"MAC" : req.params.MAC})
      .update({ "CID" : CID,
                "MD" : MD,
                "VER" : VER,
                "NN" : NN,
                "MAC" : MAC
        }).setOptions({runValidators : true})
          .exec();
      return res.send({ status: 'success' });
    } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/ajax/device_list_edit1', isNotLoggedIn, async(req, res, next) => {
  const { device_id } = req.body;
  
  var ObjectId = Mongoose.Types.ObjectId;
  const deviceone = await Device.find({ _id : ObjectId(device_id) });
  res.send({ status : "success", deviceone : deviceone });
});

router.post('/ajax/device_list_edit2', isNotLoggedIn, async(req, res, next) => {
  const { VER, NN, CID, device_id } = req.body;
  
  try{
    await Device.where({"_id" : device_id})
      .update({ "CID" : CID,
                "VER" : String(VER),
                "NN" : NN,
        }).setOptions({runValidators : true})
          .exec();
      return res.send({ status: 'success' });
   
  }catch(e) {
    console.log(e)
    res.send({ status : "failed" });
  }
});

//장비 한개 삭제
router.post('/ajax/device_deleteone', async (req, res, next) => {
  var select = req.body["select"];
  console.log(select)
  try {
    const deviceone = await Device.findOne({ "MAC" : select.split(' ') });
    await Devicedelete.create({
                  "CID" : deviceone.CID,
                    "MD" : deviceone.MD,
                    "VER" : deviceone.VER,
                    "NN" : deviceone.NN,
                    "MAC" : deviceone.MAC
    });
    await Device.remove({ "MAC" : select.split(' ') });
    res.json({ result : true });
  } catch (err) {
    res.json({ result : false });
    console.error(err);
    next(err);
    
  }
});

//장비 선택 삭제
router.post('/ajax/device_delete', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select[]"];
  console.log(JSON.stringify(req.body));
  console.log(select)
  
 
  
    
        if(!select) {
          res.json({ result : false });
        }
        else {
          
          if(typeof(select) == 'string') {
            const deviceone = await Device.findOne({"MAC" : select});
            await Devicedelete.create({
                  "CID" : deviceone.CID,
                  "MD" : deviceone.MD,
                  "VER" : deviceone.VER,
                  "NN" : deviceone.NN,
                  "MAC" : deviceone.MAC
            });
            await Device.remove({ "MAC" : select });
            
          }
          else {
            for(var i = 0; i < select.length; i ++) {
              var deviceone = await Device.findOne({"MAC" : select[i]});   
              await Devicedelete.create({
                    "CID" : deviceone.CID,
                      "MD" : deviceone.MD,
                      "VER" : deviceone.VER,
                      "NN" : deviceone.NN,
                      "MAC" : deviceone.MAC
              });
              await Device.remove({ "MAC" : select[i] });
            }
          }
        res.json({ result : true });
        }
  
  try {
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;