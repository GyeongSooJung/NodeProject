const express = require('express');
require('dotenv').config();
//schema
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');
const {encrypt, decrypt} = require('./module');

const moment = require('moment');
const qrcode = require('qrcode');
const session = require('express-session');
const multer = require('multer');
const upload = multer({
  // dest: 'public/assets/upload/notice',
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets/upload/notice');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});
//Router or MiddleWare
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, DataSet, agentDevide } = require('./middleware');
// const { pagination, timeset } = require('./modulebox');
const axios = require('axios');
var request = require('request');
const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;



//메세지 조회 사용
const { msg } = require('solapi'); 

let running = false;
global.running = running;

//반복적으로 사용되는 변수
const todayStart = moment().format('YYYY-MM-DD');
const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');

//----------------------------------------------------------------------------//
//                                  기본라우터                                //
//----------------------------------------------------------------------------//

//기본 페이지 설정
router.get('/', (req, res, next) => {
  res.render('index', {title: "OASIS"});
});

router.get('/en', function(req, res) {
  res.cookie('lang', 'en');
  res.redirect('/main');
});

router.get('/ko', function(req, res) {
  res.cookie('lang', 'ko');
  res.redirect('/main');
});

router.get('/en_index', function(req, res) {
  res.cookie('lang', 'en');
  res.redirect('/');
});

router.get('/ko_index', function(req, res) {
  res.cookie('lang', 'ko');
  res.redirect('/');
});
//----------------------------------------------------------------------------//
//                                  회원정보                                  //
//----------------------------------------------------------------------------//

// 로그인
router.get('/login', isLoggedIn, (req, res) => {
  res.render('login');
});

router.get('/address', (req, res) => {
  const juso = process.env.juso;
  res.render('address_pop', {juso});
});

router.post('/address', (req, res) => {
  const juso = process.env.juso;
  const locals = req.body;
  
  res.render('address_pop', {juso, locals});
});

// 회원가입
router.get('/register', isLoggedIn, async(req, res, next) => {
  res.render('register');
});

//회원정보 수정
router.get('/profile', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  
  try {
    res.render('profile', { company: req.decoded.company, aclist });
  }
  catch (err) {
    console.error(err);
  }
});

//비밀번호 찾기
router.get('/find', (req, res, next) => {
  res.render('findpw');
});

//----------------------------------------------------------------------------//
//                                  설정                                      //
//----------------------------------------------------------------------------//

// 환경?설정
router.get('/setting', isNotLoggedIn, DataSet, agentDevide, async (req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  
  res.render('setting', { company: req.decoded.company, aclist });
});

//----------------------------------------------------------------------------//
//                                  에러                                      //
//----------------------------------------------------------------------------//

//ERROR Page
router.get('/error', (req, res) => {
  res.render('error', { title: 'ERROR 404' });
});

//----------------------------------------------------------------------------//
//                                  메인                                      //
//----------------------------------------------------------------------------//

//메인 페이지
router.get('/main', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {


  const CID = req.decoded.CID;

  const HOME = process.env.IP;

  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const devices = await modelQuery(QUERY.Find,COLLECTION_NAME.Device,{ "CNU": {$regex: req.searchCNU} },{});
  const cars = await modelQuery(QUERY.Find,COLLECTION_NAME.Car,{ "CNU": {$regex: req.searchCNU} },{});
  const workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU} },{});
  const publishs = await modelQuery(QUERY.Find,COLLECTION_NAME.Publish,{},{});
  const historys = await modelQuery(QUERY.Find,COLLECTION_NAME.History,{ "CNU": {$regex: req.searchCNU} },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});
  const noticePop = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{"POP": true},{});
  
  var psum = 0;
  for(var i = 0; i < publishs.length; i++) {
    var pcount = publishs[i].PUN;
    
    psum += pcount;
  }


  var history_count2 = [0,0,0,0,0,0,0];
  const Days = 24 * 60 * 60 * 1000;
  const today = new Date();
  
  const sevenday = new Date();
  
  sevenday.setDate(sevenday.getDate() - 7);
  const history_date = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.History,{match : {"CNU": {$regex: req.searchCNU}, "CA": { $lte: today, $gte: sevenday }}, project : {_id : 0,CA : "$CA"} },{});
  for (var i =  0; i < 7 ; i ++) {
        for(var j = await 0; j < history_date.length; j ++) {
          if((history_date[j].CA <=  (Date.now() - (Days * i))) && (history_date[j].CA >=  (Date.now() - Days * (i + 1)))) {
            history_count2[i] += await 1;
          }
        } 
      }
  const history_count = await history_count2;
  
  const history_array = await (historys.reverse())[0];
  if (history_array) {
    const recent_history = history_array.PD;
    res.render('main', { page_title: "main_dashboard", company: req.decoded.company, aclist, noticethree, noticePop, devices, cars, workers, historys, recent_history, history_array, history_count, HOME, psum });
  }
  else {
    res.render('main', { page_title: "main_dashboard", company: req.decoded.company, aclist, noticethree, noticePop, devices, cars, workers, historys, history_array, history_count, HOME, psum });
  }

});

//----------------------------------------------------------------------------//
//                                  사업자                                    //
//----------------------------------------------------------------------------//

//사업자 목록
router.get('/company_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {

  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});
  
    res.render('company_list', { company: req.decoded.company, aclist, noticethree });
});


//----------------------------------------------------------------------------//
//                                  통계                                      //
//----------------------------------------------------------------------------//

// //제품 통계
// router.get('/device_static', isNotLoggedIn, DataSet, agentDevide, async(req, res, nex) => {
//   const CID = req.decoded.CID;
//   const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": req.searchCID, "AC": false },{});
//   const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});
  
//   const AllCompany = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Company,{},{});
//   const AllHistory = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.History,{},{});
//   const AllCar = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Car,{},{});
//   const AllDevice = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Device,{},{});

//   const company1 = await Company.count({ "CK": "렌터카" });
//   const company2 = await Company.count({ "CK": "카센터" });
//   const company3 = await Company.count({ "CK": "출장정비" });
//   const company4 = await Company.count({ "CK": "출장세차" });
//   const company5 = await Company.count({ "CK": "택시운수업" });
//   const company6 = await Company.count({ "CK": "버스운수업" });
//   const company7 = await Company.count({ "CK": "타이어샵" });
//   const companycount = [company1, company2, company3, company4, company5, company6, company7];

//   res.render('device_static', { company: req.decoded.company, companycount, aclist, noticethree, AllDevice, AllCar, AllHistory, AllCompany });
// })

// //소독 통계
// router.get('/history_static', isNotLoggedIn, DataSet, agentDevide, async(req, res, nex) => {
//   const CID = req.decoded.CID;
//   const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": req.searchCID, "AC": false },{});

//   const AllCompany = await Company.countDocuments({});
//   const AllHistory = await History.countDocuments({});
//   const AllCar = await Car.countDocuments({});
//   const AllDevice = await Device.countDocuments({});
//   const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});
  
//   res.render('history_static', { company: req.decoded.company, aclist, noticethree, AllDevice, AllCar, AllHistory, AllCompany });
// })

//----------------------------------------------------------------------------//
//                                  장비                                      //
//----------------------------------------------------------------------------//

//장비 등록
router.get('/device_join', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  res.render('device_join', { company: req.decoded.company, aclist, noticethree, });
});

//장비 목록
router.get('/device_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const NN = req.query.NN;
  
  // 작업자 신규 등록 시 new 표시
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  // 공지사항 rolling 표시
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  try {
    const devices = await modelQuery(QUERY.Find,COLLECTION_NAME.Device,{ "CNU": {$regex: req.searchCNU} },{})
    const deviceTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Device,{ "CNU": {$regex: req.searchCNU}, "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{})
    const deviceCount = devices.length;

    res.render('device_list', { company: req.decoded.company, aclist, devices, deviceTodayCount, deviceCount, noticethree });
  }
  catch (err) {
    console.error(err);
    next(err);
  }


});

//----------------------------------------------------------------------------//
//                                  자동차                                    //
//----------------------------------------------------------------------------//

//차량 등록
router.get('/car_join', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  res.render('car_join', { company: req.decoded.company, aclist, noticethree });
});

//차량 목록
router.get('/car_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{sort : {CA : -1}, limit : 3})
  
  const cars = await modelQuery(QUERY.Find,COLLECTION_NAME.Car,{ "CNU": {$regex: req.searchCNU} },{});
  const carTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Car,{ "CNU": {$regex: req.searchCNU}, "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{});
  const carCount = cars.length;
  
  res.render('car_list', { company: req.decoded.company, aclist, noticethree, carTodayCount, carCount });
});


//----------------------------------------------------------------------------//
//                                  작업자                                    //
//----------------------------------------------------------------------------//

//작업자 목록
router.get('/worker_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{})
  const WN = req.query.WN;
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  if(req.searchCNU == "3388800960") {
    const workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{},{});
    const workerTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Worker,{ "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{});
    const workerCount = workers.length;
    res.render('worker_list', { company: req.decoded.company, aclist, noticethree, workers, workerTodayCount, workerCount });
  }
  else {
    const workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU} },{});
    const workerTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{});
    const workerCount = workers.length;
  
    res.render('worker_list', { company: req.decoded.company, aclist, noticethree, workers, workerTodayCount, workerCount });
  }
  
});


//작업자 인증 ajax
router.post('/ajax/post', isNotLoggedIn, DataSet, agentDevide, async function(req, res) {

  var au = req.body.au;
  var ac_true = req.body.ac_true;
  var ac_false = req.body.ac_false;

  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;

  let workerone;
  
  if (au) {
    var audata = au.split(",")
    workerone = await modelQuery(QUERY.Update,COLLECTION_NAME.Worker,{where : { "EM": audata[0] }, update : { "AU": audata[1] } },{})
  }
  else if (ac_true) {
    workerone = await modelQuery(QUERY.Update,COLLECTION_NAME.Worker,{where : { "EM": ac_true }, update : { "AC": true }},{})
  }
  else if (ac_false) {
    workerone = await modelQuery(QUERY.Update,COLLECTION_NAME.Worker,{where : { "EM": ac_false }, update : { "AC": false }},{})
  }
  
  const workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ CID: req.decoded.CID},{});

  res.render('worker_list', { company: req.decoded.company, workers });

});

//----------------------------------------------------------------------------//
//                                  소독이력                                  //
//----------------------------------------------------------------------------//

// 소독 목록
router.get('/history_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  try {
    const cars = await modelQuery(QUERY.Find,COLLECTION_NAME.Car,{ "CNU": {$regex: req.searchCNU} },{});
    const devices = await modelQuery(QUERY.Find,COLLECTION_NAME.Device,{ "CNU": {$regex: req.searchCNU} },{});
    const CN = req.query.CN;
    const MD = req.query.MD;
    
    const historys = await modelQuery(QUERY.Find,COLLECTION_NAME.History,{ "CNU": {$regex: req.searchCNU} },{});
    const historyTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.History,{ "CNU": {$regex: req.searchCNU}, "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{});
    const historyCount = historys.length;

    res.render('history_list', { company: req.decoded.company, aclist, noticethree, cars, devices, historys, historyTodayCount, historyCount });
    
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});


//소독 그래프
router.get('/history_chart/:_id', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  try {
    const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{ "_id": req.params._id },{});
    const history_array = historyone.PD;
    console.log("씨에이",historyone.CA);
    res.render('history_chart', { company: req.decoded.company, aclist, noticethree, historyone, history_array });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  pay                                       //
//----------------------------------------------------------------------------//

//포인트 결제
router.get('/shop', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const imp_code = process.env.imp_code;
  const HOME = process.env.IP;

  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const goods = await modelQuery(QUERY.Find,COLLECTION_NAME.Goods,{},{})
  
  try {
    res.render('shop', { company: req.decoded.company, aclist, imp_code, HOME, goods });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//결제 완료 내역
router.get('/pay_confirm', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const imp_uid = req.query.imp_uid;
  const imp_code = process.env.imp_code;
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  // 엑세스 토큰 발급 받기
  const getToken = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post", // POST method
    headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    data: {
      imp_key: process.env.imp_key, // REST API키
      imp_secret: process.env.imp_secret // REST API Secret
    }
  });
  const { access_token } = getToken.data.response; // 인증 토큰

  // imp_uid로 아임포트 서버에서 결제 정보 조회
  const getPaymentData = await axios({
    url: 'https://api.iamport.kr/payments/' + imp_uid, // imp_uid 전달
    method: "get", // GET method
    headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
  });
  const paymentData = getPaymentData.data.response; // 조회한 결제 정보
  
  const orderGoods = await modelQuery(QUERY.Find,COLLECTION_NAME.GOODS,{ "OID": paymentData.merchant_uid },{});
  var orderAllCount = 0;
  for(var i = 0; i < orderGoods.length; i ++) {
    var orderCount = orderGoods[i].ONU;
    orderAllCount += orderCount;
  }
  
  try {
    res.render('pay_confirm', { company: req.decoded.company, aclist, imp_code, paymentData, noticethree, orderGoods, orderAllCount });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//결제 목록
router.get('/pay_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const GN = req.query.GN;
  const IP = process.env.IP;
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  try {
    const orders = await modelQuery(QUERY.Find,COLLECTION_NAME.Order,{ "CNU": {$regex: req.searchCNU} },{});
    const orderTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Order,{ "CNU": {$regex: req.searchCNU}, "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{});
    const orderCount = orders.length;
    
    res.render('pay_list', { company: req.decoded.company, aclist, noticethree, IP, orders, orderTodayCount, orderCount });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});


// 영수증
router.get('/receipt', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const imp_code = process.env.imp_code;
  const imp_uid = req.query.imp_uid;

  const getToken = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post", // POST method
    headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    data: {
      imp_key: process.env.imp_key, // REST API키
      imp_secret: process.env.imp_secret // REST API Secret
    }
  });
  const { access_token } = getToken.data.response; // 인증 토큰

  // imp_uid로 아임포트 서버에서 결제 정보 조회
  const getPaymentData = await axios({
    url: 'https://api.iamport.kr/payments/' + imp_uid, // imp_uid 전달
    method: "get", // GET method
    headers: { "Authorization": access_token } // ��증 토큰 Authorization header에 추가
  });
  const paymentData = getPaymentData.data.response; // 조회한 결제 정보

  const orderone = await modelQuery(QUERY.Find,COLLECTION_NAME.Order,{ "IID": imp_uid },{})
  const orderGoods = await modelQuery(QUERY.Find,COLLECTION_NAME.OrderDetail,{ "OID" : paymentData.merchant_uid },{})
  var orderAllCount = 0;
  for(var i = 0; i < orderGoods.length; i ++) {
    var orderCount = orderGoods[i].ONU;
    orderAllCount += orderCount;
  }

  res.render('receipt', { company: req.decoded.company, aclist, paymentData, orderone, orderGoods, orderAllCount, moment });

})


//----------------------------------------------------------------------------//
//                                   Point                                    //
//----------------------------------------------------------------------------//

//포인트 사용 목록
router.get('/point_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {

  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const GN = req.query.GN;
  const IP = process.env.IP;
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});

  try {
    const points = await modelQuery(QUERY.Find,COLLECTION_NAME.Point,{ "CNU": {$regex: req.searchCNU} },{});
    const pointTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Point,{ "CNU": {$regex: req.searchCNU}, "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{});
    const pointCount = points.length;

    res.render('point_list', { company: req.decoded.company, aclist, noticethree, IP, points, pointTodayCount, pointCount });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});



//----------------------------------------------------------------------------//
//                                   QR                                       //
//----------------------------------------------------------------------------//

//QR코드 관리
router.get('/publish_manage', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const HOME = process.env.IP;
  const cat = process.env.publish_cat;
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});
  
  try {
    res. render('publish_manage', { company: req.decoded.company, aclist, noticethree, HOME, cat });
  }
  catch(err) {
    console.error(err);
    next(err);
  }
});

//QR Code Create
router.get('/create', isNotLoggedIn, DataSet, agentDevide, async (req, res, next) => {
  
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  var main = req.query.main;
  var cid = req.query.cid;
  var cat = req.query.cat;
  var type = req.query.type;
  var width = req.query.width;
  var height = req.query.height;
  var url;
  
  try {
    if(cat == 1) {
      url = main+"/inflow?cat="+cat;
    }
    else {
      url = main+"/inflow?cat="+cat+"&cid="+cid;
    }
    const cr_qrcode = await qrcode.toDataURL(url, {width: width, height: height});
    const cr_sticker = await qrcode.toDataURL(url, {width: width, height: height, color: {light: "#FED23D"}});
    
    res.render('code_img', { company: req.decoded.company, aclist, cr_qrcode, cr_sticker, type });
  }
  catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  SOLAPI                                    //
//----------------------------------------------------------------------------//

router.get('/sendsms', isNotLoggedIn, DataSet, async(req, res, next) => {

  const historyid = '6046d067b1d64326737c82bd';
  const number = '01021128228';


  let apiSecret = process.env.sol_secret;
  let apiKey = process.env.sol_key;

  const moment = require('moment')
  const nanoidGenerate = require('nanoid/generate')
  const generate = () => nanoidGenerate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)
  const HmacSHA256 = require('crypto-js/hmac-sha256')
  const fs = require('fs')
  const path = require('path')

  const date = moment.utc().format()
  const salt = generate()
  const hmacData = date + salt
  const signature = HmacSHA256(hmacData, apiSecret).toString()
  const autori = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`

  var request = require('request');

  // const historyid = '6046d067b1d64326737c82bd'
  //const number = '01021128228'

  const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{ '_id': historyid },{});
  const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ '_id': historyone.CID },{});
  var companypoint = companyone.SPO;

  if (companypoint > 0) {

    var options = {
      headers: {
        Authorization: autori,
        'Content-Type': 'application/json'
      },
      body: {
        message: {
          to: '01021128228',
          from: '16443486',
          text: '내용',
          type: "SMS"
        },
      },
      method: 'POST',
      json: true,
      url: 'http://api.solapi.com/messages/v4/send'
    };


    request(options, function(error, response, body) {
      if (error) throw error;
    });

    companypoint = companypoint - 20;
    
    companyone = await modelQuery(QUERY.Update,COLLECTION_NAME.Company,{where : { '_id': historyone.CID }, update : { "SPO": companypoint }},{});
  }


});

// router.get('/sendkko', isNotLoggedIn, DataSet, async(req, res, next) => {

//   const historyid = '605aec074164b23448038c2d';
//   const number = '01021128228';
//   const comname = '롯데렌터카';

//   let apiSecret = process.env.sol_secret;
//   let apiKey = process.env.sol_key;

//   const moment = require('moment')
//   const nanoidGenerate = require('nanoid/generate')
//   const generate = () => nanoidGenerate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)
//   const HmacSHA256 = require('crypto-js/hmac-sha256')
//   const fs = require('fs')
//   const path = require('path')

//   const date = moment.utc().format()
//   const salt = generate()
//   const hmacData = date + salt
//   const signature = HmacSHA256(hmacData, apiSecret).toString()
//   const autori = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`

//   var request = require('request');
  

//   const historyone = await History.findOne({ '_id': historyid });
//   const companyone = await Company.findOne({ '_id': historyone.CID })
//   var companypoint = companyone.SPO;

//   var msgID = ""
//   var options = {
//     headers: {
//       Authorization: autori,
//       'Content-Type': 'application/json'
//     },
//     body: {
//       messages: [{
//         to: number,
//         from: '16443486',
//         text:
//           comname + "에서 소독이 완료되었음을 알려드립니다.자세한 사항은 아래 링크에서 확인 가능합니다 (미소)",
//         type: 'ATA',
//         kakaoOptions: {
//           pfId: 'KA01PF210319072804501wAicQajTRe4',
//           templateId: 'KA01TP210319074611283wL0AjgZVdog',
//           buttons: [{
//             buttonType: 'WL',
//             buttonName: '확인하기',
//             linkMo: process.env.IP + '/publish?cat=1&hid=' + historyid,
//             linkPc: process.env.IP + '/publish?cat=1&hid=' + historyid
//           }]
//         }
//       }]
//     },
//     method: 'POST',
//     json: true,
//     url: 'http://api.solapi.com/messages/v4/send-many'
//   };

//   request(options, function(error, response, body) {
//     if (error) throw error;
//   });
  
//   const pointone = await Point.insertMany({
//     "CID": companyone._id,
//     "PN": "알림톡 전송",
//     "PO": 50,
//   });

//   companypoint = companypoint - 50;

//   await Company.where({ '_id': historyone.CID })
//     .update({ "SPO": companypoint }).setOptions({ runValidators: true })
//     .exec();
// });

// // 알림톡 테스트

// router.get('/sendkko2', isNotLoggedIn, DataSet, async(req, res, next) => {
  
//   const historyid = '605aec074164b23448038c2d';
//   const number = '01021128228';
  
//   let apiSecret = process.env.sol_secret;
//   let apiKey = process.env.sol_key;
  
//   const { config, Group, msg } = require('solapi');
  
//   const historyone = await History.findOne({ '_id': historyid });
//   const companyone = await Company.findOne({ '_id': historyone.CID });
//   var companypoint = companyone.SPO;

// // 인증을 위해 발급받은 본인의 API Key를 사용합니다.

//   config.init({ apiKey, apiSecret })
  
//   var fn = async function send (params = {}) {
//     try {
//       const response = await Group.sendSimpleMessage(params);
//       const pointone = await Point.insertMany({
//         "CID": companyone._id,
//         "PN": "알림톡 전송",
//         "PO": 50,
//         "MID" : response.messageId,
//         "WNM" : historyone.WNM,
//       });
//       companypoint = companypoint - 50;
//       await Company.where({ '_id': historyone.CID })
//         .update({ "SPO": companypoint }).setOptions({ runValidators: true })
//         .exec();
      
//     } catch (e) {
//       console.log(e);
//     }
//   }
  
//   const params = {
//     autoTypeDetect: true,
//     text: companyone.CNA + "에서 소독이 완료되었음을 알려드립니다.자세한 사항은 아래 링크에서 확인 가능합니다 (미소)",
//     to: '01021128228', // 수신번호 (받는이)
//     from: '16443486', // 발신번호 (보내는이)
//     type: 'ATA',
//     kakaoOptions: {
//       pfId: 'KA01PF210319072804501wAicQajTRe4',
//       templateId: 'KA01TP210319074611283wL0AjgZVdog',
//             buttons: [{
//               buttonType: 'WL',
//               buttonName: '확인하기',
//               linkMo: process.env.IP + '/publish?cat=1&hid=' + historyid,
//               linkPc: process.env.IP + '/publish?cat=1&hid=' + historyid
//             }]
//     }
//   };
  
//   fn(params);
  
// });

// 알림톡 리스트
router.get('/alarmtalk_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const WNM = req.query.WNM;
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3, sort : {CA : -1}});
  
  
  let apiSecret = process.env.sol_secret;
  let apiKey = process.env.sol_key;

  const nanoidGenerate = require('nanoid/generate');
  const generate = () => nanoidGenerate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32);
  const HmacSHA256 = require('crypto-js/hmac-sha256');
  
  const messageIds = []; //메세지 ID 담을 배열 선언
  
  //포인트에 있는 내용 중 CID를 비교해서 MID 배열에 넣음
  const pointaggregate = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Point,{ match : {"CNU": {$regex: req.searchCNU}} ,group : { _id : "$MID" }},{});
    
    //_id 키의 값들을 배열에 담음(mid들만)
    for (var i = 0; i < pointaggregate.length; i++) {
      messageIds[i] = await pointaggregate[i]._id;
    }
    
    
    for (var i = 0; i < messageIds.length; i++) {
      //signature 키 반복 방지를 위해 date가 생성될 때마다 i초씩 더해주었음
      
      const date = moment().add(i,'s').format();
      const salt = generate();
      const hmacData = date + salt;
      const signature = HmacSHA256(hmacData, apiSecret).toString();
      const autori = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
      
      
      var options = {
        headers: { Authorization: autori },
        method: 'GET',
        json: true,
        url:
          'http://api.solapi.com/messages/v4/list?criteria=messageId&value='+ messageIds[i]+'&cond=eq'
      };
      
      
      
      request(options, async function(error, response, body) {
        try {
          for(var key in body.messageList) {
            const pointone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Point,{"MID" : body.messageList[key]._id},{})
            const alarmone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Alarm,{"MID" : body.messageList[key]._id},{})
            
            
            if(body.messageList[key].status == "COMPLETE")
            {
              if(!alarmone) {
                await modelQuery(QUERY.InsertMany,COLLECTION_NAME.Alarm,{
                  "MID" : body.messageList[key]._id,
                  "WNM" : pointone.WNM,
                  "CNU" : pointone.CNU,
                  "CA" : pointone.CA,
                  "RE" : "성공"
                },{})
              }
              else {
                if(alarmone.RE == "성공") {
                }
                else {
                  await modelQuery(QUERY.Update,COLLECTION_NAME.Alarm,{where : {"MID" : body.messageList[key]._id} , update : {"RE" : "성공"}},{});
                }
                
                
              }
            }
            else if(body.messageList[key].status == "PENDING") {
              if(!alarmone) {
                await modelQuery(QUERY.InsertMany,COLLECTION_NAME.Alarm,{
                  "MID" : body.messageList[key]._id,
                  "WNM" : pointone.WNM,
                  "CNU" : pointone.CNU,
                  "CA" : pointone.CA,
                  "RE" : "보내는중"
                },{})
              }
            }
            else {
              if(!alarmone) {
                await modelQuery(QUERY.InsertMany,COLLECTION_NAME.Alarm,{
                  "MID" : body.messageList[key]._id,
                  "WNM" : pointone.WNM,
                  "CNU" : pointone.CNU,
                  "CA" : pointone.CA,
                  "RE" : "실패"
                },{})
              }
              else {
              }
            }
            
          }
          
          if (error) throw error;
        }catch(e) {
          console.log(e)
        }
      });
    }

  try {
    const alarms = await modelQuery(QUERY.Find,COLLECTION_NAME.Alarm,{ "CNU": {$regex: req.searchCNU} },{});
    const alarmTodayCount = await modelQuery(QUERY.CountDoc,COLLECTION_NAME.Alarm,{ "CNU": {$regex: req.searchCNU}, "CA" : { "$gte": todayStart, "$lt" : todayEnd } },{});
    const alarmCount = alarms.length;
    res.render('alarmtalk_list', { company: req.decoded.company, aclist, noticethree, alarms, alarmCount, alarmTodayCount });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});


//----------------------------------------------------------------------------//
//                                  Notice                                    //
//----------------------------------------------------------------------------//

// 공지사항
router.get('/notice_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  const noticethree = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{limit : 3})
  res.render('notice_list',{company: req.decoded.company, aclist, noticethree});
});


// 공지사항 입력
router.get('/notice_write', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  res.render('notice_write',{company: req.decoded.company, aclist});
});

// 공지사항 입력 ajax
router.post('/ajax/notice_write', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  
  const title = req.body.title;
  const text = req.body.text;
  
  try {
    const noticeone = await modelQuery(QUERY.Create,COLLECTION_NAME.Notice,{ CNU: req.decoded.CNU, TI : title , CO : text},{});
    res.send({result : true, oid : noticeone._id});
    
  } catch(err) {
    console.error(err);
    res.send({result : false});
  }
});

router.post('/ajax/notice_file', isNotLoggedIn, DataSet, agentDevide, upload.array('noticeFile'), async(req, res, next) => {
  const nin = req.body.nin;
  const files = req.files;
  const saveFile = files[0].destination+"/"+files[0].filename;
  const originalName = files[0].originalname;
  
  await modelQuery(QUERY.Create,COLLECTION_NAME.NoticeUpload,{OID: nin, FI: saveFile, ON: originalName },{});
  res.send({result: true});
});

// 공지사항 팝업
// router.get('/notice_pop', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
//   const CID = req.decoded.CID;
//   const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": req.searchCID, "AC": false },{});
  
//   const noticeid = req.query.noticeid;
//   const noticeone = await Notice.findOne({_id : noticeid});
//   console.log(noticeone);
  
//   res.render('notice_pop',{company: req.decoded.company, aclist, noticeone, moment});
// });

router.post('/ajax/notice_detail', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  
  const noticeid = req.body.noticeid;
  
  try {
    const noticedetail = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{_id : noticeid},{});
    const filedetail = await modelQuery(QUERY.Find,COLLECTION_NAME.NoticeUpload,{OID : noticeid},{});
    
    res.send({result : true, noticedetail : noticedetail, filedetail : filedetail});
  } catch(err) {
    console.error(err);
    res.send({result : false});
  }
});

router.post('/ajax/notice_pop_check', isNotLoggedIn, async(req, res, next) => {
  
  try {
    const noticeId = req.body.id;
    const noticeCheck = req.body.ck;
    
    const noticeChange = await modelQuery(QUERY.Updateone,COLLECTION_NAME.Notice,{where: {_id: noticeId}, update: {POP: noticeCheck}},{});
    
    res.send({result: true});
    
    console.log(noticeChange);
  } catch(err) {
    console.error(err);
    res.send({result : false});
  }
})



//----------------------------------------------------------------------------//
//                                  About App                                 //
//----------------------------------------------------------------------------//
router.get('/aboutapp', async(req, res, next) => {
  res.render('aboutapp');
});

//----------------------------------------------------------------------------//
//                                  Manual                                    //
//----------------------------------------------------------------------------//
router.get('/manual', async(req, res, next) => {
  res.render('manual');
});

//----------------------------------------------------------------------------//
//                                  Ozone Spread                              //
//----------------------------------------------------------------------------//

//Ozone Spread
router.get('/ozone_spread', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": req.searchCID, "AC": false },{});
  
  res.render('ozone_spread', { company: req.decoded.company, aclist });
});

//----------------------------------------------------------------------------//
//                                  Agent Manager                             //
//----------------------------------------------------------------------------//

router.get('/agent_manager', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});

  res.render('agent_manager', { company: req.decoded.company, aclist });
});

router.get('/agent_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});

  res.render('agent_list', { company: req.decoded.company, aclist });
});


router.get('/gstest', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const aclist = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": {$regex: req.searchCNU}, "AC": false },{});
  
    // Excel Test
  //로직 흐름 : 
  //엑셀 워크북 생성 -> 엑셀 시트 생성 -> 대표행(타이틀행) 설정 및 입력 -> 데이터 입력 -> 저장
  
  const Excel = require('excel4node');
  
  //비동기 함수 생성
  async function ExcelTest(){
    
    try{
    //엑셀 워크북 생성 및 시트 생성
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("My Sheet");
    
      //대표행(타이틀행) 설정 및 입력
    worksheet.columns = [
      {header: 'Id', key: 'id', width: 10},
      {header: 'Name', key: 'name', width: 35}, 
      {header: 'Birth', key: 'birth', width: 15},
    ];
    
    //데이터 추가 (행단위 추가)
    worksheet.addRow({id: 1, name: 'Hong', birth: new Date().toLocaleDateString()});
    worksheet.addRow({id: 2, name: 'Kim', birth: new Date().toLocaleDateString()});
    
    //엑셀 데이터 저장
    await workbook.xlsx.writeFile('export.xlsx');
    
    //엑셀 데이터 읽고 워크북 불러오기
    const newWorkbook = new Excel.Workbook();
    await newWorkbook.xlsx.readFile('export.xlsx');
    
    //엑셀 시트 불러오기
    const newworksheet = newWorkbook.getWorksheet('My Sheet');
    
    //데이터 추가 (행단위 추가)
    newworksheet.addRow(
      {id: 3, name: 'Lee', date: new Date().toLocaleDateString()}
    );
    
    //다른이름으로 저장 (기존 파일명과 같으면 덮어쓰기)
    await newWorkbook.xlsx.writeFile('export2.xlsx');
    
    //종료
    console.log("끝!");
    
    }
    
  catch(e) {
    console.log(e)
  }
  
  
  }
  
  //함수실행
    ExcelTest();
  
})

//테스트
router.post('/password', async(req, res, next) => {
  try {
    const newPW = encrypt(req.body.name, process.env.cryptoKey);
    const exPW = decrypt(newPW, process.env.cryptoKey);
    
    res.send({new: newPW, ex: exPW})
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});


  
module.exports = router;