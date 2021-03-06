const COMPANY = {
    "NA" : "NA",
    "AL" : "AL",
    "ANA" : "ANA",
    "ANU" : "ANU",
    "CNU" : "CNU",
    "CNA" : "CNA",
    "CK" : "CK",
    "ADR" : "ADR",
    "PN" : "PN",
    "MN" : "MN",
    "PW" : "PW",
    "AH" : "AH",
    "EA" : "EA",
    "SPO" : "SPO",
    "POA" : "POA",
    "VAN" : "VAN",
    "VAD" : "VAD",
    "VA" : "VA",
    "CA" : "CA",
    "UA" : "UA",
    "CUA" : "CUA",
    "RUA" : "RUA",
    
    schema : {
        //Name
        NA: {
            type: String,
            required: true,
        },
        // Agent list
        AL: {
            type: [Object],
        },
        //Company_Agent_Name
        ANA: {
            type: String,
        },
        //Company_Agent_Number
        ANU: {
            type: String,
        },
        //Company_Number
        CNU: {
            type: String,
            required: true,
            unique: true
        },
        //Compnay_Name
        CNA: {
            type: String,
            required: true
    
        }, //Company_Kinds 
        //1 : 렌터카,  2 : 카센터, 3 :  출장정비, 4 : 출장세차,  5 : 택시운수업, 6 : 버스운수업,  7 : 타이어샵
        CK: {
            type: String,
            required: true
        }, //Company_Address
        ADR: {
            type: String,
            required: true
        }, //Company Phone Number
        PN: {
            type: String,
        }, //Company Mobile Number
        MN: {
            type: String,
        }, // PassWord
        PW: {
            type: String,
            required: true,
        },//MK_Admin_authorization
        AH: {
            type: Boolean,
            required: true,
            default: false,
        }, //E-mail
        EA: {
            type: String,
            unique: true
        }, //Service Point
        SPO: {
            type: Number,
            default: 0
        }, //Service Point Set Alarm
        POA: {
            type: Number,
            default: 5000
        }, //Virtual Account Number
        VAN: {
            type: Number
        }, //Virtual Account Date
        VAD: {
            type: Date,
            default: Date.now
        }, //Virtual Account Name
        VA: {
            type: String
        },
        CA: {
            type: Date,
            default: Date.now
        }, //UpDate Date
        UA: {
            type: Date,
            default: Date.now
        },//Car UpDate
        CUA: {
            type: Date,
            default: Date.now
        },//Renual UpDate
        RUA: {
            type: Date
        }, //UpDate Date
    }
}

exports.COMPANY = COMPANY;