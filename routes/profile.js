const Company = require('../schemas/company');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {isLoggedIn,isNotLoggedIn,DataSet} = require('./middleware');

router.post('/editInfo', isNotLoggedIn, DataSet, async(req, res, next) => {
   const { CNA, MN, PN, PW } = req.body;
   const company = req.decoded.company;
   
  try {
      if (bcrypt.compareSync(PW, company.PW)) {
         const exMnCompany = await Company.findOne({ "MN" : MN });
         const exPnCompany = await Company.findOne({ "PN" : PN });
         // if (exMnCompany) {
         //    return res.send({ status: 'exMn', company: company });
         // }
         // else if (exPnCompany) {
         //    return res.send({ status: 'exPn', company: company });
         // }
         // else {
            await Company.where({ "_id" : company._id }).update({$set : { "CNA" : CNA, "MN" : MN, "PN" : PN, "UA" : Date.now() }});
            return res.send({ status: 'success', company: company });
         // }
      } else {
         return res.send({ status: 'fail', company: company });
      }
  } catch(err) {
      console.error(err);
      next(err);
  }
});

router.post('/emailCK', isNotLoggedIn, DataSet, async(req, res, next) => {
   const { EA } = req.body;
   const company = req.decoded.company;
   
   try {
      if (EA == company.EA) {
         return res.send({ status: 'match' });
      }
      else {
         return res.send({ status: 'mismatch' });
      }
   } catch(err) {
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
         return res.send({ status: 'success' });
      } else {
         return res.send({ status: 'fail' });
      }
  } catch(err) {
      console.error(err);
      next(err);
  }
});

module.exports = router;