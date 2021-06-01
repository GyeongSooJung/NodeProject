	        
	// 정렬 기능        
	function sortpage (Object,  i18nconvert,string,json) {
		
		var paglist = Object.array;
		
		var check_sort = string.id;
		
		if(document.getElementById(string.id).classList.contains('fa-sort-down')) {
	 		var check2 = check_sort + "2";
		}
		else {
	 		var check2 = check_sort;
		}
		
			Object.array = paglist;
			Object.sort = check2;
			Object.page = 0;
			pagereload(Object, i18nconvert);
		
	}        
	
	//검색 옵션 지정
	function searchoption(opt,Object,i18nconvert,jsondata) {
    	Object.search = opt;
    	$("#searchoption").empty();
    	
    	var string = "";
    	
    	for (var item in jsondata) {
    		if (opt === item) {
    			string = i18nconvert(item);
    			if((opt == "CA") || (opt == "ET")|| (opt == "payCA")|| (opt == "UCA") || (opt == "pointCA")) {
    				document.getElementById('searchtext').classList.add('d-none');
	    			$("#searchtext").val('');
    			}
    			else {
	    			document.getElementById('searchtext').classList.remove('d-none');
    			}
    		}
    	}
    	$("#searchtext").val('');
    	$("#searchdatetext1").val('');
    	$("#searchdatetext2").val('');
    	$("#searchoption").append(string);
    	$("#searchoption").show();
    }
    
    //검색기능
    function searchtext (Object,  i18nconvert) {
		if(Object.search == "")
			alert(i18nconvert('choiceerror'));
		else{
	    	if(($('#searchdatetext1').val() != "") && ($('#searchdatetext2').val() != "")) {
				Object.searchtext = $('#searchtext').val();
				Object.searchdate ="";
	    		Object.searchdate += $('#searchdatetext1').val();
	    		Object.searchdate += "~";
	    		Object.searchdate += $('#searchdatetext2').val();
				pagereload(Object,  i18nconvert);
				document.getElementById('gotolist').classList.remove('d-none');
			}
			else {
				Object.searchtext = $('#searchtext').val();
				pagereload(Object,  i18nconvert);
				document.getElementById('gotolist').classList.remove('d-none');
			}
		}
	}
