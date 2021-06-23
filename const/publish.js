const PUBLISH = {
    
    schema : {
        //Publish Category
        PUC: {
            type: Number,
            unique: true
        }, //Publish number of connection
        PUN: {
            type: Number,
            default: 0
        },
    }
}

exports.PUBLISH = PUBLISH;