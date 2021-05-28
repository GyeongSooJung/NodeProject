        // ------------------------------- 페이지네이션 ------------------------------------
    
    function pagereload(Object,i18nconvert) {
    	// console.log(JSON.stringify(Object));
			$("input:checkbox[name='allck']").prop("checked", false);
			$("input:checkbox[name='ck']").prop("checked", false);
    	    $.ajax({
	    		url: Object.url,
                type: "POST",
                async: false,
                dataType: 'json',
                data: {
                	CID : Object.CID,
                    sort : Object.sort,
                    search : Object.search,
                    searchtext : Object.searchtext,
                    searchdate : Object.searchdate
                }
	        }).done(function (data) { 
	        	if(data.result == true) {
	    		    Object.array = data.pagelist; // 전체 리스트
	    		    Object.startpage = Math.floor((Object.page) / Object.pageNum) * Object.pageNum;
	    		    Object.endpage = Object.startpage + Object.pageNum;
	    		    
	    		    var postNum = Object.postNum; // 게시될 페이지 숫자
	    		    var pageNum = Object.pageNum; // 페이지 번호의 갯수
	    		    var totalPage = Math.ceil(Object.array.length/Object.postNum); // 전체 페이지의 갯수
	    		    
	    		    if (Object.endpage > totalPage) { // 끝 페이지가 총 페이지 수보다 많다면 같게끔 처리
				        Object.endpage = totalPage;
				    }
	    		    
		        	//tr 초기화
		        	$("#data-table-combine > tbody > tr").remove();
		        	//페이지 넘버 박스 초기화
			     	$("#pagebox *").remove(); 
			    	
			    	var con = ""; // 조건에 따라 페이지네이션 버튼들에 들어갈 내용들을 바꿔줌
		    		if(Object.name == "Company") {
						companylist_condition(Object,i18nconvert);
					
					}
					else if (Object.name == "Device") {
						devicelist_condition(Object,i18nconvert);
					}
					
					else if (Object.name == "Car") {
						carlist_condition(Object,i18nconvert);
					}
					
					else if (Object.name == "Worker") {
						workerlist_condition(Object,i18nconvert);
					}
					else if (Object.name == "History") {
						historylist_condition(Object,i18nconvert);
					}
					else if (Object.name == "Pay") {
						paylist_condition(Object,i18nconvert);
					}
					else if (Object.name == "Point") {
						pointlist_condition(Object,i18nconvert);
					}
					else if (Object.name == "Alarmtalk") {
						alarmtalklist_condition(Object,i18nconvert);
					}
			    		
					var insertTr = " ";
					insertTr +=	"<a href='javascript:;' onclick=pageDoubleBtn('left',pagingObject,i18nconvert) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-double-left'></i></a>";
					insertTr +=	"<a href='javascript:;' onclick=pageBtn('left',pagingObject,"+con+",i18nconvert) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-left'></i></a>";
					
					for(var i = Object.startpage; i < Object.endpage; i ++) {
						if(Object.page == i)
							insertTr +=	"<input type='button' onclick='pagebutton(pagingObject,"+ i +",i18nconvert)' value ='"+ (i+1) +"' class='btn btn-white mr-1 px-2 text-primary' style=' background-color: #00acac; color: white !important;' >";
						else
							insertTr +=	"<input type='button' onclick='pagebutton(pagingObject,"+ i +",i18nconvert)' value ='"+ (i+1) +"' class='btn btn-white mr-1 px-2 text-primary' >";
					}
					insertTr +=	"<a href='javascript:;' onclick=pageBtn('right',pagingObject,i18nconvert) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-right'></i></a>";
					insertTr +=	"<a href='javascript:;' onclick=pageDoubleBtn('right',pagingObject,i18nconvert) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-double-right'></i></a>";
					$("#pagebox").append(insertTr);
					
					$("#pagebox").show();
	        	}
	        	
	        	else if (data.result == "nothing") {
	        		
	        		alert(i18nconvert('searcherror'));
	        		$("#searchtext").val('');
			    	$("#searchdatetext1").val('');
			    	$("#searchdatetext2").val('');
	        	}
	        	
	        	else {
	        		alert(i18nconvert('searcherror'));
			    	$("#searchdatetext1").val('');
			    	$("#searchdatetext2").val('');
	        	}
			});
    }
    
    //초기화
    function refresh(Object) {
    	if(Object.name == "Company") {
    		Object.url = "/ajax/company_list"
    		Object.CID = "5fd6c731a26c914fbad53ebe"
    		Object.array = [];
	    	Object.sort = "ET";
	    	Object.page = 0;
	    	Object.postNum = 10;
	    	Object.pageNum = 5;
	    	Object.startpage = 0;
	    	Object.endpage = 0;
	    	Object.search = "";
	    	Object.searchtext = "";
    		
    	}
    	else if(Object.name == "History") {
    		Object.array = [];
	    	Object.sort = "ET";
	    	Object.page = 0;
	    	Object.postNum = 10;
	    	Object.pageNum = 5;
	    	Object.startpage = 0;
	    	Object.endpage = 0;
	    	Object.search = "";
	    	Object.searchtext = "";
    	}
    	else {
    		Object.array = [];
	    	Object.sort = "CA";
	    	Object.page = 0;
	    	Object.postNum = 10;
	    	Object.pageNum = 5;
	    	Object.startpage = 0;
	    	Object.endpage = 0;
	    	Object.search = "";
	    	Object.searchtext = "";
    		
    	}
    	
    }
    
    	// 전체 목록으로
	function gotolist(Object, i18nconvert) {
		refresh(Object);
		pagereload(Object, i18nconvert);
		
		
		$("#searchtext").val('');
		$("#searchdatetext1").val('');
		$("#searchdatetext2").val('');
		$("#searchoption").empty();
		$("#searchoption").append(i18nconvert("search"));
		document.getElementById('gotolist').classList.add('d-none');
		document.getElementById('searchtext').classList.remove('d-none');
    	document.getElementById('searchdatetext').classList.add('d-none');
	}
    
    // 페이지 기능
	function pagebutton(Object,num,i18nconvert) {
		Object.page = num;
    	pagereload(Object, i18nconvert);
    }
    
    // 다음 페이지 기능
    function pageBtn(dir,Object, i18nconvert) {
		if(dir == 'left') {
			if((Object.page - 1) > -1)
			{
				Object.page -= 1;
				pagereload(Object,  i18nconvert);
			}
		}
		if(dir == 'right') {
			if((Object.page + 1) < Math.ceil(Object.array.length / Object.postNum))
			{
				Object.page += 1;
				pagereload(Object,  i18nconvert);
				
			}
			
		}
	}
	
	function pageDoubleBtn(dir, Object,  i18nconvert) {
		if(dir == 'left') {
			if((Object.page - Object.pageNum) < 0) {
				Object.page = 0;
				pagereload(Object,  i18nconvert);
			}
			else {
				Object.startpage -= 1;
				Object.page -= 5;
				pagereload(Object,  i18nconvert);
			}
		}
		if(dir == 'right') {
			
			if ((Object.page + Object.pageNum) >= Math.ceil(Object.array.length / Object.postNum))
			{
				Object.page = Math.ceil(Object.array.length / Object.postNum)-1;
				pagereload(Object,  i18nconvert);
			}
			else {
				Object.startpage += 1;
				Object.page += 5;
				pagereload(Object,  i18nconvert);
			}
		}
	}
	
	// 페이지 개수 지정
	
	function selectpage(Object,  i18nconvert,jsondata) {
        if(Object.postNum != jsondata.option)
		{
			Object.postNum = jsondata.option
			pagereload(Object,  i18nconvert);
		}
    }     
