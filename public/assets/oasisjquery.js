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