const mongoose = require('mongoose');

const { Schema } = mongoose;
const AlarmSchema = new Schema({
    
    //Message ID
    MID: {
        type: String,
        required: true,
    },//Company ID
    CID: {
        type: String,
    },//Point Name
    WNM: {
        type: String,
    },//result
    RE: {
        type: String,
    },//Create Time
    CA: {
        type: Date,
        default: Date.now
    },
    
}, { collection: 'Alarm' });

module.exports = mongoose.model('Alarm', AlarmSchema, 'Alarm');