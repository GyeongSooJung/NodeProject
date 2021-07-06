//Express
const express = require('express');
const router = express.Router();
//Schemas
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');
//Middleware
const { isNotLoggedIn, DataSet } = require('./middleware');

// -- Start Code -- //

// 포인트 설정
router.post('/point', isNotLoggedIn, DataSet, async(req, res, next) => {
    const company = req.decoded.company;
    const { POA } = req.body;
    
    try {
        await modelQuery(QUERY.Update,COLLECTION_NAME.Company,{where : { "_id" : company._id },update : { "POA" : POA }},{});
        return res.send({ result : 'success' });
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

module.exports = router;