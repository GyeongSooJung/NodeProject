const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
//const cookies = require('cookie-Parser');
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const mongoose = require('mongoose');

//schemas
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');

//middleware
const {isLoggedIn, isNotLoggedIn, DataSet} = require('./middleware');


const TokenMake = async function(req,res,next){
  // default : HMAC SHA256
  const {CNU, PW} = req.body;
  try{
  const company = await Company.findOne({"CNU":parseInt(CNU)})// CNU에 맞는 데이터 찾아오기
    //bcrypt 암호화된 PW와 입력 PW 비교
    if(bcrypt.compareSync( PW,company.PW) ){
       const token = jwt.sign({CNU : company.CNU, CNA : company.CNA, CID : company._id, AH : company.AH },// 토큰의 내용(payload)
        secretObj.secret ,   // 비밀 키
      {expiresIn: '1440m'});  // 유효 시간은 1440분 하루 설정
      res.cookie("token", token); // 쿠키에 token 등록  
      res.redirect('/main');
    }
    else{
      res.redirect('/login?fail=true');
    }
  }catch(err){
     res.redirect('/login?fail=true');
  }
}





//login 진행 할경우 토큰 만들어서 cookie에 넣음
router.post("/login", TokenMake);

//logout시 Browser Cookie 삭제
router.get("/logout", async function(req,res,next){
  try{
  await res.cookie("token", req.cookies,{expiresIn:0});
  res.redirect("/");

  }catch(err){
    console.error(err);
  }
});

//withdrawal시 Browser Cookie 삭제 하고 소독이력을 제외한 company에 관련된 내용들 삭제
router.get("/withdrawal",isNotLoggedIn, async function(req,res,next){
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  
  try{
    await Company.remove({"_id": CID});
    await Car.remove({"CID" : CID});
    await Device.remove({"CID" : CID});
    await Worker.remove({"CID" : CID});
    

  await res.cookie("token", req.cookies,{expiresIn:0});
  
  res.redirect("/");

  }catch(err){
    console.error(err);
  }
});

module.exports = router;