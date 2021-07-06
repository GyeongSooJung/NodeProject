
    // 쿠키 가져오기
    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return "";
    }

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
    
    // MAC주소 콜론 기능
	function setComma(str){
		//var MAC =document.getElementById('MAC')
		if((Number(str.length) % 3) ==2) {
			if(Number(str.length) == 17) {
				return str;
			}
			return str+":";
		}
		return str;
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
    
	

    