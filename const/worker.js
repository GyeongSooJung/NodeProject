const WORKER = {
    "CNU" : "CNU",
    "WN" : "WN",
    "PN" : "PN",
    "GID" : "GID",
    "EM" : "EM",
    "PU" : "PU",
    "CA" : "CA",
    "UA" : "UA",
    "AU" : "AU",
    "AC" : "AC",
    
    schema : {
        CNU: { // Company Number
            type: String,
            required: true,
        },
        WN: { // Worker Name
            type: String,
            required: true,
        },
        PN: { // Phone Number
            type: String,
            unique: true,
        },
        GID:{   // Google Account ID
          type: String,
        },
        EM: { // Email
            type: String,
            unique: true,
            required: true,
        },
        PU: { // Photo URL
            type: String,
        },
        CA: { // Created At
            type: Date,
            default: Date.now,
        },
        UA: { // Updated At
            type: Date,
            default: Date.now,
        },
        AU: { // Auth, 0: MK 관리자, 1: 작업자, 2: 사업주, 3: 대리점(장비,차량등록 권한)
            type: Number,
            default:1,
        },
        AC: { // Activated(장비작동권한)
            type: Boolean,
            default: false,
        },
    }
}

exports.WORKER = WORKER;