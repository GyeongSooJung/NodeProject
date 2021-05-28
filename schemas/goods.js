const mongoose = require('mongoose');

const { Schema } = mongoose;
const GoodsSchema = new Schema({
    //Goods Name
    GN: {
        type: String,
        unique: true,
        required: true
    }, //Price
    GP: {
        type: Number
    }, //Option
    GO: {
        type: Boolean,
        default: false
    }, //Explanation
    GE: {
        type: String
    }, //Img
    GI: {
        type: String
    }, //Create Time
    CA: {
        type: Date,
        default: Date.now
    },
}, { collection: 'Goods' });

module.exports = mongoose.model('Goods', GoodsSchema, 'Goods');