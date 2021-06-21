const mongoose = require('mongoose');
const {Car_delete} = require('../const/car_delete');

const { Schema } = mongoose;
const car_deleteSchema = new Schema(Car_delete);

module.exports = mongoose.model('Car_delete', car_deleteSchema);
