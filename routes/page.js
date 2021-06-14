const express = require('express');
require('dotenv').config();
//schema
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
const History = require('../schemas/history');
const Order = require('../schemas/order');
const OrderDetail = require('../schemas/order_detail');
const Publish = require('../schemas/publish');
const Point = require('../schemas/point');
const Alarm = require('../schemas/alarm_complete');
const Notice = require('../schemas/notice');
const Goods = require('../schemas/goods');

const moment = require('moment');
const qrcode = require('qrcode');
const session = require('express-session');
//Router or MiddleWare
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, DataSet } = require('./middleware');
const { pagination, timeset } = require('./modulebox');
const axios = require('axios');
var request = require('request');
const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;



//메세지 조회 사용
const { msg } = require('solapi'); 

let running = false;
global.running = running;

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
  console.log(locals.inputYn);
  
  res.render('address_pop', {juso, locals});
});

// 회원가입
router.get('/register', isLoggedIn, async(req, res, next) => {
  res.render('register');
});

//회원정보 수정
router.get('/profile', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

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
router.get('/setting', isNotLoggedIn, DataSet, async (req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  
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
router.get('/main', isNotLoggedIn, DataSet, async(req, res, next) => {


  const CID = req.decoded.CID;

  const HOME = process.env.IP;

  const aclist = await Worker.find({ "CID": CID, "AC": false });
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
router.get('/company_list', isNotLoggedIn, DataSet, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  const DEVICE = req.query.DEVICE;
  const CAR = req.query.CAR;
  const WORKER = req.query.WORKER;
  const HISTORY = req.query.HISTORY;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  if (DEVICE) {
    const companyone = await Company.findOne({ "_id": DEVICE });
    
    const devices = await Device.find({ "CID": DEVICE });

    res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, devices });
  }
  else if (CAR) {
    const companyone = await Company.findOne({ "_id": CAR });
    
    const cars = await Car.find({ "CID": CAR });

    res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, cars });
  }
  else if (WORKER) {
    const companyone = await Company.findOne({ "_id": WORKER });

    const workers = await Worker.find({ "CID": WORKER });

    res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, workers });
  }
  else if (HISTORY) {
    const companyone = await Company.findOne({ "_id": HISTORY });
    
    const historys = await History.find({ "CID": HISTORY });

    res.render('company_list', { company: req.decoded.company, companyone, aclist, noticethree, historys });
  }
  else {
    const companys = await Company.find({ "AH": false });

    res.render('company_list', { company: req.decoded.company, companys, aclist, noticethree });
  }
});

router.post('/ajax/company_list', isNotLoggedIn, DataSet, async(req, res, nex) => {
  const CID = req.body.CID;
  const companylist = await Company.find({});
  res.send({ result: true, pagelist : companylist, totalnum : companylist.length});
  
});

//----------------------------------------------------------------------------//
//                                  통계                                      //
//----------------------------------------------------------------------------//

//제품 통계
router.get('/device_static', isNotLoggedIn, DataSet, async(req, res, nex) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  const AllCompany = await Company.countDocuments({});
  const AllHistory = await History.countDocuments({});
  const AllCar = await Car.countDocuments({});
  const AllDevice = await Device.countDocuments({});

  // const companys = await Company.find({"AH" : {$ne: "true"}});
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
router.get('/history_static', isNotLoggedIn, DataSet, async(req, res, nex) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

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
router.get('/device_join', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  res.render('device_join', { company: req.decoded.company, aclist, noticethree, });
});

//장비 목록
router.get('/device_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const NN = req.query.NN;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
   

  try {
    const devices = await Device.find({ "CID": CID });
    const todayStart = moment().format('YYYY-MM-DD');
    const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');
    const deviceTodayCount = await Device.countDocuments({ "CID" : CID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const deviceCount = devices.length;

    res.render('device_list', { company: req.decoded.company, aclist, devices, deviceTodayCount, deviceCount, noticethree });
  }
  catch (err) {
    console.error(err);
    next(err);
  }


});

router.post('/ajax/device_list', isNotLoggedIn, DataSet, async function(req, res, next) {
  const CID = req.body.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var devices = new Object;
  
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
        if(search == "MD") {
          devices = await Device.find({ "CID": CID, "MD" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "VER") {
          devices = await Device.find({ "CID": CID, "VER" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "MAC") {
          devices = await Device.find({ "CID": CID, "MAC" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "NN") {
          devices = await Device.find({ "CID": CID, "NN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          devices = await Device.find({ "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
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
        if (search =="MD") {
          devices = await Device.find({ "CID": CID, "MD" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="VER") {
          devices = await Device.find({ "CID": CID, "VER" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="MAC") {
          devices = await Device.find({ "CID": CID, "MAC" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="NN") {
          devices = await Device.find({ "CID": CID, "NN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(devices.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          devices = await Device.find({ "CID" : CID }).sort({ [sortText]: sortNum });
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
    
    res.send({ result: true, pagelist : devicelist, totalnum : devices.length});
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  자동차                                    //
//----------------------------------------------------------------------------//

//차량 등록
router.get('/car_join', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  res.render('car_join', { company: req.decoded.company, aclist, noticethree });
});

//차량 목록
router.get('/car_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  const cars = await Car.find({ "CID" : CID });
  const todayStart = moment().format('YYYY-MM-DD');
  const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');
  const carTodayCount = await Alarm.countDocuments({ "CID" : CID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
  const carCount = cars.length;
  
  res.render('car_list', { company: req.decoded.company, aclist, noticethree, carTodayCount, carCount });
});

router.post('/ajax/car_list', isNotLoggedIn, DataSet, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var cars = new Object;
  
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
      cars = await Car.find({ "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
      if(cars.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "CN") {
          cars = await Car.find({ "CID": CID, "CN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "CPN") {
          cars = await Car.find({ "CID": CID, "CPN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      cars = await Car.find({ "CID" : CID }).sort({ [sortText]: sortNum });
      if(cars.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="CN") {
          cars = await Car.find({ "CID": CID, "CN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="CPN") {
          cars = await Car.find({ "CID": CID, "CPN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(cars.length == 0) {
            return res.send({ result : "nothing"});
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
    
    res.send({ result: true, pagelist : carlist, totalnum : cars.length });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  작업자                                    //
//----------------------------------------------------------------------------//

//작업자 목록
router.get('/worker_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID" : CID, "AC": false });
  const WN = req.query.WN;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});
  const todayStart = moment().format('YYYY-MM-DD');
  const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');
  
  if(CID == "5fd6c731a26c914fbad53ebe") {
    const workers = await Worker.find({});
    const workerTodayCount = await Worker.countDocuments({ "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const workerCount = workers.length;
  
    res.render('worker_list', { company: req.decoded.company, aclist, noticethree, workers, workerTodayCount, workerCount });
  }
  else {
    const workers = await Worker.find({ "CID" : CID });
    const workerTodayCount = await Worker.countDocuments({ "CID" : CID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const workerCount = workers.length;
  
    res.render('worker_list', { company: req.decoded.company, aclist, noticethree, workers, workerTodayCount, workerCount });
  }
});

router.post('/ajax/worker_list', isNotLoggedIn, DataSet, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var workers = new Object;
  
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
            workers = await Worker.find({ "CID": CID, "WN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if(search == "PN") {
            workers = await Worker.find({ "CID": CID, "PN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if(search == "EM") {
            workers = await Worker.find({ "CID": CID, "EM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else {
            workers = await Worker.find({ "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
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
            workers = await Worker.find({ "CID": CID, "WN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if (search =="PN") {
            workers = await Worker.find({ "CID": CID, "PN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else if (search =="EM") {
            workers = await Worker.find({ "CID": CID, "EM" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
            if(workers.length == 0) {
              return res.send({ result : "nothing"});
            }
          }
          else {
            workers = await Worker.find({ "CID" : CID }).sort({ [sortText]: sortNum });
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
    
    res.send({ result: true, pagelist : workerlist, totalnum : workers.length});
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//작업자 인증 ajax
router.post('/ajax/post', isNotLoggedIn, DataSet, async function(req, res) {

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
router.get('/history_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const cars = await Car.find({ "CID": CID });
    const devices = await Device.find({ "CID": CID });
    const CN = req.query.CN;
    const MD = req.query.MD;
    const historys = await History.find({ "CID": CID });
    const todayStart = moment().format('YYYY-MM-DD');
    const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');
    const historyTodayCount = await History.countDocuments({ "CID" : CID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const historyCount = historys.length;

    res.render('history_list', { company: req.decoded.company, aclist, noticethree, cars, devices, historys, historyTodayCount, historyCount });
    
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/history_list', isNotLoggedIn, DataSet, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var historys = new Object;
  
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
        if(search == "CNM") {
          historys = await History.aggregate([
            { $match : { "CID" : CID, "CNM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "DNM") {
          historys = await History.aggregate([
            { $match : { "CID" : CID, "DNM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "WNM") {
          historys = await History.aggregate([
            { $match : { "CID" : CID, "WNM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          historys = await History.aggregate([
            { $match : { "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
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
        if (search =="CNM") {
          historys = await History.aggregate([
            { $match : { "CID" : CID, "CNM" : {$regex:searchtext} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="DNM") {
          historys = await History.aggregate([
            { $match : { "CID" : CID, "DNM" : {$regex:searchtext} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="WNM") {
          historys = await History.aggregate([
            { $match : { "CID" : CID, "WNM" : {$regex:searchtext} } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
            { $sort : { [sortText]: sortNum } }
          ]);
          if(historys.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          historys = await History.aggregate([
            { $match : { "CID" : CID } },
            { $project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM" } },
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
    
    console.log(historylist);
    
    res.send({ result: true, pagelist : historylist, totalnum : historys.length});
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//소독 그래프
router.get('/history_chart/:_id', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
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
})

//----------------------------------------------------------------------------//
//                                  pay                                       //
//----------------------------------------------------------------------------//

//포인트 결제
router.get('/shop', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const imp_code = process.env.imp_code;
  const HOME = process.env.IP;

  const aclist = await Worker.find({ "CID": CID, "AC": false });
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
router.get('/pay_confirm', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
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
router.get('/pay_list', isNotLoggedIn, DataSet, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const GN = req.query.GN;
  const IP = process.env.IP;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const orders = await Order.find({ "CID": CID });
    const todayStart = moment().format('YYYY-MM-DD');
    const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');
    const orderTodayCount = await Order.countDocuments({ "CID" : CID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const orderCount = orders.length;
    
    res.render('pay_list', { company: req.decoded.company, aclist, noticethree, IP, orders, orderTodayCount, orderCount });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/pay_list', isNotLoggedIn, DataSet, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var orders = new Object;
  
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
        if(search == "MID") {
          orders = await Order.find({ "CID": CID, "MID" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "GN") {
          orders = await Order.find({ "CID": CID, "GN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          orders = await Order.find({ "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
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
        if (search =="MID") {
          orders = await Order.find({ "CID": CID, "MID" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="GN") {
          orders = await Order.find({ "CID": CID, "GN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(orders.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          orders = await Order.find({ "CID" : CID }).sort({ [sortText]: sortNum });
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
    
    res.send({ result: true, pagelist : orderlist, totalnum : orders.length});
    
  } catch(err) {
    console.error(err);
    next(err);
  }
  // if (search!="") {
  //   if(search == "CA") {
  //         var searchtext2 = searchdate.split("~");
  //         var orders = await Order.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
  //         if(orders.length == 0) 
  //         res.send({result : "nothing"});
  //   }
  //   else {
  //     if(!searchdate) {
  //       try{
  //         if (search =="MID") {
  //           var orders = await Order.find({ "CID": CID, "MID" : {$regex:searchtext} });
  //           if(orders.length == 0) 
  //           res.send({result : "nothing"});
  //         }
  //         else if (search =="GN") {
  //           var orders = await Order.find({ "CID": CID, "GN" : {$regex:searchtext} });
  //           if(orders.length == 0) 
  //           res.send({result : "nothing"});
  //         }
  //         else if (search =="AM") {
  //           searchtext = parseInt(searchtext)
  //           var orders = await Order.find({ "CID": CID, "AM" : searchtext });
  //           if(orders.length == 0) 
  //           res.send({result : "nothing"});
  //         }
          
  //       }catch(e) {
  //         res.send({ result: false });
  //       }
  //     }
  //     else {
  //       if (search =="MID") {
  //         var searchtext2 = searchdate.split("~");
  //           var orders = await Order.find({ "CID": CID, "MID" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
  //           if(orders.length == 0) 
  //           res.send({result : "nothing"});
  //         }
  //         else if (search =="GN") {
  //           var searchtext2 = searchdate.split("~");
  //           var orders = await Order.find({ "CID": CID, "GN" : {$regex:searchtext} , "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"}});
  //           if(orders.length == 0) 
  //           res.send({result : "nothing"});
  //         }
  //         else if (search =="AM") {
  //           var searchtext2 = searchdate.split("~");
  //           searchtext = parseInt(searchtext)
  //           var orders = await Order.find({ "CID": CID, "AM" : searchtext, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
  //           if(orders.length == 0) 
  //           res.send({result : "nothing"});
  //         }
  //     }
      
  //   }
  // }
  
  // else {
  //     var orders = await Order.find({ "CID": CID });
    
  //     if(sort == "MID") {
  //         orders.sort(function (a,b) {
            
  //           if(typeof(a.MID) == "object")
  //           a.MID = JSON.stringify(a.MID);
  //           return (a.MID[0]).charCodeAt(0) < (b.MID[0]).charCodeAt(0) ? -1 : (a.MID[0]).charCodeAt(0) > (b.MID[0]).charCodeAt(0) ? 1 : 0;
  //         })
  //     }
      
  //     else if(sort == "MID2") {
  //         orders.sort(function (a,b) {
  //           if(typeof(a.MID) == "object")
  //           a.MID = JSON.stringify(a.MID);
  //           return (a.MID[0]).charCodeAt(0) > (b.MID[0]).charCodeAt(0) ? -1 : (a.MID[0]).charCodeAt(0) < (b.MID[0]).charCodeAt(0) ? 1 : 0;
  //         })
  //     }
      
  //     else if(sort == "CA") { 
  //         var orders = await Order.find({ "CID": CID }).sort({ CA: -1 });
  //     }
      
  //     else if(sort == "CA2"){
  //         var orders = await Order.find({ "CID": CID }).sort({ CA: 1 });
  //     }
  //     else if(sort == "GN") {
  //         orders.sort(function (a,b) {
            
  //           if(typeof(a.GN) == "object")
  //           a.GN = JSON.stringify(a.GN);
  //           return (a.GN[0]).charCodeAt(0) < (b.GN[0]).charCodeAt(0) ? -1 : (a.GN[0]).charCodeAt(0) > (b.GN[0]).charCodeAt(0) ? 1 : 0;
  //         })
  //     }
      
  //     else if(sort == "GN2") {
  //         orders.sort(function (a,b) {
  //           if(typeof(a.GN) == "object")
  //           a.GN = JSON.stringify(a.GN);
  //           return (a.GN[0]).charCodeAt(0) > (b.GN[0]).charCodeAt(0) ? -1 : (a.GN[0]).charCodeAt(0) < (b.GN[0]).charCodeAt(0) ? 1 : 0;
  //         })
  //     }
  //     else if(sort == "AM") {
  //         orders.sort(function (a,b) {
  //           return a.AM < b.AM ? -1 : a.AM > b.AM ? 1 : 0;
  //         })
  //     }
      
  //     else if(sort == "AM2") {
  //         orders.sort(function (a,b) {
  //           return a.AM > b.AM ? -1 : a.AM < b.AM ? 1 : 0;
  //         })
  //     }
  //     else {
  //       var orders = await Order.find({ "CID": CID }).sort({ CA: -1 });
        
  //     }
  // }
});

router.post('/ajax/pay_list_detail', isNotLoggedIn, DataSet, async(req, res, next) => {
  const { merchant_uid } = req.body;

  const orderGoods = await OrderDetail.find({ "OID" : merchant_uid });
  
  res.send({ status : "success", orderGoods : orderGoods });
});

// 영수증
router.get('/receipt', isNotLoggedIn, DataSet, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
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
    headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
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
router.get('/point_list', isNotLoggedIn, DataSet, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const GN = req.query.GN;
  const IP = process.env.IP;
  const noticethree = await Notice.find().limit(3).sort({CA : -1});

  try {
    const points = await Point.find({ "CID": CID });
    const todayStart = moment().format('YYYY-MM-DD');
    const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');
    const pointTodayCount = await Point.countDocuments({ "CID" : CID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const pointCount = points.length;

    res.render('point_list', { company: req.decoded.company, aclist, noticethree, IP, points, pointTodayCount, pointCount });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/point_list', isNotLoggedIn, DataSet, async function(req, res, next) {
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
        if(search == "PN") {
          points = await Point.find({ "CID": CID, "PN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "PO") {
          points = await Point.find({ "CID": CID, "PO" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          points = await Point.find({ "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
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
        if (search =="PN") {
          points = await Point.find({ "CID": CID, "PN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="PO") {
          points = await Point.find({ "CID": CID, "PO" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(points.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          points = await Point.find({ "CID" : CID }).sort({ [sortText]: sortNum });
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
    
    res.send({ result: true, pagelist : pointlist, totalnum : points.length});
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                   QR                                       //
//----------------------------------------------------------------------------//

//QR코드 관리
router.get('/publish_manage', isNotLoggedIn, DataSet, async(req, res, next) => {
  
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
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
router.get('/create', isNotLoggedIn, DataSet, async (req, res, next) => {
  
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  
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
  }
  
  fn(params)





});

// 알림톡 리스트
router.get('/alarmtalk_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
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
    const alarms = await Alarm.find({ "CID": CID });
    const todayStart = moment().format('YYYY-MM-DD');
    const todayEnd = moment(todayStart).add(1,'days').format('YYYY-MM-DD');
    const alarmTodayCount = await Alarm.countDocuments({ "CID" : CID, "CA" : { "$gte": todayStart, "$lt" : todayEnd } });
    const alarmCount = alarms.length;
    res.render('alarmtalk_list', { company: req.decoded.company, aclist, noticethree, alarms, alarmCount, alarmTodayCount });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/alarmtalk_list', isNotLoggedIn, DataSet, async function(req, res, next) {
  const CID = req.body.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var alarms = new Object;
  
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
        if(search == "WNM") {
          alarms = await Alarm.find({ "CID": CID, "WNM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "RE") {
          alarms = await Alarm.find({ "CID": CID, "RE" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          alarms = await Alarm.find({ "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
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
        if (search =="WNM") {
          alarms = await Alarm.find({ "CID": CID, "WNM" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="RE") {
          alarms = await Alarm.find({ "CID": CID, "RE" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else {
          alarms = await Alarm.find({ "CID" : CID }).sort({ [sortText]: sortNum });
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
    
    return res.send({ result: true, pagelist : alarmlist, totalnum : alarms.length});
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  Notice                                    //
//----------------------------------------------------------------------------//

// 공지사항
router.get('/notice_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const noticethree = await Notice.find().limit(3);
  res.render('notice_list',{company: req.decoded.company, aclist, noticethree});
  
});

router.post('/ajax/notice_list', isNotLoggedIn, DataSet, async function(req, res) {
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
  
  // if ((search!="") && (searchtext!="")) {
  //   try{
  //     if (search =="TI") {
  //       var notices = await Notice.find({ "CID": CID, "TI" : {$regex:searchtext} });
  //       if(notices.length == 0) 
  //       res.send({result : "nothing"});
  //     }
  //     else if (search =="CA") {
  //       var searchtext2 = searchtext.split("~")
  //       var notices = await Notice.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
  //       if(notices.length == 0) 
  //       res.send({result : "nothing"});
  //     }
  //     else {
  //       var notices = await Notice.find({ "CID": CID }).sort({ CA: -1 });
  //     }
  //   }catch(e) {
  //     res.send({ result: false});
  //   }
    
  // }
  
  // else {
  //     var notices = await Notice.find({ "CID": CID });
    
  //     if(sort == "TI") {
  //         notices.sort(function (a,b) {
  //           var ax = [], bx = [];
  //           a = JSON.stringify(a.TI);
  //           b = JSON.stringify(b.TI);
          
  //           a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
  //           b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
            
  //           while(ax.length && bx.length) {
  //               var an = ax.shift();
  //               var bn = bx.shift();
  //               var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
  //               if(nn) return nn;
  //           }
        
  //           return ax.length - bx.length;
  //         });
  //     }
      
  //     else if(sort == "TI2") {
  //                   notices.sort(function (a,b) {
  //           var ax = [], bx = [];
  //           a = JSON.stringify(a.TI);
  //           b = JSON.stringify(b.TI);
          
  //           a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
  //           b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
            
  //           while(ax.length && bx.length) {
  //               var an = bx.shift();
  //               var bn = ax.shift();
  //               var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
  //               if(nn) return nn;
  //           }
        
  //           return ax.length - bx.length;
  //         });
  //     }
      
  //     else if(sort == "CA") { 
  //         var notices = await Notice.find({ "CID": CID }).sort({ CA: -1 });
  //     }
      
  //     else if(sort == "CA2"){
  //         var notices = await Notice.find({ "CID": CID }).sort({ CA: 1 });
  //     }
  //     else {
  //       var notices = await Notice.find({ "CID": CID }).sort({ CA: -1 });
  //     }
  // }
  
  var noticelist = [];
  if(notices.length) {
    for(var i = 0; i < notices.length; i ++) {
      noticelist[i] = notices[i];
    }
  }
  res.send({ result: true, pagelist : noticelist, totalnum : notices.length});
 
});

// 공지사항 입력
router.get('/notice_write', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  
  res.render('notice_write',{company: req.decoded.company, aclist})
});

// 공지사항 입력 ajax
router.post('/ajax/notice_write', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  
  const title = req.body.title;
  const text = req.body.text;
  
  
  try {
    
    const notice = await Notice.create({ CID : CID, TI : title , CO : text});
    
    
    res.send({result : true})
  }catch(e) {
    console.log(e)
    res.send({result : false})
  }
});

// 공지사항 팝업
router.get('/notice_pop', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  
  const noticeid = req.query.noticeid
  const noticeone = await Notice.find({_id : noticeid})
  
  res.render('notice_pop',{company: req.decoded.company, aclist, noticeone, moment});
  
  
});

router.post('/ajax/notice_detail', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  
  const noticeid = req.body.noticeid;
  
  
  try {
    
    const noticedetail = await Notice.find({_id : noticeid});
    
    res.send({result : true, noticedetail : noticedetail})
  }catch(e) {
    console.log(e)
    res.send({result : false})
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
router.get('/ozone_spread', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  res.render('ozone_spread', { company: req.decoded.company, aclist });
});

// var {graphqlHTTP} = require('express-graphql');

// const schema = require('../graphql/schema');
// const rootValue = require("../graphql/resolvers")

// router.get('/graphql', graphqlHTTP({
//   schema, rootValue, graphiql: true,
// }), DataSet, async(req, res, next) => {
  
// });


router.get('/gstest', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  const mac = "84:CC:A8:12:FF:2E"
  
  const deviceone = await Device.find({MAC : mac});
  
  console.log(deviceone[0]._id);
  
  res.render('company_list', { company: req.decoded.company, aclist });
  
  
})


  
module.exports = router;