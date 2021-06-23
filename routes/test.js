//Express
const express = require('express');
const router = express.Router();
//Module
var moment = require('moment');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const path = require('path');
const Mongoose = require('mongoose');

//Middleware
const { isNotLoggedIn } = require('./middleware');
  
const Schema = require("../schemas/schemas");

const {schemaSelect} = require('../schemas/schemas');
  
// router.get('/gstest', isNotLoggedIn, async(req, res, next) => {
//     try{
        
//     var {model} = require('./mongoware');
    
//     model(req, res, next, 'Car')
    
//     }catch(e) {
//     console.log(e)
//     }

// })

module.exports = router;