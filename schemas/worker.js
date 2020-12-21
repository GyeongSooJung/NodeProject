const mongoose = require('mongoose');

// schema
const {Schema} = mongoose;
const workerSchema = new Schema({
    CID: {
        type: String,
        required: [true, 'CID is required'],
    },
    WN: {
        type: String,
        required: [true, 'WN is required!'],
    },
    PN: {
        type: String,
        unique: true,
    },
    EM: {
        type: String,
        unique: true,
        required: [true, 'EM is required!'],
    },
    PU: {
        type: String,
    },
    CA: {
        type: Date,
        required: [true, 'CA is required!'],
    },
    UA: {
        type: Date,
    },
    AU: {
        type: Number,
        required: [true, 'AU is required!'],
    },
    AC: {
        type: Boolean,
        required: [true, 'AC is required!'],
    },
    NC: {
        type: Boolean,
        default : false,
    },
},
    {collection : 'worker'}
);

module.exports = mongoose.model('worker', workerSchema,'worker');