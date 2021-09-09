const CAR_DELETE = {
  "CNU" : "CNU",
  "CC" : "CC",
  "CN" : "CN",
  "CPN" : "CPN",
  "SN" : "SN",
  "CA" : "CA",
  "UA" : "UA",
  
  schema : {  
    CNU: {
      type: String,
    },
    CC: {
      type: Number,
    },
    CN: {
      type: String,
    },
    CPN: {
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
}


exports.CAR_DELETE = CAR_DELETE;