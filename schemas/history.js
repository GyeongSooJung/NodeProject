const mongoose = require('mongoose');

// schema
const {Schema} = mongoose;
const historySchema = new Schema({
    WID: {
        type: String,
        required: [true, 'WID is required!'],
    },
    DID: {
        type: String,
        required: [true, 'DID is required!'],
    },
    CID: {
        type: String,
        required: [true, 'CID is required!'],
    },
    VID: {
        type: String,
        required: [true, 'VID is required!'],
    },
    ST: {
        type: Date,
        default: Date.now(),
    },
    ET: {
        type: Date,
        required: [true, 'ET is required!'],
    },
    PD: {
        type: [String],
    },
    MP: {
        type: Number,
        default: 0.0,
    },
    FP: {
        type: Number,
        default: 0.0,
    },
    RC: {
        type: Number,
        required: [true, 'RC is required!'],
    },
    CA: {
        type: Date,
        required: [true, 'CA is required!'],
        default: Date.now
    },
},
    {collection : 'history'}
);

module.exports = mongoose.model('history', historySchema,'history');