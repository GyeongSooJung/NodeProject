const mongoose = require('mongoose');

const { Schema } = mongoose;
const PublishSchema = new Schema({
    //Publish Category
    PUC: {
        type: Number,
        unique: true
    }, //Publish number of connection
    PUN: {
        type: Number,
        default: 0
    },
}, { collection: 'Publish' });

module.exports = mongoose.model('Publish', PublishSchema, 'Publish');