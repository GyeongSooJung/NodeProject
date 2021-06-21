const mongoose = require('mongoose');
const {Publish} = require('../const/publish');

const { Schema } = mongoose;
const PublishSchema = new Schema(Publish, { collection: 'Publish' });

module.exports = mongoose.model('Publish', PublishSchema, 'Publish');