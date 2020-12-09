const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Company = require('../schemas/company');
//const cookies = require('cookie-Parser');
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const mongoose = require('mongoose');


const TokenMake = function(req,res,next){
  // default : HMAC SHA256
  const {CNU, PW} = req.body;
  Company.findOne({"CNU":parseInt(CNU)}) // CNU에 맞는 데이터 찾아오기
  .then( Company => {
    //bcrypt 암호화된 PW와 입력 PW 비교
    if(bcrypt.compareSync( PW,Company.PW)){
       const token = jwt.sign({CNU : Company.CNU, CNA : Company.CNA, CID : Company._id },// 토큰의 내용(payload)
        secretObj.secret ,   // 비밀 키
      {expiresIn: '1440m'})  // 유효 시간은 1440분 하루 설정
      res.cookie("token", token); // 쿠키에 token 등록  
      res.redirect('/')
    }
    else{
      res.redirect('/login?fail=true');
    }
  })
}





//login 진행 할경우 토큰 만들어서 cookie에 넣음
router.post("/login",TokenMake);

//logout시 Browser Cookie 삭제
router.get("/logout",async function(req,res,next){
  try{
  await res.cookie("token", req.cookies,{expiresIn:0});
  res.redirect("/");

  }catch(err){
    console.error(err);
  }
});
module.exports = router;