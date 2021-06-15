 //------------------------------------------리스트마다 들어갈 내용들 정리 -------------------------------------//
    
    //사업자 리스트
    
    var companylist_condition = function (Object) {
    	var num =  Object.array.length; 	
		var	insertTr = ""; // 채워넣을 HTML 초기화
		var indexcount = 1; // 인덱스번호 초기화
		
		    $("#memDiv2").empty();
			$("#memDiv1").empty();
			
			insertTr += "<tr>"
			insertTr += "<th></th>"
			insertTr += "<th class='sort'>상호명</th>"
			insertTr += "<th class='sort'>사업자 번호</th>"
			insertTr += "<th class='sort'>대표자</th>"
			insertTr += "<th class='sort'>회사 전화번호</th>"
			insertTr += "<th class='sort'>휴대폰 번호</th>"
			insertTr += "<th class='sort'>대표 이메일</th>"
			insertTr += "<th class='sort'>가입 일자</th>"
			insertTr += "<th width='1%' class='text-nowrap'>장비/차량/작업자/소독이력</th>	"	
			insertTr += "</tr>";
			$("#memDiv1").append(insertTr);
			insertTr = ""
			
			for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
				if(Object.array.length != 0) {
					if(Object.array[i]) {
						
						insertTr += "<tr>";
						insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
						insertTr += "<td>"+ Object.array[i].CNA +"</td>";
						insertTr += "<td>"+ Object.array[i].CNU+"</td>";
						insertTr += "<td>"+ Object.array[i].NA+"</td>";
						insertTr += "<td>"+ Object.array[i].PN+"</td>";
						insertTr += "<td>"+ Object.array[i].MN+"</td>";
						insertTr += "<td>"+ Object.array[i].EA+"</td>";
						insertTr += "<td>";
						if ( (moment(Object.array[i].CA).format('DD')) == moment().format('DD') )
						{
							insertTr +=  moment(Object.array[i].CA).format('HH:mm');
						}
						else {
							insertTr += moment(Object.array[i].CA).format('YYYY-MM-DD');
						}
						
						insertTr +=	"<td class='d-flex flex-nowrap justify-content-around'>";
						insertTr +=	"<button onClick='devicelist(pagingObject,this)' name = '"+ Object.array[i]._id +"' class='btn btn-primary mx-1 px-2'><i class='fas fa-lg fa-fw fa-microchip'></i></button>";
						insertTr +=	"<button onClick='carlist(pagingObject,this)' name = '"+ Object.array[i]._id +"' class='btn btn-info mx-1 px-2'><i class='fas fa-lg fa-fw fa-car'></i></button>";
						insertTr +=	"<button onClick='workerlist(pagingObject,this)' name = '"+ Object.array[i]._id +"' class='btn btn-warning mx-1 px-2'><i class='fas fa-lg fa-fw fa-user'></i></button>";
						insertTr +=	"<button onClick='historylist(pagingObject,this)' name = '"+ Object.array[i]._id +"' class='btn btn-danger mx-1 px-2'><i class='fas fa-lg fa-fw fa-history'></i></button>";
						insertTr +=	"</td>";
						insertTr += "</tr>";
						num -= indexcount;
					}
				} 
				else {
					insertTr += "<tr>";
					insertTr += "	<td colspan='10'>No Data</td>";
					insertTr += "</tr>";
					
					break;
				}
			}
			$("#memDiv2").append(insertTr);
    };
    
    
    // 사업자 리스트에서 조회 기능
	
	function company_gotolist(Object) {
	   	Object.name = "Company";
	   	gotolist(Object);
    }
	
	function devicelist(Object,obj) {
		refresh(Object);
		Object.name = "Device";
		Object.url = "/ajax/device_list";
		Object.CID = $(obj).attr('name');
		
		pagereload(Object);
	}
	
	function carlist(Object,obj) {
		refresh(Object);
		Object.name = "Car";
		Object.url = "/ajax/car_list";
		Object.CID = $(obj).attr('name');
		// console.log("먼저"+Object.array);
		
		pagereload(Object);
	}
	
	function workerlist(Object,obj) {
		refresh(Object);
		Object.name = "Worker";
		Object.url = "/ajax/worker_list";
		Object.CID = $(obj).attr('name');
		
		pagereload(Object)
	}
	
	function historylist(Object,obj) {
		refresh(Object);
		Object.name = "History";
		Object.url = "/ajax/history_list";
		Object.CID = $(obj).attr('name');
		
		pagereload(Object);
	}
	
    
    // 차량 리스트
    
    var carlist_condition = function (Object) {
		var num =  Object.array.length; 	
		var	insertTr = ""; // 채워넣을 HTML 초기화
		var indexcount = 1; // 인덱스번호 초기화
		
		$("#memDiv1").empty();
	    insertTr += "<tr>";
		insertTr += "<th id ='allcheck' width='1%'>";
		insertTr += "<input type='checkbox' name='allck' class='neHeros' value='' onChange='allCheckedBox(this);'/>";
		insertTr += "</th>";
		insertTr += "<th width='2.5%'></th>";
		insertTr += "<th width='33%' name='CN'>"+i18nconvert("CN")+"<a href='javascript:sortList(pagingObject,CN);'><i id = 'CN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CN-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CN")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='33%'name='CPN'>"+i18nconvert("CPN")+"<a href='javascript:sortList(pagingObject,CPN);'><i id = 'CPN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CPN-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CPN")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='30.5%'name='CA'>"+i18nconvert("CA")+"<a href='javascript:sortList(pagingObject,CA);'><i id = 'CA' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CA-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CA")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='1%'></th>";
		insertTr += "</tr>";
		
		$("#memDiv1").append(insertTr);
		
		insertTr = "";
		for (var i = ( Object.postNum *  Object.page) ; i < ( Object.postNum *  Object.page) +  Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
			if( Object.array.length != 0) {
				if( Object.array[i]) {
					insertTr += "<tr>";
					insertTr += "<td class='with-btn' nowrap>";
					insertTr += "<input id='ck' type='checkbox' name ='ck' class='neHeros' value="+  Object.array[i].CN +" onChange='eachCheckedBox(this);'/>";
					insertTr += "</td>";
					insertTr += "<td class='font-weight-bold'>"+(num - ( Object.page*10)) +" </td>";
					insertTr += "<td>"+  Object.array[i].CN +"</td>";
					
					if(! Object.array[i].CPN){
						insertTr+="<td>"+"N/A"+"</td><td>";
					}
					else {
						insertTr += "<td>"+  Object.array[i].CPN+"</td><td>";
					}
					
					if ( (moment( Object.array[i].CA).format('DD')) == moment().format('DD') )
					{
						insertTr +=  moment( Object.array[i].CA).format('HH:mm');
					}
					else {
						insertTr += moment( Object.array[i].CA).format('YYYY-MM-DD');
					}
					insertTr += "</td><td class='with-btn' nowrap>";
					insertTr += "<a href='javascript:;' id = 'carid' onclick='car_editone(this);' data-type='show' name='"+ Object.array[i]._id +"'   class='btn btn-sm btn-primary width-60 m-r-2 edit-btn'>"+i18nconvert("modify")+"</a>";
					insertTr += "<input type='button' value='"+i18nconvert("delete")+"' onclick=delete_one(this,'/car/ajax/car_deleteone') class='btn btn-sm btn-white width-60' name =' "+  Object.array[i].CN +"'></td> ";
					insertTr += "</tr>";
					num -= indexcount;
				}
			}
			else {
				insertTr += "<tr>";
				insertTr += "<td colspan='10'>No Data</td>";
				insertTr += "</tr>";
			
			break;
			}
		}
		
		$("#memDiv2").append(insertTr);
	};
	
	// 차량 엑셀 확인 리스트
	
	// 장비 리스트
	
	var devicelist_condition = function (Object) {
		var num =  Object.array.length; 	
		var	insertTr = ""; // 채워넣을 HTML 초기화
		var indexcount = 1; // 인덱스번호 초기화
		
		$("#memDiv1").empty();
		
	    insertTr += "<tr>";
		insertTr += "<th id ='allcheck' width='1%'>";
		insertTr += "<input type='checkbox' name='allck' class='neHeros' value='' onChange='allCheckedBox(this);'/>";
		insertTr += "</th>";
		insertTr += "<th width='2.5%'></th>";
		
		insertTr += "<th width='10.5%' name = 'MD'>"+i18nconvert("MD")+"<a href='javascript:sortList(pagingObject,MD);'><i id = 'MD' class='float-right mx-1 fas fa-lg fa-fw m-t-3 "
		if(Object.sort == "MD-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "MD")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='10%'name = 'VER'>"+i18nconvert("VER")+"<a href='javascript:sortList(pagingObject,VER);'><i id = 'VER' class='float-right mx-1 fas fa-lg fa-fw m-t-3 "
		if(Object.sort == "VER-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "VER")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='18%' name = 'MAC'>"+i18nconvert("MAC")+"<a href='javascript:sortList(pagingObject,MAC);'><i id = 'MAC' class='float-right mx-1 fas fa-lg fa-fw m-t-3 "
		if(Object.sort == "MAC-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "MAC")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='18%' name = 'NN'>"+i18nconvert("NN")+"<a href='javascript:sortList(pagingObject,NN);'><i id = 'NN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 "
		if(Object.sort == "NN-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "NN")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='18%' name = 'UN'>"+i18nconvert("UN")+"<a href='javascript:sortList(pagingObject,UN);'><i id = 'UN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 "
		if(Object.sort == "UN-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "UN")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='18%'name = 'CA'>"+i18nconvert("CA")+"<a href='javascript:sortList(pagingObject,CA);'><i id = 'CA' class='float-right mx-1 fas fa-lg fa-fw m-t-3 "
		if(Object.sort == "CA-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CA")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='1%'></th>";
		insertTr += "</tr>";
		
		$("#memDiv1").append(insertTr);
		
		insertTr = "";
		
		
		for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
			if(Object.array.length != 0) {	  
				if(Object.array[i]) {
					insertTr += "<tr>";
					insertTr += " 	<td class='with-btn' nowrap>";
					insertTr += "		<input id='ck' type='checkbox' name ='ck' class='neHeros' value="+ Object.array[i].MAC +" onChange='eachCheckedBox(this);'/>";
					insertTr += " 	</td>";
					insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
					insertTr += "<td>"+ Object.array[i].MD +"</td>";
					insertTr += "<td>"+ Object.array[i].VER+"</td>";
					insertTr += "<td>"+ Object.array[i].MAC+"</td>";
					if(!Object.array[i].NN) {
						insertTr += "<td>x</td>";
					}
					else {
						insertTr += "<td>"+ Object.array[i].NN+"</td>";
					}
					insertTr += "<td>"+ Object.array[i].UN+"회</td><td>";
					
					if ( (moment(Object.array[i].CA).format('DD')) == moment().format('DD') )
					{
						insertTr +=  moment(Object.array[i].CA).format('HH:mm');
					}
					else {
						insertTr += moment(Object.array[i].CA).format('YYYY-MM-DD');
					}
					insertTr += "</td><td class='with-btn' nowrap>";
					insertTr += "<a href='javascript:;' id = 'deviceid' onclick='device_editone(this);' data-type='show' name='"+ Object.array[i]._id +"' class='btn btn-sm btn-primary width-60 m-r-2 edit-btn'>"+i18nconvert("modify")+"</a>";
					insertTr += "<input type='button' value='"+i18nconvert("delete")+"' onclick=delete_one(this,'/device/ajax/device_deleteone') class='btn btn-sm btn-white width-60' name =' "+ Object.array[i].MAC +"'></td> ";
					insertTr += "</tr>";
					num -= indexcount;
				}
			} 
			else {
				insertTr += "<tr>";
				insertTr += "	<td colspan='10'>No Data</td>";
				insertTr += "</tr>";
				
				break;
			}
		}
		
		$("#memDiv2").append(insertTr);
	};
	
	// 작업자 리스트
	
	var workerlist_condition = function (Object) {
		var num =  Object.array.length; 	
        var	insertTr = ""; // 채워넣을 HTML 초기화
     	var indexcount = 1; // 인덱스번호 초기화
     	
		
		if (Object.CID =="5fd6c731a26c914fbad53ebe") {
			$("#memDiv1").empty();
			insertTr +="<tr>";
			insertTr +="<th width='1%'><input type='checkbox' class='neHeros' value='' onChange='allCheckedBox(this);'/></th>";
			insertTr +="<th width='2.5%'></th>";
			insertTr +="<th width='2.5%' data-orderable='false'></th>";
			
			insertTr +="<th width='10%' name = 'WN'>"+i18nconvert("WN")+"<a href='javascript:sortList(pagingObject,WN);'><i id = 'WN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
			if(Object.sort == "WN2")
				insertTr += "fa-sort-up'></a></i></th>";
			else if(Object.sort == "WN")
				insertTr += "fa-sort-down'></a></i></th>";
			else 
				insertTr += "fa-sort'></a></i></th>";
				
			insertTr +="<th width='8%' name = 'PN'>"+i18nconvert("PN")+"<a href='javascript:sortList(pagingObject,PN);'><i id = 'PN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
			if(Object.sort == "PN2")
				insertTr += "fa-sort-up'></a></i></th>";
			else if(Object.sort == "PN")
				insertTr += "fa-sort-down'></a></i></th>";
			else 
				insertTr += "fa-sort'></a></i></th>";
				
			insertTr +="<th width='15%' name = 'EM'>"+i18nconvert("EM")+"<a href='javascript:sortList(pagingObject,EM);'><i id = 'EM' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
			if(Object.sort == "EM2")
				insertTr += "fa-sort-up'></a></i></th>";
			else if(Object.sort == "EM")
				insertTr += "fa-sort-down'></a></i></th>";
			else 
				insertTr += "fa-sort'></a></i></th>";
				
			
			if (Object.CID =="5fd6c731a26c914fbad53ebe") {
				insertTr +="<th width='10%'>본사/대리점</th>";
				insertTr +="<th width='10%'>MK본사 권한</th>";
				insertTr +="<th width='10%'>대리점 권한</th>";
				insertTr +="<th width='10%'>"+i18nconvert("owner_auth")+"</th>";
				insertTr +="<th width='10%'>작업자</br>(초기값)</th></th>";
			}
			else
			insertTr +="<th width='10%'>"+i18nconvert("owner_auth")+"</th>";
			
			insertTr +="<th width='10%'>"+i18nconvert("approval")+"</th>";
			insertTr +="<th width='1%'></th>";
			insertTr +="</tr>";
						
						
			$("#memDiv1").append(insertTr);
		
			insertTr = "";
			
			for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
				if(Object.array.length != 0) {
					if(Object.array[i]) {
						
						insertTr += "<tr>";
						insertTr += "<td class='with-btn' nowrap>";
						insertTr += "<input id='ck' type='checkbox' name ='ck' class='neHeros' value="+ Object.array[i].EM +" onChange='eachCheckedBox(this);'/>";
						insertTr += "</td>";
						insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
						insertTr += "<td class='with-img'><img src='"+ Object.array[i].PU +"' class='img-rounded height-30' /></td>";
						insertTr += "<td>"+ Object.array[i].WN+"</td>";
						insertTr += "<td>"+ Object.array[i].PN+"</td>";
						insertTr += "<td>"+ Object.array[i].EM+"</td>";
						if(Object.array[i].CID == "5fd6c731a26c914fbad53ebe")
						insertTr += "<td>본사</td>";
						else
						insertTr += "<td>대리점</td>";
						insertTr += "<td><input onclick ='checkau(this)' name = '"+i+"' class ='com_ck_au' type='radio'  value ='"+Object.array[i].EM+",0'";
						if(Object.array[i].AU ==0)
							insertTr += "checked/></td>";
						else 
							insertTr += "unchecked/></td>";
						insertTr += "<td><input onclick ='checkau(this)' name = '"+i+"' class ='com_ck_au' type='radio'  value ='"+Object.array[i].EM+",3'";
						if(Object.array[i].AU ==3)
							insertTr += "checked/></td>";
						else 
							insertTr += "unchecked/></td>";
						insertTr += "<td><input onclick ='checkau(this)' name = '"+i+"' class ='com_ck_au' type='radio'  value ='"+Object.array[i].EM+",2'";
						if(Object.array[i].AU ==2)
							insertTr += "checked/></td>";
						else 
							insertTr += "unchecked/></td>";
						insertTr += "<td><input onclick ='checkau(this)'  name = '"+i+"' class ='com_ck_au' type='radio'  value ='"+Object.array[i].EM+",1'";
						if(Object.array[i].AU ==1)
							insertTr += "checked/></td>";
						else 
							insertTr += "unchecked/></td>";
						insertTr += "<td class='with-btn' nowrap>";
						insertTr += "<input onclick ='checkac(this)' class ='ck_ac' type='checkbox'  value ='"+Object.array[i].EM+"'";
						
						if(Object.array[i].AC ==1)
							insertTr += "checked/>";
						else
							insertTr += "unchecked/>";
						insertTr += "</td>";
						insertTr += "<td>";
						insertTr += "<input type='button' value='"+i18nconvert("delete")+"' onclick=delete_one(this,'/worker/ajax/worker_deleteone') class='btn btn-sm btn-white width-60' name ='"+ Object.array[i].EM +"'></td> ";
						insertTr += "</td>";
						insertTr += "</tr>";
						num -= indexcount;
						}
					}
					else {
					insertTr += "<tr>";
					insertTr += "	<td colspan='10'>No Data</td>";
					insertTr += "</tr>";
					
					break;
				}
			}
		}
		else {
			
			$("#memDiv1").empty();
			insertTr +="<tr>";
			insertTr +="<th width='1%'><input type='checkbox' class='neHeros' value='' onChange='allCheckedBox(this);'/></th>";
			insertTr +="<th width='2.5%'></th>";
			insertTr +="<th width='2.5%' data-orderable='false'></th>";
			
			insertTr +="<th width='10%' name = 'WN'>"+i18nconvert("WN")+"<a href='javascript:sortpage(pagingObject,WN,[WN,PN,EM]);' name = 'WN'><i id = 'WN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
			if(Object.sort == "WN2")
				insertTr += "fa-sort-up'></a></i></th>";
			else if(Object.sort == "WN")
				insertTr += "fa-sort-down'></a></i></th>";
			else 
				insertTr += "fa-sort'></a></i></th>";
				
			insertTr +="<th width='8%' name = 'PN'>"+i18nconvert("PN")+"<a href='javascript:sortpage(pagingObject,PN,[WN,PN,EM]);' name = 'PN'><i id = 'PN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
			if(Object.sort == "PN2")
				insertTr += "fa-sort-up'></a></i></th>";
			else if(Object.sort == "PN")
				insertTr += "fa-sort-down'></a></i></th>";
			else 
				insertTr += "fa-sort'></a></i></th>";
				
			insertTr +="<th width='15%' name = 'EM'>"+i18nconvert("EM")+"<a href='javascript:sortpage(pagingObject,EM,[WN,PN,EM]);' name = 'EM'><i id = 'EM' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
			if(Object.sort == "EM2")
				insertTr += "fa-sort-up'></a></i></th>";
			else if(Object.sort == "EM")
				insertTr += "fa-sort-down'></a></i></th>";
			else 
				insertTr += "fa-sort'></a></i></th>";
			
			if (Object.CID =="5fd6c731a26c914fbad53ebe") {
				insertTr +="<th width='10%'>본사/대리점</th>";
				insertTr +="<th width='10%'>MK본사 권한</th>";
				insertTr +="<th width='10%'>대리점 권한</th>";
				insertTr +="<th width='10%'>"+i18nconvert("owner_auth")+"</th>";
				insertTr +="<th width='10%'>작업자</br>(초기값)</th></th>";
			}
			else
			insertTr +="<th width='10%'>"+i18nconvert("owner_auth")+"</th>";
			
			insertTr +="<th width='10%'>"+i18nconvert("approval")+"</th>";
			insertTr +="<th width='1%'></th>";
			insertTr +="</tr>";
						
						
			$("#memDiv1").append(insertTr);
			insertTr = "";
			
			for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
				if(Object.array.length != 0) {
					if(Object.array[i]) {
						insertTr += "<tr>";
						insertTr += "<td class='with-btn' nowrap>";
						insertTr += "<input id='ck' type='checkbox' name ='ck' class='neHeros' value="+ Object.array[i].EM +" onChange='eachCheckedBox(this);'/>";
						insertTr += "</td>";
						insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
						insertTr += "<td class='with-img'><img src='"+ Object.array[i].PU +"' class='img-rounded height-30' /></td>";
						insertTr += "<td>"+ Object.array[i].WN+"</td>";
						insertTr += "<td>"+ Object.array[i].PN+"</td>";
						insertTr += "<td>"+ Object.array[i].EM+"</td>";
						insertTr += "<td class='with-btn' nowrap>";
						insertTr += "<input onclick ='checkau2(this)' name ='"+i+"' class ='ck_au' type='checkbox'  value ='"+Object.array[i].EM+",2'";
						if(Object.array[i].AU ==2)
							insertTr += "checked/>";
						else
							insertTr += "unchecked/>";
						insertTr += "</td>";
						insertTr += "<td class='with-btn' nowrap>";
						insertTr += "<input onclick =checkac(this) name ='"+i+"'' class ='ck_ac' type='checkbox'  value ='"+Object.array[i].EM+"'";
						if(Object.array[i].AC ==1)
							insertTr += "checked/>";
						else
							insertTr += "unchecked/>";
						insertTr += "</td>";
						insertTr += "<td>";
						insertTr += "<input type='button' value='"+i18nconvert("delete")+"' onclick=delete_one(this,'/worker/worker_delete') class='btn btn-sm btn-white width-60' name ='"+ Object.array[i].EM +"'></td> ";
						insertTr += "</td>";
						insertTr += "</tr>";
						num -= indexcount;
						}
					}
					else {
					insertTr += "<tr>";
					insertTr += "	<td colspan='10'>No Data</td>";
					insertTr += "</tr>";
					
					break;
				}
			}
		}
				     	
		$("#memDiv2").append(insertTr);
	};
	
	// 소독이력 리스트
	var historylist_condition = function (Object) {
		var num =  Object.array.length; 	
		var	insertTr = ""; // 채워넣을 HTML 초기화
		var indexcount = 1; // 인덱스번호 초기화
		
		$("#memDiv1").empty();
		
		insertTr += "<tr>";
		insertTr += "<th id ='allcheck' width='1%'>";
		insertTr += "<input type='checkbox' name='allck' class='neHeros' value='' onChange='allCheckedBox(this);'/>";
		insertTr += "</th>";
		insertTr += "<th width='2.5%'></th>";
		
		insertTr += "<th width='15%' name = 'CNM'>"+i18nconvert("CNM")+"<a href='javascript:sortList(pagingObject,CNM);'><i id = 'CNM' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CNM-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CNM")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='15%' name = 'DNM'>"+i18nconvert("DNM")+"<a href='javascript:sortList(pagingObject,DNM);'><i id = 'DNM' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "DNM-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "DNM")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='15%' name = 'ET'>"+i18nconvert("ET")+"<a href='javascript:sortList(pagingObject,ET);'><i id = 'ET' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "ET-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "ET")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='15%' name = 'PD'>"+i18nconvert("PD")+"<a href='javascript:sortList(pagingObject,PD);'><i id = 'PD' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "PD-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "PD")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='15%' name = 'WNM'>"+i18nconvert("WNM")+"<a href='javascript:sortList(pagingObject,WNM);'><i id = 'WNM' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "WNM-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "WNM")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
		
		insertTr += "<th width='1%'></th>";
		insertTr += "</tr>";
							
		$("#memDiv1").append(insertTr);
		insertTr = "";
		
		for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
			if(Object.array.length != 0) {
				if(Object.array[i]) {
					insertTr += "<tr>";
					insertTr += "<td class='with-btn' nowrap>";
					insertTr += "<input id='ck' type='checkbox' name ='ck' class='neHeros' value="+ Object.array[i]._id +" onChange='eachCheckedBox(this);'/>";
					insertTr += "</td>";
					insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
					insertTr += "<td>"+ Object.array[i].CNM +"</td>";
					insertTr += "<td>"+ Object.array[i].DNM+"</td><td>";
					if ( (moment(Object.array[i].ET).format('DD')) == moment().format('DD') )
					{
						insertTr +=  moment(Object.array[i].ET).format('HH:mm');
					}
					else {
						insertTr += moment(Object.array[i].ET).format('YYYY-MM-DD');
					}
					if (parseInt(Object.array[i].PD/60)==0)
						insertTr += "</td><td>"+((Object.array[i].PD)%60)+"s</td>";
					else 
						insertTr += "</td><td>"+parseInt((Object.array[i].PD)/60)+"m "+(parseInt(parseInt(Object.array[i].PD)%60))+"s</td>"
					
					insertTr += "<td>"+ Object.array[i].WNM+"</td>";
					
					
					insertTr += "<td class='with-btn' nowrap>"	;
					insertTr += "<a href='/history_chart/"+Object.array[i]._id+"' class='btn btn-sm btn-white width-60'>"+i18nconvert("main_indetail")+"</a>";
					insertTr += "</tr>";
					num -= indexcount;
				}
			}
			else {
				insertTr += "<tr>";
				insertTr += "<td colspan='10'>No Data</td>";
				insertTr += "</tr>";
				
				break;
			}
		}
		
		$("#memDiv2").append(insertTr);
	};
	
	// 구매내역 리스트
	var paylist_condition = function (Object) {
		var num =  Object.array.length; 	
        var	insertTr = ""; // 채워넣을 HTML 초기화
     	var indexcount = 1; // 인덱스번호 초기화
     	
     	$("#memDiv1").empty();
     	
     	insertTr += "<tr>";
		insertTr += "<th width='2.5%'></th>";
		
		insertTr += "<th width='30.5%' name = 'MID'>"+i18nconvert("MID")+"<a href='javascript:sortList(pagingObject,MID);'><i id = 'MID' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "MID-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "MID")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='24%' name = 'CA'>"+i18nconvert("CA")+"<a href='javascript:sortList(pagingObject,CA);'><i id = 'CA' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CA-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CA")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='21%' name = 'GN'>"+i18nconvert("GN")+"<a href='javascript:sortList(pagingObject,GN);'><i id = 'GN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "GN-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "GN")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='21%' name = 'AM'>"+i18nconvert("AM")+"<a href='javascript:sortList(pagingObject,AM);'><i id = 'AM' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "AM-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "AM")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
		
		insertTr += "<th width='1%'></th>";
		insertTr += "</tr>";
     	
     	$("#memDiv1").append(insertTr);
		insertTr = "";
		
		for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
			if(Object.array.length != 0) {
				if(Object.array[i]) {
				       
					insertTr += "<tr class='order-one'>";
					insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
					insertTr += "<td>"+ Object.array[i].MID +"</td><td>";
					if ( (moment(Object.array[i].CA).format('DD')) == moment().format('DD') )
					{
					   insertTr +=  moment(Object.array[i].CA).format('HH:mm');
					}
					else {
					  insertTr += moment(Object.array[i].CA).format('YYYY-MM-DD');
					}
					insertTr += "</td><td>"+ Object.array[i].GN+"</td>";
					insertTr += "<td>"+ Math.floor(Object.array[i].AM)+"</td>";
					insertTr += "<td class='with-btn' nowrap>";
					insertTr += "<a href='javascript:;' onclick='showDetail(this);' class='btn btn-sm btn-white width-60 m-r-2 edit-btn detail-btn' data-type='show' name='"+ Object.array[i].MID +"'>"+i18nconvert("main_indetail")+"</a>"
					insertTr += "<a href='javascript:;' onclick='receiptPay(this);' class='btn btn-sm btn-primary width-60 m-r-2 edit-btn' name='"+ Object.array[i].IID +"' >"+i18nconvert("payment_receit")+"</a>";
					insertTr += "</td>";
					insertTr += "</tr>";
					num -= indexcount;
				}
			}
			else {
				insertTr += "<tr class='bg-light'>";
				insertTr += "<td colspan='10'>No Data</td>";
				insertTr += "</tr>";
				
				break;
			}
		}
			  
		$("#memDiv2").append(insertTr);
	};
	
	// 구매 상세 내역(자세히버튼)
	function showDetail(obj) {
		var type = $(obj).data().type;
		$('.tr-detail').empty();
		$(obj).parents('tr').siblings().find('.detail-btn').text(i18nconvert("main_indetail"));
		$(obj).parents('tr').siblings().find('.detail-btn').removeData().type;
		$(obj).parents('tr').siblings().find('.detail-btn').data('type', 'show');
		if(type == "show") {
			var merchant_uid = $(obj).attr('name');
			if (merchant_uid) {
				$.ajax({
					type: 'POST',
					url: 'ajax/pay_list_detail',
					dataType: 'json',
					data: {
						merchant_uid: merchant_uid
					},
					success: function(result) {
						console.log(result)
						if(result.status == 'success') {
							$(obj).text(i18nconvert("main_indetail"));
							$(obj).removeData().type;
							$(obj).data('type', 'hide');
							$(obj).parents('tr').after("\
								<tr class='tr-detail'>\
									<td colspan='6'>\
										<table class='table table-bordered table-td-valign-middle text-center table-active'>\
											<tr class='detail-head font-weight-bold table-secondary'>\
												<td>"+i18nconvert("GN")+"</td>\
												<td>"+i18nconvert("payNum")+"</td>\
												<td>"+i18nconvert("AM")+"</td>\
											</tr>\
										</table>\
									</td>\
								</tr>\
							");
							for(var i = 0; i < result.orderGoods.length; i++) {
								var orderGoodsOption = "";
								if(result.orderGoods[i].OON) {
									orderGoodsOption = "("+result.orderGoods[i].OON+")";
								}
								else {
									orderGoodsOption = "";
								}
								$('.detail-head').after("\
									<tr>\
										<th width='50%' class='font-weight-normal'>"+result.orderGoods[i].OGN+orderGoodsOption+"</td>\
										<th width='20%' class='font-weight-normal'>"+result.orderGoods[i].ONU+"</td>\
										<th width='30%' class='font-weight-normal'>"+result.orderGoods[i].OTP+"</td>\
									</tr>\
								");
							}
						}
						else {
							alert(i18nconvert("purchase_failed"));
						}
					}
				});
			}
			else {
				alert(i18nconvert("purchase_failed"));
			}
		}
		else {
			$(obj).text(i18nconvert("main_indetail"));
			$(obj).removeData().type;
			$(obj).data('type', 'show');
			// alert($('.tr-detail').html());
			$('.tr-detail').remove();
		}
	}
	
	// 영수증 출력 화면
	
    function receiptPay(obj) {
    	var imp_code = $(obj).attr('name');
        if (imp_code)
        	window.open("/receipt?imp_uid="+imp_code,"pop","width=620, height=700, scrollbars=yes, resizable=yes"); 
        else{
            alert(i18nconvert("purchase_failed"));
        }   
    }
    
    
    // 포인트 사용내역
    
	var pointlist_condition = function (Object) {
		
		var num =  Object.array.length; 	
        var	insertTr = ""; // 채워넣을 HTML 초기화
     	var indexcount = 1; // 인덱스번호 초기화
     	
     	$("#memDiv1").empty();
     	
     	
     	insertTr += "<tr>";
		insertTr += "<th width='2.5%'></th>";
		insertTr += "<th width='25%' name = 'PN'>"+i18nconvert("pointPN")+"<a href='javascript:sortList(pagingObject,PN);'><i id = 'PN' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "PN-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "PN")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='25%' name = 'CA'>"+i18nconvert("pointCA")+"<a href='javascript:sortList(pagingObject,CA);'><i id = 'CA' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CA-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CA")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='25%' name = 'PO'>"+i18nconvert("PO")+"<a href='javascript:sortList(pagingObject,PO);'><i id = 'PO' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "PO-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "PO")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "</tr>";
     	
     	$("#memDiv1").append(insertTr);
		insertTr = "";
		
    	
		for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
			if(Object.array.length != 0) {
				if(Object.array[i]) {
				  insertTr += "<tr>";
				  insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
				  insertTr += "<td>"+ Object.array[i].PN +"</td><td>";
				  if ( (moment(Object.array[i].CA).format('DD')) == moment().format('DD') )
				  {
				       insertTr +=  moment(Object.array[i].CA).format('HH:mm');
				  }
				  else {
				      insertTr += moment(Object.array[i].CA).format('YYYY-MM-DD');
				  }
				  insertTr += "</td><td>-"+ Object.array[i].PO+"</td>";
				  insertTr += "</tr>";
				  num -= indexcount;
				  
				}
			}
			else {
				insertTr += "<tr>";
				insertTr += "	<td colspan='10'>No Data</td>";
				insertTr += "</tr>";
				
				break;
			}
		}
					
		$("#memDiv2").append(insertTr);
	};
	
	
	// 알림톡 전송 내역
	var alarmtalklist_condition = function (Object) {
		
		var num =  Object.array.length; 	
        var	insertTr = ""; // 채워넣을 HTML 초기화
     	var indexcount = 1; // 인덱스번호 초기화
     	
     	$("#memDiv1").empty();
     	
     	insertTr += "<tr>";
		insertTr += "<th width='2.5%'></th>";
		insertTr += "<th width='30.5%' name = 'WNM'>"+i18nconvert("payWNM")+"<a href='javascript:sortList(pagingObject,WNM);'><i id = 'WNM' class=' float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "WNM-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "WNM")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='24%' name = 'CA'>"+i18nconvert("pointCA")+"<a href='javascript:sortList(pagingObject,CA);'><i id = 'CA' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CA-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CA")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "<th width='21%' name = 'RE'>"+i18nconvert("RE")+"<a href='javascript:sortList(pagingObject,RE);'><i id = 'RE' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "RE-2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "RE")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "</tr>";
     	
     	$("#memDiv1").append(insertTr);
		insertTr = "";
		
		for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
			if(Object.array.length != 0) {	
	     	   if(Object.array[i]) {
	     	      
				  insertTr += "<tr>";
				  insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
				  insertTr += "<td>"+ Object.array[i].WNM +"</td><td>";
				  if ( (moment(Object.array[i].CA).format('DD')) == moment().format('DD') )
				  {
				       insertTr +=  moment(Object.array[i].CA).format('HH:mm');
				  }
				  else {
				      insertTr += moment(Object.array[i].CA).format('YYYY-MM-DD');
				  }
				  insertTr += "</td><td>"+ Object.array[i].RE+"</td>";
				  insertTr += "</tr>";
				  num -= indexcount;
	     	   }
			}
	     	else {
	     	  	insertTr += "<tr>";
				insertTr += "	<td colspan='10'>No Data</td>";
				insertTr += "</tr>";
				
				break;
	     	}   
     	}
			  
		$("#memDiv2").append(insertTr);
		
	};
	
	// 공지사항 리스트
	var noticeList_condition = function (Object) {
		
		var num =  Object.array.length; 	
        var	insertTr = ""; // 채워넣을 HTML 초기화
     	var indexcount = 1; // 인덱스번호 초기화
     	
     	$("#memDiv1").empty();
     	
     	
     	insertTr += "<tr>";
		insertTr += "<th width='2.5%'></th>";
		insertTr += "<th width='60.5%' name='TI'>"+i18nconvert("notice_contents")+"<a href='javascript:sortpage(pagingObject,TI,[TI,CA]);' name = 'TI'><i id = 'TI' class=' float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "TI2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "TI")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			
		insertTr += "	<th width='24%' name='CA'>"+i18nconvert("notice_date")+"<a href='javascript:sortpage(pagingObject,CA,[TI,CA]);' name = 'CA'><i id = 'CA' class='float-right mx-1 fas fa-lg fa-fw m-t-3 ";
		if(Object.sort == "CA2")
			insertTr += "fa-sort-up'></a></i></th>";
		else if(Object.sort == "CA")
			insertTr += "fa-sort-down'></a></i></th>";
		else 
			insertTr += "fa-sort'></a></i></th>";
			insertTr += "</tr>";
     	
     	$("#memDiv1").append(insertTr);
     	
		insertTr = "";
		for (var i = (Object.postNum * Object.page) ; i < (Object.postNum * Object.page) + Object.postNum ; i ++) { // 현재 페이지의 번호에 맞는 리스트 뽑아서 출력 (0 ~ 9, 10 ~ 19)
			if(Object.array.length != 0) {	
	     	   if(Object.array[i]) {
	     	      
				  insertTr += "<tr>";
				  insertTr += "<td class='font-weight-bold'>"+(num - (Object.page*10)) +" </td>";
				  insertTr += "<td>"+ Object.array[i].TI +"</td><td>";
				  if ( (moment(Object.array[i].CA).format('DD')) == moment().format('DD') )
				  {
				       insertTr += moment(Object.array[i].CA).format('HH:mm');
				  }
				  else {
				      insertTr += moment(Object.array[i].CA).format('YYYY-MM-DD');
				  }
				  insertTr += "</tr>";
				  num -= indexcount;
	     	   }
			}
	     	else {
	     	  	insertTr += "<tr>";
				insertTr += "<td colspan='10'>No Data</td>";
				insertTr += "</tr>";
				
				break;
	     	}   
     	}
			  
		$("#memDiv2").append(insertTr);
	};