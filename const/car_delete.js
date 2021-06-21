const Car_delete = {
    
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
}

console.log(Car_delete)

exports.Car_delete = Car_delete