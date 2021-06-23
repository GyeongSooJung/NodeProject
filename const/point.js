const POINT = {
     "CID" : "CID",
     "PN" : "PN",
     "PO" : "PO",
     "MID" : "MID",
     "WNM" : "WNM",
     "CA" : "CA",
     
    schema : {
        //Company ID
        CID: {
            type: String,
            required: true,
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