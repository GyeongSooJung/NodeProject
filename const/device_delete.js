const DEVICE_DELETE = {
    "CNU" : "CNU",
    "MD" : "MD",
    "MAC" : "MAC",
    "VER" : "VER",
    "NN" : "NN",
    "CA" : "CA",
    "UA" : "UA",
    "UT" : "UT",
    schema : {
        CNU: {
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
        UT: {
            type: Number,
        },
        CA: {
            type: Date,
            default: Date.now
        },
        UA: {
            type: Date,
            default: Date.now
        }
    }
}

exports.DEVICE_DELETE = DEVICE_DELETE;