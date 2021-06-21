const mongoose = require('mongoose');
const {Order} = require('../const/order');

const { Schema } = mongoose;
const OrderSchema = new Schema(Order, { collection: 'Order' });

module.exports = mongoose.model('Order', OrderSchema, 'Order');
