//Express
const express = require('express');
const router = express.Router();

// -- Start Code -- //

//Mobile Connect Page
router.get('/', async(req, res, next) => {
  var cn = req.query.cn;
  var cat = req.query.cat;
  var lang = req.query.lang;
  
  try {
    if(cat == 1) {
      if(lang == 'en') {
        res.render('inflow_en', { cn, cat, lang });
      }
      else {
        res.render('inflow', { cn, cat, lang });
      }
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
  
//   try {
//     if(cn) {
//       const exCN = await Car.findOne({"CN" : cn});
//       if(exCN) {
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