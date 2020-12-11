const express = require('express');
//schema
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
//Router or MiddleWare
const router = express.Router();
const {isLoggedIn,isNotLoggedIn,DataSet,emailcontrol} = require('./middleware');


//홈페이지 연결 및 추가 방법 + cookie 연결 사용방법 : company.CNA or company.CNU
const Route_page= function(page,req,res){
    let pages = "/"+page;
    router.get(pages,isNotLoggedIn,(req,res)=>{
       res.render(page,{company : req.decoded}); 
    });
}
// 로그인
router.get('/login',isLoggedIn,(req,res)=>{
    res.render('login',
    {title:'Login Website - MK Corp'});
});
//회원 가입
router.get('/register',isLoggedIn,emailcontrol,(req,res)=>{
  
     console.log("토큰은 이거입니다22 " + req.decoded2.authNum2);
     const authNum2 = parseInt(req.decoded2.authNum2);
     console.log(authNum2);
  
  if (authNum2){
    console.log("성공 ");
    res.render('register',
    {title:'Register our Website - MK Corp',
    email : req.decoded2}
    );
    console.log(req.decoded2);
  }
  else {
    console.log("실패");
    res.render('register',
    {title:'Register our Website - MK Corp'}
    );
  }
});
//ERROR Page
router.get('/error',(req,res)=>{
    res.render('error',
    {title:'ERROR 404'});
});
router.get('/',(req,res,next)=>{
    res.redirect('index');
});

// 공통페이지 작성 방법
Route_page('index');
Route_page('car_join');
Route_page('device_join');


//장비 수정 페이지
router.get('/device_edit/:MAC',isNotLoggedIn ,async (req, res, next) => {
  try {
    const deviceone = await Device.findOne({MAC : req.params.MAC});
    res.render('device_edit', {company : req.decoded ,
                                deviceone});
  } catch (err) {
    console.error(err);
    next(err);
  }
});
//Device List Data Setting for Devices
router.get('/device_list', isNotLoggedIn,async (req, res, next) => {
  try {
    const devices = await Device.find({CID : req.decoded.CID,});
    res.render('device_list', {company : req.decoded 
                                ,devices});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/////////////////////////////////////////////

//차량 수정 페이지
router.get('/car_edit/:CN',isNotLoggedIn,async (req, res, next) => {
  try {
    const carone = await Car.findOne({CN : req.params.CN});
    res.render('car_edit', {company : req.decoded ,
                            carone});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//Car List Data Setting for Cars
router.get('/car_list',isNotLoggedIn, async (req, res, next) => {
  try {
    const cars = await Car.find({CID : req.decoded.CID,});
      console.log(cars);
    res.render('car_list', {company : req.decoded 
                            ,cars});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

////////////////////////////////////////////

//Profile DataSetting for Profile(company)
router.get('/profile',isNotLoggedIn,DataSet ,async (req, res, next) => {
  try {
    res.render('profile', {company : req.decoded });
  } catch (err) {
    console.error(err);
  }
});



////////////////////////////////////
//worker

//Worker list for Workers
router.get('/worker_list',isNotLoggedIn, async (req, res, next) => {
  try {
    const workers = await Worker.find({CID : req.decoded.CID,});
    res.render('worker_list', {company : req.decoded
                                ,workers});
  } catch (err) {
    console.error(err);
    next(err);
  }
});






module.exports = router;

