const express = require('express');
require('dotenv').config();
//schema
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
const History = require('../schemas/history');
const Order = require('../schemas/order');
const Service = require('../schemas/service');
const Publish = require('../schemas/publish');
const Point = require('../schemas/point');
const Alarm = require('../schemas/alarm_complete')

const moment = require('moment');
const qrcode = require('qrcode');
const session = require('express-session');
//Router or MiddleWare
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, DataSet } = require('./middleware');
const { pagination, timeset } = require('./modulebox');
const axios = require('axios');
var request = require('request');

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
  res.render('login', { title: 'OASIS Admin | Login' });
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
  res.render('register', { title: 'OASIS Admin | Sign Up'});
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
  
  var psum = 0;
  for(var i = 0; i < publishs.length; i++) {
    var pcount = publishs[i].PUN;
    console.log("카운트"+pcount);
    
    psum += pcount;
  }


  var history_count2 = [0,0,0,0,0,0,0];
  const Days = 24 * 60 * 60 * 1000;
  
  const history_date = await History.find({ "CID": req.decoded.CID, "CA": { $lte: Date.now(), $gte: (Date.now() - Days * 7) } },{_id:0,CA:1});
console.log(history_date);
    for (var i =  0; i < 7 ; i ++) {
        console.log(history_date[i]);
        for(var j = await 0; j < history_date.length; j ++) {
          if((history_date[j].CA <=  (Date.now() - (Days * i))) && (history_date[j].CA >=  (Date.now() - Days * (i + 1)))) {
            history_count2[i] += await 1;
          }
        } 
      }
      
//   const history_date2 = await History.aggregate([
//   {
//     $match : {
//       CID : req.decoded.CID
//     }
//   },
//    {
//       $group : {
//         _id : {month: { $month: "$CA" },day : {$dayOfMonth : "$CA"}},
//         count : { $sum: 1},
//       },
//    },
//    {
//      $sort : { _id : -1}
//    },
//       {
//      $project : {
//        _id : 0
//      }
//    }

// ],function(rr,ra){
//    if(ra){
//       console.log(ra);   
//    } 
// });

  const history_count = await history_count2;
  console.log(history_count);
  
  const history_array = await (historys.reverse())[0]
  if (history_array) {
    const recent_history = history_array.PD;
    res.render('main', { company: req.decoded.company, aclist, devices, cars, workers, historys, recent_history, history_array, history_count, HOME, psum });
  }
  else {
    res.render('main', { company: req.decoded.company, aclist, devices, cars, workers, historys, history_array, history_count, HOME, psum });
  }

});

//----------------------------------------------------------------------------//
//                                  사업자                                    //
//----------------------------------------------------------------------------//

//사업자 목록
router.get('/company_list', isNotLoggedIn, DataSet, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  var totalNum = 0;

  let page = req.query.page;

  const DEVICE = req.query.DEVICE;
  const CAR = req.query.CAR;
  const WORKER = req.query.WORKER;
  const HISTORY = req.query.HISTORY;

  console.log("DEVICE : " + DEVICE);
  console.log("CAR : " + CAR);
  console.log("WORKER : " + WORKER);
  console.log("HISTORY : " + HISTORY);

  if (DEVICE) {
    const companyone = await Company.findOne({ "_id": DEVICE });

    totalNum = await Device.countDocuments({ "CID": DEVICE });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const devices = await Device.find({ "CID": DEVICE }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, devices, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (CAR) {
    const companyone = await Company.findOne({ "_id": CAR });

    totalNum = await Car.countDocuments({ "CID": CAR });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const cars = await Car.find({ "CID": CAR }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, cars, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (WORKER) {
    const companyone = await Company.findOne({ "_id": WORKER });

     totalNum = await Worker.countDocuments({ "CID": WORKER });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const workers = await Worker.find({ "CID": WORKER }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (HISTORY) {
    const companyone = await Company.findOne({ "_id": HISTORY });

    totalNum = await History.countDocuments({ "CID": HISTORY });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const historys = await History.find({ "CID": HISTORY }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, historys, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else {
    totalNum = await Company.countDocuments({ "AH": false });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const companys = await Company.find({ "AH": false }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companys, aclist, totalNum, currentPage, totalPage, startPage, endPage });
  }
})

//----------------------------------------------------------------------------//
//                                  통계                                      //
//----------------------------------------------------------------------------//

//제품 통계
router.get('/device_static', isNotLoggedIn, DataSet, async(req, res, nex) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

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
  console.log(companycount[0]);

  res.render('device_static', { company: req.decoded.company, companycount, aclist, AllDevice, AllCar, AllHistory, AllCompany });
})

//소독 통계
router.get('/history_static', isNotLoggedIn, DataSet, async(req, res, nex) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  const AllCompany = await Company.countDocuments({});
  const AllHistory = await History.countDocuments({});
  const AllCar = await Car.countDocuments({});
  const AllDevice = await Device.countDocuments({});
  res.render('history_static', { company: req.decoded.company, aclist, AllDevice, AllCar, AllHistory, AllCompany });
})

//----------------------------------------------------------------------------//
//                                  장비                                      //
//----------------------------------------------------------------------------//

//장비 등록
router.get('/device_join', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  res.render('device_join', { company: req.decoded.company, aclist });
});

//장비 수정
router.get('/device_edit/:MAC', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });


  try {
    const deviceone = await Device.findOne({ MAC: req.params.MAC });
    res.render('device_edit', { company: req.decoded.company, aclist, deviceone });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//장비 목록
router.get('/device_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const NN = req.query.NN;
  let page = req.query.page;

  if (NN) {
    const totalNum = await Device.countDocuments({ "NN": NN });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const devices = await Device.find({ "NN": NN }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('device_list', { company: req.decoded.company, aclist, devices, totalNum, currentPage, totalPage, startPage, endPage, NN });

  }
  else {

    try {
      const totalNum = await Device.countDocuments({ "CID": CID });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const devices = await Device.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

      res.render('device_list', { company: req.decoded.company, aclist, devices, totalNum, currentPage, totalPage, startPage, endPage });
    }
    catch (err) {
      console.error(err);
      next(err);
    }

  }


});

router.post('/ajax/device_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
  console.log(searchtext);
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="MD") {
        var devices = await Device.find({ "CID": CID, "MD" : {$regex:searchtext} });
        if(devices.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="DNM") {
        var devices = await Device.find({ "CID": CID, "DNM" : {$regex:searchtext} });
        if(devices.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="VER") {
        searchtext = parseInt(searchtext)
        var devices = await Device.find({ "CID": CID, "VER" : searchtext });
      }
      else if (search =="MAC") {
        var devices = await Device.find({ "CID": CID, "MAC" : {$regex:searchtext} });
        if(devices.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="NN") {
        var devices = await Device.find({ "CID": CID, "NN" : {$regex:searchtext} });
        if(devices.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="UN") {
        searchtext = parseInt(searchtext);
        var devices = await Device.find({ "CID": CID, "UN" : searchtext });
        if(devices.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        console.log(typeof(searchtext))
        var devices = await Device.find({ "CID": CID, "CA" : {$regex:searchtext}})
        console.log(devices +"@@@")
      }
    }catch(e) {
      res.json({ result: false});
    }
    
  }
  
  else {
    
      var devices = await Device.find({ "CID": CID });
    
      if(sort == "MD") {
          devices.sort(function (a,b) {
            if(typeof(a.MD) == "object")
            a.MD = JSON.stringify(a.MD);
            return (a.MD[0]).charCodeAt(0) < (b.MD[0]).charCodeAt(0) ? -1 : (a.MD[0]).charCodeAt(0) > (b.MD[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "MD2") {
          devices.sort(function (a,b) {
            if(typeof(a.MD) == "object")
            a.MD = JSON.stringify(a.MD);
            return (a.MD[0]).charCodeAt(0) > (b.MD[0]).charCodeAt(0) ? -1 : (a.MD[0]).charCodeAt(0) < (b.MD[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "VER") {  // 버전은 숫자인데 스키마에서 string이라 첫글자만 비교함 그래서 바꿔야됨
          devices.sort(function (a,b) {
            var anum = parseInt(a.VER);
            var bnum = parseInt(b.VER);
            return anum < bnum ? -1 : anum > bnum ? 1 : 0;
          })
      }
      
      else if(sort == "VER2")
          devices.sort(function (a,b) {
            var anum = parseInt(a.VER);
            var bnum = parseInt(b.VER);
            return anum > bnum ? -1 : anum < bnum ? 1 : 0;
          })
        
      else if(sort == "MAC")
        var devices = await Device.find({ "CID": CID }).sort({ MAC: -1 });
        
      else if(sort == "MAC2")
        var devices = await Device.find({ "CID": CID }).sort({ MAC: 1 });
        
      else if(sort == "NN") {
          devices.sort(function (a,b) {
            if(typeof(a.NN) == "object")
            a.NN = JSON.stringify(a.NN);
            return (a.NN[0]).charCodeAt(0) < (b.NN[0]).charCodeAt(0) ? -1 : (a.NN[0]).charCodeAt(0) > (b.NN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "NN2") {
          devices.sort(function (a,b) {
            if(typeof(a.NN) == "object")
            a.NN = JSON.stringify(a.NN);
            return (a.NN[0]).charCodeAt(0) > (b.NN[0]).charCodeAt(0) ? -1 : (a.NN[0]).charCodeAt(0) < (b.NN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else if(sort == "UN")
        var devices = await Device.find({ "CID": CID }).sort({ UN: 1 });
        
      else if(sort == "UN2")
        var devices = await Device.find({ "CID": CID }).sort({ UN: -1 });
        
      else if(sort == "CA")
        var devices = await Device.find({ "CID": CID }).sort({ CA: -1 });
        
      else if(sort == "CA2")
        var devices = await Device.find({ "CID": CID }).sort({ CA: 1 });
        
      else {
        var devices = await Device.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }
  
  var devicelist = [];
  if(devices.length) {
    for(var i = 0; i < devices.length; i ++) {
      devicelist[i] = devices[i];
    }
  }
  res.json({ result: true, devicelist : devicelist, devicenum : devices.length});
 
});

//----------------------------------------------------------------------------//
//                                  자동차                                    //
//----------------------------------------------------------------------------//

//차량 등록
router.get('/car_join', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  res.render('car_join', { company: req.decoded.company, aclist });
});

//차량 수정
router.get('/car_edit/:CN', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  try {
    const carone = await Car.findOne({ CN: req.params.CN });
    res.render('car_edit', { company: req.decoded.company, aclist, carone });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//차량 목록
router.get('/car_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const CN = req.query.CN;

  let page = req.query.page;

  if (CN) {
    const totalNum = await Car.countDocuments({ "CN": CN });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const cars = await Car.find({ "CN": CN }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
    console.log(cars);

    res.render('car_list', { company: req.decoded.company, aclist, cars, totalNum, currentPage, totalPage, startPage, endPage, CN });

  }
  else {

    try {
      const totalNum = await Car.countDocuments({ "CID": CID });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const cars = await Car.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
      console.log(cars);

      res.render('car_list', { company: req.decoded.company, aclist, cars, totalNum, currentPage, totalPage, startPage, endPage });
    }
    catch (err) {
      console.error(err);
      next(err);
    }
  }
});

router.post('/ajax/car_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
  console.log(searchtext);
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="CN") {
        var cars = await Car.find({ "CID": CID, "CN" : {$regex:searchtext} });
        if(cars.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="CPN") {
        var cars = await Car.find({ "CID": CID, "CPN" : {$regex:searchtext} });
        if(cars.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        console.log(typeof(searchtext));
        var cars = await Car.find({ "CID": CID, "CA" : {$regex:searchtext}});
        console.log(cars +"@@@");
      }
    }catch(e) {
      res.json({ result: false });
    }
    
  }
  
  else {
    
      var cars = await Car.find({ "CID": CID });
    
      if(sort == "CN") {
          cars.sort(function (a,b) {
                var ax = [], bx = [];
                a = JSON.stringify(a.CN);
                b = JSON.stringify(b.CN);
              
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
      else if(sort == "CN2") {
          cars.sort(function (a,b) {
                var ax = [], bx = [];
                a = JSON.stringify(a.CN);
                b = JSON.stringify(b.CN);
              
                a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
                b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
                
                while(ax.length && bx.length) {
                    var an = bx.shift();
                    var bn = ax.shift();
                    var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                    if(nn) return nn;
                }
            
                return ax.length - bx.length;eAt(0) < (b.CN[0]).charCodeAt(0) ? -1 : (a.CN[0]).charCodeAt(0) > (b.CN[0]).charCodeAt(0) ? 1 : 0;
          });
      }
      else if(sort == "CPN") {  // 버전은 숫자인데 스키마에서 string이라 첫글자만 비교함 그래서 바꿔야됨
          cars.sort(function (a,b) {
            var anum = parseInt(a.CPN);
            var bnum = parseInt(b.CPN);
            return anum < bnum ? -1 : anum > bnum ? 1 : 0;
          });
      }
      
      else if(sort == "CPN2") {
          cars.sort(function (a,b) {
            var anum = parseInt(a.CPN);
            var bnum = parseInt(b.CPN);
            return anum > bnum ? -1 : anum < bnum ? 1 : 0;
          });
      }
      else if(sort == "CA") {
      console.log("@@@")
        var cars = await Car.find({ "CID": CID }).sort({ CA: -1 });
      }
        
      else if(sort == "CA2")
        var cars = await Car.find({ "CID": CID }).sort({ CA: 1 });
        
      else {
        var cars = await Car.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }
  
  var carlist = [];
  if(cars.length) {
    for(var i = 0; i < cars.length; i ++) {
      carlist[i] = cars[i];
    }
  }
  res.json({ result: true, carlist : carlist, carnum : cars.length});
 
});

//----------------------------------------------------------------------------//
//                                  작업자                                    //
//----------------------------------------------------------------------------//

//작업자 목록
router.get('/worker_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const WN = req.query.WN;

  let page = req.query.page;
  if (WN) {
      const totalNum = await Worker.countDocuments({ "WN": WN });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const workers = await Worker.find({ "WN": WN, }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

      res.render('worker_list', { company: req.decoded.company, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage, WN });

  }
  else {
    const totalNum = await Worker.countDocuments({ "CID": CID });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const workers = await Worker.find({ CID: CID, }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('worker_list', { company: req.decoded.company, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage });

  }


});

router.post('/ajax/worker_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
  console.log(searchtext);
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="WN") {
        var workers = await Worker.find({ "CID": CID, "CNM" : {$regex:searchtext} });
        if(workers.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="PN") {
        var workers = await Worker.find({ "CID": CID, "DNM" : {$regex:searchtext} });
        if(workers.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="EM") {
        var workers = await Worker.find({ "CID": CID, "WNM" : {$regex:searchtext} });
        if(workers.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        var workers = await Worker.find({ "CID": CID }).sort({ ET: -1 });
      }
    }catch(e) {
      res.json({ result: false});
    }
    
  }
  
  else {
    
      var workers = await Worker.find({ "CID": CID });
    
      if(sort == "WN") {
          workers.sort(function (a,b) {
            
            if(typeof(a.WN) == "object")
            a.WN = JSON.stringify(a.WN);
            return (a.WN[0]).charCodeAt(0) < (b.WN[0]).charCodeAt(0) ? -1 : (a.WN[0]).charCodeAt(0) > (b.WN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "WN2") {
          workers.sort(function (a,b) {
            if(typeof(a.WN) == "object")
            a.WN = JSON.stringify(a.WN);
            return (a.WN[0]).charCodeAt(0) > (b.WN[0]).charCodeAt(0) ? -1 : (a.WN[0]).charCodeAt(0) < (b.WN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "PN") { 
          workers.sort(function (a,b) {
            if(typeof(a.PN) == "object")
            a.PN = JSON.stringify(a.PN);
            return (a.PN[0]).charCodeAt(0) < (b.PN[0]).charCodeAt(0) ? -1 : (a.PN[0]).charCodeAt(0) > (b.PN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "PN2"){
          workers.sort(function (a,b) {
            if(typeof(a.PN) == "object")
            a.PN = JSON.stringify(a.PN);
            return (a.PN[0]).charCodeAt(0) > (b.PN[0]).charCodeAt(0) ? -1 : (a.PN[0]).charCodeAt(0) < (b.PN[0]).charCodeAt(0) ? 1 : 0;
          })
       }
      else if(sort == "EM") {
          workers.sort(function (a,b) {
            return (a.EM).length < (b.EM).length ? -1 : (a.EM).length > (b.EM).length ? 1 : 0;
          });
          
      }
      else if(sort == "EM2") {
          workers.sort(function (a,b) {
            return (a.EM).length > (b.EM).length ? -1 : (a.EM).length < (b.EM).length ? 1 : 0;
          });
      }
      else {
        var workers = await Worker.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }
  
  var workerlist = [];
  if(workers.length) {
    for(var i = 0; i < workers.length; i ++) {
      workerlist[i] = workers[i];
    }
  }
  res.json({ result: true, workerlist : workerlist, workernum : workers.length});
 
});

//작업자 인증 ajax
router.post('/ajax/post', isNotLoggedIn, DataSet, async function(req, res) {

  var au_true = req.body.au_true;
  var au_false = req.body.au_false;
  var ac_true = req.body.ac_true;
  var ac_false = req.body.ac_false;



  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;

  let workerone;
  
  console.log(au_true)
  console.log(au_false)

  if (au_true) {
    workerone = await Worker.where({ "EM": au_true }).update({ "AU": 1 }).setOptions({ runValidators: true }).exec();
  }
  else if (au_false) {
    workerone = await Worker.where({ "EM": au_false }).update({ "AU": 2 }).setOptions({ runValidators: true }).exec();
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

  try {
    const cars = await Car.find({ "CID": CID });
    const devices = await Device.find({ "CID": CID });
    const CN = req.query.CN;
    const MD = req.query.MD;
    const keyword = req.query.keyword;

    let page = req.query.page;
    
      const totalNum = await History.countDocuments({ "CID": CID });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const historylist = await History.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
      const totalNumlist = [];
      for (var i = 0; i < totalNum.length; i++) {
        totalNumlist[i] = i + 1;
      }

      res.render('history_list', { company: req.decoded.company, aclist, cars, devices, historylist, totalNum, currentPage, totalPage, startPage, endPage, totalNumlist });
    
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/history_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
  console.log(searchtext);
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="CNM") {
        var historys = await History.find({ "CID": CID, "CNM" : {$regex:searchtext} });
        if(historys.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="DNM") {
        var historys = await History.find({ "CID": CID, "DNM" : {$regex:searchtext} });
        if(historys.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="WNM") {
        var historys = await History.find({ "CID": CID, "WNM" : {$regex:searchtext} });
        if(historys.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="ET") {
        var searchtext2 = searchtext.split("~")
        var historys = await History.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
        if(historys.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        var historys = await History.find({ "CID": CID }).sort({ ET: -1 });
      }
    }catch(e) {
      res.json({ result: false});
    }
    
  }
  
  else {
    
      var historys = await History.find({ "CID": CID });
    
      if(sort == "CNM") {
          historys.sort(function (a,b) {
            
            if(typeof(a.CNM) == "object")
            a.CNM = JSON.stringify(a.CNM);
            return (a.CNM[0]).charCodeAt(0) < (b.CNM[0]).charCodeAt(0) ? -1 : (a.CNM[0]).charCodeAt(0) > (b.CNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "CNM2") {
          historys.sort(function (a,b) {
            if(typeof(a.CNM) == "object")
            a.CNM = JSON.stringify(a.CNM);
            return (a.CNM[0]).charCodeAt(0) > (b.CNM[0]).charCodeAt(0) ? -1 : (a.CNM[0]).charCodeAt(0) < (b.CNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "DNM") { 
          historys.sort(function (a,b) {
            if(typeof(a.DNM) == "object")
            a.DNM = JSON.stringify(a.DNM);
            return (a.DNM[0]).charCodeAt(0) < (b.DNM[0]).charCodeAt(0) ? -1 : (a.DNM[0]).charCodeAt(0) > (b.DNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "DNM2"){
          historys.sort(function (a,b) {
            if(typeof(a.DNM) == "object")
            a.DNM = JSON.stringify(a.DNM);
            return (a.DNM[0]).charCodeAt(0) > (b.DNM[0]).charCodeAt(0) ? -1 : (a.DNM[0]).charCodeAt(0) < (b.DNM[0]).charCodeAt(0) ? 1 : 0;
          })
       }
      else if(sort == "ET")
        var historys = await History.find({ "CID": CID }).sort({ ET: -1 });
        
      else if(sort == "ET2")
        var historys = await History.find({ "CID": CID }).sort({ ET: 1 });
        
      else if(sort == "PD") {
          historys.sort(function (a,b) {
            return (a.PD).length < (b.PD).length ? -1 : (a.PD).length > (b.PD).length ? 1 : 0;
          });
          
      }
      else if(sort == "PD2") {
          historys.sort(function (a,b) {
            return (a.PD).length > (b.PD).length ? -1 : (a.PD).length < (b.PD).length ? 1 : 0;
          });
      }
      else if(sort == "WNM") {
          historys.sort(function (a,b) {
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else if(sort == "WNM2") {
          historys.sort(function (a,b) {
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else {
        var historys = await History.find({ "CID": CID }).sort({ ET: -1 });
        
      }
  }
  
  var historylist = [];
  if(historys.length) {
    for(var i = 0; i < historys.length; i ++) {
      historylist[i] = historys[i];
    }
  }
  res.json({ result: true, historylist : historylist, historynum : historys.length});
 
});

//소독 그래프
router.get('/history_chart/:_id', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  try {
    const historyone = await History.findOne({ "_id": req.params._id });
    const history_array = historyone.PD;
    console.log("길이" + history_array.length);
    res.render('history_chart', { company: req.decoded.company, aclist, historyone, history_array });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
})

//----------------------------------------------------------------------------//
//                                  pay                                       //
//----------------------------------------------------------------------------//

//알림톡 결제
router.get('/pay_point', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const imp_code = process.env.imp_code;
  const HOME = process.env.IP;

  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const service = await Service.find({});

  try {
    res.render('pay_point', { company: req.decoded.company, aclist, imp_code, HOME, service });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//알림톡 라디오 버튼 클릭 ajax
router.post('/ajax/check', isNotLoggedIn, DataSet, async(req, res, next) => {
  var SN = req.body.SN;
  if (SN) {
    const serviceone = await Service.findOne({ "SN": SN });
    console.log(serviceone);

    res.json({ result: true, serviceone: serviceone });
  }
  else {
    res.json({ result: true });
  }
});

//알림톡 결제 ajax
router.post('/ajax/payment', isNotLoggedIn, DataSet, async(req, res, next) => {
  var SN = req.body.SN;
  if (SN) {
    const serviceone = await Service.findOne({ "SN": SN });
    console.log(serviceone);

    res.json({ result: true, serviceone: serviceone, check: true });
  }
  else {
    res.json({ result: true, check: false });
  }
});

//결제 완료 내역
router.get('/pay_confirm', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const imp_uid = req.query.imp_uid;
  const imp_code = process.env.imp_code;

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

  const serviceone = await Service.findOne({ "SN": paymentData.name });
  console.log(serviceone);

  try {
    res.render('pay_confirm', { company: req.decoded.company, aclist, imp_code, paymentData, serviceone });
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
  const imp_code = process.env.imp_code;
  let page = req.query.page;
  const GN = req.query.GN;
  const IP = process.env.IP;

  try {
    const order = await Order.find({ "CID": CID });
    if (GN) {
      const orderone = await Order.find({ "GN": GN });
      const totalNum = await Order.countDocuments({ "GN": GN });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const orders = await Order.find({ "GN": GN }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
      res.render('pay_list', { company: req.decoded.company, aclist, totalNum, currentPage, totalPage, startPage, endPage, imp_code, IP, orders, GN });
    }
    else {
      try {
        const totalNum = await Order.countDocuments({ "CID": CID });
        let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
        const orders = await Order.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
        console.log(orders);

        res.render('pay_list', { company: req.decoded.company, aclist, totalNum, currentPage, totalPage, startPage, endPage, IP, orders });
      }
      catch (err) {
        console.error(err);
        next(err);
      }
    }
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/pay_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
  console.log(search)
  console.log(searchtext)
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="MID") {
        var orders = await Order.find({ "CID": CID, "MID" : {$regex:searchtext} });
        if(orders.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="CA") {
        var searchtext2 = searchtext.split("~")
        var orders = await Order.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
        if(orders.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="GN") {
        var orders = await Order.find({ "CID": CID, "GN" : {$regex:searchtext} });
        if(orders.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="AM") {
        searchtext = parseInt(searchtext)
        var orders = await Order.aggregate([
      
        { $match : {"CID" : CID},
          $group : {_id : "$_id.AM"}}
           
        ], function (err,result) {
          if(err) throw err;
        });
        if(orders.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        var orders = await Order.find({ "CID": CID }).sort({ CA: -1 });
      }
    }catch(e) {
      res.json({ result: false});
    }
    
  }
  
  else {
      var orders = await Order.find({ "CID": CID });
    
      if(sort == "MID") {
          orders.sort(function (a,b) {
            
            if(typeof(a.MID) == "object")
            a.MID = JSON.stringify(a.MID);
            return (a.MID[0]).charCodeAt(0) < (b.MID[0]).charCodeAt(0) ? -1 : (a.MID[0]).charCodeAt(0) > (b.MID[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "MID2") {
          orders.sort(function (a,b) {
            if(typeof(a.MID) == "object")
            a.MID = JSON.stringify(a.MID);
            return (a.MID[0]).charCodeAt(0) > (b.MID[0]).charCodeAt(0) ? -1 : (a.MID[0]).charCodeAt(0) < (b.MID[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "CA") { 
          var orders = await Order.find({ "CID": CID }).sort({ CA: -1 });
      }
      
      else if(sort == "CA2"){
          var orders = await Order.find({ "CID": CID }).sort({ CA: 1 });
       }
      else if(sort == "GN") {
          orders.sort(function (a,b) {
            
            if(typeof(a.GN) == "object")
            a.GN = JSON.stringify(a.GN);
            return (a.GN[0]).charCodeAt(0) < (b.GN[0]).charCodeAt(0) ? -1 : (a.GN[0]).charCodeAt(0) > (b.GN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "GN2") {
          orders.sort(function (a,b) {
            if(typeof(a.GN) == "object")
            a.GN = JSON.stringify(a.GN);
            return (a.GN[0]).charCodeAt(0) > (b.GN[0]).charCodeAt(0) ? -1 : (a.GN[0]).charCodeAt(0) < (b.GN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else if(sort == "AM") {
          orders.sort(function (a,b) {
            return a.AM < b.AM ? -1 : a.AM > b.AM ? 1 : 0;
          })
      }
      
      else if(sort == "AM2") {
          orders.sort(function (a,b) {
            return a.AM > b.AM ? -1 : a.AM < b.AM ? 1 : 0;
          })
      }
      else {
        var orders = await Order.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }
  
  var orderlist = [];
  if(orders.length) {
    for(var i = 0; i < orders.length; i ++) {
      orderlist[i] = orders[i];
    }
  }
  res.json({ result: true, orderlist : orderlist, ordernum : orders.length});
 
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

  console.log(paymentData);


  const orderone = await Order.find({ "IID": imp_uid });

  res.render('receipt', { company: req.decoded.company, aclist, paymentData, orderone, moment });

})


//----------------------------------------------------------------------------//
//                                   Point                                    //
//----------------------------------------------------------------------------//

//포인트 사용 목록
router.get('/point_list', isNotLoggedIn, DataSet, async(req, res, next) => {

  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const imp_code = process.env.imp_code;
  let page = req.query.page;
  const GN = req.query.GN;
  const IP = process.env.IP;

  try {
    const point = await Point.find({ "CID": CID });

    const totalNum = await Point.countDocuments({ "CID": CID });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const points = await Point.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
    console.log(points);

    res.render('point_list', { company: req.decoded.company, aclist, totalNum, currentPage, totalPage, startPage, endPage, IP, points });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/point_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
  console.log("@@@");
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="PN") {
        var points = await Point.find({ "CID": CID, "PN" : {$regex:searchtext} });
        if(points.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="CA") {
        console.log(searchtext)
        var searchtext2 = searchtext.split("~")
        var points = await Point.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
        if(points.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="PO") {
        searchtext = parseInt(searchtext)
        var points = await Point.find({ "CID": CID, "PO" : searchtext });
        if(points.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        var points = await Point.find({ "CID": CID }).sort({ CA: -1 });
      }
    }catch(e) {
      res.json({ result: false});
    }
    
  }
  
  else {
      var points = await Point.find({ "CID": CID });
    
      if(sort == "PN") {
          points.sort(function (a,b) {
            
            if(typeof(a.PN) == "object")
            a.PN = JSON.stringify(a.PN);
            b.PN = JSON.stringify(b.PN);
            return (a.PN[0]).charCodeAt(0) < (b.PN[0]).charCodeAt(0) ? -1 : (a.PN[0]).charCodeAt(0) > (b.PN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "PN2") {
          points.sort(function (a,b) {
            if(typeof(a.PN) == "object")
            a.PN = JSON.stringify(a.PN);
            b.PN = JSON.stringify(b.PN);
            return (a.PN[0]).charCodeAt(0) > (b.PN[0]).charCodeAt(0) ? -1 : (a.PN[0]).charCodeAt(0) < (b.PN[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "CA") { 
          var points = await Point.find({ "CID": CID }).sort({ CA: -1 });
      }
      
      else if(sort == "CA2"){
          var points = await Point.find({ "CID": CID }).sort({ CA: 1 });
       }
      else if(sort == "PO") {
          var points = await Point.find({ "CID": CID }).sort({ PO: -1 });
      }
      else if(sort == "PO2") {
          var points = await Point.find({ "CID": CID }).sort({ PO: 1 });
      }
      else {
        console.log("@@@")
        var points = await Point.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }
  
  var pointlist = [];
  if(points.length) {
    for(var i = 0; i < points.length; i ++) {
      pointlist[i] = points[i];
    }
  }
  console.log(pointlist)
  res.json({ result: true, pointlist : pointlist, pointnum : points.length});
 
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
  
  try {
    res. render('publish_manage', { company: req.decoded.company, aclist, HOME, cat });
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
  console.log("ㅏ타타타"+type);
  
  try {
    if(cat == 1) {
      url = main+"/inflow?cat="+cat;
    }
    else {
      url = main+"/inflow?cat="+cat+"&cid="+cid;
    }
    console.log("유알엘"+url);
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
      console.log('result :', body);
    });

    console.log(companypoint);
    companypoint = companypoint - 20;
    console.log(companypoint);

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
    console.log('result :', body);
  });

  const pointone = await Point.insertMany({
    "CID": companyone._id,
    "PN": "알림톡 전송",
    "PO": 50,
  });

  console.log(companypoint);
  companypoint = companypoint - 50;
  console.log(companypoint);

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
      console.log(pointone);
    
      console.log(companypoint);
      companypoint = companypoint - 50;
      console.log(companypoint);
    
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
  let page = req.query.page;
  const WNM = req.query.WNM;
  
  
  let apiSecret = process.env.sol_secret;
  let apiKey = process.env.sol_key;

  const moment = require('moment');
  const nanoidGenerate = require('nanoid/generate');
  const generate = () => nanoidGenerate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32);
  const HmacSHA256 = require('crypto-js/hmac-sha256');
  if(WNM)
  console.log("WNM : " + WNM);


  
  
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
        const totalNum = await Alarm.countDocuments({ "CID": CID });
        let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
        const alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
        res.render('alarmtalk_list', { company: req.decoded.company, aclist, totalNum, currentPage, totalPage, startPage, endPage, alarms });

  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/ajax/alarmtalk_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
 
  
  console.log("@@@");
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="WNM") {
        var alarms = await Alarm.find({ "CID": CID, "PN" : {$regex:searchtext} });
        if(alarms.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="CA") {
        var searchtext2 = searchtext.split("~")
        var alarms = await Alarm.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
        if(alarms.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="RE") {
        searchtext = parseInt(searchtext)
        var alarms = await Alarm.find({ "CID": CID, "RE" : searchtext });
        if(alarms.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
      }
    }catch(e) {
      res.json({ result: false});
    }
    
  }
  
  else {
      var alarms = await Alarm.find({ "CID": CID });
    
      if(sort == "WNM") {
          alarms.sort(function (a,b) {
            
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "WNM2") {
          alarms.sort(function (a,b) {
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "CA") { 
          var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
      }
      
      else if(sort == "CA2"){
          var alarms = await Alarm.find({ "CID": CID }).sort({ CA: 1 });
       }
      else if(sort == "RE") {
          alarms.sort(function (a,b) {
            
            if(typeof(a.RE) == "object")
            a.RE = JSON.stringify(a.RE);
            return (a.RE[0]).charCodeAt(0) < (b.RE[0]).charCodeAt(0) ? -1 : (a.RE[0]).charCodeAt(0) > (b.RE[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else if(sort == "RE2") {
          alarms.sort(function (a,b) {
            
            if(typeof(a.RE) == "object")
            a.RE = JSON.stringify(a.RE);
            return (a.RE[0]).charCodeAt(0) > (b.RE[0]).charCodeAt(0) ? -1 : (a.RE[0]).charCodeAt(0) < (b.RE[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else {
        console.log("@@@")
        var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }
  
  var alarmlist = [];
  if(alarms.length) {
    for(var i = 0; i < alarms.length; i ++) {
      alarmlist[i] = alarms[i];
    }
  }
  console.log(alarms)
  console.log(alarmlist)
  res.json({ result: true, alarmlist : alarmlist, alarmnum : alarms.length});
 
});

//----------------------------------------------------------------------------//
//                                  Notice                                    //
//----------------------------------------------------------------------------//

// 알림톡 리스트
router.get('/notice_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  
  res.render('notice_list',{company: req.decoded.company, aclist})
  
});

router.post('/ajax/notice_list', isNotLoggedIn, DataSet, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  
  
  if ((search!="") && (searchtext!="")) {
    try{
      if (search =="WNM") {
        var alarms = await Alarm.find({ "CID": CID, "PN" : {$regex:searchtext} });
        if(alarms.length == 0) 
        res.json({result : "nothing"});
      }
      else if (search =="CA") {
        var searchtext2 = searchtext.split("~")
        var alarms = await Alarm.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
        if(alarms.length == 0) 
        res.json({result : "nothing"});
      }
      else {
        var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
      }
    }catch(e) {
      res.json({ result: false});
    }
    
  }
  
  else {
      var alarms = await Alarm.find({ "CID": CID });
    
      if(sort == "WNM") {
          alarms.sort(function (a,b) {
            
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "WNM2") {
          alarms.sort(function (a,b) {
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "CA") { 
          var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
      }
      
      else if(sort == "CA2"){
          var alarms = await Alarm.find({ "CID": CID }).sort({ CA: 1 });
       }
      else {
        var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }
  
  var alarmlist = [];
  if(alarms.length) {
    for(var i = 0; i < alarms.length; i ++) {
      alarmlist[i] = alarms[i];
    }
  }
  res.json({ result: true, alarmlist : alarmlist, alarmnum : alarms.length});
 
});



//----------------------------------------------------------------------------//
//                                  About App                                 //
//----------------------------------------------------------------------------//
router.get('/aboutapp', async(req, res, next) => {
  res.render('aboutapp');
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

//----------------------------------------------------------------------------//
//                                  Test                                      //
//----------------------------------------------------------------------------//

router.get('/test', async(req, res, next)  =>  {
  
  res.render('company_list');
});

module.exports = router;