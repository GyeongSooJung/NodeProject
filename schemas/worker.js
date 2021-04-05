const mongoose = require('mongoose');

// schema
const { Schema } = mongoose;
const workerSchema = new Schema({
    CID: { // Company ID
        type: String,
        required: [true, 'CID is required'],
    },
    WN: { // Worker Name
        type: String,
        required: [true, 'WN is required!'],
    },
    PN: { // Phone Number
        type: String,
        unique: true,
    },
    GID:{   // Google Account ID
      type: String,
    },
    EM: { // Email
        type: String,
        unique: true,
        required: [true, 'EM is required!'],
    },
    PU: { // Photo URL
        type: String,
    },
    CA: { // Created At
        type: Date,
        default: Date.now,
    },
    UA: { // Updated At
        type: Date,
        default: Date.now,
    },
    AU: { // Auth, 0: MK 관리자, 1: 사업주, 2: 직업
        type: Number,
        default:2,
    },
    AC: { // Activated
        type: Boolean,
        default: false,
    },
}, { collection: 'worker' });

module.exports = mongoose.model('worker', workerSchema, 'worker');
