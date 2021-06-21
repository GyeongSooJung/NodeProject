const mongoose = require('mongoose');
const {History} = require('../const/history');

// schema
const { Schema } = mongoose;
const historySchema = new Schema(History, { collection: 'history' });

module.exports = mongoose.model('history', historySchema, 'history');
