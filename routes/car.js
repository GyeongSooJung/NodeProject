const express = require('express');
const Car = require('../schemas/car');
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const router = express.Router();
const Company = require('../schemas/company');

let CARcheck;
global.CARcheck = CARcheck;

//자동차 등록
    //DB에 등록
router.post('/car_join', isNotLoggedIn,async (req, res, next) => {
  const { CC, CN, SN} = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
  console.log(CA);
  
  
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
        const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
        const UA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
        await Car.create({
            CID, CC, CN, SN, CA, UA
        });
        
        const companyone = await Company.where({"CNU" : CNU})
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();
        return res.redirect('/car_list');
        
        
      }
    } catch (err) {
      console.error(err);
      return next(err);
  }
});

const CNcheck = function(data,req,res){
    
}
const SNcheck = async (res,req,data) => {
    const Ckdb = await Car.findOne({"SN": data});
    console.log(Ckdb);
    if (Ckdb) {
      return false;
    }else
    {
      return true;
    }
}


//Excel로 DB에 등록
router.post('/car_join_xlsx', isNotLoggedIn, async(req, res, next) => {
  const { CC, CN, SN } = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
  const UA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
  const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
  var CNlist = []
 
  
  
  
  const resData = {};
  
  
  try {
      const form = new multiparty.Form({
          autoFiles: true,
      });

      form.on('file', async (name, file, CARcheck) => {
          const workbook = xlsx.readFile(file.path);
          const sheetnames = Object.keys(workbook.Sheets);
          resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]); 
          
          
          
          
           for(var j = 0; j < resData.Sheet1.length;  j++) {
             
             
             const carone = await Car.findOne({"CN": resData.Sheet1[j].차량번호});
             const carone2 = await Car.findOne({"SN": resData.Sheet1[j].차대번호});
             
             const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;
             
             console.log("33333333"+carone);
             console.log("33333333"+carone2);
             console.log(resData.Sheet1[j].차량번호);
             
              if (carone || carone2) {
              //  CARcheck = 1;
                return res.redirect('/car_join?excelCN=true');
              }
                              
                              // 엑셀 파일이 잘 되어있는지 확인
              if (7 > resData.Sheet1[j].차량번호 || 8 < resData.Sheet1[j].차량번호) {
                  return res.redirect('/car_join?length=true');
                }
              if (check.test(resData.Sheet1[j].차량번호) == false) 
                {
                 return res.redirect('/car_join?type=true');
                }
              if (!(resData.Sheet1[j].차종 == 1 || resData.Sheet1[j].차종 == 2 || resData.Sheet1[j].차종 == 3 || resData.Sheet1[j].차종 == 4 || resData.Sheet1[j].차종 == 5 || resData.Sheet1[j].차종 == 6 )) {
                  console.log("여기서 걸렸다!!!!");
                resData[sheetnames[0]][j].CID = CID;
                resData[sheetnames[0]][j].CA = CA; //차후에 변경 
                console.log(resData.Sheet1[j].차종)
                Car.insertMany({
                "CID": resData.Sheet1[j].CID,
                "CC" : resData.Sheet1[j].차종,
                "CN": resData.Sheet1[j].차량번호,
                "SN": resData.Sheet1[j].차대번호,
                "CA" : resData.Sheet1[j].CA,
                "UA" : resData.Sheet1[j].CA
                });
                }
              else {
                resData[sheetnames[0]][j].CID = CID;
                resData[sheetnames[0]][j].CA = CA; //차후에 변경 
                console.log(resData.Sheet1[j].차종)
                Car.insertMany({
                "CID": resData.Sheet1[j].CID,
                "CC" : resData.Sheet1[j].차종,
                "CN": resData.Sheet1[j].차량번호,
                "SN": resData.Sheet1[j].차대번호,
                "CA" : resData.Sheet1[j].CA,
                "UA" : resData.Sheet1[j].CA
                });
              }
                      
         }
         res.redirect('/car_list');
      });
      
      
        const companyone = await Company.where({"CNU" : CNU})
          .updateMany({ "CUA" : CA }).setOptions({runValidators : true})
          .exec();
          
          
          
      form.on('close', () => {
      });
   
      form.parse(req);
    
    } catch(err) {
      console.error(err);
      next(err);
      return res.redirect('/car_join?excel=true');
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
        const UA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
        const carone = await Car.where({"CN" : req.params.CN})
          .updateMany({ "CID" : CID,
                        "CC" : CC,
                        "CN" : CN,
                        "SN" : SN,
                        "UA" : UA,
          }).setOptions({runValidators : true})
          .exec();
          console.log(carone);
          
        const companyone = await Company.where({"CNU" : CNU})
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
router.get('/car_delete/:CN',isNotLoggedIn, async (req, res, next) => {
  const { CC, CN, SN } = req.body;
  const CNU = req.decoded.CNU;
  const CUA = moment().add('9','h').format('YYYY-MM-DD hh:mm:ss');
  try {
    await Car.remove({ "CN" : req.params.CN });
    res.redirect('/car_list');
    
  const companyone = await Company.where({"CNU" : CNU})
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
      const CNU = req.decoded.CNU;
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
          
      const companyone = await Company.where({"CNU" : CNU})
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
