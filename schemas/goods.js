const mongoose = require('mongoose');
const {Goods} = require('../const/goods');

const { Schema } = mongoose;
const GoodsSchema = new Schema(Goods, { collection: 'Goods' });

module.exports = mongoose.model('Goods', GoodsSchema, 'Goods');