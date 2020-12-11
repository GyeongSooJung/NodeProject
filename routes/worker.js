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

module.exports = router;