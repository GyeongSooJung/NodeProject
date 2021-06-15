//Express
const express = require('express');
const router = express.Router();

// -- Start Code -- //

//Mobile Connect Page
router.get('/', async(req, res, next) => {
  var cn = req.query.cn;
  var cat = req.query.cat;
  // var cid = req.query.cid;
  
  try {
    if(cat == 1) {
      res.render('inflow', { cn, cat });
    }
    // else if(cat == 2) {
    //   res.render('inflow', { cn, cat, cid });
    // }
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