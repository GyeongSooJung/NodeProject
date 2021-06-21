const mongoose = require('mongoose');
const {Car} = require('../const/car');

const { Schema } = mongoose;
const carSchema = new Schema(Car);

module.exports = mongoose.model('Car', carSchema);
