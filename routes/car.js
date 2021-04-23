const express = require('express');
const Car = require('../schemas/car');
const Cardelete = require('../schemas/car_delete')
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const path = require('path');
const router = express.Router();
const Company = require('../schemas/company');

// let CARcheck;3
// global.CARcheck = CARcheck;

//자동차 등록
  //DB에 등록
router.post('/car_join', isNotLoggedIn, async (req, res, next) => {
  const { CN, CPN } = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  // const CA = moment().format('YYYY-MM-DD hh:mm:ss');
  
  
  try {
    const exCar = await Car.findOne({ "CID" : CID, "CN" :  CN });
    const check = /^[0-9]{2,3}[가-힣]{1}[0-9]{4}/gi;

    if (CN.length >= 7 && CN.length <= 8) {
      if (check.test(CN) == true) {
        if (!exCar) {
          await Car.create({
            CID, CN, CPN,
          });
          
          const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
          await Company.where({ "CNU" : CNU })
            .update({ "CUA" : CUA }).setOptions({runValidators : true})
            .exec();
          return res.redirect('/car_list');
        }
        else {
          return res.redirect('/car_join?exist=true');
        }
      }
      else {
        return res.redirect('/car_join?type=true');
      }
    }
    else {
      return res.redirect('/car_join?length=true');
    }
    } catch (err) {
      console.error(err);
      return next(err);
  }
});

  //Excel로 DB에 등록
router.post('/car_join_xlsx', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
  
  const resData = {};
  try {
      const form = new multiparty.Form({
          autoFiles: true,
      });

      form.on('file', async (name, file) => {
        const extname = path.extname(file.path);
        console.log("확장자명"+extname);
        
        // 엑셀 파일인 경우
        if(extname == '.xlsx') {
          
          // 중복이 안된 값들을 넣는 배열
          const add_excel1 = [];
          const add_excel2 = [];
          // 중복된 값들을 넣는 배열(CID같음)
          const re_excel1 = [];
          const re_excel2 = [];
          
          // 엑셀 파일 처리
          const workbook = xlsx.readFile(file.path);
          const sheetnames = Object.keys(workbook.Sheets);
          resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]);
          
          var a = 0;
          var b = 0;
          
          // 항목이 100개 이하인 경우
          if (resData.Sheet1.length <= 100) {
            for(var j = 0; j < resData.Sheet1.length;  j++) {
              const carone = await Car.findOne({"CID" : CID, "CN": resData.Sheet1[j].차량번호});
              const check = /^[0-9]{2,3}[가-힣]{1}[0-9]{4}/gi;
              
              // 차량번호 길이가 7,8자리인 경우
              if (resData.Sheet1[j].차량번호.length >= 7 && resData.Sheet1[j].차량번호.length <= 8) {
                
                // 차량번호가 유효한 경우
                if(check.test(resData.Sheet1[j].차량번호) == true) {
                  
                  // 차량번호가 중복되지 않는 경우
                  if (!carone) {
                    add_excel1[a] = resData.Sheet1[j].차량번호;
                    add_excel2[a] = resData.Sheet1[j].차주전화번호;
                    a += 1;
                  }
                  // 차량번호가 중복되는 경우(CID 같음)
                  else {
                    re_excel1[b] = resData.Sheet1[j].차량번호;
                    re_excel2[b] = resData.Sheet1[j].차주전화번호;
                    b += 1;
                  }
                }
                // 
                else {
                  return res.redirect('/car_join?excelType=true');
                }
              }
              else {
                return res.redirect('/car_join?excelLength=true')
              }
              
            }
            a = 0;
            b = 0;
            
            for (var h = 0; h < add_excel1.length; h ++) {
              await Car.insertMany({
                "CID" : CID,
                "CN" : add_excel1[h],
                "CPN" : add_excel2[h],
              });
            }
            for (var i = 0; i < re_excel1.length; i ++) {
              await Car.where({ "CN" : re_excel1[i] })
                .update({
                  "CID" : CID,
                  "CN" : re_excel1[i],
                  "CPN" : re_excel2[i],
                });
            }
            return res.redirect('/car_list');
          }
          else {
            return res.redirect('/car_join?excelSize=true');
          }
          
        }
        // 파일이 없을 경우
        else if (extname == "") {
          return res.redirect('/car_join?nofile=true');
        }
        // 엑셀 파일이 아닌 경우
        else {
          return res.redirect('/car_join?excel=true');
        }
        
      });
        await Company.where({"CNU" : CNU})
          .update({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();

      form.on('close', () => {});
   
      form.parse(req);
    
    } catch(err) {
      console.error(err);
      next(err);
    }
});

//차량 수정
  //DB
router.post('/car_edit/upreg/:CN', isNotLoggedIn, async (req, res, next) => {
    const { CN, CPN } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    
    try {
      const exCar = await Car.findOne({ "CID" : CID, "CN" :  CN });
      const check = /^[0-9]{2,3}[가-힣]{1}[0-9]{4}/gi;
      
      if (CN.length >= 7 && CN.length <= 8) {
        if (check.test(CN) == true) {
          if (!exCar) {
            await Car.where({"CN" : req.params.CN})
              .update({ "CID" : CID,
                        "CN" : CN,
                        "CPN" : CPN,
              }).setOptions({runValidators : true})
              .exec();
              
            await Company.where({"CNU" : CNU})
              .update({ "CUA" : CUA }).setOptions({runValidators : true})
              .exec();
          }
          else {
            if (CN == req.params.CN) {
              await Car.where({"CN" : req.params.CN})
                .update({ "CID" : CID,
                          "CN" : CN,
                          "CPN" : CPN,
                }).setOptions({runValidators : true})
                .exec();
                
              await Company.where({"CNU" : CNU})
                .update({ "CUA" : CUA }).setOptions({runValidators : true})
                .exec();
            }
            else {
              res.redirect('/car_list?exist=true');
            }
          }
        }
        else {
          return res.redirect('/car_join?type=true');
        }
      }
      else {
        return res.redirect('/car_join?length=true');
      }
      
    } catch (error) {
    console.error(error);
    return next(error);
  }
  res.redirect('/car_list');
});

//차량 삭제
router.get('/car_delete/:CN', isNotLoggedIn, async (req, res, next) => {
  const { CN, CPN } = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
  try {
    const carone = await Car.findOne({ "CID" : CID, "CN" : req.params.CN });
    await Cardelete.create({
                    "CID" : carone.CID,
                    "CC" : carone.CC,
                    "CPN" : carone.CPN,
    });
    await Car.remove({ "CID" : CID, "CN" : req.params.CN });
    res.redirect('/car_list');
    
  const companyone = await Company.where({"CNU" : CNU})
    .update({ "CUA" : CUA }).setOptions({runValidators : true})
    .exec();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//차량 선택삭제
router.post('/car_select_delete',isNotLoggedIn ,async (req, res, next) => {
    const { CN, CPN } = req.body;
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    try {
        const {ck} = req.body;
        
        if(!ck) {
          return res.redirect('/car_list?null=true');
        }
        else {
          
          if (typeof(ck) == 'string') {
            const carone = await Car.findOne({ "CID" : CID, "CN" : ck });
                await Cardelete.create({
                    "CID" : carone.CID,
                    "CN" : carone.CN,
                    "CPN" : carone.CPN,
                });
            await Car.remove({ "CID" : CID, "CN" : ck });
          }
          else {
             for(var i = 0; i < ck.length; i++){
               var carone = await Car.findOne({ "CID" : CID, "CN" : ck[i] });  
                 await Cardelete.create({
                    "CID" : carone.CID,
                    "CN" : carone.CN,
                    "CPN" : carone.CPN,
                });
                await Car.remove({ "CID" : CID, "CN" : ck[i] });
             }
          }
          
          const companyone = await Company.where({"CNU" : CNU})
            .update({ "CUA" : CUA }).setOptions({runValidators : true})
            .exec();
              res.redirect('/car_list');
        }
    }   catch (err) {
        console.error(err);
        next(err);
  }
});

module.exports = router;