const mongoose = require('mongoose');

const { Schema } = mongoose;
const carSchema = new Schema({
  
  CID: {
    type: String,
    unique: false,
    require : true
  },
  CC: {
    type: Number,
    unique: false,
  },
  CN: {
    type: String,
    unique: true,
    require : true
  },
  SN: {
    type: String,
    unique: true,
  },
  CA: {
    type: Date,
    default: Date.now(),
  },
  UA: {
    type: Date,
    default: Date.now
    default: Date.now(),
  },
});

module.exports = mongoose.model('Car', carSchema);
