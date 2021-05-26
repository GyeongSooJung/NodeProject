const mongoose = require('mongoose');

const { Schema } = mongoose;
const NoticeSchema = new Schema({
    
    //Company ID
    CID: {
        type: String,
        required: true,
    },//Title
    TI: {
        type: String,
    },//Contents
    CO: {
        type: String,
    },//Create Time
    CA: {
        type: Date,
        default: Date.now
    },
    
}, { collection: 'Notice' });

module.exports = mongoose.model('Notice', NoticeSchema, 'Notice');