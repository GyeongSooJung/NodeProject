//Express
const express = require('express');
const router = express.Router();
//Module
const moment = require('moment');
//Schemas
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');
// -- Start Code -- //

//Mobile QR Code Page
  //publish_main
router.get('/', async (req, res, next) => {
  const CN = req.query.cn;
  const HID = req.query.hid;
  const cat = req.query.cat;
  const timenow = moment().format('YYYY-MM-DD HH:mm');
  const kakao = process.env.KAKAO;
  
  try {
    if(HID){
      
      const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{"_id" : HID},{});
      if(historyone) {
        await modelQuery(QUERY.Updateupsert,COLLECTION_NAME.Publish,{where : {"PUC" : cat}, update : {$inc : {"PUN" : 1}}});
        
        const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{"_id" : historyone.CID},{});
        const deviceone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Device,{"_id" : historyone.DID},{});
        const history_array = await historyone.PD;
        
        const et = moment(historyone.ET).format('YYYY-MM-DD HH:mm');
        const term = await moment(timenow).diff(et, 'hours');
        
        res.render('publish', {companyone, deviceone, historyone, history_array, term, kakao});
      }
      else {
        res.redirect('/inflow?cat='+cat+'&nodata=true');
      }
    }
    else {
      const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{"CNM" : CN},{sort : {"ET" : -1}, limit : 1})
    
      if(historyone) { //historyone.RC == 1
        await modelQuery(QUERY.Updateupsert,COLLECTION_NAME.Publish,{where : {"PUC" : cat},update :{$inc : {"PUN" : 1}}},{});
        
        const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{"_id" : historyone.CID},{});
        const deviceone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Device,{"_id" : historyone.DID},{});
        const history_array = await historyone.PD;
        
        const et = moment(historyone.ET).format('YYYY-MM-DD HH:mm');
        const term = await moment(timenow).diff(et, 'hours');
        
        res.render('publish', {companyone, deviceone, historyone, history_array, term, kakao, cat});
      }
      else {
        res.redirect('/inflow?cat='+cat+'&nodata=true');
      }
    }
  } catch(err) {
      console.error(err);
      next(err);
  }
});

  //publish_detail
router.get('/brand', async (req, res, next) => {
  const CN = req.query.cn;
  const HID = req.query.hid;
  const cat = req.query.cat;
  
  const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{"_id" : HID},{})
  const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{"_id" : historyone.CID},{});
  
  res.render('publish_brand', {CN, HID, cat, companyone});
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