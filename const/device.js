const DEVICE  = {
    "CNU" : "CNU",
    "MD" : "MD",
    "MAC" : "MAC",
    "VER" : "VER",
    "NN" : "NN",
    "CA" : "CA",
    "UA" : "UA",
    "UT" : "UT",
    "UN" : "UN",
    schema : {
        CNU: {
            type: String,
            required: true,
        },
        MD: {
            type: String,
            trim: true,
            required: true,
        },
        MAC: {
            type: String,
            unique: true,
            required: true,
        },
        VER: {
            type: String,
            required: true,
        },
        NN: {
            type: String,
        },//Number of Use
        UN: {
            type: Number,
            default: 0
        },
        CA: {
            type: Date,
            required: true,
            default: Date.now
        },
        UA: {
            type: Date,
            default: Date.now
        }
    }
}
exports.DEVICE = DEVICE;