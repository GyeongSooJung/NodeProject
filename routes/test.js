insertTr += "<tr>";
		insertTr += "	<th width='2.5%'></th>";
		insertTr += "	<th width='30.5%' name = 'WNM'>"+i18nconvert("payWNM")+"<a href='javascript:sortList(pagingObject,WNM);'><i id = 'WNM' class=' float-right mx-1 fas fa-lg fa-fw m-t-3";
		if(Object.sort == "WNM-2")
			insertTr += " fa-sort-up'></a></i></th>";
		else if(Object.sort == "WNM")
			insertTr += " fa-sort-down'></a></i></th>";
		else 
			insertTr += " fa-sort'></a></i></th>";
			
		insertTr += "	<th width='24%' name = 'CA'>"+i18nconvert("pointCA")+"<a href='javascript:sortList(pagingObject,CA);'><i id = 'CA' class='float-right mx-1 fas fa-lg fa-fw m-t-3";
		if(Object.sort == "CA-2")
			insertTr += " fa-sort-up'></a></i></th>";
		else if(Object.sort == "CA")
			insertTr += " fa-sort-down'></a></i></th>";
		else 
			insertTr += " fa-sort'></a></i></th>";
			
		insertTr += "	<th width='21%' name = 'RE'>"+i18nconvert("RE")+"<a href='javascript:sortList(pagingObject,RE);'><i id = 'RE' class='float-right mx-1 fas fa-lg fa-fw m-t-3";
		if(Object.sort == "RE-2")
			insertTr += " fa-sort-up'></a></i></th>";
		else if(Object.sort == "RE")
			insertTr += " fa-sort-down'></a></i></th>";
		else 
			insertTr += " fa-sort'></a></i></th>";
			
		insertTr += "</tr>";
		
--------------------------------------------------------------------------------------------		
		
  var sortText = "";
  var sortNum = 0;
  var alarms = new Object;
  
  if(sort.includes('-') == true) {
    sortText = sort.split('-')[0];
    sortNum = -1;
  }
  else {
    sortText = sort;
    sortNum = 1;
  }
  
  
  try {
    if (searchdate) {
      var searchtext2 = searchdate.split("~");
      alarms = await Alarm.find({ "CID" : CID, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
      if(alarms.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if(search == "WNM") {
          alarms = await Alarm.find({ "CID": CID, "WNM" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if(search == "RE") {
          alarms = await Alarm.find({ "CID": CID, "RE" : {$regex:searchtext}, "CA" : {$gte:searchtext2[0]+"T00:00:00.000Z", $lt:searchtext2[1]+"T23:59:59.999Z"} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
    else {
      alarms = await Alarm.find({ "CID" : CID }).sort({ [sortText]: sortNum });
      if(alarms.length == 0) {
        return res.send({ result : "nothing" });
      }
      else {
        if (search =="WNM") {
          alarms = await Alarm.find({ "CID": CID, "WNM" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
        else if (search =="RE") {
          alarms = await Alarm.find({ "CID": CID, "RE" : {$regex:searchtext} }).sort({ [sortText]: sortNum });
          if(alarms.length == 0) {
            return res.send({ result : "nothing"});
          }
        }
      }
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
------------------------------------------------------------------------------------