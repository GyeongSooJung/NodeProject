const mongoose = require('mongoose');

// schema
const {Schema} = mongoose;
const device_deleteSchema = new Schema({
    CID: {
        type: String,
    },
    MD: {
        type: String,
    },
    MAC: {
        type: String,
    },
    VER: {
        type: String,
    },
    NN: {
        type: String,
    },
    CA: {
        type: Date,
        default: Date.now
    },
    UA: {
        type: Date,
        default: Date.now
    },
    UT: {
        type: Number,
    }
},
    {collection : 'device_delete'}
);

// // virtuals(DB에 기록하고 싶지는 않지만 사용하고 사용하고 싶어서)
// deviceSchema.virtual('PWConfirmation')
//     .get(function(){ return this._PWconfirmation; })
//     .set(function(value){ this._PWconfirmation=value; });

// deviceSchema.virtual('originalPW')
//     .get(function(){ return this._originalPW; })
//     .set(function(value){ this._originalPW=value; });

// deviceSchema.virtual('currentPW')
//     .get(function(){ return this._currentPW; })
//     .set(function(value){ this._currentPW=value; });

// deviceSchema.virtual('newPW')
//     .get(function(){ return this._newPW; })
//     .set(function(value){ this._newPW=value; });
  
// // password validation
// deviceSchema.path('password').validate(function(v) {
//     const device = this;

//     // create device
//     if(device.isNew){
//         if(!device.PWconfirmation){
//           device.invalidate('PWconfirmation', 'Password Confirmation is required.');
//         }
    
//         if(device.password !== device.PWconfirmation) {
//           device.invalidate('PWconfirmation', 'Password Confirmation does not matched!');
//         }
//     }
//     // update device
//     if(!device.isNew){
//         if(!device.currentPW){
//           device.invalidate('currentPW', 'Current Password is required!');
//         }
//         else if(device.currentPW != device.originalPW){
//           device.invalidate('currentPW', 'Current Password is invalid!');
//         }
        
//         if(device.newPW !== device.PWconfirmation) {
//           device.invalidate('PWconfirmation', 'Password Confirmation does not matched!');
//         }
//     }
// });

module.exports = mongoose.model('device_delete', device_deleteSchema,'device_delete');