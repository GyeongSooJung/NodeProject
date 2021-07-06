const ORDER_DETAIL = {
    "OID" : "OID",
    "OGN" : "OGN",
    "OGP" : "OGP",
    "OOT" : "OOT",
    "OON" : "OON",
    "OOP" : "OOP",
    "OTP" : "OTP",
    "ONU" : "ONU",
    "CA" : "CA",
    
    schema : {
        // //Merchant_uid
        OID: {
            type: String,
            required: true
        }, // Order Goods Name
        OGN: {
            type: String,
            required: true
        }, // Order Goods Price
        OGP: {
            type: Number,
            required: true
        }, // Order Goods Option Type
        OOT: {
            type: Object
        }, // Order Goods Option Name
        OON: {
            type: Object
        }, // Order Goods Option Price
        OOP: {
            type: Object
        }, // Order Goods Total Price
        OTP: {
            type: Number
        }, // Order Goods Number
        ONU: {
            type: Number
        }, //Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
}

exports.ORDER_DETAIL = ORDER_DETAIL;