const express = require('express');
const router = express.Router();
//schema
const Company = require('../schemas/company');
const Device = require('../schemas/device');
const Car = require('../schemas/car');
const Worker = require('../schemas/worker');
const History = require('../schemas/history');
const moment = require('moment');
//Router or MiddleWare

//Mobile Connect Page
router.get('/', async(req, res, next) => {
  var cn = req.query.cn;
  var cat = req.query.cat;
  
  try {
    if(cat) {
        res.render('inflow', { cn, cat });
    }
    else {
        res.render('error');
    }
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

module.exports = router;