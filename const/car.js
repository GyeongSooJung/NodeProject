const Car  = {

  CID: {
    type: String,
    require: true
  },
  //차종
  CC: {
    type: Number,
  },
  //차량번호
  CN: {
    type: String,
    require: true,
  },
  //차주 전화번호
  CPN: {
    type: String,
  },
  //차대번호
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

exports.Car = Car;