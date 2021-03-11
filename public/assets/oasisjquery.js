
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
    function receiptPay(imp_code) {
        if (imp_code)
        window.open("/receipt?imp_uid="+imp_code,"pop","width=570,height=700, scrollbars=yes, resizable=yes"); 
        else{
            alert("구매 내용이 잘못되었습니다.");
        }
        
                     
    }
    