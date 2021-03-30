const express = require('express');
const Car = require('../schemas/car');
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const path = require('path');
const router = express.Router();
const Company = require('../schemas/company');

// let CARcheck;
// global.CARcheck = CARcheck;

//자동차 등록
    //DB에 등록
router.post('/car_join', isNotLoggedIn,async (req, res, next) => {
  const { CC, CN, SN} = req.body;
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  
  
  try {
      const exCar = await Car.findOne({ "CN" :  CN });
      const exCar2 = await Car.findOne({ "SN" : SN  });
      const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;
      
      if (CN.length >= 7 && CN.length <= 8) {
        if (check.test(CN) == true) {
          if (!exCar && !exCar2) {
            await Car.create({
              CID, CC, CN, SN
            });
            
            const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
            await Company.where({ "CNU" : CNU })
              .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
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
          const add_excel3 = [];
          const add_excel4 = [];
          // 중복된 값들을 넣는 배열
            // cn만
          const re_excel1 = [];
          const re_excel2 = [];
          const re_excel3 = [];
          const re_excel4 = [];
            // sn만
          const re2_excel1 = [];
          const re2_excel2 = [];
          const re2_excel3 = [];
          const re2_excel4 = [];
            // cn&sn
          const re3_excel1 = [];
          const re3_excel2 = [];
          const re3_excel3 = [];
          const re3_excel4 = [];
          // 엑셀 파일 처리
          const workbook = xlsx.readFile(file.path);
          const sheetnames = Object.keys(workbook.Sheets);
          resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]);
          var a = 0;
          var b = 0;
          var c = 0;
          var d = 0;
          
          for(var j = 0; j < resData.Sheet1.length;  j++) {
            const carone = await Car.findOne({"CN": resData.Sheet1[j].차량번호});
            const carone2 = await Car.findOne({"SN": resData.Sheet1[j].차대번호});
            
            const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;
            
            console.log("33333333"+carone);
            console.log("33333333"+carone2);
            console.log(resData.Sheet1[j].차량번호);
            
            if ((resData.Sheet1[j].차종 == 1 || resData.Sheet1[j].차종 == 2 || resData.Sheet1[j].차종 == 3 || resData.Sheet1[j].차종 == 4 || resData.Sheet1[j].차종 == 5 || resData.Sheet1[j].차종 == 6 || resData.Sheet1[j].차종 == 7 || resData.Sheet1[j].차종 == 8 || resData.Sheet1[j].차종 == 9)) {
              if (resData.Sheet1[j].차량번호.length >= 7 && resData.Sheet1[j].차량번호.length <= 8) {
                
                if(check.test(resData.Sheet1[j].차량번호) == true) {
                  
                  if (!carone && !carone2) {
                    resData[sheetnames[0]][j].CID = CID;
                    
                    add_excel1[a] = resData.Sheet1[j].CID;
                    add_excel2[a] = resData.Sheet1[j].차종;
                    add_excel3[a] = resData.Sheet1[j].차량번호;
                    add_excel4[a] = resData.Sheet1[j].차대번호;
                    a += 1;
                  }
                  else if (carone && !carone2) {
                    resData[sheetnames[0]][j].CID = CID;
                
                    re_excel1[b] = resData.Sheet1[j].CID;
                    re_excel2[b] = resData.Sheet1[j].차종;
                    re_excel3[b] = resData.Sheet1[j].차량번호;
                    re_excel4[b] = resData.Sheet1[j].차대번호;
                    b += 1;
                  }
                  else if (!carone && carone2) {
                    resData[sheetnames[0]][j].CID = CID;
                
                    re2_excel1[c] = resData.Sheet1[j].CID;
                    re2_excel2[c] = resData.Sheet1[j].차종;
                    re2_excel3[c] = resData.Sheet1[j].차량번호;
                    re2_excel4[c] = resData.Sheet1[j].차대번호;
                    c += 1;
                  }
                  else {
                    resData[sheetnames[0]][j].CID = CID;
                
                    re3_excel1[d] = resData.Sheet1[j].CID;
                    re3_excel2[d] = resData.Sheet1[j].차종;
                    re3_excel3[d] = resData.Sheet1[j].차량번호;
                    re3_excel4[d] = resData.Sheet1[j].차대번호;
                    d += 1;
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
            else {
              return res.redirect('/car_join?excelCC=true');
            }
          }
          a = 0;
          b = 0;
          c = 0;
          d = 0;
          
          for (var i = 0; i < add_excel1.length; i ++) {
            Car.insertMany({
              "CID": add_excel1[i],
              "CC" : add_excel2[i],
              "CN": add_excel3[i],
              "SN": add_excel4[i],
            });
          }
          
          var re_excel = [];
          var re2_excel = [];
          var re3_excel = [];
          
          for (var h = 0; h < re_excel1.length; h ++) {
            re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h], re_excel4[h]];
          }
          for (var g = 0; g < re2_excel1.length; g ++) {
            re2_excel[g] = [re2_excel1[g], re2_excel2[g], re2_excel3[g], re2_excel4[g]];
          }
          for (var k = 0; k < re3_excel1.length; k ++) {
            re3_excel[k] = [re3_excel1[k], re3_excel2[k], re3_excel3[k], re3_excel4[k]];
          }
          console.log("길이"+re3_excel1.length);
          
          req.session.re_car_excel = await re_excel;
          req.session.re2_car_excel = await re2_excel;
          req.session.re3_car_excel = await re3_excel;
          
          console.log("알이큐"+req.session.re_car_excel);
          console.log("알이큐"+req.session.re2_car_excel);
          console.log("알이큐"+req.session.re3_car_excel);
          
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
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
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
  const { CC, CN, SN, exCN, exSN } = req.body;
  const CID = req.decoded.CID;
  
  try {
    if (typeof(CN) == 'string') {
      const exCar = await Car.findOne({ "CN" : CN });
      const exCar2 = await Car.findOne({ "SN" : SN });
      
      if (!exCar && !exCar2) {
        await Car.where({ $or : [ { "CN" : exCN }, { "SN" : exSN } ] })
          .updateMany({
            "CID" : CID,
            "CC" : CC,
            "CN" : CN,
            "SN" : SN,
          }).setOptions({runValidators : true})
            .exec();
      }
      else if (exCar && !exCar2) {
        if (CN === exCN) {
          await Car.where({"CN" : exCN})
            .updateMany({
              "CID" : CID,
              "CC" : CC,
              "CN" : CN,
              "SN" : SN,
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re_excel = [CID, CC, CN, SN, exCN, exSN];
        }
      }
      else if (!exCar && exCar2) {
        if (SN === exSN) {
          await Car.where({"SN" : exSN})
            .updateMany({
              "CID" : CID,
              "CC" : CC,
              "CN" : CN,
              "SN" : SN,
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re2_excel = [CID, CC, CN, SN, exCN, exSN];
        }
      }
      else {
        var re3_excel = [CID, CC, CN, SN, exCN, exSN];
      }
      
      req.session.re_car_excel = await null;
      req.session.re2_car_excel = await null;
      req.session.re3_car_excel = await null;
      req.session.re_car_excel = await re_excel;
      req.session.re2_car_excel = await re2_excel;
      req.session.re3_car_excel = await re3_excel;
      
      return res.redirect('/car_inspect');
      
    }
    else {
      
      var re_excel1 = [];
      var re_excel2 = [];
      var re_excel3 = [];
      var re_excel4 = [];
      var re_excel5 = [];
      var re_excel6 = [];
      
      var re2_excel1 = [];
      var re2_excel2 = [];
      var re2_excel3 = [];
      var re2_excel4 = [];
      var re2_excel5 = [];
      var re2_excel6 = [];
      
      var re3_excel1 = [];
      var re3_excel2 = [];
      var re3_excel3 = [];
      var re3_excel4 = [];
      var re3_excel5 = [];
      var re3_excel6 = [];
      
      var a = 0;
      var b = 0;
      var c = 0;
      
      for (var i = 0; i < CN.length; i ++) {
        
        const exCar = await Car.findOne({ "CN" : CN[i] });
        const exCar2 = await Car.findOne({ "SN" : SN[i] });
        
        if (!exCar && !exCar2) {
          await Car.where({ $or : [ { "CN" : exCN[i] }, { "SN" : exSN[i] } ] })
            .updateMany({
              "CID" : CID,
              "CC" : parseInt(CC[i]),
              "CN" : CN[i].toString(),
              "SN" : SN[i].toString(),
            }).setOptions({runValidators : true})
              .exec();
        }
        else if (exCar && !exCar2) {
          if (CN[i] === exCN[i]) {
            await Car.where({"CN" : exCN[i]})
              .updateMany({
                "CID" : CID,
                "CC" : parseInt(CC[i]),
                "CN" : CN[i].toString(),
                "SN" : SN[i].toString(),
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re_excel1[a] = CID;
            re_excel2[a] = CC[i];
            re_excel3[a] = CN[i];
            re_excel4[a] = SN[i];
            re_excel5[a] = exCN[i];
            re_excel6[a] = exSN[i];
            a += 1;
          }
        }
        else if (!exCar && exCar2) {
          if (SN[i] === exSN[i]) {
            await Car.where({"SN" : exSN[i]})
              .updateMany({
                "CID" : CID,
                "CC" : parseInt(CC[i]),
                "CN" : CN[i].toString(),
                "SN" : SN[i].toString(),
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re2_excel1[b] = CID;
            re2_excel2[b] = CC[i];
            re2_excel3[b] = CN[i];
            re2_excel4[b] = SN[i];
            re2_excel5[b] = exCN[i];
            re2_excel6[b] = exSN[i];
            b += 1;
          }
        }
        else {
          re3_excel1[c] = CID;
          re3_excel2[c] = CC[i];
          re3_excel3[c] = CN[i];
          re3_excel4[c] = SN[i];
          re3_excel5[c] = exCN[i];
          re3_excel6[c] = exSN[i];
          c += 1;
        }
        
      }
      
      a = 0;
      b = 0;
      c = 0;
             
      req.session.re_car_excel = await null;
      req.session.re2_car_excel = await null;
      req.session.re3_car_excel = await null;
      
      var re_excel = [];
      var re2_excel = [];
      var re3_excel = [];
      
      for (var h = 0; h < re_excel1.length; h ++) {
        re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h], re_excel4[h], re_excel5[h], re_excel6[h]];
      }
      for (var k = 0; k < re2_excel1.length; k ++) {
        re2_excel[k] = [re2_excel1[k], re2_excel2[k], re2_excel3[k], re2_excel4[k], re2_excel5[k], re2_excel6[k]];
      }
      for (var z = 0; z < re3_excel1.length; z ++) {
        re3_excel[z] = [re3_excel1[z], re3_excel2[z], re3_excel3[z], re3_excel4[z], re3_excel5[z], re3_excel6[z]];
      }
      
      req.session.re_car_excel = await re_excel;
      req.session.re2_car_excel = await re2_excel;
      req.session.re3_car_excel = await re3_excel;
      
      return res.redirect('/car_inspect');
    }
    
  } catch (err) {
    console.error(err);
    next(err);
  }
});

  //선택
router.post('/car_overwrite_check', isNotLoggedIn, async(req, res, next) => {
  const { ck, CC, CN, SN, exCN, exSN } = req.body;
  const CID = req.decoded.CID;
  
  try {
    if (typeof(ck) == 'string') {
      
      const exCar = await Car.findOne({ "CN" : CN });
      const exCar2 = await Car.findOne({ "SN" : SN });
      
      if (!exCar && !exCar2) {
        await Car.where({ $or : [ { "CN" : exCN }, { "SN" : exSN } ] })
          .updateMany({
            "CID" : CID,
            "CC" : CC,
            "CN" : CN,
            "SN" : SN,
          }).setOptions({runValidators : true})
            .exec();
      }
      else if (exCar && !exCar2) {
        if (CN === exCN) {
          await Car.where({"CN" : exCN})
            .updateMany({
              "CID" : CID,
              "CC" : CC,
              "CN" : CN,
              "SN" : SN,
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re_excel = [CID, CC, CN, SN, exCN, exSN];
        }
      }
      else if (!exCar && exCar2) {
        if (SN === exSN) {
          await Car.where({"SN" : exSN})
            .updateMany({
              "CID" : CID,
              "CC" : CC,
              "CN" : CN,
              "SN" : SN,
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re2_excel = [CID, CC, CN, SN, exCN, exSN];
        }
      }
      else {
        var re3_excel = [CID, CC, CN, SN, exCN, exSN];
      }
      
      req.session.re_car_excel = await null;
      req.session.re2_car_excel = await null;
      req.session.re3_car_excel = await null;
      req.session.re_car_excel = await re_excel;
      req.session.re2_car_excel = await re2_excel;
      req.session.re3_car_excel = await re3_excel;
      
      return res.redirect('/car_inspect');
      
    }
    else {
      
      var re_excel1 = [];
      var re_excel2 = [];
      var re_excel3 = [];
      var re_excel4 = [];
      var re_excel5 = [];
      var re_excel6 = [];
      
      var re2_excel1 = [];
      var re2_excel2 = [];
      var re2_excel3 = [];
      var re2_excel4 = [];
      var re2_excel5 = [];
      var re2_excel6 = [];
      
      var re3_excel1 = [];
      var re3_excel2 = [];
      var re3_excel3 = [];
      var re3_excel4 = [];
      var re3_excel5 = [];
      var re3_excel6 = [];
      
      var a = 0;
      var b = 0;
      var c = 0;
      
      for (var i = 0; i < ck.length; i ++) {
        
        const exCar = await Car.findOne({ "CN" : CN[i] });
        const exCar2 = await Car.findOne({ "SN" : SN[i] });
        
        if (!exCar && !exCar2) {
          await Car.where({ $or : [ { "CN" : exCN[i] }, { "SN" : exSN[i] } ] })
            .updateMany({
              "CID" : CID,
              "CC" : parseInt(CC[i]),
              "CN" : CN[i].toString(),
              "SN" : SN[i].toString(),
            }).setOptions({runValidators : true})
              .exec();
        }
        else if (exCar && !exCar2) {
          if (CN[i] === exCN[i]) {
            await Car.where({"CN" : exCN[i]})
              .updateMany({
                "CID" : CID,
                "CC" : parseInt(CC[i]),
                "CN" : CN[i].toString(),
                "SN" : SN[i].toString(),
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re_excel1[a] = CID;
            re_excel2[a] = CC[i];
            re_excel3[a] = CN[i];
            re_excel4[a] = SN[i];
            re_excel5[a] = exCN[i];
            re_excel6[a] = exSN[i];
            a += 1;
          }
        }
        else if (!exCar && exCar2) {
          if (SN[i] === exSN[i]) {
            await Car.where({"SN" : exSN[i]})
              .updateMany({
                "CID" : CID,
                "CC" : parseInt(CC[i]),
                "CN" : CN[i].toString(),
                "SN" : SN[i].toString(),
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re2_excel1[b] = CID;
            re2_excel2[b] = CC[i];
            re2_excel3[b] = CN[i];
            re2_excel4[b] = SN[i];
            re2_excel5[b] = exCN[i];
            re2_excel6[b] = exSN[i];
            b += 1;
          }
        }
        else {
          re3_excel1[c] = CID;
          re3_excel2[c] = CC[i];
          re3_excel3[c] = CN[i];
          re3_excel4[c] = SN[i];
          re3_excel5[c] = exCN[i];
          re3_excel6[c] = exSN[i];
          c += 1;
        }
        
        // await Car.where({"CN" : ck[i]})
        //   .updateMany({
        //     "CID" : CID,
        //     "CC" : parseInt(CC[i]),
        //     "CN" : CN[i].toString(),
        //     "SN" : SN[i].toString(),
        //   }).setOptions({runValidators : true})
        //     .exec();
      }
      
      a = 0;
      b = 0;
      c = 0;
      
      req.session.re_car_excel = await null;
      req.session.re2_car_excel = await null;
      req.session.re3_car_excel = await null;
      
      var re_excel = [];
      var re2_excel = [];
      var re3_excel = [];
      
      for (var h = 0; h < re_excel1.length; h ++) {
        re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h], re_excel4[h], re_excel5[h], re_excel6[h]];
      }
      for (var k = 0; k < re2_excel1.length; k ++) {
        re2_excel[k] = [re2_excel1[k], re2_excel2[k], re2_excel3[k], re2_excel4[k], re2_excel5[k], re2_excel6[k]];
      }
      for (var z = 0; z < re3_excel1.length; z ++) {
        re3_excel[z] = [re3_excel1[z], re3_excel2[z], re3_excel3[z], re3_excel4[z], re3_excel5[z], re3_excel6[z]];
      }
      
      req.session.re_car_excel = await re_excel;
      req.session.re2_car_excel = await re2_excel;
      req.session.re3_car_excel = await re3_excel;
      
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
      const exCar = await Car.findOne({ "CN" :  CN });
      const exCar2 = await Car.findOne({ "SN" : SN  });
      const check = /^[0-9]{2,3}[하,허,호]{1}[0-9]{4}/gi;
      
      if (!exCar2) {
        const carone = await Car.where({"CN" : req.params.CN})
          .updateMany({ "CID" : CID,
                        "CC" : CC,
                        "CN" : CN,
                        "SN" : SN,
          }).setOptions({runValidators : true})
          .exec();
          console.log(carone);
          
        const companyone = await Company.where({"CNU" : CNU})
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();
      }
      else {
        if(SN === exCar.SN) {
          
          const carone = await Car.where({"CN" : req.params.CN})
            .updateMany({ "CID" : CID,
                          "CC" : CC,
                          "CN" : CN,
                          "SN" : SN,
            }).setOptions({runValidators : true})
            .exec();
            console.log(carone);
          
        const companyone = await Company.where({"CNU" : CNU})
          .updateMany({ "CUA" : CUA }).setOptions({runValidators : true})
          .exec();
          
        }
        else{
          return res.redirect('/car_list?exist=true');
        }
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
  const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
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
