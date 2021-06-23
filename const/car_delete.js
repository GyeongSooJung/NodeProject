const CAR_DELETE = {
  "CID" : "CID",
  "CC" : "CC",
  "CN" : "CN",
  "SN" : "SN",
  "CA" : "CA",
  "UA" : "UA",
  
  schema : {  
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
}


exports.CAR_DELETE = CAR_DELETE;