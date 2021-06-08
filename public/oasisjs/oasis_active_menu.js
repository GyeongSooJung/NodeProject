window.addEventListener('load', function() {
	// 메뉴 active 기능
	var path = document.location.pathname.toString();
	var cut =  path.split('/');
	if (cut[1] == 'car_edit') {
		cut[1] = 'car_list';
	}
	if (cut[1] == 'device_edit') {
		cut[1] = 'device_list';
	}
	if (cut[1] == 'history_chart') {
		cut[1] = 'history_list';
	}
	if (cut[1] == 'pay_confirm') {
		cut[1] = 'shop';
	}
	$('#active-menu').find('a[href="' + '/' + cut[1] + '"]').parents('li').addClass('active');
});