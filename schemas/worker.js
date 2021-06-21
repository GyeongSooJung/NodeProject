const mongoose = require('mongoose');
const {Worker} = require('../const/worker');

// schema
const { Schema } = mongoose;
const workerSchema = new Schema(Worker, { collection: 'worker' });

module.exports = mongoose.model('worker', workerSchema, 'worker');
