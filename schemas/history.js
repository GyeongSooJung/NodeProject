const mongoose = require('mongoose');

// schema
const { Schema } = mongoose;
const historySchema = new Schema({
    WID: {
        type: String,
        required: [true, 'WID is required!'],
    },
    DID: {
        type: String,
        required: [true, 'DID is required!'],
    },
    CID: {
        type: String,
        required: [true, 'CID is required!'],
    },
    VID: {
        type: String,
        required: [true, 'VID is required!'],
    },
    WNM: { // 작업자명
        type: String,
        default: null,
    },
    CNM: { //차량번호(번호판)
        type: String,
        default: null,
    },
    DNM: { // 장비명(모델명)
        type: String,
        default: null,
    },
    DNN: { // 장비 별명
        type: String,
        default: null,
    },
    VER: { // 수행 공정의 펌웨어 버전
        type: String,
        default: null,
    },
    ET: {
        type: Date,
        required: [true, 'ET is required!'],
    },
    PD: {
        type: [String],
        default: null,
    },
    MP: {
        type: Number,
        default: null,
    },
    FP: {
        type: Number,
        default: null,
    },
    RC: {
        type: Number,
        required: [true, 'RC is required!'],
    },
    RD: { // ResultDetail, 공정 상세 코드
        type: [Number()],
        default: null,
    },
    CA: {
        type: Date,
        required: [true, 'CA is required!'],
        default: Date.now
    },
}, { collection: 'history' });

module.exports = mongoose.model('history', historySchema, 'history');
