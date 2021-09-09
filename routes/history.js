//Express
const express = require('express');
const router = express.Router();
//Schemas
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');
//Middleware
const {isNotLoggedIn} = require('./middleware');

// -- Start Code -- //

//소독이력 한개 삭제
router.post('/ajax/history_deleteone', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select"];
  const CNU = req.decoded.CNU;
  
  try {
    await modelQuery(QUERY.Remove,COLLECTION_NAME.History,{ "_id" : select.split(' ') },{});
    
    res.send({ result : 'success' });
    
  } catch (err) {
    res.send({ result : 'fail' });
    console.error(err);
    next(err);
  }
});

//소독이력 선택 삭제
router.post('/ajax/history_delete', isNotLoggedIn, async (req, res, next) => {
  var select = req.body["select[]"];
  
  try {
    if(!select) {
      res.send({ result : 'fail' });
    }
    else {
      if(typeof(select) == 'string') {
        await modelQuery(QUERY.Remove,COLLECTION_NAME.History,{ "_id" : select },{});
        
      }
      else {
        for(var i = 0; i < select.length; i ++) {
          await modelQuery(QUERY.Remove,COLLECTION_NAME.History,{ "_id" : select[i] },{});
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