const WORKER_DELETE = {
    
    schema : {
        CID: { // Company ID
            type: String,
        },
        WN: { // Worker Name
            type: String,
        },
        PN: { // Phone Number
            type: String,
        },
        GID:{   // Google Account ID
          type: String,
        },
        EM: { // Email
            type: String,
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
        AU: { // Auth, 0: MK 관리자, 1: 사업주, 2: 직업
            type: Number,
            default:2,
        },
        AC: { // Activated
            type: Boolean,
            default: false,
        },
    }
}

exports.WORKER_DELETE = WORKER_DELETE;