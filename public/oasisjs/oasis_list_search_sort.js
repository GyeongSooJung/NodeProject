	// 정렬 기능
	function sortList(Object, sort) {
		var pagelist = Object.array;
		var sortPlus = sort.id;
		
		if(document.getElementById(sort.id).classList.contains('fa-sort-down')) {
	 		var sortPlus2 = sortPlus + "-2";
		}
		else {
	 		var sortPlus2 = sortPlus;
		}
		
		Object.array = pagelist;
		Object.sort = sortPlus2;
		pagereload(Object);
	}
	
	//검색 옵션 지정
	function searchoption(opt,Object,jsondata) {
    	Object.search = opt;
    	$("#searchoption").empty();
    	
    	var string = "";
    	
    	for (var item in jsondata) {
    		if (opt === item) {
    			string = i18nconvert(item);
    		}
    	}
    	$("#searchtext").val('');
    	$("#searchoption").append(string);
    	$("#searchoption").show();
    }
    
    //검색기능
    function searchtext (Object) {
		if(Object.search == "" && $('#searchtext').val() != "") {
			alert(i18nconvert('search_option_error'));
		}
		else{
	    	if(($('#searchdatetext1').val() != "") && ($('#searchdatetext2').val() != "")) {
				Object.searchtext = $('#searchtext').val();
				Object.searchdate ="";
	    		Object.searchdate += $('#searchdatetext1').val();
	    		Object.searchdate += "~";
	    		Object.searchdate += $('#searchdatetext2').val();
				pagereload(Object);
				document.getElementById('gotolist').classList.remove('d-none');
			}
			else {
				Object.searchtext = $('#searchtext').val();
				pagereload(Object);
				document.getElementById('gotolist').classList.remove('d-none');
			}
		}
	}
