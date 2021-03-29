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
                  // if(!carone && !carone2) {
                  //   resData[sheetnames[0]][j].CID = CID;
                    
                  //   add_excel1[j] = resData.Sheet1[j].CID;
                  //   add_excel2[j] = resData.Sheet1[j].차종;
                  //   add_excel3[j] = resData.Sheet1[j].차량번호;
                  //   add_excel4[j] = resData.Sheet1[j].차대번호;
                  // }
                  // else {
                  //   resData[sheetnames[0]][j].CID = CID;
                    
                  //   re_excel1[j] = resData.Sheet1[j].CID;
                  //   re_excel2[j] = resData.Sheet1[j].차종;
                  //   re_excel3[j] = resData.Sheet1[j].차량번호;
                  //   re_excel4[j] = resData.Sheet1[j].차대번호;
                  // }
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
             
            // if (carone || carone2) {
            //   return res.redirect('/car_join?excelCN=true');
            // }    // 엑셀 파일이 잘 되어있는지 확인
            // if (7 > resData.Sheet1[j].차량번호.length || 8 < resData.Sheet1[j].차량번호.length) {
            //     return res.redirect('/car_join?length=true');
            //   }
            // if (check.test(resData.Sheet1[j].차량번호) == false) 
            //   {
            //   return res.redirect('/car_join?type=true');
            //   }
            // if (!(resData.Sheet1[j].차종 == 1 || resData.Sheet1[j].차종 == 2 || resData.Sheet1[j].차종 == 3 || resData.Sheet1[j].차종 == 4 || resData.Sheet1[j].차종 == 5 || resData.Sheet1[j].차종 == 6 )) {
                
            //     return res.redirect('/car_join?CCtype=true');
            //   }
            // else {
            //   resData[sheetnames[0]][j].CID = CID;
            //   Car.insertMany({
            //   "CID": resData.Sheet1[j].CID,
            //   "CC" : resData.Sheet1[j].차종,
            //   "CN": resData.Sheet1[j].차량번호,
            //   "SN": resData.Sheet1[j].차대번호,
            //   });
            // }       
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
        await Car.where({"CN" : exCN})
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
          var re_excel = [CID, CC, CN, SN];
          // return res.redirect('/car_inspect?exist=true');
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
          var re2_excel = [CID, CC, CN, SN];
        }
      }
      else {
        var re3_excel = [[CID], [CC], [CN], [SN]];
        console.log("알이쓰리"+re3_excel);
      }
      
      req.session.re_car_excel = await null;
      req.session.re2_car_excel = await null;
      req.session.re3_car_excel = await null;
      console.log("널쎄션"+req.session.re3_car_excel);
      req.session.re_car_excel = await re_excel;
      req.session.re2_car_excel = await re2_excel;
      req.session.re3_car_excel = await re3_excel;
      console.log("담은쎄션"+req.session.re3_car_excel);
      
      return res.redirect('/car_join?inspect=true');
      // else {
      //   if (CN === exCN && SN === exSN) {
      //     await Car.where({"CN" : exCN})
      //       .updateMany({
      //         "CID" : CID,
      //         "CC" : CC,
      //         "CN" : CN,
      //         "SN" : SN,
      //       }).setOptions({runValidators : true})
      //         .exec();
      //   }
      //   else if (CN === exCN && SN != exSN) {
      //     if(!exCar2) {
      //       await Car.where({"CN" : exCN})
      //         .updateMany({
      //           "CID" : CID,
      //           "CC" : CC,
      //           "CN" : CN,
      //           "SN" : SN,
      //         }).setOptions({runValidators : true})
      //           .exec();
      //     }
      //     else {
      //       return res.redirect('/car_inspect?exist=true');
      //     }
      //   }
      //   else if (CN != exCN && SN === exSN) {
      //     if(!exCar) {
      //       await Car.where({"CN" : exCN})
      //         .updateMany({
      //           "CID" : CID,
      //           "CC" : CC,
      //           "CN" : CN,
      //           "SN" : SN,
      //         }).setOptions({runValidators : true})
      //           .exec();
      //     }
      //     else {
      //       return res.redirect('/car_inspect?exist=true');
      //     }
      //   }
      //   else {
      //     return res.redirect('/car_inspect?exist=true');
      //   }
      // }
      
    }
    else {
      
      for (var i = 0; i < CN.length; i ++) {
        //// 여기서부터@@@@@@@@@@@@@@@@@@@
        await Car.where({"CN" : CN[i]})
          .updateMany({
            "CID" : CID,
            "CC" : parseInt(CC[i]),
            "CN" : CN[i].toString(),
            "SN" : SN[i].toString(),
          }).setOptions({runValidators : true})
            .exec();
            
      }
      
    }
    req.session.re_car_excel = null;
    return res.redirect('/car_inspect?overwrite=true');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

  //선택
router.post('/device_overwrite_check', isNotLoggedIn, async(req, res, next) => {
  const { ck, CC, CN, SN } = req.body;
  const CID = req.decoded.CID;
  
  try {
    if (typeof(ck) == 'string') {
      await Car.where({"CN" : CN})
        .updateMany({
          "CID" : CID,
          "CC" : CC,
          "CN" : CN,
          "SN" : SN,
        }).setOptions({runValidators : true})
          .exec();
    }
    else {
      for (var i = 0; i < ck.length; i ++) {
        await Car.where({"CN" : ck[i]})
          .updateMany({
            "CID" : CID,
            "CC" : parseInt(CC[i]),
            "CN" : CN[i].toString(),
            "SN" : SN[i].toString(),
          }).setOptions({runValidators : true})
            .exec();
      }
    }
    req.session.re_car_excel = null;
    return res.redirect('/car_inspect?overwrite=true');
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
