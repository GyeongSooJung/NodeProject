const express = require('express');
const Car = require('../schemas/car');
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const router = express.Router();
const Company = require('../schemas/company');

//자동차 등록
    //DB에 등록
router.post('/car_join', isNotLoggedIn,async (req, res, next) => {
  const { CC, CN, SN } = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  
  try {
      const exCar = await Car.find({ "CN" :  CN });
      const exCar2 = await Car.find({ "SN" : SN  });
      const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;
      
      if (7 > CN.length || 8 < CN.length) {
        return res.redirect('/car_join?length=true');
      }
      else if (check.test(CN) == false) {
        return res.redirect('/car_join?type=true');
      }
      else if (exCar[0] || exCar2[0]) {
        return res.redirect('/car_join?error=exist');
      }
      else {
        const CA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
        const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
        const UA = "";
        await Car.create({
            CID, CC, CN, SN, CA
        });
        return res.redirect('/car_join');
        
        const companyone = await Company.where({"CN" : req.params.CN})
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();
      }
    } catch (err) {
      console.error(err);
      return next(err);
  }
});

//Excel로 DB에 등록
router.post('/car_join_xlsx', isNotLoggedIn, async(req, res, next) => {
  const { CC, CN, SN } = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss'); //한국시간 맞추기 위해 +9시간
  const UA = "";
  const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
  
  const resData = {};
    try {
      const form = new multiparty.Form({
          autoFiles: true,
      });

      form.on('file', (name, file) => {
          const workbook = xlsx.readFile(file.path);
          const sheetnames = Object.keys(workbook.Sheets);
          resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]); 
          console.log(resData);
           for(var j = 0; j < resData.Sheet1.length;  j++) {
            resData[sheetnames[0]][j].CID = CID;
            resData[sheetnames[0]][j].CA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');;
           Car.insertMany({
            "CID": resData.Sheet1[j].CID,
            "CC" : resData.Sheet1[j].차종,
            "CN": resData.Sheet1[j].차량번호,
            "SN": resData.Sheet1[j].차대번호,
            "CA" : resData.Sheet1[j].CA
           });
           
           
           
         }
      });
      
       const companyone = await Company.where({"CN" : req.params.CN})
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();
   
      form.on('close', () => {
        res.redirect('/car_join');
      });
   
      form.parse(req);
    
    } catch(err) {
      console.error(err);
      next(err);
    }
});

//차량 수정
  //DB
router.post('/car_edit/upreg/:CN', isNotLoggedIn,async (req, res, next) => {
    const { CC, CN, SN } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
    
    try {
      const exCar = await Car.find({ "CN" :  CN });
      const exCar2 = await Car.find({ "SN" : SN  });
      const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;
      
      if (7 > CN.length || 8 < CN.length) {
        return res.redirect('/car_list?length=true');
      }
      else if (check.test(CN) == false) {
        return res.redirect('/car_list?type=true');
      }
      else if (exCar[0] || exCar2[0]) {
        return res.redirect('/car_list?error=exist');
      }
      else {
        const UA =  moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
        const carone = await Car.where({"CN" : req.params.CN})
          .updateMany({ "CID" : CID,
                        "CC" : CC,
                        "CN" : CN,
                        "SN" : SN,
                        "UA" : UA,
          }).setOptions({runValidators : true})
          .exec();
          console.log(carone);
          
        const companyone = await Company.where({"CN" : req.params.CN})
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();
      }
    } catch (error) {
    console.error(error);
    return next(error);
  }
  res.redirect('/car_list');
});

//차량 삭제
router.get('/car_delete/:CN', async (req, res, next) => {
  const { CC, CN, SN } = req.body;
  const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
  try {
    await Car.remove({ "CN" : req.params.CN });
    res.redirect('/car_list');
    
    const companyone = await Company.where({"CN" : req.params.CN})
    .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
    .exec();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//차량 선택삭제
router.post('/car_select_delete',isNotLoggedIn ,async (req, res, next) => {
    const { CC, CN, SN } = req.body;
    const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
    try {
        const {ck} = req.body;
        
        if(!ck) {
          return res.redirect('/car_list');
        }
        else {
          const carone = await Car.findOne({"CN" : ck});
          console.log("zzzzzzzzz : "+carone);
          const CNc = carone.CN;
          var i;
          console.log("CN: " + ck);
          
          for(i=0; i < ck.length; i++){
              if(ck){
                  if(ck[i] == CNc){
                      await Car.remove({ "CN" : ck });
                  }
                  else if(!(ck instanceof Object)) {
                      await Car.remove({ "CN" : ck });
                  }
              }
          }
          
        const companyone = await Company.where({"CN" : req.params.CN})
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();
          res.redirect('/car_list');
        }
    }   catch (err) {
        console.error(err);
        next(err);
  }
});

module.exports = router;
