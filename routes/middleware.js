const jwt = require('jsonwebtoken');
const secretObj = require("../config/jwt");
const Company = require('../schemas/company');
const Worker = require('../schemas/worker');

exports.isLoggedIn = (req, res, next) => {
  try{
    req.decoded = jwt.verify(req.cookies.token, secretObj.secret);
    res.redirect('/main');
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
        res.redirect('/') ;//Token 만료시 다시 로그인 페이지로 넘어가게 설정
  }
  
};

exports.DataSet = async(req,res,next)=>{
  try{
     const CID = await req.decoded.CID;
      req.decoded.company  = await Company.findOne({"_id" : CID});
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

