const express = require('express');
const Car = require('../schemas/car');
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
router.post('/car_join', isNotLoggedIn,async (req, res, next) => {
  const { CC, CN, SN} = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  // const CA = moment().format('YYYY-MM-DD hh:mm:ss');
  
  
  try {
      const exCar = await Car.findOne({ "CN" :  CN });
      // const exCar2 = await Car.findOne({ "SN" : SN  });
      const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;

      if (CN.length >= 7 && CN.length <= 8) {
        if (check.test(CN) == true) {
          if (!exCar) {
            await Car.create({
              CID, CC, CN, SN, 
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
        if(extname == '.xlsx') {
          
          // 중복이 안된 값들을 넣는 배열
          const add_excel1 = [];
          const add_excel2 = [];
          // 중복된 값들을 넣는 배열
          const re_excel1 = [];
          const re_excel2 = [];
          
          // 엑셀 파일 처리
          const workbook = xlsx.readFile(file.path);
          const sheetnames = Object.keys(workbook.Sheets);
          resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]);
          
          var a = 0;
          var b = 0;
          
          for(var j = 0; j < resData.Sheet1.length;  j++) {
            const carone = await Car.findOne({"CN": resData.Sheet1[j].차량번호});
            
            const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;

            if (resData.Sheet1[j].차량번호.length >= 7 && resData.Sheet1[j].차량번호.length <= 8) {
              
              if(check.test(resData.Sheet1[j].차량번호) == true) {
                
                if (!carone) {
                  resData[sheetnames[0]][j].CID = CID;
                  
                  add_excel1[a] = resData.Sheet1[j].CID;
                  add_excel2[a] = resData.Sheet1[j].차량번호;
                  a += 1;
                }
                else {
                  resData[sheetnames[0]][j].CID = CID;
              
                  re_excel1[b] = resData.Sheet1[j].CID;
                  re_excel2[b] = resData.Sheet1[j].차량번호;
                  b += 1;
                }
              }
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
          
          for (var i = 0; i < add_excel1.length; i ++) {
            console.log("라라ㅏ"+add_excel1+add_excel2);
            Car.insertMany({
              "CID": add_excel1[i],
              "CN": add_excel2[i],
              "SN": "엑셀등록",
            });
          }
          
          var re_excel = [];
          
          for (var h = 0; h < re_excel1.length; h ++) {
            re_excel[h] = [re_excel1[h], re_excel2[h]];
          }
          
          req.session.re_car_excel = await re_excel;
          
          return res.redirect('/car_join?inspect=true');
        }
        else if (extname == "") {
          return res.redirect('/car_join?nofile=true');
        }
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

// 차량 중복 목록 덮어쓰기

  //전체
router.post('/car_overwrite_all', isNotLoggedIn, async(req, res, next) => {
  const { CN, exCN } = req.body;
  const CID = req.decoded.CID;
  
  try {
    if (typeof(CN) == 'string') {
      const exCar = await Car.findOne({ "CN" : CN });
      
      if (!exCar) {
        await Car.where({ "CN" : exCN })
          .update({
            "CID" : CID,
            "CN" : CN,
            "SN" : "엑셀등록",
          }).setOptions({runValidators : true})
            .exec();
      }
      else {
        if (CN === exCN) {
          await Car.where({"CN" : exCN})
            .update({
              "CID" : CID,
              "CN" : CN,
              "SN" : "엑셀등록",
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re_excel = [CID, CN, exCN];
        }
      }
      
      req.session.re_car_excel = await null;
      req.session.re_car_excel = await re_excel;
      
      return res.redirect('/car_inspect');
      
    }
    else {
      
      var re_excel1 = [];
      var re_excel2 = [];
      var re_excel3 = [];
      
      var a = 0;
      
      for (var i = 0; i < CN.length; i ++) {
        
        const exCar = await Car.findOne({ "CN" : CN[i] });
        
        if (!exCar) {
          await Car.where({ "CN" : exCN[i] })
            .update({
              "CID" : CID,
              "CN" : CN[i].toString(),
              "SN" : "엑셀등록",
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          if (CN[i] === exCN[i]) {
            await Car.where({"CN" : exCN[i]})
              .update({
                "CID" : CID,
                "CN" : CN[i].toString(),
                "SN" : "엑셀등록",
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re_excel1[a] = CID;
            re_excel2[a] = CN[i];
            re_excel3[a] = exCN[i];
            a += 1;
          }
        }
        
      }
      
      a = 0;
             
      req.session.re_car_excel = await null;
      
      var re_excel = [];
      
      for (var h = 0; h < re_excel1.length; h ++) {
        re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h]];
      }
      
      req.session.re_car_excel = await re_excel;
      
      return res.redirect('/car_inspect');
    }
    
  } catch (err) {
    console.error(err);
    next(err);
  }
});

  //선택
router.post('/car_overwrite_check', isNotLoggedIn, async(req, res, next) => {
  const { ck, CN, exCN } = req.body;
  const CID = req.decoded.CID;
  
  try {
    if (typeof(ck) == 'string') {
      
      const exCar = await Car.findOne({ "CN" : CN });
      
      if (!exCar) {
        await Car.where({ "CN" : exCN })
          .update({
            "CID" : CID,
            "CN" : CN,
            "SN" : "엑셀등록",
          }).setOptions({runValidators : true})
            .exec();
      }
      else {
        if (CN === exCN) {
          await Car.where({"CN" : exCN})
            .update({
              "CID" : CID,
              "CN" : CN,
              "SN" : "엑셀등록",
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re_excel = [CID, CN, exCN];
        }
      }
      
      req.session.re_car_excel = await null;
      req.session.re_car_excel = await re_excel;
      
      return res.redirect('/car_inspect');
      
    }
    else {
      
      var re_excel1 = [];
      var re_excel2 = [];
      var re_excel3 = [];
      
      var a = 0;
      
      for (var i = 0; i < ck.length; i ++) {
        
        const exCar = await Car.findOne({ "CN" : CN[i] });
        
        if (!exCar) {
          await Car.where({ "CN" : exCN[i] })
            .update({
              "CID" : CID,
              "CN" : CN[i].toString(),
              "SN" : "엑셀등록",
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          if (CN[i] === exCN[i]) {
            await Car.where({"CN" : exCN[i]})
              .update({
                "CID" : CID,
                "CN" : CN[i].toString(),
                "SN" : "엑셀등록",
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re_excel1[a] = CID;
            re_excel2[a] = CN[i];
            re_excel3[a] = exCN[i];
            a += 1;
          }
        }
        
      }
      
      a = 0;
      
      req.session.re_car_excel = await null;
      
      var re_excel = [];
      
      for (var h = 0; h < re_excel1.length; h ++) {
        re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h]];
      }
      
      req.session.re_car_excel = await re_excel;
      
      return res.redirect('/car_inspect');
      
    }
    
  } catch (err) {
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
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    
    try {
      // const exCar = await Car.findOne({ "CN" :  CN });
      // const exCar2 = await Car.findOne({ "SN" : SN  });
      // const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;
      
      await Car.where({"CN" : req.params.CN})
        .update({ "CID" : CID,
                      "CC" : CC,
                      "CN" : CN,
                      "SN" : SN,
        }).setOptions({runValidators : true})
        .exec();
        
      await Company.where({"CNU" : CNU})
        .update({ "CUA" : CUA }).setOptions({runValidators : true})
        .exec();
      
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
  const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
  try {
    await Car.remove({ "CN" : req.params.CN });
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
    const { CC, CN, SN } = req.body;
    const CNU = req.decoded.CNU;
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    try {
        const {ck} = req.body;
        
        if(!ck) {
          return res.redirect('/car_list?null=true');
        }
        else {
          const carone = await Car.findOne({"CN" : ck});
          console.log("zzzzzzzzz : "+carone);
          const CNc = carone.CN;
          var i;
          console.log("CN: " + ck);
          console.log("CNc: " + CNc);
          
          for(i=0; i < ck.length; i++){
            if(ck[i] == CNc){
                await Car.remove({ "CN" : ck });
            }
            else if(!(ck instanceof Object)) {
                await Car.remove({ "CN" : ck });
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
