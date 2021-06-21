const Order = {
    //Goods Name
    GN: {
        type: String,
        required: true,
    },//Amount
    AM: {
        type: Number,
        required: true,
    },//Amount
    CAM: {
        type: Number,
        default: 0,
    },//Company ID
    CID: {
        type: String,
        required: true,
    }, //Buyer Name
    BN: {
        type: String
    }, //Buyer Email
    BE: {
        type: String
    }, //Buyer Telephone
    BT: {
        type: String
    }, //Buyer Address
    BA: {
        type: String
    }, //Merchant_uid
    MID: {
        type: String,
        required: true
    }, //imp_uid
    IID: {
        type: String,
        required: true
    }, //Payment Method
    PAM: {
        type: String
    }, //Payment Site
    PG: {
        type: String
    }, //Payment Status
    PS: {
        type: String
    },
    //Create Time
    CA: {
        type: Date,
        default: Date.now
    },
}

exports.Order = Order;