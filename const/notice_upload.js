const NOTICE_UPLOAD = {
    "OID" : "OID",
    "FI" : "FI",
    "CA" : "CA",
    schema : {
        //Linked file Object ID(ex. notice._id)
        OID: {
            type: String
        },
        //File Destination + File Name
        FI: {
            type: String
        },
        //File Original Name
        ON: {
            type: String
        },
        //Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
    
}

exports.NOTICE_UPLOAD = NOTICE_UPLOAD;