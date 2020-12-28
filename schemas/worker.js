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
    PN: { // Phone Name
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
        required: [true, 'CA is required!'],
        default: Date.now
    },
    UA: { // Updated At
        type: Date,
    },
    AU: { // Auth
        type: Number,
        required: [true, 'AU is required!'],
    },
    AC: { // Activated
        type: Boolean,
        required: [true, 'AC is required!'],
    },
}, { collection: 'worker' });

module.exports = mongoose.model('worker', workerSchema, 'worker');
