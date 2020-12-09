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
        required: [true, 'ST is required!'],
    },
    ET: {
        type: Date,
        required: [true, 'ET is required!'],
    },
    PD: {
        type: String,
        required: [true, 'PD is required!'],
    },
    MP: {
        type: Number,
        required: [true, 'MP is required!'],
    },
    FP: {
        type: Number,
        required: [true, 'FP is required!'],
    },
    RC: {
        type: Number,
        required: [true, 'RC is required!'],
    },
    CA: {
        type: Date,
        required: [true, 'CA is required!'],
    },
},
    {collection : 'history'}
);

module.exports = mongoose.model('history', historySchema,'history');