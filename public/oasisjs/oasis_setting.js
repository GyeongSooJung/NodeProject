function setPointAjax() {
    $.ajax({
        type: 'POST',
        url: 'setting/point',
        dataType: 'json',
        data: {
            POA: document.getElementsByName("POA")[0].value
        }
    }).done(function(data) {
        if(data.result == 'success') {
            alert(i18nconvert("setting_point_success"));
            location.reload();
        }
        else {
            alert(i18nconvert("setting_point_fail"));
            location.reload();
        }
    });
}