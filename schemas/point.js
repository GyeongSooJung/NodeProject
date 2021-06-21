const mongoose = require('mongoose');
const {Point} = require('../const/point');

const { Schema } = mongoose;
const PointSchema = new Schema(Point, { collection: 'Point' });

module.exports = mongoose.model('Point', PointSchema, 'Point');