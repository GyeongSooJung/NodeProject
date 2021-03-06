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
  const lang = req.query.lang;
  const timenow = moment().format('YYYY-MM-DD HH:mm');
  const kakao = process.env.KAKAO;
  
  try {
    if(HID){
      const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{"_id" : HID},{});
      if(historyone) {
        await modelQuery(QUERY.Updateupsert,COLLECTION_NAME.Publish,{where : {"PUC" : cat}, update : {$inc : {"PUN" : 1}}},{});
        
        const history_array = await historyone.PD;
        
        const et = moment(historyone.ET).format('YYYY-MM-DD HH:mm');
        const term = await moment(timenow).diff(et, 'hours');
        
        if(lang == 'en') {
          res.render('publish_en', {historyone, history_array, term, kakao, lang});
        }
        else {
          res.render('publish', {historyone, history_array, term, kakao});
        }
      }
      else {
        if(lang == 'en') {
          res.redirect('/inflow?cat='+cat+'&lang=en&nodata=true');
        }
        else {
          res.redirect('/inflow?cat='+cat+'&nodata=true');
        }
      }
    }
    else {
      const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{"CNM" : CN},{sort : {"ET" : -1}, limit : 1})
    
      if(historyone) { //historyone.RC == 1
        await modelQuery(QUERY.Updateupsert,COLLECTION_NAME.Publish,{where : {"PUC" : cat},update :{$inc : {"PUN" : 1}}},{});
        
        const history_array = await historyone.PD;
        
        const et = moment(historyone.ET).format('YYYY-MM-DD HH:mm');
        const term = await moment(timenow).diff(et, 'hours');
        
        if(lang == 'en') {
          res.render('publish_en', {historyone, history_array, term, kakao, cat, lang});
        }
        else {
          res.render('publish', {historyone, history_array, term, kakao, cat});
        }
      }
      else {
        if(lang == 'en') {
          res.redirect('/inflow?cat='+cat+'&lang=en&nodata=true');
        }
        else {
          res.redirect('/inflow?cat='+cat+'&nodata=true');
        }
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
  const lang = req.query.lang;
  
  const historyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.History,{"_id" : HID},{});
  // const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{"_id" : historyone.CID},{});
  
  // res.render('publish_brand', {CN, HID, cat, companyone});
  if(lang == 'en') {
    res.render('publish_brand_en', {CN, HID, cat, historyone, lang});
  }
  else {
    res.render('publish_brand', {CN, HID, cat, historyone});
  }
});

// ?????? ????????? ??????
// router.get('/QR', async (req, res, next) => {
//   const CN = req.query.CN;
//   console.log(CN);
//   const exCN = await Car.findOne({"CN" : CN});
//     try {
//       if (exCN) {
//         const carone = await Car.findOne({"CN" : CN});
//         const companyone = await Company.findOne({"_id" : carone.CID});
        
//         // const kmoment = await moment(); //?????? ??????
//         const timenow = moment().format('YYYY-MM-DD hh:mm:ss'); //?????? ?????? ???????????????
//         // const find_month = await {'$gte' : kmoment.add('-1', 'M').format('YYYY-MM-DD hh:mm:ss')}; //kmoment 1?????? ???
        
//         // const historys = await History.find({"VID" : carone._id, "ET": find_month}).sort({"ET":-1}); // 1?????? ??? ???????????? ----------- ?????? ??????
        // const historyone = await History.findOne({"VID" : carone._id}).sort({"ET":-1}).limit(1); // ?????? ?????? ????????????
//         console.log("?????????"+historyone);
        
//         if (historyone) { // && (historyone.RC==1)
//           const history_array = await historyone.PD;
//           console.log("???????????? ?????????"+historyone._id);
          
//           const et = moment(historyone.ET).format('YYYY-MM-DD hh:mm:ss'); // ?????? ???????????? ???????????????
//           const term = await moment(timenow).diff(et, 'days'); // ?????? ?????? - ?????? ????????????
          
//           console.log("????????????"+historyone.RC);
          
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