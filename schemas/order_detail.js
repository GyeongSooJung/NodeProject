const mongoose = require('mongoose');

const { Schema } = mongoose;
const Order_DetailSchema = new Schema({
    // //Merchant_uid
    OID: {
        type: String,
        required: true
    }, // Order Goods Name
    OGN: {
        type: String,
        required: true
    }, // Order Goods Price
    OGP: {
        type: Number,
        required: true
    }, // Order Goods Option Type
    OOT: {
        type: Object
    }, // Order Goods Option Name
    OON: {
        type: Object
    }, // Order Goods Option Price
    OOP: {
        type: Object
    }, // Order Goods Total Price
    OTP: {
        type: Number
    }, // Order Goods Number
    ONU: {
        type: Number
    }, //Create Time
    CA: {
        type: Date,
        default: Date.now
    },
}, { collection: 'Order_Detail' });

module.exports = mongoose.model('Order_Detail', Order_DetailSchema, 'Order_Detail');
