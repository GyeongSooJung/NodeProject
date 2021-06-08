function setPointAjax() {
    $.ajax({
       type: 'POST',
       url: 'setting/point',
       dataType: 'json',
       data: {
           POA: document.getElementsByName("POA")[0].value
       },
       success: function(result) {
           if(result.status == 'success') {
               alert(i18nconvert("setting_point_success"));
               location.reload();
           }
           else if(result.status == 'fail') {
               alert(i18nconvert("setting_point_fail"));
               location.reload();
           }
       }
    });
}