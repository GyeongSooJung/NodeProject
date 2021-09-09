const HISTORY = {
    "CNU" : "CNU",
    "CNA" : "CNA",
    "WNM" : "WNM",
    "CNM" : "CNM",
    "DNM" : "DNM",
    "DNN" : "DNN",
    "DMAC" : "DMAC",
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
        CNU: {
            type: String,
            required: true,
        }, // Company Name
        CNA: {
            type: String,
            required: true,
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
        DMAC: {
            type: String,
            required: true,
        },
        VER: { // 수행 공정의 펌웨어 버전
            type: String,
            default: null,
        },
        ET: {
            type: Date,
            required: true,
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
            required: true,
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
            required: true,
            default: Date.now
        },
    }
}


exports.HISTORY = HISTORY;