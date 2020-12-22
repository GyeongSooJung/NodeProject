const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Device = require('../schemas/device');
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const fs = require('fs');
const multer = require('multer');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const excelToJson = require('convert-excel-to-json');
const router = express.Router();

//장비 등록
  //페이지 호출

  //DB에 등록
router.post('/device_join', isNotLoggedIn,async (req, res, next) => {
  const { MD, MAC, VER, NN, CA, UA, UT } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    console.log(req.body);
  try {
    const exDevice = await Device.findOne({ "MAC" : MAC });
    
    if (exDevice) {
      return res.redirect('/device_join?error=exist');
    }
    else{
      const CA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss'); //한국시간 맞추기 위해 +9시간
      const UA = "";
      await Device.create({
        CID, MD, VER, MAC, NN, CA
    });
    return res.redirect('/device_join');
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

  //Excel로 DB에 등록
router.post('/device_join_xlsx', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss'); //한국시간 맞추기 위해 +9시간
  const UA = "";
  
  const resData = {};
 
    const form = new multiparty.Form({
        autoFiles: true,
    });
 
    form.on('file', (name, file) => {
        const workbook = xlsx.readFile(file.path);
        const sheetnames = Object.keys(workbook.Sheets);
        let i = sheetnames.length;
        
        const array = [];
        var j = 0;
 
        while (i--) {
            const sheetname = sheetnames[i];
            resData[sheetname] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetname]);
        }
        const excel = JSON.stringify(resData);
        
        JSON.parse(excel, (key,value) => {
          array.push(value);
        });
        
        for(j = 0; j < array.length ; j++) {
          const MD = array[j];
          const VER = array[j+1];
          const MAC = array[j+2];
          const NN = array[j+3];
          console.log("123123" + j);
          j += 4;
          Device.create({ CID, MD, VER, MAC, NN, CA});
        }
    });
 
    form.on('close', () => {
      res.redirect('/device_join');
    });
 
    form.parse(req);
});

//장비 수정
  //DB
router.post('/device_edit/upreg/:MAC', isNotLoggedIn,async (req, res, next) => {
    const { MD, VER, NN, MAC } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    
    try {
      const exDevice = await Device.find({ "MAC" :  MAC });
      console.log(exDevice);
      
      if (exDevice[0]) {
        return res.redirect('/device_list?error=exist');
      }
      else{
        const UA =  moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
        const deviceone = await Device.where({"MAC" : req.params.MAC})
        .updateMany({ "CID" : CID,
                      "MD" : MD,
                      "VER" : VER,
                      "NN" : NN,
                      "MAC" : MAC,
                      "UA" : UA,
          }).setOptions({runValidators : true})
          .exec();
          console.log(deviceone);
      }
    } catch (error) {
    console.error(error);
    return next(error);
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
        const deviceone = await Device.findOne({"MAC" : ck});
        console.log("zzzzzzzzz : "+deviceone);
        const MACc = deviceone.MAC;
        var i;
        console.log("MAC: " + ck);
        
        for(i=0; i < ck.length; i++){
            if(ck){
                if(ck[i] == MACc){
                    await Device.remove({ "MAC" : ck });
                }
                else if(!(ck instanceof Object)) {
                    await Device.remove({ "MAC" : ck });
                }
            }
            else if(!ck){
                return res.redirect('/device_list');
            }
        }
        res.redirect('/device_list');
    }   catch (err) {
        console.error(err);
        next(err);
  }
});
    
module.exports = router;