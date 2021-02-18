const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Device = require('../schemas/device');
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
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
    console.log(check);
    console.log(MAC);

    if (exDevice) {
      return res.redirect('/device_join?error=true');
    }
    else if(check.test(MAC) == false) {
      return res.redirect('/device_join?type=true');
    }
    else{
      await Device.create({
        CID, MD, VER, MAC, NN
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

  const resData = {};
    try {
      const form = new multiparty.Form({
        autoFiles: true,
      });

      form.on('file', async (name, file) => {
        
          const workbook = xlsx.readFile(file.path);
          const sheetnames = Object.keys(workbook.Sheets);
          resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]);
          console.log(resData);
           for(var j = 0; j < resData.Sheet1.length;  j++) {
             
             console.log("############################"+resData.Sheet1[j].맥주소);
            const exDevice = await Device.findOne({ "MAC" : resData.Sheet1[j].맥주소 });
            const check = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
             
             if (exDevice) {
                return res.redirect('/device_join?error=true');
              } 
             else if(check.test(resData.Sheet1[j].맥주소) == false) {
              return res.redirect('/device_join?type=true');
            }
            
            

             
              resData[sheetnames[0]][j].CID = CID;
              
              
             Device.insertMany({
              "CID": resData.Sheet1[j].CID,
              "MD" : resData.Sheet1[j].모델명,
              "VER": resData.Sheet1[j].버전,
              "MAC": resData.Sheet1[j].맥주소,
              "NN" : resData.Sheet1[j].별칭
             });
         }
         
      res.redirect('/device_list');
      });

    form.on('close', () => {
    });

    form.parse(req);

    } catch(err) {
      console.error(err);
      next(err);
    }
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

      const deviceone = await Device.where({"MAC" : req.params.MAC})
      .updateMany({ "CID" : CID,
                    "MD" : MD,
                    "VER" : VER,
                    "NN" : NN,
                    "MAC" : MAC
        }).setOptions({runValidators : true})
        .exec();
        console.log(deviceone);
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

        if(!ck) {
          return res.redirect('/device_list?null=true');
        }
        else {
          const deviceone = await Device.findOne({"MAC" : ck});
          console.log("zzzzzzzzz : "+deviceone);
          const MACc = deviceone.MAC;
          var i;
          console.log("MAC: " + ck);
          console.log("MACc: " + MACc);

          for(i=0; i < ck.length; i++){
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