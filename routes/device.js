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
        const extname = path.extname(file.path);
        console.log("확장자명"+extname);
        if(extname == '.xlsx') {
          
          // 중복이 안된 값들을 넣는 배열
          const add_excel1 = [];
          const add_excel2 = [];
          const add_excel3 = [];
          // 중복된 값들을 넣는 배열
          const re_excel1 = [];
          const re_excel2 = [];
          const re_excel3 = [];
          
          // 엑셀 파일 처리
          const workbook = xlsx.readFile(file.path);
          const sheetnames = Object.keys(workbook.Sheets);
          resData[sheetnames[0]] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[0]]);
          
          var a = 0;
          var b = 0;
          
          for(var j = 0; j < resData.Sheet1.length;  j++) {
            const exDevice = await Device.findOne({ "MAC" : resData.Sheet1[j].맥주소 });
            const check = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
            
            if (check.test(resData.Sheet1[j].맥주소) == true) {
              
              if(!exDevice) {
                resData[sheetnames[0]][j].CID = CID;
                
                add_excel1[a] = resData.Sheet1[j].CID;
                add_excel2[a] = resData.Sheet1[j].맥주소;
                add_excel3[a] = resData.Sheet1[j].별칭;
                a += 1;
              }
              else {
                resData[sheetnames[0]][j].CID = CID;
                
                re_excel1[b] = resData.Sheet1[j].CID;
                re_excel2[b] = resData.Sheet1[j].맥주소;
                re_excel3[b] = resData.Sheet1[j].별칭;
                b += 1;
              }
            }
            else {
              return res.redirect('/device_join?excelType=true');
            }
            
          }
          a = 0;
          b = 0;
          
          for (var i = 0; i < add_excel1.length; i ++) {
            Device.insertMany({
              "CID": add_excel1[i],
              "MD" : "엑셀등록",
              "VER" : NaN,
              "MAC": add_excel2[i],
              "NN" : add_excel3[i]
            });
          }
          
          var re_excel = [];
          
          for (var h = 0; h < re_excel1.length; h ++) {
            re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h]];
          }
          req.session.re_device_excel = await re_excel;
          
          return res.redirect('/device_join?inspect=true');
        }
        else if (extname == "") {
          return res.redirect('/device_join?nofile=true');
        }
        else {
          return res.redirect('/device_join?excel=true');
        }
      });

      form.on('close', () => {});
  
      form.parse(req);

    } catch(err) {
      console.error(err);
      next(err);
    }
});

//장비 중복 목록 덮어쓰기

  //전체
router.post('/device_overwrite_all', isNotLoggedIn, async(req, res, next) => {
  const { MAC, NN, exMAC } = req.body;
  const CID = req.decoded.CID;
  
  try {
    if (typeof(MAC) == 'string') {
      
      const exDevice = await Device.findOne({ "MAC" : MAC });
      
      if (!exDevice) {
        await Device.where({"MAC" : exMAC})
          .update({
            "CID" : CID,
            "MD" : "엑셀등록",
            "VER" : NaN,
            "MAC" : MAC,
            "NN" : NN,
          }).setOptions({runValidators : true})
            .exec();
      }
      else {
        if (MAC === exMAC) {
          await Device.where({"MAC" : exMAC})
            .update({
              "CID" : CID,
              "MD" : "엑셀등록",
              "VER" : NaN,
              "MAC" : MAC,
              "NN" : NN,
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re_excel = [CID, MAC, NN, exMAC];
        }
      }
      
      req.session.re_device_excel = await null;
      req.session.re_device_excel = await re_excel;
      
      return res.redirect('/device_inspect');
      
    }
    else {
      
      var re_excel1 = [];
      var re_excel2 = [];
      var re_excel3 = [];
      var re_excel4 = [];
      
      var a = 0;
      
      for (var i = 0; i < MAC.length; i ++) {
        
        const exDevice = await Device.findOne({ "MAC" : MAC[i] });
        
        if (!exDevice) {
          await Device.where({"MAC" : exMAC[i]})
            .update({
              "CID" : CID,
              "MD" : "엑셀등록",
              "VER" : NaN,
              "MAC" : MAC[i].toString(),
              "NN" : NN[i].toString(),
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          if (MAC[i] === exMAC[i]) {
            await Device.where({"MAC" : exMAC[i]})
              .update({
                "CID" : CID,
                "MD" : "엑셀등록",
                "VER" : NaN,
                "MAC" : MAC[i].toString(),
                "NN" : NN[i].toString(),
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re_excel1[a] = CID;
            re_excel2[a] = MAC[i];
            re_excel3[a] = NN[i];
            re_excel4[a] = exMAC[i];
            a += 1;
          }
        }
        
      }
      
      a = 0;
      
      req.session.re_device_excel = await null;
      
      var re_excel = [];
      
      for (var h = 0; h < re_excel1.length; h ++) {
        re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h], re_excel4[h]];
      }
      
      req.session.re_device_excel = await re_excel;
      
      return res.redirect('/device_inspect');
      
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

  //선택
router.post('/device_overwrite_check', isNotLoggedIn, async(req, res, next) => {
  const { ck, MAC, NN, exMAC } = req.body;
  const CID = req.decoded.CID;
  
  try {
    if (typeof(ck) == 'string') {

      const exDevice = await Device.findOne({ "MAC" : MAC });
      
      if (!exDevice) {
        await Device.where({"MAC" : exMAC})
          .update({
            "CID" : CID,
            "MD" : "엑셀등록",
            "VER" : NaN,
            "MAC" : MAC.toString(),
            "NN" : NN.toString(),
          }).setOptions({runValidators : true})
            .exec();
      }
      else {
        if (MAC === exMAC) {
          await Device.where({"MAC" : exMAC})
            .update({
              "CID" : CID,
              "MD" : "엑셀등록",
              "VER" : NaN,
              "MAC" : MAC.toString(),
              "NN" : NN.toString(),
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          var re_excel = [CID, MAC, NN, exMAC];
        }
      }
      
      req.session.re_device_excel = await null;
      req.session.re_device_excel = await re_excel;
      
      return res.redirect('/device_inspect');
      
    }
    else {
      
      var re_excel1 = [];
      var re_excel2 = [];
      var re_excel3 = [];
      var re_excel4 = [];
      
      var a = 0;
      
      for (var i = 0; i < ck.length; i ++) {
        
        const exDevice = await Device.findOne({ "MAC" : MAC[i] });
        
        if (!exDevice) {
          await Device.where({"MAC" : exMAC[i]})
            .update({
              "CID" : CID,
              "MD" : "엑셀등록",
              "VER" : NaN,
              "MAC" : MAC[i].toString(),
              "NN" : NN[i].toString(),
            }).setOptions({runValidators : true})
              .exec();
        }
        else {
          if (MAC[i] === exMAC[i]) {
            await Device.where({"MAC" : exMAC[i]})
              .update({
                "CID" : CID,
                "MD" : "엑셀등록",
                "VER" : NaN,
                "MAC" : MAC[i].toString(),
                "NN" : NN[i].toString(),
              }).setOptions({runValidators : true})
                .exec();
          }
          else {
            re_excel1[a] = CID;
            re_excel2[a] = MAC[i];
            re_excel3[a] = NN[i];
            re_excel4[a] = exMAC[i];
            a += 1;
          }
        }
        
      }
      
      a = 0;
      
      req.session.re_device_excel = await null;
      
      var re_excel = [];
      
      for (var h = 0; h < re_excel1.length; h ++) {
        re_excel[h] = [re_excel1[h], re_excel2[h], re_excel3[h], re_excel4[h]];
      }
      
      req.session.re_device_excel = await re_excel;
      
      return res.redirect('/device_inspect');
      
    }
  } catch (err) {
    console.error(err);
    next(err);
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