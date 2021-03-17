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

const moment = require('moment');
//Router or MiddleWare
const router = express.Router();
const { isLoggedIn, isNotLoggedIn, DataSet, emailcontrol } = require('./middleware');
const { pagination, timeset } = require('./modulebox');
const axios = require('axios');

//----------------------------------------------------------------------------//
//                                  기본라우터                                //
//----------------------------------------------------------------------------//

//홈페이지 연결 및 추가 방법 + cookie 연결 사용방법 : company.CNA or company.CNU
const Route_page = function(page, req, res) {
  let pages = "/" + page;
  router.get(pages, isNotLoggedIn, async(req, res) => {
    const CID = req.decoded.CID;
    const aclist = await Worker.find({ "CID": CID, "AC": false });
    res.render(page, { company: req.decoded, aclist });
  });
}

//기본 페이지 설정
router.get('/', (req, res, next) => {
  res.redirect('main');
});

// 공통페이지 작성 방법
Route_page('car_join');
Route_page('device_join');
Route_page('ozone_spread');
//----------------------------------------------------------------------------//
//                                  회원정보                                  //
//----------------------------------------------------------------------------//

// 로그인
router.get('/login', isLoggedIn, (req, res) => {
  res.render('login', { title: 'Login Website - OASIS' });
});
router.get('/index', isLoggedIn, (req, res) => {
  res.render('index')
})
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
    res.render('profile', { company: req.decoded, aclist });
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
router.get('/main', isNotLoggedIn, async(req, res, next) => {

  const CID = req.decoded.CID;

  const HOME = process.env.IP;

  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const devices = await Device.find({ "CID": req.decoded.CID });
  const cars = await Car.find({ "CID": req.decoded.CID });
  const workers = await Worker.find({ "CID": req.decoded.CID });

  const Days = await 24 * 60 * 60 * 1000;
  const h1 = await History.countDocuments({ "CID": req.decoded.CID, "CA": { $lte: Date.now(), $gte: (Date.now() - Days) } });
  const h2 = await History.countDocuments({ "CID": req.decoded.CID, "CA": { $lte: Date.now() - Days, $gte: (Date.now() - Days * 2) } });
  const h3 = await History.countDocuments({ "CID": req.decoded.CID, "CA": { $lte: Date.now() - Days * 2, $gte: (Date.now() - Days * 3) } });
  const h4 = await History.countDocuments({ "CID": req.decoded.CID, "CA": { $lte: Date.now() - Days * 3, $gte: (Date.now() - Days * 4) } });
  const h5 = await History.countDocuments({ "CID": req.decoded.CID, "CA": { $lte: Date.now() - Days * 4, $gte: (Date.now() - Days * 5) } });
  const h6 = await History.countDocuments({ "CID": req.decoded.CID, "CA": { $lte: Date.now() - Days * 5, $gte: (Date.now() - Days * 6) } });
  const h7 = await History.countDocuments({ "CID": req.decoded.CID, "CA": { $lte: Date.now() - Days * 6, $gte: (Date.now() - Days * 7) } });
  const history_count = await [h1, h2, h3, h4, h5, h6, h7];

  const historys = await History.find({ "CID": req.decoded.CID });
  const history_array = await History.findOne({ "CID": req.decoded.CID }).sort({ '_id': -1 }).limit(1);
  console.log(history_array);
  console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz" + aclist);
  if (history_array) {
    const recent_history = history_array.PD;
    res.render('main', { company: req.decoded, aclist, devices, cars, workers, historys, recent_history, history_array, history_count, HOME });
  }
  else {
    res.render('main', { company: req.decoded, aclist, devices, cars, workers, historys, history_array, history_count, HOME });
  }


});

//----------------------------------------------------------------------------//
//                                  사업자                                    //
//----------------------------------------------------------------------------//

//사업자 목록
router.get('/company_list', isNotLoggedIn, async(req, res, next) => {

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

    res.render('company_list', { companyone, company: req.decoded, aclist, devices, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (CAR) {
    const companyone = await Company.findOne({ "_id": CAR });

    const totalNum = await Car.countDocuments({ "CID": CAR });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const cars = await Car.find({ "CID": CAR }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { companyone, company: req.decoded, aclist, cars, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (WORKER) {
    const companyone = await Company.findOne({ "_id": WORKER });

    const totalNum = await Worker.countDocuments({ "CID": WORKER });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const workers = await Worker.find({ "CID": WORKER }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { companyone, company: req.decoded, aclist, workers, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else if (HISTORY) {
    const companyone = await Company.findOne({ "_id": HISTORY });

    const totalNum = await History.countDocuments({ "CID": HISTORY });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const historys = await History.find({ "CID": HISTORY }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { companyone, company: req.decoded, aclist, historys, totalNum, currentPage, totalPage, startPage, endPage });
  }
  else {
    const totalNum = await Company.countDocuments({ "AH": false });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const companys = await Company.find({ "AH": false }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('company_list', { companys, aclist, company: req.decoded, totalNum, currentPage, totalPage, startPage, endPage });
  }
})

//----------------------------------------------------------------------------//
//                                  통계                                      //
//----------------------------------------------------------------------------//

//제품 통계
router.get('/device_static', isNotLoggedIn, async(req, res, nex) => {
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

  res.render('device_static', { company: req.decoded, companycount, aclist, AllDevice, AllCar, AllHistory, AllCompany });
})

//소독 통계
router.get('/history_static', isNotLoggedIn, async(req, res, nex) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  const AllCompany = await Company.countDocuments({});
  const AllHistory = await History.countDocuments({});
  const AllCar = await Car.countDocuments({});
  const AllDevice = await Device.countDocuments({});
  res.render('history_static', { company: req.decoded, aclist, AllDevice, AllCar, AllHistory, AllCompany });
})

//----------------------------------------------------------------------------//
//                                  장비                                      //
//----------------------------------------------------------------------------//

//장비 수정
router.get('/device_edit/:MAC', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });


  try {
    const deviceone = await Device.findOne({ MAC: req.params.MAC });
    res.render('device_edit', { company: req.decoded, aclist, deviceone });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});
//장비 목록
router.get('/device_list', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });
  const NN = req.query.NN;

  let page = req.query.page;

  if (NN) {
    const deviceone = await Device.find({ "NN": NN });

    const totalNum = await Device.countDocuments({ "NN": NN });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const devices = await Device.find({ "NN": NN }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('device_list', { company: req.decoded, aclist, devices, totalNum, currentPage, totalPage, startPage, endPage, NN });


  }
  else {

    try {
      const totalNum = await Device.countDocuments({ "CID": CID });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const devices = await Device.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

      res.render('device_list', { company: req.decoded, aclist, devices, totalNum, currentPage, totalPage, startPage, endPage });
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

//차량 수정
router.get('/car_edit/:CN', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  try {
    const carone = await Car.findOne({ CN: req.params.CN });
    res.render('car_edit', { company: req.decoded, aclist, carone });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//차량 목록
router.get('/car_list', isNotLoggedIn, async(req, res, next) => {
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

    res.render('car_list', { company: req.decoded, aclist, cars, totalNum, currentPage, totalPage, startPage, endPage, CN });

  }
  else {

    try {
      const totalNum = await Car.countDocuments({ "CID": CID });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const cars = await Car.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
      console.log(cars);

      res.render('car_list', { company: req.decoded, aclist, cars, totalNum, currentPage, totalPage, startPage, endPage });
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
router.get('/worker_list', isNotLoggedIn, async(req, res, next) => {
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

      res.render('worker_list', { aclist, company: req.decoded, workers, totalNum, currentPage, totalPage, startPage, endPage, WN });

    }
    else {
      const totalNum = await Worker.countDocuments({ "WN": WN });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const workers = await Worker.find({ "WN": WN, }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

      res.render('worker_list', { aclist, company: req.decoded, workers, totalNum, currentPage, totalPage, startPage, endPage, WN });

    }


  }
  else {
    const totalNum = await Worker.countDocuments({ "CID": CID });
    let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
    const workers = await Worker.find({ CID: CID, }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

    res.render('worker_list', { aclist, company: req.decoded, workers, totalNum, currentPage, totalPage, startPage, endPage });

  }


});

//작업자 인증 ajax
router.post('/ajax/post', isNotLoggedIn, async function(req, res) {

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

  res.render('worker_list', { company: req.decoded, workers });

});

//----------------------------------------------------------------------------//
//                                  소독이력                                  //
//----------------------------------------------------------------------------//

// 소독 목록
router.get('/history_list', isNotLoggedIn, async(req, res, next) => {
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

      res.render('history_list', { company: req.decoded, aclist, cars, devices, historylist, totalNum, currentPage, totalPage, startPage, endPage, totalNumlist });
    }

    else if (CN) {
      const carone = await Car.findOne({ "CN": CN });
      if (carone) {
        const totalNum = await History.countDocuments({ "VID": carone._id });
        let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
        const historylist = await History.find({ "VID": carone._id }).sort({ CA: -1 }).skip(skipPost).limit(postNum);

        res.render('history_list', { company: req.decoded, aclist, cars, carone, devices, historylist, totalNum, currentPage, totalPage, startPage, endPage });
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

      res.render('history_list', { company: req.decoded, aclist, cars, devices, deviceone, historylist, totalNum, currentPage, totalPage, startPage, endPage });
    }
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

//소독 그래프
router.get('/history_chart/:_id', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  try {
    const historyone = await History.findOne({ "_id": req.params._id });
    const history_array = historyone.PD;
    const companyone = await Company.findOne({ "_id": CID });
    console.log("길이"+history_array.length);
    res.render('history_chart', { company: req.decoded, aclist, historyone, companyone, history_array });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
})

//----------------------------------------------------------------------------//
//                                  QR코드                                    //
//----------------------------------------------------------------------------//

//Mobile Connect Page
router.get('/inflow', async(req, res, next) => {
  var cn = req.query.cn;
  var cat = req.query.cat;
  
  try {
    res.render('inflow', { cn, cat });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

// 바로 넘어갈 경우
// router.get('/mobile_con', async(req, res, next) => {
//   var cn = req.query.cn;
//   console.log(cn);
//   console.log(req.body.cn+"dddddddddddddd");
  
//   try {
//     if(cn) {
//       const exCN = await Car.findOne({"CN" : cn});
//       if(exCN) {
//           console.log('af1313a');
//           return res.redirect('qrcode/QR?CN='+cn);
//       }
//       else {
//         return res.redirect('/mobile_con?exist=true');
//       }
//     }
//     else {
//       res.render('mobile_con');
//     }
//   }
//   catch (err) {
//     console.error(err);
//     next(err);
//   }
// })

//Mobile QR Code Page
router.get('/publish', async (req, res, next) => {
  const CN = req.query.cn;
  const HID = req.query.hid;
  const timenow = moment().format('YYYY-MM-DD HH:mm');
  const kakao = process.env.KAKAO;
  
    try {
      if(HID){
        const historyone = await History.findOne({"_id" : HID});
        
        if(historyone) {
          const companyone = await Company.findOne({"_id" : historyone.CID});
          const history_array = await historyone.PD;
          
          const et = moment(historyone.ET).format('YYYY-MM-DD HH:mm');
          const term = await moment(timenow).diff(et, 'hours');
          
          res.render('publish', {companyone, historyone, history_array, term, kakao});
        }
        else {
          res.redirect('/inflow?&nodata=true');
        }
      }
      else {
        const historyone = await History.findOne({"CNM" : CN}).sort({"ET" : -1}).limit(1);
      
        if(historyone) { //historyone.RC == 1
          const companyone = await Company.findOne({"_id" : historyone.CID});
          const history_array = await historyone.PD;
          
          const et = moment(historyone.ET).format('YYYY-MM-DD HH:mm');
          const term = await moment(timenow).diff(et, 'hours');
          
          res.render('publish', {companyone, historyone, history_array, term, kakao});
        }
        else {
          res.redirect('/inflow?&nodata=true');
        }
      }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 바로 넘어갈 경우
// router.get('/QR', async (req, res, next) => {
//   const CN = req.query.CN;
//   console.log(CN);
//   const exCN = await Car.findOne({"CN" : CN});
//     try {
//       if (exCN) {
//         const carone = await Car.findOne({"CN" : CN});
//         const companyone = await Company.findOne({"_id" : carone.CID});
        
//         // const kmoment = await moment(); //현재 시간
//         const timenow = moment().format('YYYY-MM-DD hh:mm:ss'); //현재 시간 포맷맞춰서
//         // const find_month = await {'$gte' : kmoment.add('-1', 'M').format('YYYY-MM-DD hh:mm:ss')}; //kmoment 1개월 전
        
//         // const historys = await History.find({"VID" : carone._id, "ET": find_month}).sort({"ET":-1}); // 1개월 간 소독이력 ----------- 다시 생각
        // const historyone = await History.findOne({"VID" : carone._id}).sort({"ET":-1}).limit(1); // 가장 최근 소독이력
//         console.log("히스톨"+historyone);
        
//         if (historyone) { // && (historyone.RC==1)
//           const history_array = await historyone.PD;
//           console.log("히스토리 아이디"+historyone._id);
          
//           const et = moment(historyone.ET).format('YYYY-MM-DD hh:mm:ss'); // 최근 소독이력 포맷맞춰서
//           const term = await moment(timenow).diff(et, 'days'); // 현재 일자 - 최근 소독이력
          
//           console.log("성공실패"+historyone.RC);
          
//           res.render('QR', {carone, companyone, historyone, history_array, term,});
//         }
//         else {
//           res.render('QR2', {companyone, carone});
//         }
//       }
//       else {
//         return res.redirect('/mobile_con?exist=true');
//       }
//     } catch(err) {
//         console.error(err);
//         next(err);
//     }
// });

//----------------------------------------------------------------------------//
//                                  pay                                       //
//----------------------------------------------------------------------------//

//알림톡 결제
router.get('/pay_point', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID" : CID, "AC" : false });
  const companyone = await Company.findOne({ "_id": CID });
  const imp_code = process.env.imp_code;
  const HOME = process.env.IP;

  try {
    res.render('pay_point', { company: req.decoded, companyone, aclist, imp_code, HOME });
  }
  catch(err) {
    console.error(err);
    next(err);
  }
});

//결제 완료 내역
router.get('/pay_confirm', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID" : CID, "AC" : false });
  const companyone = await Company.findOne({ "_id": CID });
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
      url: 'https://api.iamport.kr/payments/'+imp_uid, // imp_uid 전달
      method: "get", // GET method
      headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
  });
  const paymentData = getPaymentData.data.response; // 조회한 결제 정보
  
  const serviceone = await Service.findOne({"SN" : paymentData.name});
  console.log(serviceone);
  
  try {
    res.render('pay_confirm', { company: req.decoded, companyone, aclist, imp_code, paymentData, serviceone });
  }
  catch(err) {
    console.error(err);
    next(err);
  }
});

//결제 목록
router.get('/pay_list', isNotLoggedIn, async(req, res, next) => {
  
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID" : CID, "AC" : false });
  const imp_code = process.env.imp_code;
  let page = req.query.page;
  const GN = req.query.GN;
  const IP = process.env.IP;
  
  try {
    const order = await Order.find({ "CID" : CID});
    if (GN) {
      const orderone = await Order.find({"GN" : GN});
      const totalNum = await Order.countDocuments({ "GN": GN });
      let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
      const orders = await Order.find({ "GN": GN }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
      res.render('pay_list', { company: req.decoded, aclist, totalNum, currentPage, totalPage, startPage, endPage, imp_code,IP, orders, GN});
    }
    else {
      try {
        const totalNum = await Order.countDocuments({ "CID": CID });
        let { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage } = await pagination(page, totalNum);
        const orders = await Order.find({ "CID": CID }).sort({ CA: -1 }).skip(skipPost).limit(postNum);
        console.log(orders);
  
        res.render('pay_list', { company: req.decoded, aclist, totalNum, currentPage, totalPage, startPage, endPage,IP, orders });
      }
      catch (err) {
        console.error(err);
        next(err);
      }
    }
  }
  catch(err) {
    console.error(err);
    next(err);
  }
});

// 영수증
router.get('/receipt', isNotLoggedIn, async(req, res, next) => {
  
  const CID = req.decoded.CID;
  const aclist = await Worker.find({ "CID" : CID, "AC" : false });
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
            url: 'https://api.iamport.kr/payments/'+imp_uid, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        
        console.log(paymentData);
        
        
        const orderone = await Order.find({"IID" : imp_uid});

  res.render('receipt', { company: req.decoded, aclist, paymentData, orderone,moment });
  
})

//----------------------------------------------------------------------------//
//                                  A/S                                       //
//----------------------------------------------------------------------------//

//A/S 처리
router.get('/repair', isNotLoggedIn, async(req, res, next) => {
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  const aclist = await Worker.find({ "CID": CID, "AC": false });

  try {
    res.render('repair', { company: req.decoded, aclist });
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
