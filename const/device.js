const DEVICE  = {
    "CID" : "CID",
    "MD" : "MD",
    "MAC" : "MAC",
    "VER" : "VER",
    "NN" : "NN",
    "CA" : "CA",
    "UA" : "UA",
    "UT" : "UT",
    "UN" : "UN",
    schema : {
        CID: {
            type: String,
            required: [true, 'CID is required'],
        },
        MD: {
            type: String,
            trim: true,
            required: [true, 'MD is required!'],
        },
        MAC: {
            type: String,
            unique: true,
            required: [true, 'MAC is required!'],
        },
        VER: {
            type: String,
            required: [true, 'VER is required!'],
        },
        NN: {
            type: String,
        },
        CA: {
            type: Date,
            required: [true, 'CA is required!'],
            default: Date.now
        },
        UA: {
            type: Date,
            default: Date.now
        },//Time of Use
        UT: {
            type: Number,
        },//Number of Use
        UN: {
            type: Number,
            default: 0
        }
    }
}
exports.DEVICE = DEVICE;