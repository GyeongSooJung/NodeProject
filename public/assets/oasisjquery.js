
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
    
    
    //영수증 출력 화면
    function receiptPay() {
        window.open("/receipt","pop","width=570,height=420, scrollbars=yes, resizable=yes"); 
                     
    }
    