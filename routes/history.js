//Express
const express = require('express');
const router = express.Router();
//Schemas
const History = require('../schemas/history');
//Middleware
const {isNotLoggedIn} = require('./middleware');

// -- Start Code -- //

//소독이력 선택 삭제
router.post('/ajax/history_delete', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select[]"];
  
  try {
    if(!select) {
      res.send({ result : 'fail' });
    }
    else {
      if(typeof(select) == 'string') {
        await History.remove({ "_id" : select });
        
      }
      else {
        for(var i = 0; i < select.length; i ++) {
          await History.remove({ "_id" : select[i] });
        }
      }
      return res.send({ result : 'success' });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;