//Express
const express = require('express');
const router = express.Router();
//Module
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
//Schemas
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');
//Middleware
const { isNotLoggedIn } = require('./middleware');

// -- Start Code -- //

//본사,지점 확인
router.post('/agent', async (req, res, next) => {
  const CNU = req.body.CNU;
  
  try {
    const agents = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ "CNU" : CNU+"000" },{});
    if(agents) {
      var nameList = [];
      var codeList = [];
      
      for(var i = 0; i < agents.AL.length; i++) {
        nameList[i] = Object.keys(agents.AL[i]).toString();
        codeList[i] = Object.values(agents.AL[i]).toString();
      }
      
      if(agents.AL.length != 0) {
        return res.send({ result : 'yesAgents', agents : agents, nameList : nameList, codeList : codeList });
      }
      else {
        return res.send({ result : 'noAgents' });
      }
    }
    else {
      return res.send({ result : 'noCompany' });
    }
    
  } catch(err) {
    res.send({ result : 'fail' });
    console.error(err);
    next(err);
  }
});

//login 진행 할경우 토큰 만들어서 cookie에 넣음
router.post("/login", async(req, res, next) => {
  const {CNU, ANU, ANA, PW} = req.body;
  try {
    const company = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ "CNU" : CNU+ANU, "ANA" : ANA, "ANU" : ANU },{});// CNU에 맞는 데이터 찾아오기
    if(company) {
      //bcrypt 암호화된 PW와 입력 PW 비교
      if(bcrypt.compareSync(PW, company.PW) ){
        const token = jwt.sign({ CNU : company.CNU, ANU : company.ANU, ANA : company.ANA, CNA : company.CNA, CID : company._id, AH : company.AH },// 토큰의 내용(payload)
          secretObj.secret,   // 비밀 키
          { expiresIn: '1440m' });  // 유효 시간은 1440분 하루 설정
        res.cookie("token", token); // 쿠키에 token 등록
        
        return res.send({ result : 'success' });
      }
      else{
        return res.send({ result : "fail" });
      }
    }
    else {
      return res.send({ result : "fail" });
    }
  } catch(err){
    res.send({ result : "fail" });
    console.error(err);
    next(err);
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
    await modelQuery(QUERY.Remove,COLLECTION_NAME.Company,{"_id": CID},{});
    await modelQuery(QUERY.Remove,COLLECTION_NAME.Car,{"CNU": CNU},{});
    await modelQuery(QUERY.Remove,COLLECTION_NAME.Device,{"CNU": CNU},{});
    await modelQuery(QUERY.Remove,COLLECTION_NAME.Worker,{"CNU": CNU},{});

    await res.cookie("token", req.cookies, { expiresIn : 0 });
    
    res.redirect("/");

  } catch(err){
    console.error(err);
    next(err);
  }
});

module.exports = router;