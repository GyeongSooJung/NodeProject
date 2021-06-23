//Express
const express = require('express');
const router = express.Router();
//Schemas
const Schema = require('../schemas/schemas');
const { Company } = Schema;
//Middleware
const { isNotLoggedIn, DataSet } = require('./middleware');

// -- Start Code -- //

// 포인트 설정
router.post('/point', isNotLoggedIn, DataSet, async(req, res, next) => {
    const company = req.decoded.company;
    const { POA } = req.body;
    
    try {
        await Company.update({ "_id" : company._id }, { "POA" : POA });
        return res.send({ result : 'success' });
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

module.exports = router;