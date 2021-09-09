const POINT = {
     "CNU" : "CNU",
     "PN" : "PN",
     "PO" : "PO",
     "MID" : "MID",
     "WNM" : "WNM",
     "CA" : "CA",
     "CNU" : "CNU",
     
    schema : {
        //Company Number
        CNU: {
            type: String,
        },//Point Name
        PN: {
            type: String,
        },//Point
        PO: {
            type: Number
        },//Message ID
        MID: {
            type: String
        }, //Worker name
        WNM: {
            type: String
        }, //Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
    
}

exports.POINT = POINT;