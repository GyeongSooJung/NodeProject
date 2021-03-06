const jwt = require('jsonwebtoken');
const secretObj = require("../config/jwt");
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');

// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_accessKeyId,
//   secretAccessKey: process.env.AWS_secretAccessKey,
//   region: 'ap-southeast-1'
// });
// let upload = multer({
//   storage: multerS3({
//     s3: s3,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     bucket: 'goods-img',
//     acl: 'public-read',
//     key: (req, file, cb) => {
//       console.log("$$$"+JSON.stringify(file));
//       cb(null, file.originalname)
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

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
    req.decoded.company  = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{"_id" : CID},{});
    next();
  } catch(err){
    console.error(err);
  }
};

exports.agentDevide = async(req, res, next) => {
  try {
    var searchCNU = "";
    
    // 본사,지점 구분하여 mongoDB 검색용 CNU 생성
    if(req.decoded.ANU == "000") { // 본사
      searchCNU += req.decoded.CNU.substring(0,10);
    }
    else { // 지점
      searchCNU += req.decoded.CNU;
    }
    
    // 사용하기 위해 req에 담아줌
    req.searchCNU = searchCNU;
    
    next();
  } catch(err) {
    console.error(err);
  }
};

// exports.upload = multer(upload);