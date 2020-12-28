const mongoose = require('mongoose');

const { Schema } = mongoose;
const CompanySchema = new Schema({
    //Name
    NA: {
        type: String,
        required: true,
        unique: false
    },
    //Company_Number
    CNU: {
        type: Number,
        required: true,
        unique: true
    },
    //Compnay_Name
    CNA: {
        type: String,
        required: true

    }, //Company_PhoneNumber
    PN: {
        type: String,
        required: true,
        unique: true
    }, //Company Mobile Number
    MN: {
        type: String,
        required: true,
        unique: true
    }, // PassWord
    PW: {
        type: String,
        required: true,
    },
    AH: {
        type: Boolean,
        required: true,
        default: false,
    },
    //E-mail
    EA: {
        type: String,
        unique: true
    },
    CA: {
        type: Date,
        default: Date.now
    }, //UpDate Date
    UA: {
        type: Date
    },
}, { collection: 'Company' });

module.exports = mongoose.model('Company', CompanySchema, 'Company');
