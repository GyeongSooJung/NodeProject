const mongoose = require('mongoose');

const { Schema } = mongoose;
const OrderSchema = new Schema({
    //Goods Name
    GN: {
        type: String,
        required: true,
    },//Amount
    AM: {
        type: Number,
        required: true,
    },//Company ID
    CID: {
        type: String,
        required: true,
    }, //Buyer Name
    BN: {
        type: String
    }, //Buyer Email
    BE: {
        type: String
    }, //Buyer Telephone
    BT: {
        type: String
    }, //Buyer Address
    BA: {
        type: String
    }, //Merchant_uid
    MID: {
        type: String,
        required: true
    }, //Payment Method
    PAM: {
        type: String
    }, //Payment Site
    PG: {
        type: String
    }, //Payment Status
    PS: {
        type: String
    },
    //Create Time
    CA: {
        type: Date,
        default: Date.now
    },
}, { collection: 'Order' });

module.exports = mongoose.model('Order', OrderSchema, 'Order');
