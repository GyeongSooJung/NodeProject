const mongoose = require('mongoose');

const { Schema } = mongoose;
const ServiceSchema = new Schema({
    //Service Name
    SN: {
        type: String,
        unique: true
    }, //Price
    PR: {
        type: Number
    }, //Point
    PO: {
        type: Number
    }, //Create Time
    CA: {
        type: Date,
        default: Date.now
    },
}, { collection: 'Service' });

module.exports = mongoose.model('Service', ServiceSchema, 'Service');
