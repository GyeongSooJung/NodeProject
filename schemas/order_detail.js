const mongoose = require('mongoose');
const {Order_detail} = require('../const/car');

const { Schema } = mongoose;
const Order_DetailSchema = new Schema(Order_detail, { collection: 'Order_Detail' });

module.exports = mongoose.model('Order_Detail', Order_DetailSchema, 'Order_Detail');
