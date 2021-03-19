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
    
    //영수증 출력 화면
    function receiptPay(imp_code) {
        if (imp_code)
        window.open("/receipt?imp_uid="+imp_code,"pop","width=620, height=700, scrollbars=yes, resizable=yes"); 
        else{
            alert("구매 내용이 잘못되었습니다.");
        }   
    }
    
    //원화 콤마 표시
    function MoneyComma(money) {
        var money = String(money);
        return money.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }