const jwt = require('jsonwebtoken');
const secretObj = require("../config/jwt");
const secretObj2 = require("../config/jwt");
const Company = require('../schemas/company');

exports.isLoggedIn = (req, res, next) => {
  try{
    req.decoded = jwt.verify(req.cookies.token, secretObj.secret);
    res.render('main');
  } 
  catch(err) {
    next();//Token 만료시 다시 로그인 페이지로 넘어가게 설정
  }
};

exports.isNotLoggedIn = (req, res, next) => {
     try{
      req.decoded = jwt.verify(req.cookies.token, secretObj.secret);
      next();   
  } 
    catch(err) {
        res.render('login') ;//Token 만료시 다시 로그인 페이지로 넘어가게 설정
  }
  
};

exports.emailcontrol = (req, res, next) => {
     try{
      req.decoded.email = req.cookies.email
      req.decoded.authNum = req.cookies.authNum
      next();   
      
  } 
    catch(err) {
        console.log("토큰은 이거입니다 " +req.decoded);
        res.render('register',{ErrMsg2 : "이메일 주소를 인증받으세요"}) ;//이메일에 대한 정보가 없을 때 에러메세지 출력
  }
  
};

exports.DataSet = async(req,res,next)=>{
  try{
     const CID = await req.decoded.CID;
      req.decoded  = await Company.findOne({"_id" : CID});
      next();
    
  } catch(err){
      console.error(err);
  }
};

//History Back 막기.
/*exports.TurnBackErr =(req,res,next) => {
    res.header('Cache-Control','private, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma','no-cache');
}
*/

