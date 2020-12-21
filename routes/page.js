const express = require('express');
//schema
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
const History = require('../schemas/history');
const moment = require('moment');
//Router or MiddleWare
const router = express.Router();
const {isLoggedIn, isNotLoggedIn, DataSet, emailcontrol} = require('./middleware');



//홈페이지 연결 및 추가 방법 + cookie 연결 사용방법 : company.CNA or company.CNU
const Route_page= function(page,req,res){
    let pages = "/"+page;
    router.get(pages,isNotLoggedIn, async (req,res)=>{
      const CID = req.decoded.CID;
      const nclist = await Worker.find({"CID" : CID, "NC" : false});
       res.render(page,{company : req.decoded, nclist});
    });
}
// 로그인
router.get('/login',isLoggedIn,(req,res)=>{
    res.render('login',
    {title:'Login Website - OASIS'});
});
router.get('/index',isLoggedIn,(req,res)=>{
  res.render('index')
})

//회원 가입
router.get('/register',isLoggedIn,emailcontrol,(req,res)=>{
  
     console.log("토큰은 이거입니다22 " + req.decoded2.authNum2);
     const authNum2 = parseInt(req.decoded2.authNum2);
     console.log(authNum2);
  
  if (authNum2){
    console.log("성공 ");
    res.render('register',
    {email : req.decoded2}
    );
    console.log(req.decoded2);
  }
  else {
    console.log("실패");
    res.render('register');
  }
  
  res.render('register');
});


//ERROR Page
router.get('/error',(req,res)=>{
    res.render('error',
    {title:'ERROR 404'});
});

router.get('/',(req,res,next)=>{
    res.redirect('main');
});

router.get('/find', (req,res,next) => {
  res.render('find');
});

//메인 페이지
router.get('/main',isNotLoggedIn , async(req,res,next)=>{
  
    const CID = req.decoded.CID;
    
    const nclist = await Worker.find({"CID" : CID, "NC" : false});
    const devices = await Device.find({"CID" : req.decoded.CID});
    const cars = await Car.find({"CID" : req.decoded.CID});
    const workers = await Worker.find({"CID" : req.decoded.CID});
    const historys = await History.find({"CID" : req.decoded.CID});
    const history_array = await History.findOne({"CID" : req.decoded.CID}).sort({'_id':-1}).limit(1);
    console.log(history_array);
            console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz" + nclist);
    if (history_array){
      const recent_history = history_array.PD;
      console.log("최근 히스토리는 :" +recent_history);
      res.render('main', {company : req.decoded, nclist, devices, cars, workers, historys, recent_history, history_array, moment});
    }
    else{
      res.render('main', {company : req.decoded, nclist, devices, cars, workers, historys,  history_array, moment});
    }
});


// 공통페이지 작성 방법
Route_page('car_join');
Route_page('device_join');

////////////////////////////////////////////////////////////////////////////////
//사업자 목록 페이지
router.get('/company_list', isNotLoggedIn, async (req, res, next) => {
  const CID = req.decoded.CID;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});
  
  const companys = await Company.find({"AH" : false});
  res.render('company_list', {companys, nclist, moment, company : req.decoded});
})

////////////////////////////////////////////////////////////////////////////////
//장비 수정 페이지
router.get('/device_edit/:MAC',isNotLoggedIn ,async (req, res, next) => {
  const CID = req.decoded.CID;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});

  try {
    const deviceone = await Device.findOne({MAC : req.params.MAC});
    res.render('device_edit', {company : req.decoded, nclist, deviceone});
  } catch (err) {
    console.error(err);
    next(err);
  }
});
//Device List Data Setting for Devices
router.get('/device_list', isNotLoggedIn,async (req, res, next) => {
  const CID = req.decoded.CID;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});
  
  try {
    const devices = await Device.find({CID : req.decoded.CID,});
    res.render('device_list', {company : req.decoded, nclist, devices});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

////////////////////////////////////////////////////////////////////////////////

//차량 수정 페이지
router.get('/car_edit/:CN',isNotLoggedIn,async (req, res, next) => {
  const CID = req.decoded.CID;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});
  
  try {
    const carone = await Car.findOne({CN : req.params.CN});
    res.render('car_edit', {company : req.decoded, nclist, carone});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//Car List Data Setting for Cars
router.get('/car_list',isNotLoggedIn, async (req, res, next) => {
  const CID = req.decoded.CID;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});
  
  try {
    const cars = await Car.find({CID : req.decoded.CID,});
      console.log(cars);
    res.render('car_list', {company : req.decoded, nclist, cars});
  } catch (err) {
    console.error(err);
    next(err);
  }
});

////////////////////////////////////////////////////////////////////////////////
//Profile DataSetting for Profile(company)
router.get('/profile',isNotLoggedIn,DataSet ,async (req, res, next) => {
  const CID = req.decoded.CID;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});
  
  try {
    res.render('profile', {company : req.decoded, nclist});
  } catch (err) {
    console.error(err);
  }
});



////////////////////////////////////////////////////////////////////////////////
//worker

//Worker list for Workers
router.get('/worker_list',isNotLoggedIn, async (req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});
  const workers = await Worker.find({CID : req.decoded.CID,});
  
  let workerone;
  let workertwo;
  
  workertwo = await Worker.where({"NC" : false }).updateMany({ "NC" : true }).setOptions({runValidators : true}).exec();
  
  try {
    const workeracem = req.query.workeracem;
    
    if(workeracem){
      const workerarray = workeracem.split(',');
      console.log(workerarray[0]);
      console.log(workerarray[1]);
      
      if(workerarray){
        if(workerarray[0] =="true") {
          workerone = await Worker.where({"EM" : workerarray[1]}).update({ "AC" : false }).setOptions({runValidators : true}).exec();
        }else{
          workerone = await Worker.where({"EM" : workerarray[1]}).update({ "AC" : true }).setOptions({runValidators : true}).exec();
        }
      }
    }
    res.render('worker_list', {nclist, company : req.decoded, workers});
  } catch (err) {
    console.error(err);
    next(err);
  }
  
});

////////////////////////////////////////////////////////////////////////////////
// History
router.get('/history_list', isNotLoggedIn, async (req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});

  try {
    const cars = await Car.find({"CID" : CID});
    const devices = await Device.find({"CID" : CID});
    const CN = req.query.CN;
    const MD = req.query.MD;
    
    if(!CN & !MD) {
      const historys = await History.find({"CID" : CID});
      res.render('history_list', {company : req.decoded, nclist, cars, devices, historys, moment});
    }
    
    else if(CN) {
      const carone = await Car.findOne({"CN" : CN});
      const historys = await History.find({"VID" : carone._id});
      res.render('history_list', {company : req.decoded, nclist, cars, devices, historys, moment});
    }
    
    else if(MD) {
      const deviceone = await Device.findOne({"MD" : MD});
      const historys = await History.find({"DID" : deviceone._id});
      res.render('history_list', {company : req.decoded, nclist, cars, devices, historys, moment});
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/history_chart/:_id',isNotLoggedIn ,async (req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const nclist = await Worker.find({"CID" : CID, "NC" : false});
    
    try {
        const historyone = await History.findOne({"_id" : req.params._id});
        const history_array = historyone.PD;
        const companyone = await Company.findOne({"_id" : CID});
        const carone = await Car.findOne({"_id" : historyone.VID});
        const deviceone = await Device.findOne({"_id" : historyone.DID});
        const workerone = await Worker.findOne({"_id" : historyone.WID});
        console.log(deviceone);
        console.log(workerone);
        res.render('history_chart', {company : req.decoded, nclist, historyone, companyone, carone, deviceone, workerone, history_array, moment});
    } catch (err) {
        console.error(err);
        next(err);
    }
})

////////////////////////////////////////////////////////////////////////////////
//Mobile Connect Page
router.get('/mobile_con', async (req, res, next) => {
    try {
        res.render('mobile_con');
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;

