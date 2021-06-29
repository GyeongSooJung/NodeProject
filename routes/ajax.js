//Express
const express = require('express');
const router = express.Router();

//Middleware
const { isLoggedIn, isNotLoggedIn, DataSet, agentDevide } = require('./middleware');

//query
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');

//company list
router.post('/company_list', isNotLoggedIn, DataSet, async(req, res, nex) => {
  const CID = req.body.CID;
  const companylist = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{},{});
  res.send({ result: true, pagelist : companylist });
  
});

// device list
router.post('/device_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var devices = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    
    var doc = {
      addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } ,
      lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } ,
      unwind : "$ANA",
      match : {},
      project : { MD : '$MD', VER : '$VER', MAC : '$MAC', NN : '$NN', UN : '$UN', CA : '$CA', ANA : '$ANA.ANA'},
      sort : { [sortText]: sortNum }
    }
    
    if(devices.length == 0) {
        return res.send({ result : "nothing" });
    }
    else {
      if (searchdate) {
      var searchtext2 = searchdate.split("~");
        if(search == "ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "MD") {
          doc.match = { "CID" : { $in : req.searchCID }, "MD" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "VER") {
          doc.match = { "CID" : { $in : req.searchCID }, "VER" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "MAC") {
          doc.match = { "CID" : { $in : req.searchCID }, "MAC" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "NN") {
          doc.match = { "CID" : { $in : req.searchCID }, "NN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
    }
    else {
        if (search =="ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="MD") {
          doc.match = { "CID" : { $in : req.searchCID }, "MD" : {$regex:searchtext} };
        }
        else if (search =="VER") {
          doc.match = { "CID" : { $in : req.searchCID }, "VER" : {$regex:searchtext} };
        }
        else if (search =="MAC") {
          doc.match = { "CID" : { $in : req.searchCID }, "MAC" : {$regex:searchtext} };
        }
        else if (search =="NN") {
          doc.match = { "CID" : { $in : req.searchCID }, "NN" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID } };
        }
    }
      
  }
    
    devices = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Device,doc,{});
    
    if(devices.length == 0) {
      return res.send({ result : "nothing"});
    }
    
    var devicelist = [];
    if(devices.length) {
      for(var i = 0; i < devices.length; i ++) {
        devicelist[i] = devices[i];
      }
    }
    
    res.send({ result: true, pagelist : devicelist });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});


//car list
router.post('/car_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var cars = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    
    var doc = {
      addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } ,
      lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } ,
      unwind : "$ANA",
      match : {},
      project : { CN : '$CN', CPN : '$CPN', CA : '$CA', ANA : '$ANA.ANA' },
      sort : { [sortText]: sortNum }
    }
    
    if(cars.length == 0) {
        return res.send({ result : "nothing" });
      }
    else {
      if (searchdate) {
      var searchtext2 = searchdate.split("~");
        if(search == "ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "CN") {
          doc.match = { "CID" : { $in : req.searchCID }, "CN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "CPN") {
          doc.match = { "CID" : { $in : req.searchCID }, "CPN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } ;
        }
      }
      else {
          if(search == "ANA") {
            doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} };
          }
          else if (search =="CN") {
            doc.match = { "CID" : { $in : req.searchCID }, "CN" : {$regex:searchtext} };
          }
          else if (search =="CPN") {
            doc.match = { "CID" : { $in : req.searchCID }, "CPN" : {$regex:searchtext} };
          }
          else {
            doc.match ={ "CID" : { $in : req.searchCID } };
          }
      }
    }
  
    cars = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Car,doc,{});
    if(cars.length == 0) {
      return res.send({ result : "nothing" });
    }
    
    var carlist = [];
    if(cars.length) {
      for(var i = 0; i < cars.length; i ++) {
        carlist[i] = cars[i];
      }
    }
    
    res.send({ result: true, pagelist : carlist });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//worker list
router.post('/worker_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var workers = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    if(CID == "5fd6c731a26c914fbad53ebe") {
      // 대리점 파악
      var franchiseCIDlist = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Company,{match : {CK : "MK 대리점"}, project : {CID : 1}},{});
      
      var CIDlist = [];
      for (var i = 0; i < franchiseCIDlist.length; i ++) {
        CIDlist.push(String(franchiseCIDlist[i]._id));
      }
      CIDlist.push(CID);
      //
      
      
      if(workers.length == 0) {
          return res.send({ result : "nothing" });
      }
      else {
        if (searchdate) {
        var searchtext2 = searchdate.split("~");
          if(search == "WN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": { $in : CIDlist }, "WN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
          else if(search == "PN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": { $in : CIDlist }, "PN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
          else if(search == "EM") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": { $in : CIDlist }, "EM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
          else {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID" : { $in : CIDlist }, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
        }
        else {
          if (search =="WN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": { $in : CIDlist }, "WN" : {$regex:searchtext} },{sort : { [sortText]: sortNum }});
            workers = await Worker.find({ "CID": { $in : CIDlist }, "WN" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          }
          else if (search =="PN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": { $in : CIDlist }, "PN" : {$regex:searchtext} },{sort : { [sortText]: sortNum }});
          }
          else if (search =="EM") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID": { $in : CIDlist }, "EM" : {$regex:searchtext} },{sort : { [sortText]: sortNum }});
          }
          else {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CID" : { $in : CIDlist } },{sort : { [sortText]: sortNum }})
          }
        }
      }
    }
    else {
      
      var doc = {
            addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } ,
            lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } ,
            unwind : "$ANA",
            match : {},
            project : { WN : '$WN', PN : '$PN', EM : '$EM', PU : '$PU', AU : '$AU', AC : '$AC', CA : '$CA', ANA : '$ANA.ANA'},
            sort : { [sortText]: sortNum }
          };
      if(workers.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (searchdate) {
          var searchtext2 = searchdate.split("~");
            
            if(search == "WN") {
              doc.match = { "CID" : { $in : req.searchCID }, "WN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
            else if(search == "PN") {
              doc.match = { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
            else if(search == "EM") {
              doc.match = { "CID" : { $in : req.searchCID }, "EM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
            else {
              doc.match = { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
        }
        else {
            if (search =="ANA") {
              doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} };
            }
            else if (search =="WN") {
              doc.match = { "CID" : { $in : req.searchCID }, "WN" : {$regex:searchtext} };
            }
            else if (search =="PN") {
              doc.match = { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext} };
            }
            else if (search =="EM") {
              doc.match = { "CID" : { $in : req.searchCID }, "EM" : {$regex:searchtext} };
            }
            else {
              doc.match = { "CID" : { $in : req.searchCID } };
            }
        }
      }
      workers = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Worker,doc,{});

    }
    
    if(workers.length == 0) {
      return res.send({ result : "nothing" });
    }
    
    
    var workerlist = [];
    if(workers.length) {
      for(var i = 0; i < workers.length; i ++) {
        workerlist[i] = workers[i];
      }
    }
    
    res.send({ result: true, pagelist : workerlist });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//history list
router.post('/history_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var historys = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CID.includes("#") == true) {
    req.searchCID = [CID.split("#")[0]]; // '#' 을 잘라낸 뒤 문자열을 배열에 담음($in은 배열만 가능하기 때문)
  }
  else {
    req.searchCID = req.searchCID; // 기존 middleware에서 받아온 본사,지점 CID 그대로 다시 담음
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    var doc = {
            addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } ,
            lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } ,
            unwind : "$ANA",
            match : {},
            project : { CNM : '$CNM', DNM : '$DNM', ET : '$ET', PD : {$size : '$PD'}, WNM : "$WNM", ANA : '$ANA.ANA' },
            sort : { [sortText]: sortNum }
          };
          
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      if(historys.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "CNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "CNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "DNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "DNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "WNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } }
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } }
        }
      }
    }
    else {
      if(historys.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} }
        }
        else if (search =="CNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "CNM" : {$regex:searchtext} }
        }
        else if (search =="DNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "DNM" : {$regex:searchtext} }
        }
        else if (search =="WNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext} }
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID } }
        }
      }
    }
    
    historys = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.History,doc,{})
    if(historys.length == 0) {
      return res.send({ result : "nothing"});
    }
    
    var historylist = [];
    if(historys.length) {
      for(var i = 0; i < historys.length; i ++) {
        historylist[i] = historys[i];
      }
    }
    
    res.send({ result: true, pagelist : historylist });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//pay_list
router.post('/pay_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var orders = new Object;
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  
  try {
    
    var doc = {
            addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } ,
            lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } ,
            unwind : "$ANA",
            match : {},
            project : { MID : "$MID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA' },
            sort : { [sortText]: sortNum }
          }
    
    if(orders.length == 0) {
      return res.send({ result : "nothing" });
    }
    else {
      if (searchdate) {
        var searchtext2 = searchdate.split("~");
          if(search == "ANA") {
            doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else if(search == "MID") {
            doc.match = { "CID" : { $in : req.searchCID }, "MID" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else if(search == "GN") {
            doc.match = { "CID" : { $in : req.searchCID }, "GN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else if(search == "AM") {
            doc.match = { "CID" : { $in : req.searchCID }, "strAM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else {
            doc.match = { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
      }
      else {
        if (search =="ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="MID") {
          doc.match = { "CID" : { $in : req.searchCID }, "MID" : {$regex:searchtext} };
        }
        else if (search =="GN") {
          doc.match = { "CID" : { $in : req.searchCID }, "GN" : {$regex:searchtext} };
        }
        else if (search =="AM") {
          doc.match = { "CID" : { $in : req.searchCID }, "strAM" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID } };
        }
      }
    }
    orders = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Order,doc,{});
    
    if(orders.length == 0) {
      return res.send({ result : "nothing"});
    }
    
    var orderlist = [];
    if(orders.length) {
      for(var i = 0; i < orders.length; i ++) {
        orderlist[i] = orders[i];
      }
    }
    
    res.send({ result: true, pagelist : orderlist });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//pay_list_detail
router.post('/pay_list_detail', isNotLoggedIn, DataSet, async(req, res, next) => {
  const { merchant_uid } = req.body;

  const orderGoods = await modelQuery(QUERY.Find,COLLECTION_NAME.OrderDetail,{ "OID" : merchant_uid },{});
  
  res.send({ status : "success", orderGoods : orderGoods });
});

//point_list
router.post('/point_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var points = new Object;
  
  // 스키마 변경 시 삭제예정
  if(search == "pointPN") {
    search = "PN";
  }
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    
    var doc = {
            addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } ,
            lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } ,
            unwind : "$ANA",
            match : {},
            project : { PN : '$PN', PO : '$PO', CA : '$CA', ANA : '$ANA.ANA' },
            sort : { [sortText]: sortNum }
          }
    
    if(points.length == 0) {
        return res.send({ result : "nothing" });
    }   
    else {
      if (searchdate) {
      var searchtext2 = searchdate.split("~");
        if(search == "ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "PN") {
          doc.match = { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "PO") {
          doc.match = { "CID" : { $in : req.searchCID }, "strPO" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
      }
      else {
        if (search =="ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="PN") {
          doc.match = { "CID" : { $in : req.searchCID }, "PN" : {$regex:searchtext} };
        }
        else if (search =="PO") {
          doc.match = { "CID" : { $in : req.searchCID }, "strPO" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID } };
        }
      }
    }
    
    
    
    points = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Point,doc,{})
    
    if(points.length == 0) {
      return res.send({ result : "nothing"});
    }
    
    var pointlist = [];
    if(points.length) {
      for(var i = 0; i < points.length; i ++) {
        pointlist[i] = points[i];
      }
    }
    
    res.send({ result: true, pagelist : pointlist });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//alarmtalk_list
router.post('/alarmtalk_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.body.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var alarms = new Object;
  
  // 정렬 기능
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = 1;
  }
  else {
    sortText = sort;
    sortNum = -1;
  }
  
  try {
    
    var doc = {
            addFields : { objCID : { $convert: { input: '$CID', to : 'objectId', onError: '',onNull: '' } } } ,
            lookup : { from : "Company", localField : "objCID", foreignField : "_id", as : "ANA" } ,
            unwind : "$ANA",
            match : {},
            project : { WNM : '$WNM', RE : '$RE', CA : '$CA', ANA : '$ANA.ANA' },
            sort : { [sortText]: sortNum }
          };
    
    if(alarms.length == 0) {
      return res.send({ result : "nothing" });
    }
    else {
      if (searchdate) {
      var searchtext2 = searchdate.split("~");
        if(search == "ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "WNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "RE") {
          doc.match = { "CID" : { $in : req.searchCID }, "RE" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
      }
      else {
        if (search =="ANA") {
          doc.match = { "CID" : { $in : req.searchCID }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="WNM") {
          doc.match = { "CID" : { $in : req.searchCID }, "WNM" : {$regex:searchtext} };
        }
        else if (search =="RE") {
          doc.match = { "CID" : { $in : req.searchCID }, "RE" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CID" : { $in : req.searchCID } };
        }
      }
    }
      
    alarms = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Alarm,doc,{})
    if(alarms.length == 0) {
      return res.send({ result : "nothing"});
    }
    
    var alarmlist = [];
    if(alarms.length) {
      for(var i = 0; i < alarms.length; i ++) {
        alarmlist[i] = alarms[i];
      }
    }
    
    return res.send({ result: true, pagelist : alarmlist });
    
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//agent_list
router.post('/agent_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  var {data} = req.body;
  data = JSON.parse(data);
  const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{_id : data.CID},{});
  var al = companyone.AL; 
  res.send({al : al});
});

//agent
router.post('/agent', isNotLoggedIn, DataSet, async(req, res, next) => {
  var {data} = req.body;
  data = JSON.parse(data);
  var ANA = data.ANA;
  var ANU = data.ANU;
  var CID = data.CID;
  var type = data.type;
  
  var b_ANA = String(data.b_ANA);
  var b_ANU = String(data.b_ANU);
  
  
  var jsondata = {};
  var anaarray = [];
  var anuarray = [];
  
  try {
    const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{_id : CID},{});
      var al = companyone.AL;
      
      
      for (var i = 0; i < al.length; i ++) {
        anaarray.push(String(Object.keys(al[i])));
        anuarray.push(String(Object.values(al[i])));
      }
    
    if (type == 'join') {
      
      if(anaarray.includes(ANA)) {
        res.send({type : "agent", result : "dupleN"});
      }
      else if (anuarray.includes(ANU)) {
        res.send({type : "agent", result : "dupleC"});
      }
      else {
        jsondata[ANA] = ANU;
        al.push(jsondata);
        await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID}, update : {AL : al}},{})
        res.send({type : "agent", result : "success"});
      }
    }
    else if (type =='edit') {
      
      if(anaarray.includes(ANA)) {
        if((ANA == b_ANA)) {
          if(anuarray.includes(ANU)) {
            if((ANU == b_ANU)) {
              res.send({type : "agent", result : "successedit"});
            }
            else {
              res.send({type : "agent", result : "dupleC"});
            }
          }
          else {
            for (var i =0; i < al.length; i ++) {
              if(Object.keys(al[i]).includes(ANA)) {
                al[i][ANA] = ANU;
              }
            }
            await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID},update : {AL : al}},{});
            const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{_id : CID},{});
            const agentone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ CNU : companyone.CNU.substring(0,10) + b_ANU},{});
            if(agentone)
            await modelQuery(QUERY.Update,COLLECTION_NAME.Company,{where : { CNU : companyone.CNU.substring(0,10) + b_ANU} , update : { AL : al, CNU : companyone.CNU.substring(0,10) + ANU, ANA : ANA, ANU : ANU }},{});
            res.send({type : "agent", result : "successedit"});
          }
          
        }
        else {
          res.send({type : "agent", result : "dupleN"});
        }
        
      }
      else {
        if (anuarray.includes(ANU)) {
          if (ANU == b_ANU) {
            for (var i =0; i < al.length; i ++) {
              if(Object.values(al[i]).includes(ANU)) {
                al.splice(i,1);
                jsondata[ANA] = ANU;
                al.push(jsondata); 
                
                await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID},update : {AL : al}},{});
                const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{_id : CID},{});
                const agentone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ CNU : companyone.CNU.substring(0,10) + b_ANU},{});
                if(agentone)
                await modelQuery(QUERY.Update,COLLECTION_NAME.Company,{where : { CNU : companyone.CNU.substring(0,10) + b_ANU} , update : { AL : al, CNU : companyone.CNU.substring(0,10) + ANU, ANA : ANA, ANU : ANU }},{});
                
                res.send({type : "agent", result : "successedit"});
              }
            }
            
          }
          else {
            res.send({type : "agent", result : "dupleC"});
          }
        }
        else {
          for (var i =0; i < al.length; i ++) {
            if(Object.values(al[i])[0] == b_ANU) {
              al.splice(i,1);
              jsondata[ANA] = ANU;
              al.push(jsondata);
              await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID},update : {AL : al}},{});
              const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{_id : CID},{});
              const agentone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ CNU : companyone.CNU.substring(0,10) + b_ANU},{});
              if(agentone)
              await modelQuery(QUERY.Update,COLLECTION_NAME.Company,{where : { CNU : companyone.CNU.substring(0,10) + b_ANU} , update : { AL : al, CNU : companyone.CNU.substring(0,10) + ANU, ANA : ANA, ANU : ANU }},{});
              
              res.send({type : "agent", result : "successedit"});
  
            }
          }
        }
      }
    }
    else if (type =='delete') {
      for (var i =0; i < al.length; i ++) {
        if(Object.keys(al[i]).includes(b_ANA)) {
          al.splice(i,1);
        }
      }
      
      await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID},update : {AL : al}},{});
      
      res.send({type : "agent", result : "successdelete"});
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//notice_list
router.post('/notice_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  
  if(search != "") {
    if(search == "CA") {
      var searchtext2 = searchdate.split("~");
      var notices = await modelQuery(QUERY.Find,COLLECTION_NAME,{ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} },{});
      if(notices.length == 0) 
      res.send({ result : "nothing" });
    }
    else {
      if(!searchdate) {
        try {
          if(search == "TI") {
            var notices = await modelQuery(QUERY.Find,COLLECTION_NAME,{ "CID": CID, "TI" : {$regex:searchtext} },{});
            if(notices.length == 0) 
            res.send({result : "nothing"});
          }
        } catch(e) {
          res.send({ result: false });
        }
      }
      else {
        try {
          if(search == "TI") {
            var notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "CID": CID, "TI" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} },{});
            if(notices.length == 0) 
            res.send({result : "nothing"});
          }
        } catch(e) {
          res.send({ result: false });
        }
      }
    }
  }
  else {
    var notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "CID": CID },{});
    
    if(sort == "TI") {
        notices.sort(function (a,b) {
          var ax = [], bx = [];
          a = JSON.stringify(a.TI);
          b = JSON.stringify(b.TI);
        
          a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
          b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
          
          while(ax.length && bx.length) {
              var an = ax.shift();
              var bn = bx.shift();
              var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
              if(nn) return nn;
          }
      
          return ax.length - bx.length;
        });
    }
    
    else if(sort == "TI2") {
                  notices.sort(function (a,b) {
          var ax = [], bx = [];
          a = JSON.stringify(a.TI);
          b = JSON.stringify(b.TI);
        
          a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
          b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
          
          while(ax.length && bx.length) {
              var an = bx.shift();
              var bn = ax.shift();
              var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
              if(nn) return nn;
          }
      
          return ax.length - bx.length;
        });
    }
    
    else if(sort == "CA") { 
      var notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "CID": CID },{sort : { CA: -1 }});
    }
    
    else if(sort == "CA2"){
      var notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "CID": CID },{sort : { CA: 1 }});
    }
    else {
      var notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "CID": CID },{sort : { CA: -1 }});
    }
  }
  
  var noticelist = [];
  if(notices.length) {
    for(var i = 0; i < notices.length; i ++) {
      noticelist[i] = notices[i];
    }
  }
  res.send({ result: true, pagelist : noticelist });
 
});


module.exports = router;