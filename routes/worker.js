//Express
const express = require('express');
const router = express.Router();
//Schemas
const Schema = require('../schemas/schemas');
const { Worker, Workerdelete } = Schema;
//Middleware
const { isNotLoggedIn } = require('./middleware');

//작업자 한개 삭제
router.post('/ajax/worker_deleteone', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select"];
  const CID = req.decoded.CID;
  const CNU = req.decoded.CNU;
  
  try {
    const workerone = await Worker.findOne({ "CID" : CID, "EM" : select.split(' ') });
    await Workerdelete.create({
      "CID" : workerone.CID,
      "WN" : workerone.WN,
      "PN" : workerone.PN,
      "GID" : workerone.GID,
      "EM" : workerone.EM,
      "PU" : workerone.PU,
      "AU" : workerone.AU,
      "AC" :workerone.AC
    });
    await Worker.remove({ "CID" : CID, "EM" : select.split(' ') });
    
    res.send({ result : 'success' });
    
  } catch (err) {
    res.send({ result : 'fail' });
    console.error(err);
    next(err);
  }
});

//작업자 선택삭제
router.post('/ajax/worker_delete', isNotLoggedIn ,async (req, res, next) => {
    var select = req.body["select[]"];
    const CID = req.decoded.CID;
    const CNU = req.decoded.CNU;
    
    try {
        if(!select) {
          res.send({ result : 'fail' });
        }
        else {
          if (typeof(select) == 'string') {
            const workerone = await Worker.findOne({ "CID" : CID, "EM" : select });
            await Workerdelete.create({
                "CID" : workerone.CID,
                "WN" : workerone.WN,
                "PN" : workerone.PN,
                "GID" : workerone.GID,
                "EM" : workerone.EM,
                "PU" : workerone.PU,
                "AU" : workerone.AU,
                "AC" :workerone.AC
            });
            await Worker.remove({ "CID" : CID, "EM" : select });
          }
          else {
             for(var i = 0; i < select.length; i++){
               var workerone = await Worker.findOne({ "CID" : CID, "EM" : select[i] });  
                 await Workerdelete.create({
                    "CID" : workerone.CID,
                    "WN" : workerone.WN,
                    "PN" : workerone.PN,
                    "GID" : workerone.GID,
                    "EM" : workerone.EM,
                    "PU" : workerone.PU,
                    "AU" : workerone.AU,
                    "AC" :workerone.AC
                });
                await Worker.remove({ "CID" : CID, "EM" : select[i] });
             }
          }
            
          res.send({ result : 'success' });
        }
    } catch (err) {
      res.send({ result : 'fail' });
      console.error(err);
      next(err);
    }
});

module.exports = router;