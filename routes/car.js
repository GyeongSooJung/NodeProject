//Express
const express = require('express');
const router = express.Router();

//Module
var moment = require('moment');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const path = require('path');
const Mongoose = require('mongoose');

//Schemas
const Car = require('../schemas/car');
const Cardelete = require('../schemas/car_delete');
const Company = require('../schemas/company');

//Middleware
const { isNotLoggedIn } = require('./middleware');

//자동차 등록
  // 수기 입력(하나씩) 차량 등록
router.post('/car_join', isNotLoggedIn, async (req, res, next) => {
  const { data } = req.body;
  const jsonData = JSON.parse(data);
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  
  try {
    // 차량번호 정규식
    var check = /^[0-9]{2,3}[가-힣]{1}[0-9]{4}/gi;
    // 업체에 등록된 차량
    const exCar = await Car.findOne({ "CID" : CID, "CN" :  jsonData.CN });
      
    if(jsonData.CN.length >= 7 && jsonData.CN.length <= 8) {
      if(check.test(jsonData.CN) == true) {
        if(!exCar) {
          await Car.create({
            "CID" : CID,
            "CN" : jsonData.CN,
            "CPN" : jsonData.CPN
          });
          
          const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
          await Company.where({ "CNU" : CNU })
            .update({ "CUA" : CUA }).setOptions({runValidators : true})
            .exec();
            
          return res.send({ result : 'success', type : 'car' });
        }
        else {
          return res.send({ result : 'exist', type : 'car' });
        }
      }
      else {
        return res.send({ result : 'type', type : 'car' });
      }
    }
    else {
      return res.send({ result : 'length', type : 'car' });
    }
  } catch(err) {
    console.error(err);
    next(err);
    return res.send({ result : 'fail'});
  }
});

  // 브라우저에 나타난 excel 데이터 등록
router.post('/car_join_excel', isNotLoggedIn, async (req, res, next) => {
  const { data } = req.body;
  const jsonData = JSON.parse(data);
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
  var current = moment().format('YYYY-MM-DD hh:mm:ss');
  var excelArr = [];
  
  try {
    // 차량번호 정규식
    var check = /^[0-9]{2,3}[가-힣]{1}[0-9]{4}/gi;
    // String으로 넘어온 값들을 배열로 변환하는 함수
    var changeArr = function strToArr(str) {
      const array = str.split(",");
      return array;
    };
    // 엑셀 데이터를 배열로 변환
    excelArr = changeArr(jsonData.excelData);
    
    const excelCN = [];
    const excelCPN = [];
    var a = 0;
    var b = 0;
    
    // 엑셀 데이터(차량번호) 배열에 담기
    for(var i = 0; i < excelArr.length; i+=2) {
      if(excelArr[i].length >=7 && excelArr[i].length <= 8) {
        //정규식 lastIndex 매번 초기화
        check.lastIndex = 0;
        if(check.test(excelArr[i])) {
          excelCN[a] = excelArr[i];
          a += 1;
        }
        else {
          return res.send({ result : 'excelType', type : 'car' });
        }
      }
      else {
        return res.send({ result : 'excelLength', type : 'car' });
      }
    }
    // 엑셀 데이터(차주전화번호) 배열에 담기
    for(var j = 1; j < excelArr.length; j+=2) {
      excelCPN[b] = excelArr[j];
      b += 1;
    }
    a = 0;
    b = 0;
    
    // 엑셀 데이터 DB에 upsert방식(없으면 insert, 있으면 update)으로 넣기
    for(var h = 0; h < excelCN.length; h++) {
      await Car.update({ "CID" : CID, "CN" : excelCN[h] }, { "CID" : CID, "CN" : excelCN[h], "CPN" : excelCPN[h], "CA" : current }, { upsert : true });
    }
    
    await Company.where({"CNU" : CNU})
      .update({ "CUA" : CUA }).setOptions({runValidators : true})
      .exec();
    
    return res.send({ result : 'success', type : 'car' });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

// Excel 데이터 브라우저에 나타내기
router.post('/car_json_excel', isNotLoggedIn, async (req, res, next) => {
  
  const resData = {};
  try {
    const form = new multiparty.Form({
      autoFiles: true,
    });
    
    form.on('file', async (name, file) => {
      const extname = path.extname(file.path); //확장자명
      const fileName = path.basename(file.path); //파일전체경로
      
      if(extname == '.xlsx') {
        // 엑셀 파일 처리
        const workbook = xlsx.readFile(file.path);
        const sheetnames = Object.keys(workbook.Sheets);
        resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]);
        
        // 항목이 100개 이하인 경우
        if (resData.Sheet1.length <= 1000) {
          // 엑셀 데이터를 반복문 통해서 배열에 담기
          const excelData = [];
          for(var j = 0; j < resData.Sheet1.length; j++) {
            excelData[j] = [resData.Sheet1[j].차량번호, resData.Sheet1[j].차주전화번호];
          }
          
          return res.send({ result : 'send', excelData : excelData });
        }
        else {
          return res.send({ result : 'overSize' });
        }
      }
      else if (extname == "") {
        return res.send({ result : 'sendNull' });
      }
      else {
        return res.send({ result : 'sendFail' });
      }
    });
    
    form.on('close', () => {});
 
    form.parse(req);
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

// 수정 - 브라우저 나타내기
router.post('/ajax/car_list_edit1', isNotLoggedIn, async(req, res, next) => {
  const { car_id } = req.body;
  
  var ObjectId = Mongoose.Types.ObjectId;
  const carone = await Car.find({ _id : ObjectId(car_id) });
  
  res.send({ result : "success", carone : carone });
});

// 수정 - 실데이터 수정
router.post('/ajax/car_list_edit2', isNotLoggedIn, async(req, res, next) => {
  const { CN, CPN, CID, car_id } = req.body;
  
  const exCar = await Car.findOne({ "CID" : CID, "CN" :  CN });
  const check = /^[0-9]{2,3}[가-힣]{1}[0-9]{4}/gi;
  const numCheck = /^[0-9]*$/;
  try{
    if (CN.length >= 7 && CN.length <= 8) {
      check.lastIndex = 0;
      if (check.test(CN) == true) {
        
        if(!exCar) {
          if(numCheck.test(CPN) == true) {
            const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
            
            await Car.where({ "_id" : car_id })
              .updateOne({
                "CID" : CID,
                "CN" : CN,
                "CPN" : CPN,
              }).setOptions({runValidators : true})
              .exec();
            await Company.where({ "_id" : CID })
              .updateOne({
                "CUA" : CUA
              }).setOptions({runValidators : true})
              .exec();
              
            return res.send({ result : "success" });
          }
          else {
            return res.send({ result : "numErr" });
          }
        }
        else {
          return res.send({ result : 'exist' });
        }
      }
      else {
        return res.send({ result : 'type' });
      }
    }
    else {
      return res.send({ result : 'length' });
    }
  }catch(err) {
    console.error(err);
    res.send({ result : "fail" });
  }
});

//차량 한개 삭제
router.post('/ajax/car_deleteone', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select"];
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
  try {
    const carone = await Car.findOne({ "CID" : CID, "CN" : select.split(' ') });
    await Cardelete.create({
      "CID" : carone.CID,
      "CC" : carone.CC,
      "CPN" : carone.CPN,
    });
    await Car.remove({ "CID" : CID, "CN" : select.split(' ') });
    await Company.where({"CNU" : CNU})
      .update({ "CUA" : CUA }).setOptions({runValidators : true})
      .exec();
      
    res.send({ result : 'success' });
  } catch (err) {
    res.send({ result : 'fail' });
    console.error(err);
    next(err);
  }
});

//차량 선택삭제
router.post('/ajax/car_delete', isNotLoggedIn ,async (req, res, next) => {
    var select = req.body["select[]"];
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    try {
        if(!select) {
          res.send({ result : 'fail' });
        }
        else {
          if (typeof(select) == 'string') {
            const carone = await Car.findOne({ "CID" : CID, "CN" : select });
            await Cardelete.create({
                "CID" : carone.CID,
                "CN" : carone.CN,
                "CPN" : carone.CPN,
            });
            await Car.remove({ "CID" : CID, "CN" : select });
          }
          else {
             for(var i = 0; i < select.length; i++){
               var carone = await Car.findOne({ "CID" : CID, "CN" : select[i] });  
                 await Cardelete.create({
                    "CID" : carone.CID,
                    "CN" : carone.CN,
                    "CPN" : carone.CPN,
                });
                await Car.remove({ "CID" : CID, "CN" : select[i] });
             }
          }
          
          await Company.where({"CNU" : CNU})
            .update({ "CUA" : CUA }).setOptions({runValidators : true})
            .exec();
            
          res.send({ result : 'success' });
        }
    } catch (err) {
      res.send({ result : 'fail' });
      console.error(err);
      next(err);
    }
});

module.exports = router;