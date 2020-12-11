const mongoose = require('mongoose');

// schema
const {Schema} = mongoose;
const processSchema = new Schema({
    HID: {
        type: String,
        required: [true, 'HID is required'],
    },
    ss: {
        type: String,
        required: [true, 'ss is required'],
    },
    ppm: {
        type: String,
        required: [true, 'ppm is required'],
    },
},
    {collection : 'process'}
);

module.exports = mongoose.model('process', processSchema,'process');