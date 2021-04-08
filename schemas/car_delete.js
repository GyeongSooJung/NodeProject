const mongoose = require('mongoose');

const { Schema } = mongoose;
const car_deleteSchema = new Schema({

  CID: {
    type: String,
  },
  CC: {
    type: Number,
  },
  CN: {
    type: String,
  },
  SN: {
    type: String,
  },
  CA: {
    type: Date,
    default: Date.now,
  },
  UA: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Car_delete', car_deleteSchema);
