//영수증 출력 화면
    function receiptPay(obj, String) {
    
    // if(String = '') {
        
    // }
    // else {
        
    // }
        var imp_code = $(obj).attr('name');
        if (imp_code)
            window.open("/receipt?imp_uid="+imp_code,"pop","width=620, height=700, scrollbars=yes, resizable=yes"); 
        else{
            alert("{{__('purchase_failed')}}");
        }   
}