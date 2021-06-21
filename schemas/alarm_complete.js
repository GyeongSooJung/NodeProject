const mongoose = require('mongoose');
const {Alarm_complete} = require('../const/alarm_complete');

const { Schema } = mongoose;
const AlarmSchema = new Schema( Alarm_complete, { collection: 'Alarm' });

module.exports = mongoose.model('Alarm', AlarmSchema, 'Alarm');