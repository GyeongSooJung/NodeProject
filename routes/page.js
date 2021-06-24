const express = require('express');
require('dotenv').config();
//schema
const Schema = require('../schemas/schemas');
const { Company, Device, Car, Worker, History, Order, OrderDetail, Publish, Point, Alarm, Notice, Goods } = Schema;

const moment = require('moment');
const qrcode = require('qrcode');
const session = require('express-session');
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
  res.render('index');
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
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });

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
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  
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

  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const devices = await Device.find({ "CID": req.decoded.CID });
  const cars = await Car.find({ "CID": req.decoded.CID });
  const workers = await Worker.find({ "CID": req.decoded.CID });
  const publishs = await Publish.find({});
  const historys = await History.find({ "CID": req.decoded.CID });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  
  var psum = 0;
  for(var i = 0; i < publishs.length; i++) {
    var pcount = publishs[i].PUN;
    
    psum += pcount;
  }


  var history_count2 = [0,0,0,0,0,0,0];
  const Days = 24 * 60 * 60 * 1000;
  
  const history_date = await History.find({ "CID": req.decoded.CID, "CA": { $lte: Date.now(), $gte: (Date.now() - Days * 7) } },{_id:0,CA:1});
    for (var i =  0; i < 7 ; i ++) {
        for(var j = await 0; j < history_date.length; j ++) {
          if((history_date[j].CA <=  (Date.now() - (Days * i))) && (history_date[j].CA >=  (Date.now() - Days * (i + 1)))) {
            history_count2[i] += await 1;
          }
        } 
      }
      

  const history_count = await history_count2;
  
  const history_array = await (historys.reverse())[0]
  
  if (history_array) {
    const recent_history = history_array.PD;
    res.render('main', { company: req.decoded.company, aclist, noticethree,  devices, cars, workers, historys, recent_history, history_array, history_count, HOME, psum });
  }
  else {
    res.render('main', { company: req.decoded.company, aclist, noticethree,  devices, cars, workers, historys, history_array, history_count, HOME, psum });
  }

});

//----------------------------------------------------------------------------//
//                                  사업자                                    //
//----------------------------------------------------------------------------//

//사업자 목록
router.get('/company_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });

  // const DEVICE = req.query.DEVICE;
  // const CAR = req.query.CAR;
  // const WORKER = req.query.WORKER;
  // const HISTORY = req.query.HISTORY;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  // if (DEVICE) {
  //   const companyone = await Company.findOne({ "_id": DEVICE });
    
  //   const devices = await Device.find({ "CID": DEVICE });

  //   res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, devices });
  // }
  // else if (CAR) {
  //   const companyone = await Company.findOne({ "_id": CAR });
    
  //   const cars = await Car.find({ "CID": CAR });

  //   res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, cars });
  // }
  // else if (WORKER) {
  //   const companyone = await Company.findOne({ "_id": WORKER });

  //   const workers = await Worker.find({ "CID": WORKER });

  //   res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, workers });
  // }
  // else if (HISTORY) {
  //   const companyone = await Company.findOne({ "_id": HISTORY });
    
  //   const historys = await History.find({ "CID": HISTORY });

  //   res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, historys });
  // }
  // else {
    const companys = await Company.find({ "AH": false });

    res.render('company_list', { company: req.decoded.company, companys, aclist, noticethree });
  // }
});

router.post('/ajax/company_list', isNotLoggedIn, DataSet, async(req, res, nex) => {
  const CID = req.body.CID;
  const companylist = await Company.find({});
  res.send({ result: true, pagelist : companylist });
  
});

//----------------------------------------------------------------------------//
//                                  통계                                      //
//----------------------------------------------------------------------------//

//제품 통계
router.get('/device_static', isNotLoggedIn, DataSet, agentDevide, async(req, res, nex) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  const AllCompany = await Company.countDocuments({});
  const AllHistory = await History.countDocuments({});
  const AllCar = await Car.countDocuments({});
  const AllDevice = await Device.countDocuments({});

  const company1 = await Company.count({ "CK": "렌터카" });
  const company2 = await Company.count({ "CK": "카센터" });
  const company3 = await Company.count({ "CK": "출장정비" });
  const company4 = await Company.count({ "CK": "출장세차" });
  const company5 = await Company.count({ "CK": "택시운수업" });
  const company6 = await Company.count({ "CK": "버스운수업" });
  const company7 = await Company.count({ "CK": "타이어샵" });
  const companycount = [company1, company2, company3, company4, company5, company6, company7];

  res.render('device_static', { company: req.decoded.company, companycount, aclist, noticethree, AllDevice, AllCar, AllHistory, AllCompany });
})

//소독 통계
router.get('/history_static', isNotLoggedIn, DataSet, agentDevide, async(req, res, nex) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });

  const AllCompany = await Company.countDocuments({});
  const AllHistory = await History.countDocuments({});
  const AllCar = await Car.countDocuments({});
  const AllDevice = await Device.countDocuments({});
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  
  res.render('history_static', { company: req.decoded.company, aclist, noticethree, AllDevice, AllCar, AllHistory, AllCompany });
})

//----------------------------------------------------------------------------//
//                                  장비                                      //
//----------------------------------------------------------------------------//

//장비 등록
router.get('/device_join', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  res.render('device_join', { company: req.decoded.company, aclist, noticethree, });
});

//장비 목록
router.get('/device_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const NN = req.query.NN;
  
  // 작업자 신규 등록 시 new 표시
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  // 공지사항 rolling 표시
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const devices = await Device.find({ "CID": req.searchCID });
    const deviceTodayCount = await Device.countDocuments({ "CID" : req.searchCID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const deviceCount = devices.length;

    res.render('device_list', { company: req.decoded.company, aclist, devices, deviceTodayCount, deviceCount, noticethree });
  }
  catch (err) {
    console.error(err);
    next(err);
  }


});

router.post('/ajax/device_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var devices = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      if(devices.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "MD") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "MD" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "VER") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "VER" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "MAC") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "MAC" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "NN") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "NN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      if(devices.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="ANA") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="MD") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "MD" : {$regex:searchtext} } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="VER") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "VER" : {$regex:searchtext} } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="MAC") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "MAC" : {$regex:searchtext} } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="NN") {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "NN" : {$regex:searchtext} } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          devices = await Device.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID } } },
            { $project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    
    var devicelist = [];
    if(devices.length) {
      for(var i = 0; i < devices.length; i ++) {
        devicelist[i] = devices[i];
      }
    }
    
    res.send({ result: true, pagelist : devicelist });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  자동차                                    //
//----------------------------------------------------------------------------//

//차량 등록
router.get('/car_join', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  res.render('car_join', { company: req.decoded.company, aclist, noticethree });
});

//차량 목록
router.get('/car_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  
  const cars = await Car.find({ "CID" : req.searchCID });
  const carTodayCount = await Car.countDocuments({ "CID" : req.searchCID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
  const carCount = cars.length;
  
  res.render('car_list', { company: req.decoded.company, aclist, noticethree, carTodayCount, carCount });
});

router.post('/ajax/car_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var cars = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      if(cars.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "CN") {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "CPN") {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CPN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      if(cars.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing" });
          }
        }
        else if (search =="CN") {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CN" : {$regex:searchtext} } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="CPN") {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CPN" : {$regex:searchtext} } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          cars = await Car.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID } } },
            { $project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA'}},
            { $sort : { [sortText]: sortNum } }
          ]);
          if(cars.length == 0) {
            return res.send({ result : "nothing" });
          }
        }
      }
    }
    
    var carlist = [];
    if(cars.length) {
      for(var i = 0; i < cars.length; i ++) {
        carlist[i] = cars[i];
      }
    }
    
    res.send({ result: true, pagelist : carlist });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  작업자                                    //
//----------------------------------------------------------------------------//

//작업자 목록
router.get('/worker_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID" : req.searchCID, "AC": false });
  const WN = req.query.WN;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  
  if(CID == "5fd6c731a26c914fbad53ebe") {
    const workers = await Worker.find({});
    const workerTodayCount = await Worker.countDocuments({ "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const workerCount = workers.length;
  
    res.render('worker_list', { company: req.decoded.company, aclist, noticethree, workers, workerTodayCount, workerCount });
  }
  else {
    const workers = await Worker.find({ "CID" : req.searchCID });
    const workerTodayCount = await Worker.countDocuments({ "CID" : req.searchCID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const workerCount = workers.length;
  
    res.render('worker_list', { company: req.decoded.company, aclist, noticethree, workers, workerTodayCount, workerCount });
  }
});

router.post('/ajax/worker_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var workers = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    if(CID == "5fd6c731a26c914fbad53ebe") {
      // 대리점 파악
      var franchiseCIDlist = await Company.aggregate([
        { $match : {CK : "MK 대리점"} },
        { $project : {CID : 1}},
           
        ], function (err,result) {
          if(err) throw err;
      });
      var CIDlist = [];
      for (var i = 0; i < franchiseCIDlist.length; i ++) {
        CIDlist.push(String(franchiseCIDlist[i]._id));
      }
      CIDlist.push(CID);
      //
      
      if (searchdate) {
        var searchtext2 = searchdate.split("~");
        if(workers.length == 0) {
          return res.send({ result : "nothing" });
        }
        else {
          if(search == "WN") {
            workers = await Worker.find({ "CID": { $in : CIDlist }, "WN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if(search == "PN") {
            workers = await Worker.find({ "CID": { $in : CIDlist }, "PN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if(search == "EM") {
            workers = await Worker.find({ "CID": { $in : CIDlist }, "EM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else {
            workers = await Worker.find({ "CID" : { $in : CIDlist }, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
        }
      }
      else {
        if(workers.length == 0) {
          return res.send({ result : "nothing" });
        }
        else {
          if (search =="WN") {
            workers = await Worker.find({ "CID": { $in : CIDlist }, "WN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if (search =="PN") {
            workers = await Worker.find({ "CID": { $in : CIDlist }, "PN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if (search =="EM") {
            workers = await Worker.find({ "CID": { $in : CIDlist }, "EM" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else {
            workers = await Worker.find({ "CID" : { $in : CIDlist } }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
        }
      }
    }
    else {
      if (searchdate) {
        var searchtext2 = searchdate.split("~");
        if(workers.length == 0) {
          return res.send({ result : "nothing" });
        }
        else {
          if(search == "WN") {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "WN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if(search == "PN") {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if(search == "EM") {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "EM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
        }
      }
      else {
        if(workers.length == 0) {
          return res.send({ result : "nothing" });
        }
        else {
          if (search =="ANA") {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if (search =="WN") {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "WN" : {$regex:searchtext} } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if (search =="PN") {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext} } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if (search =="EM") {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID }, "EM" : {$regex:searchtext} } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else {
            workers = await Worker.aggregate([
              { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
              { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
              { $unwind : "$ANA" },
              { $match : { "CID" : { $in : req.searchCID } } },
              { $project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'} },
              { $sort : { [sortText]: sortNum } }
            ]);
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
        }
      }
    }
    
    var workerlist = [];
    if(workers.length) {
      for(var i = 0; i < workers.length; i ++) {
        workerlist[i] = workers[i];
      }
    }
    
    res.send({ result: true, pagelist : workerlist });
    
  } catch(err) {
    console.error(err);
    next(err);
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
  
  console.log(au);
  
  if (au) {
    var audata = au.split(",")
    workerone = await Worker.where({ "EM": audata[0] }).update({ "AU": audata[1] }).setOptions({ runValidators: true }).exec();
  }
  else if (ac_true) {
    workerone = await Worker.where({ "EM": ac_true }).update({ "AC": true }).setOptions({ runValidators: true }).exec();
  }
  else if (ac_false) {
    workerone = await Worker.where({ "EM": ac_false }).update({ "AC": false }).setOptions({ runValidators: true }).exec();
  }

  const workers = await Worker.find({ CID: req.decoded.CID, });

  res.render('worker_list', { company: req.decoded.company, workers });

});

//----------------------------------------------------------------------------//
//                                  소독이력                                  //
//----------------------------------------------------------------------------//

// 소독 목록
router.get('/history_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const cars = await Car.find({ "CID": CID });
    const devices = await Device.find({ "CID": CID });
    const CN = req.query.CN;
    const MD = req.query.MD;
    
    const historys = await History.find({ "CID": req.searchCID });
    const historyTodayCount = await History.countDocuments({ "CID" : req.searchCID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const historyCount = historys.length;

    res.render('history_list', { company: req.decoded.company, aclist, noticethree, cars, devices, historys, historyTodayCount, historyCount });
    
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/history_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var historys = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      if(historys.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "CNM") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "DNM") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "DNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "WNM") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      if(historys.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="ANA") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="CNM") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CNM" : {$regex:searchtext} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="DNM") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "DNM" : {$regex:searchtext} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="WNM") {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          historys = await History.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID } } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    
    var historylist = [];
    if(historys.length) {
      for(var i = 0; i < historys.length; i ++) {
        historylist[i] = historys[i];
      }
    }
    
    res.send({ result: true, pagelist : historylist });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//소독 그래프
router.get('/history_chart/:_id', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const historyone = await History.findOne({ "_id": req.params._id });
    const history_array = historyone.PD;
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
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const imp_code = process.env.imp_code;
  const HOME = process.env.IP;

  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const goods = await Goods.find({});
  
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
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const imp_uid = req.query.imp_uid;
  const imp_code = process.env.imp_code;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

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

  const orderGoods = await OrderDetail.find({ "OID": paymentData.merchant_uid });
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

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const GN = req.query.GN;
  const IP = process.env.IP;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const orders = await Order.find({ "CID": req.searchCID });
    const orderTodayCount = await Order.countDocuments({ "CID" : req.searchCID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const orderCount = orders.length;
    
    res.render('pay_list', { company: req.decoded.company, aclist, noticethree, IP, orders, orderTodayCount, orderCount });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/pay_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var orders = new Object;
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  
  try {
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      if(orders.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "MID") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "MID" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "GN") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "GN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "AM") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } }, strAM : { $convert: { input: '$AM', to : 'string', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "strAM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", strAM : "$strAM", CA : "$CA", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      if(orders.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="ANA") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="MID") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "MID" : {$regex:searchtext} } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="GN") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "GN" : {$regex:searchtext} } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="AM") {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } }, strAM : { $convert: { input: '$AM', to : 'string', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "strAM" : {$regex:searchtext} } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", strAM : "$strAM", CA : "$CA", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          orders = await Order.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID } } },
            { $project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    
    var orderlist = [];
    if(orders.length) {
      for(var i = 0; i < orders.length; i ++) {
        orderlist[i] = orders[i];
      }
    }
    
    res.send({ result: true, pagelist : orderlist });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/pay_list_detail', isNotLoggedIn, DataSet, async(req, res, next) => {
  const { merchant_uid } = req.body;

  const orderGoods = await OrderDetail.find({ "OID" : merchant_uid });
  
  res.send({ status : "success", orderGoods : orderGoods });
});

// 영수증
router.get('/receipt', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
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


  const orderone = await Order.find({ "IID": imp_uid });
  const orderGoods = await OrderDetail.find({ "OID" : paymentData.merchant_uid });
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

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const GN = req.query.GN;
  const IP = process.env.IP;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const points = await Point.find({ "CID": req.searchCID });
    const pointTodayCount = await Point.countDocuments({ "CID" : req.searchCID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const pointCount = points.length;

    res.render('point_list', { company: req.decoded.company, aclist, noticethree, IP, points, pointTodayCount, pointCount });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/point_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var points = new Object;
  
  // 스키마 변경 시 삭제예정
  if(search == "pointPN") {
    search = "PN";
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      if(points.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { PN : '$PN', PO : '$PO', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "PN") {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { PN : '$PN', PO : '$PO', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "PO") {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } }, strPO : { $convert: { input: '$PO', to : 'string', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "strPO" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { PN : '$PN', PO : '$PO', strPO : '$strPO', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { PN : '$PN', PO : '$PO', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      if(points.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="ANA") {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} } },
            { $project : { PN : '$PN', PO : '$PO', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="PN") {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext} } },
            { $project : { PN : '$PN', PO : '$PO', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="PO") {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } }, strPO : { $convert: { input: '$PO', to : 'string', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "strPO" : {$regex:searchtext} } },
            { $project : { PN : '$PN', PO : '$PO', strPO : '$strPO', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          points = await Point.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID } } },
            { $project : { PN : '$PN', PO : '$PO', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    
    var pointlist = [];
    if(points.length) {
      for(var i = 0; i < points.length; i ++) {
        pointlist[i] = points[i];
      }
    }
    
    res.send({ result: true, pagelist : pointlist });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                   QR                                       //
//----------------------------------------------------------------------------//

//QR코드 관리
router.get('/publish_manage', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const HOME = process.env.IP;
  const cat = process.env.publish_cat;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  
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
  
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  
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


  const historyone = await History.findOne({ '_id': historyid });
  const companyone = await Company.findOne({ '_id': historyone.CID })
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

    const companyone = await Company.where({ '_id': historyone.CID })
      .update({ "SPO": companypoint }).setOptions({ runValidators: true })
      .exec();
  }


});

router.get('/sendkko', isNotLoggedIn, DataSet, async(req, res, next) => {

  const historyid = '605aec074164b23448038c2d';
  const number = '01021128228';
  const comname = '롯데렌터카';

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
  

  const historyone = await History.findOne({ '_id': historyid });
  const companyone = await Company.findOne({ '_id': historyone.CID })
  var companypoint = companyone.SPO;

  var msgID = ""
  var options = {
    headers: {
      Authorization: autori,
      'Content-Type': 'application/json'
    },
    body: {
      messages: [{
        to: number,
        from: '16443486',
        text:
          comname + "에서 소독이 완료되었음을 알려드립니다.자세한 사항은 아래 링크에서 확인 가능합니다 (미소)",
        type: 'ATA',
        kakaoOptions: {
          pfId: 'KA01PF210319072804501wAicQajTRe4',
          templateId: 'KA01TP210319074611283wL0AjgZVdog',
          buttons: [{
            buttonType: 'WL',
            buttonName: '확인하기',
            linkMo: process.env.IP + '/publish?cat=1&hid=' + historyid,
            linkPc: process.env.IP + '/publish?cat=1&hid=' + historyid
          }]
        }
      }]
    },
    method: 'POST',
    json: true,
    url: 'http://api.solapi.com/messages/v4/send-many'
  };

  request(options, function(error, response, body) {
    if (error) throw error;
  });

  const pointone = await Point.insertMany({
    "CID": companyone._id,
    "PN": "알림톡 전송",
    "PO": 50,
  });

  companypoint = companypoint - 50;

  await Company.where({ '_id': historyone.CID })
    .update({ "SPO": companypoint }).setOptions({ runValidators: true })
    .exec();
});

// 알림톡 테스트

router.get('/sendkko2', isNotLoggedIn, DataSet, async(req, res, next) => {
  
  const historyid = '605aec074164b23448038c2d';
  const number = '01021128228';
  
  let apiSecret = process.env.sol_secret;
  let apiKey = process.env.sol_key;
  
  const { config, Group, msg } = require('solapi');
  
  const historyone = await History.findOne({ '_id': historyid });
  const companyone = await Company.findOne({ '_id': historyone.CID });
  var companypoint = companyone.SPO;

// 인증을 위해 발급받은 본인의 API Key를 사용합니다.

  config.init({ apiKey, apiSecret })
  
  var fn = async function send (params = {}) {
    try {
      const response = await Group.sendSimpleMessage(params);
      const pointone = await Point.insertMany({
        "CID": companyone._id,
        "PN": "알림톡 전송",
        "PO": 50,
        "MID" : response.messageId,
        "WNM" : historyone.WNM,
      });
      companypoint = companypoint - 50;
      await Company.where({ '_id': historyone.CID })
        .update({ "SPO": companypoint }).setOptions({ runValidators: true })
        .exec();
      
    } catch (e) {
      console.log(e);
    }
  }
  
  const params = {
    autoTypeDetect: true,
    text: companyone.CNA + "에서 소독이 완료되었음을 알려드립니다.자세한 사항은 아래 링크에서 확인 가능합니다 (미소)",
    to: '01021128228', // 수신번호 (받는이)
    from: '16443486', // 발신번호 (보내는이)
    type: 'ATA',
    kakaoOptions: {
      pfId: 'KA01PF210319072804501wAicQajTRe4',
      templateId: 'KA01TP210319074611283wL0AjgZVdog',
            buttons: [{
              buttonType: 'WL',
              buttonName: '확인하기',
              linkMo: process.env.IP + '/publish?cat=1&hid=' + historyid,
              linkPc: process.env.IP + '/publish?cat=1&hid=' + historyid
            }]
    }
  };
  
  fn(params);
  
});

// 알림톡 리스트
router.get('/alarmtalk_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const WNM = req.query.WNM;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  
  
  let apiSecret = process.env.sol_secret;
  let apiKey = process.env.sol_key;

  const nanoidGenerate = require('nanoid/generate');
  const generate = () => nanoidGenerate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32);
  const HmacSHA256 = require('crypto-js/hmac-sha256');
  
  const messageIds = []; //메세지 ID 담을 배열 선언
  
  //포인트에 있는 내용 중 CID를 비교해서 MID 배열에 넣음
  const pointaggregate = await Point.aggregate([
      
    { $match : {CID : CID} },
    { $group : { _id : "$MID" } }
       
    ], function (err,result) {
      if(err) throw err;
    });
    
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
            const pointone = await Point.findOne({"MID" : body.messageList[key]._id});
            const alarmone = await Alarm.findOne({"MID" : body.messageList[key]._id});
            
            
            if(body.messageList[key].status == "COMPLETE")
            {
              if(!alarmone) {
                await Alarm.insertMany({
                  "MID" : body.messageList[key]._id,
                  "WNM" : pointone.WNM,
                  "CID" : pointone.CID,
                  "CA" : pointone.CA,
                  "RE" : "성공"
                });
              }
              else {
                if(alarmone.RE == "성공") {
                }
                else {
                   await Alarm.where({"MID" : body.messageList[key]._id}).update({
                    "RE" : "성공"
                  }).setOptions({runValidators : true}).exec();
                }
                
                
              }
            }
            else if(body.messageList[key].status == "PENDING") {
              if(!alarmone) {
                await Alarm.insertMany({
                  "MID" : body.messageList[key]._id,
                  "WNM" : pointone.WNM,
                  "CID" : pointone.CID,
                  "CA" : pointone.CA,
                  "RE" : "보내는중"
                });
              }
            }
            else {
              if(!alarmone) {
                await Alarm.insertMany({
                  "MID" : body.messageList[key]._id,
                  "WNM" : pointone.WNM,
                  "CID" : pointone.CID,
                  "CA" : pointone.CA,
                  "RE" : "실패"
                });
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
    const alarms = await Alarm.find({ "CID": req.searchCID });
    const alarmTodayCount = await Alarm.countDocuments({ "CID" : req.searchCID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const alarmCount = alarms.length;
    res.render('alarmtalk_list', { company: req.decoded.company, aclist, noticethree, alarms, alarmCount, alarmTodayCount });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/alarmtalk_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var alarms = new Object;
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      if(alarms.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "WNM") {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "RE") {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "RE" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      if(alarms.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="ANA") {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA' } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="WNM") {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext} } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="RE") {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID }, "RE" : {$regex:searchtext} } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          alarms = await Alarm.aggregate([
            { $addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } },
            { $lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } },
            { $unwind : "$ANA" },
            { $match : { "CID" : { $in : req.searchCID } } },
            { $project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA'} },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    
    var alarmlist = [];
    if(alarms.length) {
      for(var i = 0; i < alarms.length; i ++) {
        alarmlist[i] = alarms[i];
      }
    }
    
    return res.send({ result: true, pagelist : alarmlist });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  Notice                                    //
//----------------------------------------------------------------------------//

// 공지사항
router.get('/notice_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  const noticethree = await Notice.find().limit(3);
  res.render('notice_list',{company: req.decoded.company, aclist, noticethree});
  
});

router.post('/ajax/notice_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  
  if(search != "") {
    if(search == "CA") {
      var searchtext2 = searchdate.split("~");
      var notices = await Notice.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
      if(notices.length == 0) 
      res.send({ result : "nothing" });
    }
    else {
      if(!searchdate) {
        try {
          if(search == "TI") {
            var notices = await Notice.find({ "CID": CID, "TI" : {$regex:searchtext} });
            if(notices.length == 0) 
            res.send({result : "nothing"});
          }
        } catch(e) {
          res.send({ result: false });
        }
      }
      else {
        try {
          if(search == "TI") {
            var notices = await Notice.find({ "CID": CID, "TI" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
            if(notices.length == 0) 
            res.send({result : "nothing"});
          }
        } catch(e) {
          res.send({ result: false });
        }
      }
    }
  }
  else {
    var notices = await Notice.find({ "CID": CID });
    
    if(sort == "TI") {
        notices.sort(function (a,b) {
          var ax = [], bx = [];
          a = JSON.stringify(a.TI);
          b = JSON.stringify(b.TI);
        
          a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
          b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
          
          while(ax.length && bx.length) {
              var an = ax.shift();
              var bn = bx.shift();
              var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
              if(nn) return nn;
          }
      
          return ax.length - bx.length;
        });
    }
    
    else if(sort == "TI2") {
                  notices.sort(function (a,b) {
          var ax = [], bx = [];
          a = JSON.stringify(a.TI);
          b = JSON.stringify(b.TI);
        
          a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
          b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
          
          while(ax.length && bx.length) {
              var an = bx.shift();
              var bn = ax.shift();
              var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
              if(nn) return nn;
          }
      
          return ax.length - bx.length;
        });
    }
    
    else if(sort == "CA") { 
        var notices = await Notice.find({ "CID": CID }).sort({ CA: -1 });
    }
    
    else if(sort == "CA2"){
        var notices = await Notice.find({ "CID": CID }).sort({ CA: 1 });
    }
    else {
      var notices = await Notice.find({ "CID": CID }).sort({ CA: -1 });
    }
  }
  
  var noticelist = [];
  if(notices.length) {
    for(var i = 0; i < notices.length; i ++) {
      noticelist[i] = notices[i];
    }
  }
  res.send({ result: true, pagelist : noticelist });
 
});

// 공지사항 입력
router.get('/notice_write', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  
  res.render('notice_write',{company: req.decoded.company, aclist});
});

// 공지사항 입력 ajax
router.post('/ajax/notice_write', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  
  const title = req.body.title;
  const text = req.body.text;
  
  
  try {
    await Notice.create({ CID : CID, TI : title , CO : text});
    
    res.send({result : true});
  } catch(err) {
    console.error(err);
    res.send({result : false});
  }
});

// 공지사항 팝업
// router.get('/notice_pop', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
//   const CID = req.decoded.CID;
//   const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  
//   const noticeid = req.query.noticeid;
//   const noticeone = await Notice.findOne({_id : noticeid});
//   console.log(noticeone);
  
//   res.render('notice_pop',{company: req.decoded.company, aclist, noticeone, moment});
// });

router.post('/ajax/notice_detail', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  
  const noticeid = req.body.noticeid;
  console.log("노티스"+noticeid);
  
  try {
    
    const noticedetail = await Notice.find({_id : noticeid});
    console.log("디테일"+noticedetail);
    
    res.send({result : true, noticedetail : noticedetail});
  } catch(err) {
    console.error(err);
    res.send({result : false});
  }
});



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
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  
  res.render('ozone_spread', { company: req.decoded.company, aclist });
});

//----------------------------------------------------------------------------//
//                                  Agent Manager                             //
//----------------------------------------------------------------------------//

router.get('/agent_manager', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });

  res.render('agent_manager', { company: req.decoded.company, aclist });
});

router.get('/agent_list', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });

  res.render('agent_list', { company: req.decoded.company, aclist });
});

router.post('/ajax/agent_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  var {data} = req.body;
  data = JSON.parse(data);
  const companyone = await Company.findOne({_id : data.CID});
  var al = companyone.AL; 
  res.send({al : al});
});

router.post('/ajax/agent', isNotLoggedIn, DataSet, async(req, res, next) => {
  var {data} = req.body;
  data = JSON.parse(data);
  var ANA = data.ANA;
  var ANU = data.ANU;
  var CID = data.CID;
  var type = data.type;
  
  var b_ANA = String(data.b_ANA);
  var b_ANU = String(data.b_ANU);
  
  
  var jsondata = {};
  var anaarray = [];
  var anuarray = [];
  
  try {
  
    const companyone = await Company.findOne({_id : CID});
      var al = companyone.AL;
      
      
      for (var i = 0; i < al.length; i ++) {
        anaarray.push(String(Object.keys(al[i])));
        anuarray.push(String(Object.values(al[i])));
      }
    
    if (type == 'join') {
      
      if(anaarray.includes(ANA)) {
        res.send({type : "agent", result : "dupleN"});
      }
      else if (anuarray.includes(ANU)) {
        res.send({type : "agent", result : "dupleC"});
      }
      else {
        jsondata[ANA] = ANU;
        al.push(jsondata);
        await Company.where({_id : CID}).updateOne({AL : al});
        res.send({type : "agent", result : "success"});
      }
    }
    else if (type =='edit') {
      
      if(anaarray.includes(ANA)) {
        if((ANA == b_ANA)) {
          if(anuarray.includes(ANU)) {
            if((ANU == b_ANU)) {
              res.send({type : "agent", result : "successedit"});
            }
            else {
              res.send({type : "agent", result : "dupleC"});
            }
          }
          else {
            for (var i =0; i < al.length; i ++) {
              if(Object.keys(al[i]).includes(ANA)) {
                al[i][ANA] = ANU;
              }
            }
            await Company.where({_id : CID}).updateOne({AL : al});
            const companyone = await Company.findOne({_id : CID});
            const agentone = await Company.findOne({ CNU : companyone.CNU.substring(0,10) + b_ANU});
            if(agentone)
            await Company.update({ CNU : companyone.CNU.substring(0,10) + b_ANU}, { AL : al, CNU : companyone.CNU.substring(0,10) + ANU, ANA : ANA, ANU : ANU });
            res.send({type : "agent", result : "successedit"});
          }
          
        }
        else {
          res.send({type : "agent", result : "dupleN"});
        }
        
      }
      else {
        if (anuarray.includes(ANU)) {
          if (ANU == b_ANU) {
            for (var i =0; i < al.length; i ++) {
              if(Object.values(al[i]).includes(ANU)) {
                al.splice(i,1);
                jsondata[ANA] = ANU;
                al.push(jsondata); 
                
                await Company.where({_id : CID}).updateOne({AL : al});
                const companyone = await Company.findOne({_id : CID});
                const agentone = await Company.findOne({ CNU : companyone.CNU.substring(0,10) + b_ANU});
                if(agentone)
                await Company.update({ CNU : companyone.CNU.substring(0,10) + b_ANU}, { AL : al, CNU : companyone.CNU.substring(0,10) + ANU, ANA : ANA, ANU : ANU });
                
                res.send({type : "agent", result : "successedit"});
              }
            }
            
          }
          else {
            res.send({type : "agent", result : "dupleC"});
          }
        }
        else {
          for (var i =0; i < al.length; i ++) {
            if(Object.values(al[i])[0] == b_ANU) {
              al.splice(i,1);
              jsondata[ANA] = ANU;
              al.push(jsondata);
              await Company.where({_id : CID}).updateOne({AL : al});
              const companyone = await Company.findOne({_id : CID});
              const agentone = await Company.findOne({ CNU : companyone.CNU.substring(0,10) + b_ANU});
              if(agentone)
              await Company.update({ CNU : companyone.CNU.substring(0,10) + b_ANU}, { AL : al, CNU : companyone.CNU.substring(0,10) + ANU, ANA : ANA, ANU : ANU });
              
              res.send({type : "agent", result : "successedit"});
  
            }
          }
        }
      }
    }
    else if (type =='delete') {
      for (var i =0; i < al.length; i ++) {
        if(Object.keys(al[i]).includes(b_ANA)) {
          al.splice(i,1);
        }
      }
      
      await Company.where({_id : CID}).updateOne({AL : al});
      
      res.send({type : "agent", result : "successdelete"});
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
});
  



router.get('/gstest', isNotLoggedIn, DataSet, agentDevide, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": req.searchCID, "AC": false });
  
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




  
module.exports = router;