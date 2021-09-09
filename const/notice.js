const NOTICE = {
    "CNU" : "CNU",
    "TI" : "TI",
    "CO" : "CO",
    "POP" : "POP",
    "CA" : "CA",
    schema : {
        //Company Number
        CNU: {
            type: String,
            required: true,
        },//Title
        TI: {
            type: String,
        },//Contents
        CO: {
            type: String,
        },//Popup
        POP: {
            type: Boolean,
            default: false,
        },//Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
    
}

exports.NOTICE = NOTICE;