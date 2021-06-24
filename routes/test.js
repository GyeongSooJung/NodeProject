//Express
const express = require('express');
const router = express.Router();
//Module
var moment = require('moment');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const path = require('path');
const Mongoose = require('mongoose');

const {findOneDocument} = require('../schemas/query');

  
const Schema = require("../schemas/schemas");
const {schemaSelect} = require('../schemas/schemas');
const {COLLECTION_NAME} = require('../const/consts');

router.get('/gstest', async(req, res, next) => {
    try{
        var data = { "CID" : "5fd6c731a26c914fbad53ebe" };
        const one = await findOneDocument(data,COLLECTION_NAME.Car,{sort : true})
        
       console.log(one)
        
    
    
    }catch(e) {
    console.log(e)
    }

})

module.exports = router;