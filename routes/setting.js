const Company = require('../schemas/company');
const express = require('express');
const router = express.Router();
const {isLoggedIn,isNotLoggedIn,DataSet} = require('./middleware');

// 포인트 설정
router.post('/point', isNotLoggedIn, DataSet, async(req, res, next) => {
    const company = req.decoded.company;
    const { POA } = req.body;
    
    try {
        await Company.update({ "_id" : company._id }, { "POA" : POA });
        return res.send({ status: 'success' });
    } catch(err) {
        res.send({ status: 'fail' });
        console.error(err);
        next(err);
    }
});

module.exports = router;