//Express
const express = require('express');
const router = express.Router();

//Middleware
const { isLoggedIn, isNotLoggedIn, DataSet, agentDevide } = require('./middleware');

//query
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');

//company list
router.post('/company_list', isNotLoggedIn, DataSet, async(req, res, next) => {
  const CNU = req.body.CNU;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var companys = new Object;
  
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
    
    if(companys.length == 0) {
        return res.send({ result : "nothing" });
    }
    else {
      if (searchdate) {
        var searchtext2 = searchdate.split("~");
        if(search == "CNA") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "CNA" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }},{});
        }
        else if(search == "ANA") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "ANA" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }},{});
        }
        else if(search == "CNU") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "CNU" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }},{});
        }
        else if(search == "NA") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "NA" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }},{});
        }
        else {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }},{});
        }
      }
      else {
        if (search =="CNA") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "CNA" : {$regex:searchtext} },{sort : { [sortText]: sortNum }},{});
        }
        else if (search =="ANA") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "ANA" : {$regex:searchtext} },{sort : { [sortText]: sortNum }},{});
        }
        else if (search =="CNU") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "CNU" : {$regex:searchtext} },{sort : { [sortText]: sortNum }},{});
        }
        else if (search =="NA") {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{ "NA" : {$regex:searchtext} },{sort : { [sortText]: sortNum }},{});
        }
        else {
          companys = await modelQuery(QUERY.Find,COLLECTION_NAME.Company,{},{sort : { [sortText]: sortNum }});
        }
    }
    
  }
    
    if(companys.length == 0) {
      return res.send({ result : "nothing"});
    }
    
    var companylist = [];
    if(companys.length) {
      for(var i = 0; i < companys.length; i ++) {
        companylist[i] = companys[i];
      }
    }
    
    res.send({ result: true, pagelist : companylist });
  
  } catch(err) {
    console.error(err);
    next(err);
  }
  
});

// device list
router.post('/device_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CNU = req.body.CNU;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var devices = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CNU.includes("#") == true) {
    req.searchCNU = CNU.split("#")[0]; // '#' 을 잘라
  }
  else {
    req.searchCNU = req.searchCNU; // 기존 middleware에서 받아온 본사,지점 CNU 그대로 다시 담음
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
      lookup : { from : "Company", localField : "CNU", foreignField : "CNU", as : "ANA" } ,
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
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "MD") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "MD" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "VER") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "VER" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "MAC") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "MAC" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "NN") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "NN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
      }
      else {
        if (search =="ANA") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="MD") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "MD" : {$regex:searchtext} };
        }
        else if (search =="VER") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "VER" : {$regex:searchtext} };
        }
        else if (search =="MAC") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "MAC" : {$regex:searchtext} };
        }
        else if (search =="NN") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "NN" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU } };
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
  const CNU = req.body.CNU;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var cars = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CNU.includes("#") == true) {
    req.searchCNU = CNU.split("#")[0]; // '#' 을 잘라
  }
  else {
    req.searchCNU = req.searchCNU; // 기존 middleware에서 받아온 본사,지점 CNU 그대로 다시 담음
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
      lookup : { from : "Company", localField : "CNU", foreignField : "CNU", as : "ANA" } ,
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
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "CN") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "CPN") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CPN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } } ;
        }
      }
      else {
          if(search == "ANA") {
            doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext} };
          }
          else if (search =="CN") {
            doc.match = { "CNU": { $regex: req.searchCNU }, "CN" : {$regex:searchtext} };
          }
          else if (search =="CPN") {
            doc.match = { "CNU": { $regex: req.searchCNU }, "CPN" : {$regex:searchtext} };
          }
          else {
            doc.match ={ "CNU": { $regex: req.searchCNU } };
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
  const CNU = req.body.CNU;
  console.log("###",CNU);
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var workers = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CNU.includes("#") == true) {
    req.searchCNU = CNU.split("#")[0]; // '#' 을 잘라
  }
  else {
    req.searchCNU = req.searchCNU; // 기존 middleware에서 받아온 본사,지점 CNU 그대로 다시 담음
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
    if(CNU == "3388800960") {
      // 대리점 파악
      var franchiseCNUlist = await modelQuery(QUERY.Aggregate,COLLECTION_NAME.Company,{match : {CK : "MK 대리점"}, project : {CNU : 1}},{});
      
      var CNUlist = [];
      for (var i = 0; i < franchiseCNUlist.length; i ++) {
        CNUlist.push(String(franchiseCNUlist[i].CNU));
      }
      CNUlist.push("3388800960000");
      //
      
      
      if(workers.length == 0) {
          return res.send({ result : "nothing" });
      }
      else {
        if (searchdate) {
        var searchtext2 = searchdate.split("~");
          if(search == "WN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": { $in : CNUlist }, "WN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
          else if(search == "PN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": { $in : CNUlist }, "PN" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
          else if(search == "EM") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": { $in : CNUlist }, "EM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
          else {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU" : { $in : CNUlist }, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} },{sort : { [sortText]: sortNum }});
          }
        }
        else {
          if (search =="WN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": { $in : CNUlist }, "WN" : {$regex:searchtext} },{sort : { [sortText]: sortNum }});
          }
          else if (search =="PN") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": { $in : CNUlist }, "PN" : {$regex:searchtext} },{sort : { [sortText]: sortNum }});
          }
          else if (search =="EM") {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU": { $in : CNUlist }, "EM" : {$regex:searchtext} },{sort : { [sortText]: sortNum }});
          }
          else {
            workers = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ "CNU" : { $in : CNUlist } },{sort : { [sortText]: sortNum }})
          }
        }
      }
    }
    else {
      
      var doc = {
            lookup : { from : "Company", localField : "CNU", foreignField : "CNU", as : "ANA" } ,
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
              doc.match = { "CNU": { $regex: req.searchCNU }, "WN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
            else if(search == "PN") {
              doc.match = { "CNU": { $regex: req.searchCNU }, "PN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
            else if(search == "EM") {
              doc.match = { "CNU": { $regex: req.searchCNU }, "EM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
            else {
              doc.match = { "CNU": { $regex: req.searchCNU }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
            }
        }
        else {
            if (search =="ANA") {
              doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext} };
            }
            else if (search =="WN") {
              doc.match = { "CNU": { $regex: req.searchCNU }, "WN" : {$regex:searchtext} };
            }
            else if (search =="PN") {
              doc.match = { "CNU": { $regex: req.searchCNU }, "PN" : {$regex:searchtext} };
            }
            else if (search =="EM") {
              doc.match = { "CNU": { $regex: req.searchCNU }, "EM" : {$regex:searchtext} };
            }
            else {
              doc.match = { "CNU": { $regex: req.searchCNU } };
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
  const CNU = req.body.CNU;
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var historys = new Object;
  
  // company list에서 접속한 것인지 확인
  if(CNU.includes("#") == true) {
    req.searchCNU = CNU.split("#")[0]; // '#' 을 잘라
  }
  else {
    req.searchCNU = req.searchCNU; // 기존 middleware에서 받아온 본사,지점 CNU 그대로 다시 담음
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
            lookup : { from : "Company", localField : "CNU", foreignField : "CNU", as : "ANA" } ,
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
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "CNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "DNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "DNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "WNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "WNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } }
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } }
        }
      }
    }
    else {
      if(historys.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="ANA") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext} }
        }
        else if (search =="CNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CNM" : {$regex:searchtext} }
        }
        else if (search =="DNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "DNM" : {$regex:searchtext} }
        }
        else if (search =="WNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "WNM" : {$regex:searchtext} }
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU } }
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
  const CNU = req.body.CNU;
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
            lookup : { from : "Company", localField : "CNU", foreignField : "CNU", as : "ANA" } ,
            unwind : "$ANA",
            match : {},
            project : { MID : "$MID", IID : "$IID", GN : "$GN", AM : "$AM", CA : "$CA", ANA : '$ANA.ANA' },
            sort : { [sortText]: sortNum }
          }
    
    if(orders.length == 0) {
      return res.send({ result : "nothing" });
    }
    else {
      if (searchdate) {
        var searchtext2 = searchdate.split("~");
          if(search == "ANA") {
            doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else if(search == "MID") {
            doc.match = { "CNU": { $regex: req.searchCNU }, "MID" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else if(search == "GN") {
            doc.match = { "CNU": { $regex: req.searchCNU }, "GN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else if(search == "AM") {
            doc.match = { "CNU": { $regex: req.searchCNU }, "strAM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
          else {
            doc.match = { "CNU": { $regex: req.searchCNU }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
          }
      }
      else {
        if (search =="ANA") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="MID") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "MID" : {$regex:searchtext} };
        }
        else if (search =="GN") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "GN" : {$regex:searchtext} };
        }
        else if (search =="AM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "strAM" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU } };
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
  const CNU = req.body.CNU;
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
            lookup : { from : "Company", localField : "CNU", foreignField : "CNU", as : "ANA" } ,
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
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "PN") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "PN" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "PO") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "strPO" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
      }
      else {
        if (search =="ANA") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="PN") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "PN" : {$regex:searchtext} };
        }
        else if (search =="PO") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "strPO" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU } };
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
  const CNU = req.body.CNU;
  
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
            lookup : { from : "Company", localField : "CNU", foreignField : "CNU", as : "ANA" } ,
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
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "WNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "WNM" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else if(search == "RE") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "RE" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU }, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } };
        }
      }
      else {
        if (search =="ANA") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "ANA.ANA" : {$regex:searchtext} };
        }
        else if (search =="WNM") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "WNM" : {$regex:searchtext} };
        }
        else if (search =="RE") {
          doc.match = { "CNU": { $regex: req.searchCNU }, "RE" : {$regex:searchtext} };
        }
        else {
          doc.match = { "CNU": { $regex: req.searchCNU } };
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
  var CID = data.CID;
  var type = data.type;
  
  var b_ANA = String(data.b_ANA);
  var b_ANU = String(data.b_ANU);
  
  
  var jsondata = {};
  var anaarray = [];
  var anuarray = [];
  var maxANU = 0;
  var plusANU = 0;
  var ANU = "";
  var zero = "0";
  // 숫자 앞에 0 붙이는 함수
  function fillZero(width, str){
    ANU = str.length >= width ? str:new Array(width-str.length+1).join('0')+str;//남는 길이만큼 0으로 채움
    return ANU;
  }
  
  try {
    const companyone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{_id : CID},{});
      var al = companyone.AL;
      console.log("에이",al);
      
      for (var i = 0; i < al.length; i ++) {
        anaarray.push(String(Object.keys(al[i])));
        anuarray.push(String(Object.values(al[i])));
      }
      maxANU = Math.max.apply(null, anuarray);
      plusANU = maxANU+1;
      
      console.log("플플",plusANU);
      
      if(plusANU == "-Infinity") {
        ANU = "001";
      }
      else if(plusANU.toString().length <= 3) {
        fillZero(3,plusANU.toString());
      }
      else {
        return res.send({ type : "agent", result : "overNum" });
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
        await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID}, update : {AL : al}},{});
        await modelQuery(QUERY.Updatemany,COLLECTION_NAME.Company,{where : { CNU : {$regex:companyone.CNU.substring(0,10)} } , update : { AL : al }},{});
        res.send({type : "agent", result : "success"});
      }
    }
    else if (type =='edit') {
      if(anaarray.includes(ANA)) {
        if((ANA == b_ANA)) {
          res.send({ type : "agent", result : "successedit" });
        }
        else {
          res.send({ type : "agent", result : "dupleN"});
        }
      }
      else {
        for (var i = 0; i < al.length; i ++) {
          if(Object.keys(al[i]).includes(b_ANA)) {
            var exANU = Object.values(al[i]);
            al.splice(i,1);
            var editAL = { [ANA] : exANU[0] };
            al.push(editAL);
          }
        }
        await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID},update : {AL : al}},{});
        
        const agentone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ CNU : companyone.CNU.substring(0,10) + exANU},{});
        // 해당 지점으로 가입된 계정이 있을 경우, ANA와 AL 변경
        if(agentone) {
          await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : { CNU : companyone.CNU.substring(0,10) + exANU} , update : { AL : al, ANA : ANA }},{});
        }
        // 그 외 지점들 AL 변경
        await modelQuery(QUERY.Updatemany,COLLECTION_NAME.Company,{where : { CNU : {$regex:companyone.CNU.substring(0,10)} } , update : { AL : al }},{});
        
        res.send({type : "agent", result : "successedit"});
      }
    }
    else if (type =='delete') {
      for (var i =0; i < al.length; i ++) {
        if(Object.keys(al[i]).includes(b_ANA)) {
          var exANU = Object.values(al[i]);
          al.splice(i,1);
        }
      }
      const agentone = await modelQuery(QUERY.Findone,COLLECTION_NAME.Company,{ CNU : companyone.CNU.substring(0,10) + exANU},{});
      //있으면 해당 지점 삭제 및 해당 지점 CID에 해당하는 데이터 전부 삭제
        // 임시 저장 db에 생성
      if(agentone) {
        const agentcar = await modelQuery(QUERY.Find,COLLECTION_NAME.Car,{ "CID" : agentone._id },{});
        if(agentcar) {
          for(var i = 0; i < agentcar.length; i ++) {
            await modelQuery(QUERY.Create,COLLECTION_NAME.Cardelete,{ CID : agentcar[i]._id, CC : agentcar[i].CC, CN : agentcar[i].CN, CPN : agentcar[i].CPN, SN : agentcar[i].SN  },{})
          }
        }
        const agentdevice = await modelQuery(QUERY.Find,COLLECTION_NAME.Device,{ CID : agentone._id },{});
        if(agentdevice) {
          for(var i = 0; i < agentdevice.length; i ++) {
            await modelQuery(QUERY.Create,COLLECTION_NAME.Devicedelete,{ CID : agentdevice[i]._id, MD : agentdevice[i].MD, MAC : agentdevice[i].MAC, VER : agentdevice[i].VER, NN : agentdevice[i].NN, UT : agentdevice[i].UT  },{})
          }
        }
        const agentworker = await modelQuery(QUERY.Find,COLLECTION_NAME.Worker,{ CID : agentone._id },{});
        if(agentworker) {
          for(var i = 0; i < agentworker.length; i ++) {
            await modelQuery(QUERY.Create,COLLECTION_NAME.Workerdelete,{ CID : agentworker[i]._id, WN : agentworker[i].WN, PN : agentworker[i].PN, GID : agentworker[i].GID, EM : agentworker[i].EM, PU : agentworker[i].PU, AU : agentworker[i].AU, AC : agentworker[i].AC },{})
          }
        }
        // 삭제
        await modelQuery(QUERY.Remove,COLLECTION_NAME.Company,{ _id : agentone._id },{});
        await modelQuery(QUERY.Remove,COLLECTION_NAME.Car,{ CID : agentone._id },{});
        await modelQuery(QUERY.Remove,COLLECTION_NAME.Device,{ CID : agentone._id },{});
        await modelQuery(QUERY.Remove,COLLECTION_NAME.Worker,{ CID : agentone._id },{});
      }
      
      //기본적으로 본사 리스트 수정 및 해당 지점들 AL 다 변경
      await modelQuery(QUERY.Updateone,COLLECTION_NAME.Company,{where : {_id : CID},update : {AL : al}},{});
      await modelQuery(QUERY.Updatemany,COLLECTION_NAME.Company,{where : { CNU : {$regex:companyone.CNU.substring(0,10)} },update : { AL : al }},{});
      
      res.send({type : "agent", result : "successdelete"});
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
});

//notice_list
router.post('/notice_list', isNotLoggedIn, DataSet, agentDevide, async function(req, res, next) {
  const CID = req.decoded.CID;
  
  var sort = req.body.sort;
  var search = req.body.search;
  var searchtext = req.body.searchtext;
  var searchdate = req.body.searchdate;
  var sortText = "";
  var sortNum = 0;
  var notices = new Object;
  
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
    
    if(notices.length == 0) {
      return res.send({ result : "nothing" });
    }
    else {
      if (searchdate) {
        var searchtext2 = searchdate.split("~");
        if(search == "TI") {
          notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "TI" : {$regex:searchtext}, "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } },{ sort : { [sortText]: sortNum } });
        }
        else {
          notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "CA" : { $gte: new Date(searchtext2[0]+"T00:00:00.000Z"), $lt: new Date(searchtext2[1]+"T23:59:59.999Z") } },{ sort : { [sortText]: sortNum } });
        }
      }
      else {
        if (search =="TI") {
          notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{ "TI" : {$regex:searchtext} },{ sort : { [sortText]: sortNum } });
        }
        else {
          notices = await modelQuery(QUERY.Find,COLLECTION_NAME.Notice,{},{ sort : { [sortText]: sortNum } });
        }
      }
    }
    
    if(notices.length == 0) {
      return res.send({ result : "nothing"});
    }
    
    var noticelist = [];
    if(notices.length) {
      for(var i = 0; i < notices.length; i ++) {
        noticelist[i] = notices[i];
      }
    }
    res.send({ result: true, pagelist : noticelist });
  } catch(err) {
    console.error(err);
    next(err);
  }
 
});


module.exports = router;