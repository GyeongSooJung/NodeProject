// 공통 등록(차량, 장비)
function ajaxJoin(url, i18nconvert, data) {
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data: {
            data : JSON.stringify(data)
        }
    }).done(function(data) {
        if(data.type == 'device') {
            if(data.result == 'success') {
				alert(i18nconvert('device_register_success'));
				location = '/device_list';
			}
			else if(data.result == 'exist') {
				alert(i18nconvert('device_duplicated'));
			}
			else if(data.result == 'type') {
				alert(i18nconvert('device_mac_wrong'));
			}
			else {
				alert(i18nconvert('device_register_fail'));
			}
        }
		else if(data.type == 'car') {
			if(data.result == 'success') {
				alert(i18nconvert('car_register_success'));
				location = '/car_list';
			}
			else if(data.result == 'exist') {
				alert(i18nconvert('car_exist_error'));
			}
			else if(data.result == 'type') {
				alert(i18nconvert('car_type_error'));
			}
			else if(data.result == 'length') {
				alert(i18nconvert('car_length_error'));
			}
			else if(data.result == 'excelType') {
				alert(i18nconvert('car_exceltype_error'));
			}
			else if(data.result == 'excelLength') {
				alert(i18nconvert('car_excellength_error'));
			}
			else {
				alert(i18nconvert('car_register_fail'));
			}
		}
    });
}

// 차량 엑셀등록(새로운 파일 시 초기화를 위해서)
async function excelNew() {
    await refresh(pagingObject);
    excelPage(pagingObject);
}