const jwt = require('jsonwebtoken');
const secretObj = require("../config/jwt");
const Company = require('../schemas/company');

exports.isLoggedIn = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.cookies.token, secretObj.secret);
    res.redirect('/main');
  } catch(err) {
    next();//Token 만료시 다시 로그인 페이지로 넘어가게 설정
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.cookies.token, secretObj.secret);
    next();   
  } catch(err) {
    res.redirect('/') ;//Token 만료시 다시 로그인 페이지로 넘어가게 설정
  }
};

exports.DataSet = async(req,res,next)=>{
  try {
    const CID = await req.decoded.CID;
    req.decoded.company  = await Company.findOne({"_id" : CID});
    next();
  } catch(err){
    console.error(err);
  }
};

exports.agentDevide = async(req, res, next) => {
  try {
    var searchCNU = "";
    var searchCID = [];
    
    // 본사,지점 구분하여 mongoDB 검색용 CNU 생성
    if(req.decoded.ANU == "000") { // 본사
      searchCNU = req.decoded.CNU.substring(0,10);
    }
    else { // 지점
      searchCNU = req.decoded.CNU;
    }
    // 생성한 CNU를 통해 company 찾기
    const companys = await Company.find({ "CNU" : {$regex:searchCNU} });
    
    // 찾은 company의 id를 mongoDB 검색용 CID 배열 생성 -> 배열로 생성해야 자동으로 in이 적용됨(or같은 기능)
    for(var i = 0; i < companys.length; i++) {
      searchCID[i] = companys[i]._id.toString();
    }
    
    // 사용하기 위해 req에 담아줌
    req.searchCNU = searchCNU;
    req.searchCID = searchCID;
    
    next();
  } catch(err) {
    console.error(err);
  }
};