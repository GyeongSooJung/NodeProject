const ORDER = {
    "CNU" : "CNU",
    "GN" : "GN",
    "AM" : "AM",
    "BN" : "BN",
    "BE" : "BE",
    "BT" : "BT",
    "BA" : "BA",
    "MID" : "MID",
    "IID" : "IID",
    "PAM" : "PAM",
    "PG" : "PG",
    "PS" : "PS",
    "CA" : "CA",
    
    schema : {
        //Company Number
        CNU: {
            type: String,
        },//Goods Name
        GN: {
            type: String,
            required: true,
        },//Amount
        AM: {
            type: Number,
            required: true,
        },//Buyer Name
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
}

exports.ORDER = ORDER;