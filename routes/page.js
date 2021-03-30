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

const moment = require('moment');
//Router or MiddleWare
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, DataSet, emailcontrol } = require('./middleware');
const { pagination, timeset } = require('./modulebox');
const axios = require('axios');

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
  res.render('login', { title: 'Login Website - OASIS' });
});

router.get('/adress', (req, res) => {
  res.render('adress_pop');
});

//회원 가입
router.get('/register', isLoggedIn, emailcontrol, async(req, res) => {
  const current_time = req.body.current_time;
  await res.cookie('ADR', null);
  console.log("사업자 이름" + req.body.CNA);
  console.log('cokigahglkhqlghaklshdgkla')
  console.log(req.cookies)

  var roadAddrPart1 = null
  var roadAddrPart2 = null
  var addrDetail = null
  if (await req.decoded.ADR) {
    roadAddrPart1 = String(req.decoded.ADR.roadAddrPart1);
    roadAddrPart2 = String(req.decoded.ADR.roadAddrPart2);
    addrDetail = String(req.decoded.ADR.addrDetail);
    console.log("where is the places " + roadAddrPart1);
  }
  const authNum = parseInt(req.decoded.authNum);
  const email = req.decoded.email;
  console.log("email = " + email);
  console.log("authNum = " + authNum);

  if (authNum) {
    return res.render('register', { email, roadAddrPart1, roadAddrPart2, addrDetail });
  }
  else {
    return res.render('register', { roadAddrPart1, roadAddrPart2, addrDetail });
  }
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
  res.render('find');
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
  
  const history_date = await History.find({ "CID": req.decoded.CID, "CA": { $lte: Date.now(), $gte: (Date.now() - Days * 7) } });

    for (var i =  0; i < 7 ; i ++) {
        console.log(history_date[i]);
        for(var j = await 0; j < history_date.length; j ++) {
          if((history_date[j].CA <=  (Date.now() - (Days * i))) && (history_date[j].CA >=  (Date.now() - Days * (i + 1)))) {
            history_count2[i] += await 1;
          }
        } 
      }

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

    const totalNum = await Device.countDocuments({ "CID": DEVICE });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const devices = await Device.find({ "CID": DEVICE }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, devices, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (CAR) {
    const companyone = await Company.findOne({ "_id": CAR });

    const totalNum = await Car.countDocuments({ "CID": CAR });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const cars = await Car.find({ "CID": CAR }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, cars, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (WORKER) {
    const companyone = await Company.findOne({ "_id": WORKER });

    const totalNum = await Worker.countDocuments({ "CID": WORKER });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const workers = await Worker.find({ "CID": WORKER }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (HISTORY) {
    const companyone = await Company.findOne({ "_id": HISTORY });

    const totalNum = await History.countDocuments({ "CID": HISTORY });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const historys = await History.find({ "CID": HISTORY }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { company: req.decoded.company, companyone, aclist, historys, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else {
    const totalNum = await Company.countDocuments({ "AH": false });
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
    const deviceone = await Device.find({ "NN": NN });

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
    const carone = await Car.findOne({ "CN": CN });
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
    const workerone = await Worker.find({ "WN": WN });
    if (workerone[0]) {
      console.log(workerone);
      const totalNum = await Worker.countDocuments({ "WN": WN });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const workers = await Worker.find({ "WN": WN }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

      res.render('worker_list', { company: req.decoded.company, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage, WN });

    }
    else {
      const totalNum = await Worker.countDocuments({ "WN": WN });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const workers = await Worker.find({ "WN": WN, }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

      res.render('worker_list', { company: req.decoded.company, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage, WN });

    }


  }
  else {
    const totalNum = await Worker.countDocuments({ "CID": CID });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const workers = await Worker.find({ CID: CID, }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('worker_list', { company: req.decoded.company, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage });

  }


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

    if (!CN & !MD) {

      const totalNum = await History.countDocuments({ "CID": CID });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const historylist = await History.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
      const totalNumlist = [];
      for (var i = 0; i < totalNum.length; i++) {
        totalNumlist[i] = i + 1;
      }

      res.render('history_list', { company: req.decoded.company, aclist, cars, devices, historylist, totalNum, currentPage, totalPage, startPage, endPage, totalNumlist });
    }

    else if (CN) {
      const carone = await Car.findOne({ "CN": CN });
      if (carone) {
        const totalNum = await History.countDocuments({ "VID": carone._id });
        let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
        const historylist = await History.find({ "VID": carone._id }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

        res.render('history_list', { company: req.decoded.company, aclist, cars, carone, devices, historylist, totalNum, currentPage, totalPage, startPage, endPage });
      }
      else {
        res.redirect('?searcherror=true');
      }
    }

    else if (MD) {
      const deviceone = await Device.findOne({ "MD": MD });
      console.log(deviceone);

      const totalNum = await History.countDocuments({ "DID": deviceone._id });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const historylist = await History.find({ "DID": deviceone._id }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

      res.render('history_list', { company: req.decoded.company, aclist, cars, devices, deviceone, historylist, totalNum, currentPage, totalPage, startPage, endPage });
    }
  }
  catch (err) {
    console.error(err);
    next(err);
  }
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
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const imp_code = process.env.imp_code;
  const HOME = process.env.IP;

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



//----------------------------------------------------------------------------//
//                                  A/S                                       //
//----------------------------------------------------------------------------//

//A/S 처리
router.get('/repair', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  try {
    res.render('repair', { company: req.decoded.company, aclist });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//----------------------------------------------------------------------------//
//                                  SOLAPI                                    //
//----------------------------------------------------------------------------//


router.get('/send', isNotLoggedIn, DataSet, async(req, res, next) => {

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
      .updateMany({ "SPO": companypoint }).setOptions({ runValidators: true })
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
        text: comname + "에서 소독이 완료되었음을 알려드립니다.자세한 사항은 아래 링크에서 확인 가능합니다 (미소)",
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
    .updateMany({ "SPO": companypoint }).setOptions({ runValidators: true })
    .exec();




});


//----------------------------------------------------------------------------//
//                                  App About                                 //
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


module.exports = router;
