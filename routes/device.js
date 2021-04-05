const express = require('express');
const session = require('express-session');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Device = require('../schemas/device');
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const path = require('path');
const router = express.Router();


//장비 등록
  //DB에 등록
router.post('/device_join', isNotLoggedIn,async (req, res, next) => {
  const { MD, MAC, VER, NN, CA, UA, UT } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    
  try {
    const exDevice = await Device.findOne({ "MAC" : MAC });
    const check = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;

    if (check.test(MAC) == true) {
      if(!exDevice) {
        await Device.create({
            CID, MD, VER, MAC, NN
        });
        return res.redirect('/device_list');
      }
      else {
        return res.redirect('/device_join?exist=true');
      }
    }
    else {
      return res.redirect('/device_join?type=true');
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
      const exDevice = await Device.find({ "MAC" :  MAC });
      console.log(exDevice);

      const deviceone = await Device.where({"MAC" : req.params.MAC})
      .update({ "CID" : CID,
                    "MD" : MD,
                    "VER" : VER,
                    "NN" : NN,
                    "MAC" : MAC
        }).setOptions({runValidators : true})
          .exec();
        console.log(deviceone);
    } catch (error) {
    console.error(error);
    next(error);
  }
  res.redirect('/device_list');
});

//장비 삭제
router.get('/device_delete/:MAC', async (req, res, next) => {
  try {
    await Device.remove({ "MAC" : req.params.MAC });
    res.redirect('/device_list');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//장비 선택삭제
router.post('/device_select_delete',isNotLoggedIn ,async (req, res, next) => {
    try {
        const {ck} = req.body;

        if(!ck) {
          return res.redirect('/device_list?null=true');
        }
        else {
          const deviceone = await Device.findOne({"MAC" : ck});
          console.log("zzzzzzzzz : "+deviceone);
          const MACc = deviceone.MAC;
          console.log("MAC: " + ck);
          console.log("MACc: " + MACc);

          for(var i = 0; i < ck.length; i++){
            if(ck[i] == MACc){
                await Device.remove({ "MAC" : ck });
            }
            else if(!(ck instanceof Object)) {
                await Device.remove({ "MAC" : ck });
            }
          }
          res.redirect('/device_list');
        }
    }   catch (err) {
        console.error(err);
        next(err);
  }
});

module.exports = router;