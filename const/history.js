const HISTORY = {
    "WID" : "WID",
    "DID" : "DID",
    "CID" : "CID",
    "VID" : "VID",
    "WNM" : "WNM",
    "CNM" : "CNM",
    "DNM" : "DNM",
    "DNN" : "DNN",
    "VER" : "VER",
    "ET" : "ET",
    "PD" : "PD",
    "MP" : "MP",
    "FP" : "FP",
    "RC" : "RC",
    "RD" : "RD",
    "COS" : "COS",
    "CA" : "CA",
    schema : {
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
            type: String
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
        COS: { // 공정 코스, 0: 쾌속, 1: 일반, 2: 탈취
            type: Number,
        },
        CA: {
            type: Date,
            required: [true, 'CA is required!'],
            default: Date.now
        },
    }
}


exports.HISTORY = HISTORY;