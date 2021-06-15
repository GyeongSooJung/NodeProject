//Express
const express = require('express');
const router = express.Router();
//Module
const bcrypt = require('bcrypt');
//Schemas
const Company = require('../schemas/company');
//Middleware
const { isNotLoggedIn, DataSet } = require('./middleware');

// -- Start Code -- //

router.post('/editInfo', isNotLoggedIn, DataSet, async(req, res, next) => {
   const { CNA, MN, PN, PW } = req.body;
   const company = req.decoded.company;
   
  try {
      if (bcrypt.compareSync(PW, company.PW)) {
         await Company.where({ "_id" : company._id }).update({$set : { "CNA" : CNA, "MN" : MN, "PN" : PN, "UA" : Date.now() }});
         
         return res.send({ result : 'success', company : company });
      } else {
         
         return res.send({ result : 'noMatch', company : company });
      }
  } catch(err) {
      res.send({ result : 'fail' });
      console.error(err);
      next(err);
  }
});

router.post('/emailCK', isNotLoggedIn, DataSet, async(req, res, next) => {
   const { EA } = req.body;
   const company = req.decoded.company;
   
   try {
      if (EA == company.EA) {
         return res.send({ result : 'success' });
      }
      else {
         return res.send({ result : 'noMatch' });
      }
   } catch(err) {
      res.send({ result : 'fail' });
      console.error(err);
      next(err);
   }
});

router.post('/editPw', isNotLoggedIn, DataSet, async(req, res, next) => {
   const { PW, CPW } = req.body;
   const company = req.decoded.company;
   
  try {
      if (bcrypt.compareSync(PW, company.PW)) {
         const hashchPW = await bcrypt.hash(CPW, 12);
         await Company.where({ "_id" : company._id }).update({$set : { "PW" : hashchPW, "UA" : Date.now() }});
         await res.cookie("token", req.cookies,{expiresIn:0});
         
         return res.send({ result : 'success' });
      } else {
         return res.send({ result : 'noMatch' });
      }
  } catch(err) {
      res.send({ result : 'fail' });
      console.error(err);
      next(err);
  }
});

module.exports = router;