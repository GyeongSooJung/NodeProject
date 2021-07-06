const ALARM_COMPLETE = {
    "MID" : "MID",
    "CID" : "CID",
    "WNM" : "WNM",
    "RE" : "RE",
    "CA" : "CA",
    schema : {
        //Message ID
        MID: {
            type: String,
            required: true,
        },//Company ID
        CID: {
            type: String,
        },//Point Name
        WNM: {
            type: String,
        },//result
        RE: {
            type: String,
        },//Create Time
        CA: {
            type: Date,
            default: Date.now
        },
    }
    
}
exports.ALARM_COMPLETE = ALARM_COMPLETE;