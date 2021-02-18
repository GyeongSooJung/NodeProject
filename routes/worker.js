const express = require('express');
const Worker = require('../schemas/worker');
const moment = require('moment');
const {isLoggedIn,isNotLoggedIn,DataSet} = require('./middleware');
const router = express.Router();

//작업자 목록

//작업자 수정
router.post('/worker_update',isNotLoggedIn ,async (req, res, next) => {
    try {
        const {EM, AC} = req.body;
        var i,j;
        let  workerone;
        console.log("AC: " + AC);
        console.log("EM: " + EM);
        
        /* EM 이랑 AC 비교 */
        if (!AC) {
            for (i = 0; i< EM.length; i++){
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : false }).setOptions({runValidators : true}).exec();
            }
            return res.redirect('/worker_list');
        }
        else if(!(AC instanceof Object)) {
          for (i =0; i < EM.length; i ++) {
            console.log(EM[i]);
             if (EM[i] == AC) {
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : true }).setOptions({runValidators : true}).exec();
            }
            else {
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : false }).setOptions({runValidators : true}).exec();
            }
          }
        }
        else{
          for (i =0; i < EM.length; i ++) {
            for(j =0; j < AC.length; j ++) {
              if(EM[i] == AC[j]){
                workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : true }).setOptions({runValidators : true}).exec();
                break;
              }
              else {
                workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : false }).setOptions({runValidators : true}).exec();
              }
            }
          }
        }
        res.redirect('/worker_list');
    }   catch (err) {
        console.error(err);
        next(err);
  }
});

// 작업자 단일 체크박스 수정

router.post('/worker_select_update',isNotLoggedIn ,async (req, res, next) => {
    try {
      
    const workerac = req.body.AC;
    const workerem = req.body.EM;
    console.log(workerac);
    console.log(workerem);
      
        const {EM, AC} = req.body;
        var i,j;
        let  workerone;
        console.log("AC: " + AC);
        console.log("EM: " + EM);
        
        if (!AC) {
            for (i = 0; i< EM.length; i++){
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : false }).setOptions({runValidators : true}).exec();
            }
            return res.redirect('/worker_list');
        }
        else if(!(AC instanceof Object)) {
          for (i =0; i < EM.length; i ++) {
            console.log(EM[i]);
             if (EM[i] == AC) {
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : true }).setOptions({runValidators : true}).exec();
            }
            else {
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : false }).setOptions({runValidators : true}).exec();
            }
          }
        }
        else{
          for (i =0; i < EM.length; i ++) {
            for(j =0; j < AC.length; j ++) {
              if(EM[i] == AC[j]){
                workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : true }).setOptions({runValidators : true}).exec();
                break;
              }
              else {
                workerone = await Worker.where({"EM" : EM[i]}).update({ "AC" : false }).setOptions({runValidators : true}).exec();
              }
            }
          }
        }
        
        
        
        res.redirect('/worker_list');
    }   catch (err) {
        console.error(err);
        next(err);
  }
});

//작업자 체크박스 사업주 권한 부여

router.post('/worker_select_manager',isNotLoggedIn ,async (req, res, next) => {
    try {
      
    const workerac = req.body.AU;
    const workerem = req.body.EM;
    console.log(workerac);
    console.log(workerem);
      
        const {EM, AC} = req.body;
        var i,j;
        let  workerone;
        console.log("AC: " + AC);
        console.log("EM: " + EM);
        
        if (!AC) {
            for (i = 0; i< EM.length; i++){
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AU" : 2 }).setOptions({runValidators : true}).exec();
            }
            return res.redirect('/worker_list');
        }
        else if(!(AC instanceof Object)) {
          for (i =0; i < EM.length; i ++) {
            console.log(EM[i]);
             if (EM[i] == AC) {
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AU" : 1 }).setOptions({runValidators : true}).exec();
            }
            else {
              workerone = await Worker.where({"EM" : EM[i]}).update({ "AU" : 2 }).setOptions({runValidators : true}).exec();
            }
          }
        }
        else{
          for (i =0; i < EM.length; i ++) {
            for(j =0; j < AC.length; j ++) {
              if(EM[i] == AC[j]){
                workerone = await Worker.where({"EM" : EM[i]}).update({ "AU" : 1 }).setOptions({runValidators : true}).exec();
                break;
              }
              else {
                workerone = await Worker.where({"EM" : EM[i]}).update({ "AU" : 2 }).setOptions({runValidators : true}).exec();
              }
            }
          }
        }
        
        
        
        res.redirect('/worker_list');
    }   catch (err) {
        console.error(err);
        next(err);
  }
});


//작업자 삭제
router.get('/worker_delete/:EM',isNotLoggedIn ,async (req, res, next) => {
  try {
    await Worker.remove({ "EM" : req.params.EM });
    res.redirect('/worker_list');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//작업자 선택삭제
router.post('/worker_select_delete',isNotLoggedIn ,async (req, res, next) => {
  try {
        const {ck} = req.body;

        if(!ck) {
          return res.redirect('/worker_list?null=true');
        }
        else {
          const workerone = await Worker.findOne({"EM" : ck});
          console.log("zzzzzzzzz : "+workerone);
          const EMc = workerone.EM;
          var i;
          console.log("EM: " + ck);
          console.log("EMc: " + EMc)

          for(i=0; i < ck.length; i++){
            if(ck[i] == EMc){
                await Worker.remove({ "EM" : ck });
            }
            else if(!(ck instanceof Object)) {
                await Worker.remove({ "EM" : ck });
            }
          }
          res.redirect('/worker_list');
        }
    }   catch (err) {
        console.error(err);
        next(err);
    // try {
    //     const {EM, ck} = req.body;
    //     var i,j;
    //     let  workerone;
    //     console.log("CK: " + ck);
    //     console.log("EM: " + EM);
    //     /* EM 이랑 AC 비교 */
        
    //     if (!ck) {
    //         return res.redirect('/worker_list');
    //     }
        
    //     else if(!(ck instanceof Object)) {
    //       for (i =0; i < EM.length; i ++) {
    //         console.log(EM[i]);
    //         if (EM[i] == ck) { 
    //           await Worker.remove({ "EM" : ck });
    //         }
    //       }
    //     }
    //     else{
    //       for (i =0; i < EM.length; i ++) {
    //         for(j =0; j < ck.length; j ++) {
    //           if(EM[i] == ck[j]){
    //             await Worker.remove({ "EM" : EM[i] });
    //             break;
    //           }
    //         }
    //       }
    //     }
    //     res.redirect('/worker_list');
    // }   catch (err) {
    //     console.error(err);
    //     next(err);
  }
});




module.exports = router;