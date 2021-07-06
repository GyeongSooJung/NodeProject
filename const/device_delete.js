const DEVICE_DELETE = {
    "CID" : "CID",
    "MD" : "MD",
    "MAC" : "MAC",
    "VER" : "VER",
    "NN" : "NN",
    "CA" : "CA",
    "UA" : "UA",
    "UT" : "UT",
    schema : {
        CID: {
            type: String,
        },
        MD: {
            type: String,
        },
        MAC: {
            type: String,
        },
        VER: {
            type: String,
        },
        NN: {
            type: String,
        },
        CA: {
            type: Date,
            default: Date.now
        },
        UA: {
            type: Date,
            default: Date.now
        },
        UT: {
            type: Number,
        }
    }
}

exports.DEVICE_DELETE = DEVICE_DELETE;