const mongoose = require('mongoose');

const { Schema } = mongoose;
const Goods_OptionSchema = new Schema({
    //Goods ID
    GID: {
        type: String
    },
    //GNA(goods name)
    GNA: {
        type: String
    }, //Option Type
    OT: {
        type: String
    }, //Option Name
    ON: {
        type: String,
        unique: true,
    }, //Option Price
    OP: {
        type: Number
    }, //Create Time
    CA: {
        type: Date,
        default: Date.now
    },
}, { collection: 'Goods_Option' });

module.exports = mongoose.model('Goods_Option', Goods_OptionSchema, 'Goods_Option');