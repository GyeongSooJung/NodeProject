const express = require('express');
const History = require('../schemas/history');
const Car = require('../schemas/car');
const Device = require('../schemas/device');
const Process = require('../schemas/process');
const moment = require('moment');
const {isNotLoggedIn} = require('./middleware');
const router = express.Router();

module.exports = router;