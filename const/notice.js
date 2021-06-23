const NOTICE = {
    
    
    schema : {
        //Company ID
        CID: {
            type: String,
            required: true,
        },//Title
        TI: {
            type: String,
        },//Contents
        CO: {
            type: String,
        },//Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
    
}

exports.NOTICE = NOTICE;