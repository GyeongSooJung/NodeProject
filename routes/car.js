const express = require('express');
const Car = require('../schemas/car');
const Cardelete = require('../schemas/car_delete');
var moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const multiparty = require('multiparty');
const excelToJson = require('convert-excel-to-json');
const xlsx = require('xlsx');
const path = require('path');
const router = express.Router();
const Company = require('../schemas/company');

const Mongoose = require('mongoose');

//자동차 등록
  // 수기 입력(하나씩) 차량 등록
router.post('/car_join', isNotLoggedIn, async (req, res, next) => {
  const { data } = req.body;
  const jsonData = JSON.parse(data);
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  // const CA = moment().format('YYYY-MM-DD hh:mm:ss');
  
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
          return res.send({ status: 'success', type: 'car' });
        }
        else {
          return res.send({ status: 'exist', type: 'car' });
        }
      }
      else {
        return res.send({ status: 'type', type: 'car' });
      }
    }
    else {
      return res.send({ status: 'length', type: 'car' });
    }
  } catch (err) {
    console.error(err);
    return next(err);
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
          return res.send({ status: 'excelType', type: 'car' });
        }
      }
      else {
        return res.send({ status: 'excelLength', type: 'car' });
      }
    }
    // 엑셀 데이터(차주전화번호) 배열에 담기
    for(var j = 1; j < excelArr.length; j+=2) {
      excelCPN[b] = excelArr[j];
      b += 1;
    }
    a = 0;
    b = 0;
    
    // 엑셀 데이터 DB에 upsert방식으로 넣기
    for(var h = 0; h < excelCN.length; h++) {
      await Car.update({ "CID" : CID, "CN" : excelCN[h] }, { "CID" : CID, "CN" : excelCN[h], "CPN" : excelCPN[h], "CA" : current }, { upsert : true });
    }
    
    await Company.where({"CNU" : CNU})
      .update({ "CUA" : CUA }).setOptions({runValidators : true})
      .exec();
    
    return res.send({ status: 'success', type: 'car' });
    
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
      console.log("패쓰"+file.path);
      const extname = path.extname(file.path);
      console.log("확장자명"+extname);
      const fileName = path.basename(file.path);
      console.log("파파파"+fileName);
      
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
          console.log("엑셀데이터"+excelData);
          
          return res.send({ status: 'send', excelData: excelData });
        }
        else {
          return res.send({ status: 'overSize' });
        }
      }
      else if (extname == "") {
        return res.send({ status: 'sendNull' });
      }
      else {
        return res.send({ status: 'sendFail' });
      }
    });
    
    form.on('close', () => {});
 
    form.parse(req);
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/car_list_edit1', isNotLoggedIn, async(req, res, next) => {
  const { car_id } = req.body;
  
  var ObjectId = Mongoose.Types.ObjectId;
  const carone = await Car.find({ _id : ObjectId(car_id) });
  res.send({ status : "success", carone : carone });
});

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
            
            const car = await Car.where({"_id" : car_id})
                        .updateOne({ "CID" : CID,
                                  "CN" : CN,
                                  "CPN" : CPN,
                        }).setOptions({runValidators : true})
                        .exec();
            const company = await Company.where({"_id" : CID})
                        .updateOne({ "CUA" : CUA }).setOptions({runValidators : true})
                        .exec();
            return res.send({ status : "success" });
          }
          else {
            return res.send({ status : "numErr" });
          }
        }
        else {
          return res.send({ status: 'exist' });
        }
      }
      else {
        return res.send({ status: 'type' });
      }
    }
    else {
      return res.send({ status: 'length' });
    }
  }catch(e) {
    console.log(e)
    res.send({ status : "failed" });
  }
});

//차량 한개 삭제
router.post('/ajax/car_deleteone', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select"];
  console.log(select);
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
    res.send({ result : true });
  } catch (err) {
    res.send({ result : false });
    console.error(err);
    next(err);
  }
});

//차량 선택삭제
router.post('/ajax/car_delete', isNotLoggedIn ,async (req, res, next) => {
    var select = req.body["select[]"];
    console.log(JSON.stringify(req.body));
    console.log(select);
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    const CUA = moment().format('YYYY-MM-DD hh:mm:ss');
    try {
        if(!select) {
          res.send({ result : false });
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
        res.send({ result : true });
        }
    } catch (err) {
    res.send({ result : true });
    console.error(err);
    next(err);
  }
});

module.exports = router;