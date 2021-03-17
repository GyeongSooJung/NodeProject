const express = require('express');
const router = express.Router();
//schema
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
const History = require('../schemas/history');
const QRS = require('../schemas/QR');
const moment = require('moment');
//Router or MiddleWare


//Mobile QR Code Page
router.get('/', async (req, res, next) => {
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
          res.redirect('/inflow/?&nodata=true');
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
          res.redirect('/inflow/?&nodata=true');
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

module.exports = router;