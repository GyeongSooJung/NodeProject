const express = require('express');
const History = require('../schemas/history');
const Car = require('../schemas/car');
const Device = require('../schemas/device');
const moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const router = express.Router();

// //소독이력 삭제
// router.get('/history_delete/:_id',isNotLoggedIn ,async (req, res, next) => {
//   try {
//     await History.remove({"_id" : req.params._id });
//     res.redirect('/history_list');
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

// //소독이력 선택삭제
// router.post('/history_select_delete',isNotLoggedIn ,async (req, res, next) => {
//     try {
//         const {_id} = req.body;
        
//         if(!_id) {
//             res.redirect('/history_list?null=true');
//         }
//         else {
//             const historyone = await History.findOne({"_id" : _id});
//             console.log(historyone);
//             const id = historyone._id;
//             var i;
//             // console.log("@@@@@@@@@@@@@@@@@@@@@@@_id: " + _id);
            
//             for(i=0; i < _id.length; i++){
//                 if(_id[i] == id){
//                     await History.remove({ "_id" : _id });
//                 }
//                 else if(!(_id instanceof Object)) {
//                     await History.remove({ "_id" : _id });
//                 }
//             }
//             res.redirect('/history_list');
//         }
//     }   catch (err) {
//         console.error(err);
//         next(err);
//   }
// });

//소독이력 선택 삭제
router.post('/ajax/history_delete', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select[]"];
  console.log(JSON.stringify(req.body));
  console.log(select);
  
  try {
    if(!select) {
      res.send({ result : false });
    }
    else {
      
      if(typeof(select) == 'string') {
        const historyone = await History.findOne({"_id" : select});
        // await History.create({
        //       "CID" : deviceone.CID,
        //       "MD" : deviceone.MD,
        //       "VER" : deviceone.VER,
        //       "NN" : deviceone.NN,
        //       "MAC" : deviceone.MAC
        // });
        await History.remove({ "_id" : select });
        
      }
      else {
        for(var i = 0; i < select.length; i ++) {
          var historyone = await History.findOne({"_id" : select[i]});   
        //   await Devicedelete.create({
        //         "CID" : deviceone.CID,
        //           "MD" : deviceone.MD,
        //           "VER" : deviceone.VER,
        //           "NN" : deviceone.NN,
        //           "MAC" : deviceone.MAC
        //   });
          await History.remove({ "_id" : select[i] });
        }
      }
      return res.send({ result : true });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;