const Alarm_complete = {
    
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
exports.Alarm_complete = Alarm_complete;