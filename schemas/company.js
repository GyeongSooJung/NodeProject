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
    CK: {
        type: String,
        required: true
    }, //Company_Kinds 
    //1 : 렌터카,  2 : 카센터, 3 :  출장정비, 4 : 출장세차,  5 : 택시운수업, 6 : 버스운수업,  7 : 타이어샵
    ADR: {
        type: String,
        required: true
    }, //Company_Address
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
