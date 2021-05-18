    //리스트 시간 출력
    function Timefunction(time) {
    	var cca = Date.UTC();
    	if ( (moment(time).format('DD')) == moment().format('DD') )
    	{
           var cca = moment(time).format('HH:mm');
    	}
    	else {
    		var cca = moment(time).format('YYYY-MM-DD');
    	}
		document.write(cca);
    };
    
    //Unix 시간 변환
    function Unix_timestamp(time) {
        var date = new Date(time*1000);
        var year = date.getFullYear();
        var month = "0" + (date.getMonth()+1);
        var day = "0" + date.getDate();
        var hour = "0" + date.getHours();
        var minute = "0" + date.getMinutes();
        var second = "0" + date.getSeconds();
        
        var datetime =  year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
        return document.write(datetime);
    }
    
    
    //원화 콤마 표시 html용
    function MoneyComma(money) {
        var money = String(money);
        var moneyCom = money.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        return document.write(moneyCom);
    }
    
    //원화 콤마 표시 자바스크립트용
    function MoneyCommaJava(money) {
        var money = String(money);
        return money.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }
    
    // ------------------------------------------ 선택 기능 -------------------------
    
    // 전체 선택 기능
	function allCheckedBox(obj) {
	   	// @brief ��택한 체크박스의 클래스 명칭을 가져온다.
	   	const termClass = obj.getAttribute("class");
	   	// @brief 선택한 클래스명과 같은 클래스의 갯수
	   	Array.prototype.forEach.call(document.getElementsByClassName(termClass), function(element, index, array) {
	        // @brief 엘리먼트의 값 출력
	        // @brief 선택한 클래스의 첫번째 checkbox의 상태가 체크가 되있는 경우
	        if(document.getElementsByClassName(termClass)[0].checked == true) {
	            // @brief 같은 클래스명을 가진 모든 checkbox의 상태를 선택 완료 처리 한다.
	            element.checked = true;
	        }
	        // @brief 선택한 클래스의 첫번째 checkbox의 상태가 체크가 해제된 경우
	        else {
	            // @brief 같은 클래스명을 가진 모든 checkbox의 상태를 선택 해제 처리 한다.
	            element.checked = false;
	        }
	   	});
    }

	// 항목 선택 기능
	function eachCheckedBox(obj) {
      // @brief 선택한 체크박스의 상태가 선택해제인 경우
      if(obj.checked == false) {
            // @brief 선택한 체크박스의 클래스 명칭을 가져온다.
            const termClass = obj.getAttribute("class");
            // @brief 첫번째 checkbox의 상태가 체크가 되어있는경우
            if(document.getElementsByClassName(termClass)[0].checked == true) {
                // @brief 첫번째 checkbox의 상태를 체크해제한다.
                document.getElementsByClassName(termClass)[0].checked = false;
            }
        }
    }
    
    // ------------------------------- 페이지네이션 ------------------------------------
    
    function pagereload(Object,condition,searcherror) {
    	
    	// console.log(JSON.stringify(Object));
			$("input:checkbox[name='allck']").prop("checked", false);
			$("input:checkbox[name='ck']").prop("checked", false);
    	    $.ajax({
	    		url: Object.url,
                type: "POST",
                async: false,
                dataType: 'json',
                data: {
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
			    		
			    		
			    	condition(Object);
			    	
						  var insertTr = " ";
				    	  insertTr +=	"<a href='javascript:;' onclick=pageDoubleBtn('left',pagingObject,condition,searcherror) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-double-left'></i></a>";
						  insertTr +=	"<a href='javascript:;' onclick=pageBtn('left',pagingObject,condition,searcherror) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-left'></i></a>";
																		
							for(var i = Object.startpage; i < Object.endpage; i ++) {
								if(Object.page == i)
									insertTr +=	"<input type='button' onclick='pagebutton(pagingObject,"+ i +",condition,searcherror)' value ='"+ (i+1) +"' class='btn btn-white mr-1 px-2 text-primary' style=' background-color: #00acac; color: white !important;' >";
								else
									insertTr +=	"<input type='button' onclick='pagebutton(pagingObject,"+ i +",condition,searcherror)' value ='"+ (i+1) +"' class='btn btn-white mr-1 px-2 text-primary' >";
							}
							insertTr +=	"<a href='javascript:;' onclick=pageBtn('right',pagingObject,condition,searcherror) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-right'></i></a>";
							insertTr +=	"<a href='javascript:;' onclick=pageDoubleBtn('right',pagingObject,condition,searcherror) class='btn btn-primary mr-1 px-2'><i class='fas fa-angle-double-right'></i></a>";
						  $("#pagebox").append(insertTr);
						  $("#pagebox").show();
	        	}
	        	
	        	else if (data.result == "nothing") {
	        		searcherror();
	        		$("#searchtext").val('');
			    	$("#searchdatetext1").val('');
			    	$("#searchdatetext2").val('');
	        	}
	        	
	        	else {
	        		searcherror();
			    	$("#searchdatetext1").val('');
			    	$("#searchdatetext2").val('');
	        	}
			});
    }
    
    //초기화
    function refresh(Object) {
    	if(Object.name == "History") {
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
	function gotolist(Object,condition, searcherror, searchappend) {
		refresh(Object);
		pagereload(Object, condition, searcherror);
		
		$("#searchtext").val('');
		$("#searchdatetext1").val('');
		$("#searchdatetext2").val('');
		$("#searchoption").empty();
		$("#searchoption").append(searchappend);
		document.getElementById('gotolist').classList.add('d-none');
		document.getElementById('searchtext').classList.remove('d-none');
    	document.getElementById('searchdatetext').classList.add('d-none');
	}
    
    // 페이지 기능
	function pagebutton(Object,num,condition,searcherror) {
		Object.page = num;
    	pagereload(Object, condition, searcherror);
    }
    
    // 다음 페이지 기능
    function pageBtn(dir,Object,condition, searcherror) {
    	
		if(dir == 'left') {
			if((Object.page - 1) > -1)
			{
				Object.page -= 1;
				pagereload(Object, condition, searcherror);
			}
		}
		if(dir == 'right') {
			if((Object.page + 1) < Math.ceil(Object.array.length / Object.postNum))
			{
				Object.page += 1;
				pagereload(Object, condition, searcherror);
				
			}
			
		}
	}
	
	function pageDoubleBtn(dir, Object, condition, searcherror) {
		if(dir == 'left') {
			if((Object.page - Object.pageNum) < 0) {
				Object.page = 0;
				pagereload(Object, condition, searcherror);
			}
			else {
				Object.startpage -= 1;
				Object.page -= 5;
				pagereload(Object, condition, searcherror);
			}
		}
		if(dir == 'right') {
			
			if ((Object.page + Object.pageNum) >= Math.ceil(Object.array.length / Object.postNum))
			{
				Object.page = Math.ceil(Object.array.length / Object.postNum)-1;
				pagereload(Object, condition, searcherror);
			}
			else {
				Object.startpage += 1;
				Object.page += 5;
				pagereload(Object, condition, searcherror);
			}
		}
	}
	
	// 페이지 찾기, 정렬 함수
	
	
	