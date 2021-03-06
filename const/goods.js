const GOODS  = {
    "GN" : "GN",
    "GP" : "GP",
    "GO" : "GO",
    "GE" : "GE",
    "GI" : "GI",
    "CA" : "CA",
    schema : {
        //Goods Name
        GN: {
            type: String,
            unique: true,
            required: true
        }, //Price
        GP: {
            type: Number
        }, //Option
        GO: {
            type: Boolean,
            default: false
        }, //Explanation
        GE: {
            type: String
        }, //Img
        GI: {
            type: String
        }, //Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
}

exports.GOODS = GOODS;