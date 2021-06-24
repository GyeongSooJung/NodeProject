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


//Middleware
const { isNotLoggedIn } = require('./middleware');
  
const Schema = require("../schemas/schemas");

const {schemaSelect} = require('../schemas/schemas');

const {COLLECTION_NAME} = require('../const/consts');

router.get('/gstest', isNotLoggedIn, async(req, res, next) => {
    try{
        console.log(findOneDocument)
        var data = { "Car" : "Car" }
        findOneDocument(data,COLLECTION_NAME.Car);
        
    
    
    }catch(e) {
    console.log(e)
    }

})

module.exports = router;