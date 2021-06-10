    if (search!="") {
      if(search == "CA") {
          try{
            var searchtext2 = searchdate.split("~");
            var alarms = await Alarm.find({ "CID": CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
            if(alarms.length == 0) 
            res.send({result : "nothing"});
          }catch(e) {
            res.send({ result: false });
          }
      }
      else {
        if(!searchdate) {
          try{
            if (search =="WNM") {
              var alarms = await Alarm.find({ "CID": CID, "WNM" : {$regex:searchtext} });
              if(alarms.length == 0) 
              res.send({result : "nothing"});
            }
            else if (search =="RE") {
              var alarms = await Alarm.find({ "CID": CID, "RE" : {$regex:searchtext} });
              if(alarms.length == 0) 
              res.send({result : "nothing"});
            }
            
          }catch(e) {
            res.send({ result: false });
          }
        }
        else {
          if (search =="WNM") {
            var searchtext2 = searchdate.split("~");
              var alarms = await Alarm.find({ "CID": CID, "WNM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"} });
              if(alarms.length == 0) 
              res.send({result : "nothing"});
            }
            else if (search =="RE") {
              var alarms = await Alarm.find({ "CID": CID, "RE" : {$regex:searchtext} , "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z",$lt:searchtext2[1]+"T23:59:59.999Z"}});
              if(alarms.length == 0) 
              res.send({result : "nothing"});
            }
        }
        
      }
  }
  else {
      var alarms = await Alarm.find({ "CID": CID });
    
      if(sort == "WNM") {
          alarms.sort(function (a,b) {
            
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "WNM2") {
          alarms.sort(function (a,b) {
            if(typeof(a.WNM) == "object")
            a.WNM = JSON.stringify(a.WNM);
            return (a.WNM[0]).charCodeAt(0) > (b.WNM[0]).charCodeAt(0) ? -1 : (a.WNM[0]).charCodeAt(0) < (b.WNM[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      
      else if(sort == "CA") { 
          var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
      }
      
      else if(sort == "CA2"){
          var alarms = await Alarm.find({ "CID": CID }).sort({ CA: 1 });
       }
      else if(sort == "RE") {
          alarms.sort(function (a,b) {
            
            if(typeof(a.RE) == "object")
            a.RE = JSON.stringify(a.RE);
            return (a.RE[0]).charCodeAt(0) < (b.RE[0]).charCodeAt(0) ? -1 : (a.RE[0]).charCodeAt(0) > (b.RE[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else if(sort == "RE2") {
          alarms.sort(function (a,b) {
            
            if(typeof(a.RE) == "object")
            a.RE = JSON.stringify(a.RE);
            return (a.RE[0]).charCodeAt(0) > (b.RE[0]).charCodeAt(0) ? -1 : (a.RE[0]).charCodeAt(0) < (b.RE[0]).charCodeAt(0) ? 1 : 0;
          })
      }
      else {
        var alarms = await Alarm.find({ "CID": CID }).sort({ CA: -1 });
        
      }
  }