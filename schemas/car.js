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
    require : true
  },
  CN: {
    type: String,
    unique: true,
    require : true
  },
  SN: {
    type: String,
    unique: true,
    require : true
  },
  CA: {
    type: Date,
    unique: false,
  },
  UA: {
    type: Date,
    unique: false,
  },
});

module.exports = mongoose.model('Car', carSchema);
