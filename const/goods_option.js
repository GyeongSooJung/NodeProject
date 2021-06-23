const GOODS_OPTION = {
    schema : {
        //Goods ID
        GID: {
            type: String
        },
        //GNA(goods name)
        GNA: {
            type: String
        }, //Option Type
        OT: {
            type: String
        }, //Option Name
        ON: {
            type: String,
            unique: true,
        }, //Option Price
        OP: {
            type: Number
        }, //Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
};

exports.GOODS_OPTION = GOODS_OPTION;