const mongoose = require('mongoose');
const {Worker_delete} = require('../const/worker_delete');

// schema
const { Schema } = mongoose;
const worker_deleteSchema = new Schema(Worker_delete, { collection: 'worker_delete' });

module.exports = mongoose.model('worker_delete', worker_deleteSchema, 'worker_delete');
