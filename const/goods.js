const Goods  = {
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

exports.Goods = Goods;