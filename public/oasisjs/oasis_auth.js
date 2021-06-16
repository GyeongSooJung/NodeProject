// 로그인 기능
function loginAjax(companyNumber, password) {
	$.ajax({
		type: 'POST',
		url: 'auth/login',
		dataType: 'json',
		data: {
			CNU: companyNumber,
			PW: password
		}
	}).done(function(data) {
		if(data.result == 'success') {
			location = '/main';
		}
		else if(data.result == 'fail') {
			alert(i18nconvert('login_error'));
		}
	});
}

// 회원탈퇴 기능
function withdrawal(i18nconvert) {
	var answer;
	//페이지를 이동하기 전에 confirm()을 사용해 다시 한번 확인한다.
	//확인을 선택하면 answer에  true, 취소를 선택하면 false 값이 들어간다.
	answer = confirm(i18nconvert("layout_withdrawal_confirm"));
	//확인을 선택한 경우 자바스크립트를 호출할 때 같이 넘어온 url이라는 변수에 들어있는 주소로 페이지 이동
	if(answer == true){
		location = '/auth/withdrawal';
	}
	else {
		return false;
	}
}

// 로그아웃 기능
function logout(i18nconvert) {
	var answer;
	//페이지를 이동하기 전에 confirm()을 사용해 다시 한번 확인한다.
	//확인을 선택하면 answer에  true, 취소를 선택하면 false 값이 들어간다.
	answer = confirm(i18nconvert("layout_signout_confirm"));
	//확인을 선택한 경우 자바스크립트를 호출할 때 같이 넘어온 url이라는 변수에 들어있는 주소로 페이지 이동
	if(answer == true){
		location = '/auth/logout';
	}
	else {
		return false;
	}
}

// 프로필 수정 - 일반 정보 수정 기능
function editInfoAjax(companyName, ceoName, email, reEmail, mobileNumber, phoneNumber, password) {
	$.ajax({
		type: 'POST',
		url: '/profile/editInfo',
		dataType: 'json',
		data: {
			CNA : companyName,
			NA : ceoName,
			EA : email,
			REA : reEmail,
			MN : mobileNumber,
			PN : phoneNumber,
			PW : password,
		}
	}).done(function(data) {
		if (data.result == 'success') {
			alert(i18nconvert('profile_success'));
			location = '/profile';
		}
		else if(data.result == 'exist') {
			alert(i18nconvert('profile_ex_email'));
			document.getElementsByName("CNA")[0].value = data.company.CNA;
			document.getElementsByName("NA")[0].value = data.company.NA;
			document.getElementsByName("EA")[0].value = data.company.EA;
			document.getElementsByName("REA")[0].value = data.company.EA;
			document.getElementsByName("MN")[0].value = data.company.MN;
			document.getElementsByName("PN")[0].value = data.company.PN;
			document.getElementsByName("PW")[0].value = null;
		}
		else if(data.result == 'noMatch') {
			alert(i18nconvert('profile_pw_error'));
			document.getElementsByName("CNA")[0].value = data.company.CNA;
			document.getElementsByName("NA")[0].value = data.company.NA;
			document.getElementsByName("EA")[0].value = data.company.EA;
			document.getElementsByName("REA")[0].value = data.company.EA;
			document.getElementsByName("MN")[0].value = data.company.MN;
			document.getElementsByName("PN")[0].value = data.company.PN;
			document.getElementsByName("PW")[0].value = null;
		}
		else {
			alert(i18nconvert('profile_fail'));
		}
	});
}

// 프로필 수정 - 비밀번호 변경 시 이메일 체크 기능
function emailCheckAjax(email) {
	$.ajax({
		type: 'POST',
		url: '/profile/emailCK',
		dataType: 'json',
		data: {
			EA : email,
		}
	}).done(function(data) {
		if(data.result == 'success') {
			document.getElementById('emailBox').classList.add('d-none');
			document.getElementById('editPw').classList.remove('d-none');
		}
		else if(data.result == 'noMatch') {
			alert(i18nconvert('find_email_error'));
			document.getElementsByName('EA')[0].value = null;
		}
		else {
			alert(i18nconvert('profile_fail'));
		}
	});
}

// 프로필 수정 - 비밀번호 변경 기능
function editPwAjax(currentPassword, changePassword, rePassword) {
	$.ajax({
		type: 'POST',
		url: '/profile/editPw',
		dataType: 'json',
		data: {
			PW : currentPassword,
			CPW : changePassword,
			RPW : rePassword,
		}
	}).done(function(data) {
		if (data.result == 'success') {
			alert(i18nconvert('profile_pw_success')+"\n"+i18nconvert('login_again'));
			location = '/login'
		}
		else if (data.result == 'noMatch') {
			alert(i18nconvert('profile_pw_error'));
			document.getElementsByName("PW2")[0].value = null;
			document.getElementsByName("CPW")[0].value = null;
			document.getElementsByName("RPW")[0].value = null;
			$("#pwNotice").hide();
			$("#pwNotice2").hide();
		}
		else {
			alert(i18nconvert('profile_fail'));
		}
	});
}