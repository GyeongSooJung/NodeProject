const mongoose = require('mongoose');

const { Schema } = mongoose;
const QRSchema = new Schema({
    //QR Sticker type
    QRT: {
        type: Number,
        required: true,
    },
    //QR count
    QRC: {
        type: Number,
        default: 0,
    }
}, { collection: 'QR' });

module.exports = mongoose.model('QR', QRSchema, 'QR');