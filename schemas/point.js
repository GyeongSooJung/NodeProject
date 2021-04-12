const mongoose = require('mongoose');

const { Schema } = mongoose;
const PointSchema = new Schema({
    
    //Company ID
    CID: {
        type: String,
        required: true,
    },//Point Name
    PN: {
        type: String,
    },//Point
    PO: {
        type: Number
    },//Message ID
    MID: {
        type: String
    }, //Worker name
    WNM: {
        type: String
    }, //Create Time
    CA: {
        type: Date,
        default: Date.now
    },
    
}, { collection: 'Point' });

module.exports = mongoose.model('Point', PointSchema, 'Point');