//Express
const express = require('express');
const router = express.Router();
//Module
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
//Schemas
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
//Middleware
const { isNotLoggedIn } = require('./middleware');

// -- Start Code -- //

//login 진행 할경우 토큰 만들어서 cookie에 넣음
router.post("/login", async(req, res, next) => {
  const {CNU, PW} = req.body;
  console.log("씨엔유"+CNU);
  console.log("피"+PW);
  try {
    const company = await Company.findOne({ "CNU" : CNU }); // CNU에 맞는 데이터 찾아오기
    console.log(company);
    //bcrypt 암호화된 PW와 입력 PW 비교
    if(bcrypt.compareSync( PW,company.PW) ){
      const token = jwt.sign({ CNU : company.CNU, CNA : company.CNA, CID : company._id, AH : company.AH },// 토큰의 내용(payload)
        secretObj.secret,   // 비밀 키
        { expiresIn: '1440m' });  // 유효 시간은 1440분 하루 설정
      res.cookie("token", token); // 쿠키에 token 등록
      
      return res.send({ result : 'success' });
    }
    else{
      return res.send({ result : "fail" });
    }
  } catch(err){
    console.error(err);
    next(err);
    return res.send({ result : "fail" });
  }
});

//logout시 Browser Cookie 삭제
router.get("/logout", async function( req, res, next){
  try {
    await res.cookie("token", req.cookies,{expiresIn:0});
    res.redirect("/");
  } catch(err){
    console.error(err);
    next(err);
  }
});

//withdrawal시 Browser Cookie 삭제 하고 소독이력을 제외한 company에 관련된 내용들 삭제
router.get("/withdrawal", isNotLoggedIn, async function(req, res, next){
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  
  try {
    await Company.remove({"_id": CID});
    await Car.remove({"CID" : CID});
    await Device.remove({"CID" : CID});
    await Worker.remove({"CID" : CID});

    await res.cookie("token", req.cookies, { expiresIn : 0 });
    
    res.redirect("/");

  } catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;