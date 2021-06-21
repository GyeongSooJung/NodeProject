const mongoose = require('mongoose');
const {Notice} = require('../const/notice');

const { Schema } = mongoose;
const NoticeSchema = new Schema(Notice, { collection: 'Notice' });

module.exports = mongoose.model('Notice', NoticeSchema, 'Notice');