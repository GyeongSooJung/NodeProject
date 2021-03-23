const mongoose = require('mongoose');

const { Schema } = mongoose;
const QRSchema = new Schema({
    //QR category
    QRC: {
        type: Number,
        unique: true
    }, //QR number of connection
    QRN: {
        type: Number,
        default: 0
    },
}, { collection: 'Service' });

module.exports = mongoose.model('QR', QRSchema, 'QR');