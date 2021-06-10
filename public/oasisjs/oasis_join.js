// 공통 등록(차량, 장비)
function ajaxJoin(url, i18nconvert, data) {
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data: {
            data : JSON.stringify(data)
        },
        success: function(result) {
            if(result.type == 'device') {
                if(result.status == 'success') {
    				alert(i18nconvert('device_register_success'));
    				location = '/device_list';
    			}
    			else if(result.status == 'exist') {
    				alert(i18nconvert('device_duplicated'));
    			}
    			else if(result.status == 'type') {
    				alert(i18nconvert('device_mac_wrong'));
    			}
            }
			else if(result.type == 'car') {
    			if(result.status == 'success') {
    				alert(i18nconvert('car_register_success'));
    				location = '/car_list';
    			}
    			else if(result.status == 'exist') {
    				alert(i18nconvert('car_exist_error'));
    			}
    			else if(result.status == 'type') {
    				alert(i18nconvert('car_type_error'));
    			}
    			else if(result.status == 'length') {
    				alert(i18nconvert('car_length_error'));
    			}
    			else if(result.status == 'excelType') {
    				alert(i18nconvert('car_exceltype_error'));
    			}
    			else if(result.status == 'excelLength') {
    				alert(i18nconvert('car_excellength_error'));
    			}
			}
        }
    });
}

// 차량 엑셀등록(새로운 파일 시 초기화를 위해서)
async function excelNew() {
    await refresh(pagingObject);
    excelPage(pagingObject, i18nconvert);
}