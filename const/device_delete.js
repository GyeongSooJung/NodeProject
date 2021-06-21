const Device_delete = {
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

exports.Device_delete = Device_delete;