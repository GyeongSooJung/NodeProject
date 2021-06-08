// 사업자 번호 조회 및 정보 가져오기 기능
function checkCNU(companyNumber) {
	var CNU = document.getElementsByName(companyNumber)[0].value;
	$.ajax({
		type: 'POST',
		url: '/company/checkCNU',
		dataType: 'json',
		data: {
			CNU : CNU
		},
		success: function(result) {
			if(result.CRNumber) {
			    alert(i18nconvert('register_business_right'));
				// var answer = confirm(i18nconvert('register_business_right')+i18nconvert('register_business_info'));
				
				// if (answer == true) {
				// 	$.ajax({
				// 		type: 'POST',
				// 		url: '/company/infoCNU',
				// 		dataType: 'json',
				// 		data: {
				// 			CNU : CNU
				// 		},
				// 		success: function(result) {
				// 			if (result.searchResult == ",,,") {
				// 				alert("{{__('register_business_null')}}");
				// 			}
				// 			else {
				// 				document.getElementsByName("CNA")[0].value = result.searchResult[0];
				// 				document.getElementsByName("NA")[0].value = result.searchResult[3];
								
				// 				if (result.searchResult[2].substr(0,3) == '010' || result.searchResult[2].substr(0,3) == '011') {
				// 					document.getElementsByName("MN")[0].value = result.searchResult[2];
				// 					document.getElementsByName("PN")[0].value = null;
				// 				}
				// 				else {
				// 					document.getElementsByName("MN")[0].value = null;
				// 					document.getElementsByName("PN")[0].value = result.searchResult[2];
				// 				}
								
				// 				if (result.searchResult[1].indexOf(',') == '-1' ) {
				// 					document.getElementsByName("addr1")[0].value = result.searchResult[1];
				// 					document.getElementsByName("addr2")[0].value = null;
				// 				}
				// 				else {
				// 					var addr = result.searchResult[1];
				// 					var splitAddr = addr.split(',');
				// 					document.getElementsByName("addr1")[0].value = splitAddr[0];
									
				// 					var splitDetailAddr = addr.substring(splitAddr[0].length+2, addr.length);
				// 					document.getElementsByName("addr2")[0].value = splitDetailAddr;
				// 				}
				// 			}
				// 		}
				// 	});
				// }
				// else {
				// 	return false;
				// }
			}
			else {
				alert(i18nconvert('register_business_noexist'));
				document.getElementsByName("CNA").value = null;
				document.getElementsByName("NA").value = null;
				document.getElementsByName("MN").value = null;
				document.getElementsByName("PN").value = null;
				document.getElementsByName("addr1").value = null;
				document.getElementsByName("addr2").value = null;
			}
		}
	});
}

// 타이머 기능
var timer;
var sec = '';

function stopWatch(TimeSet) {
	timer = setInterval(function(){
		sec = (TimeSet)%60;
		document.getElementById('err-msg2').innerHTML =i18nconvert('register_auth_time') + '&nbsp;' + parseInt(TimeSet/60) + i18nconvert('register_auth_minute') + sec + i18nconvert('register_auth_second') + "." + "<br><a href='javascript:;' id='resend' class='text-white' onclick=emailSend('EA')><u>"+i18nconvert('register_auth_resend')+"</u></a>";
		TimeSet--;
		
		if(TimeSet < 0){
			clearTimeout(timer);
			alert(i18nconvert('register_auth_timeout'));
			document.getElementsByName('EA')[0].value = null;
			document.getElementsByName('CEA')[0].value = null;
			document.getElementsByName('EA')[0].readOnly = false;
			document.getElementsByName('CEA')[0].readOnly = false;
			document.getElementsByName('hideCK')[0].value = null;
			document.getElementById('CEA').classList.add('d-none');
			document.getElementById('cerBtn').classList.add('d-none');
			document.getElementById('sendBtn').classList.remove('d-none');
			document.getElementById('err-msg2').innerHTML = i18nconvert('register_reauth_msg');
		}
    }, 1000);
}

// 이메일 전송 기능
function emailSendAjax(email) {
    $.ajax({
		type: 'POST',
		url: '/email/send',
		dataType: 'json',
		data: {
			EA: email
		},
		success: function(result) {
			if (result.status == 'exist') {
				alert(i18nconvert('register_already_msg'));
			}
			else if (result.status == 'send') {
				alert(i18nconvert('register_auth_com_msg'));
				document.getElementsByName('EA')[0].readOnly = true;
				document.getElementById('CEA').classList.remove('d-none');
				document.getElementById('cerBtn').classList.remove('d-none');
				document.getElementById('sendBtn').classList.add('d-none');
				
			clearTimeout(timer);
			stopWatch(300);
			}
		}
	});
}

// 이메일 인증 기능
function emailCerAjax(cerNum) {
    $.ajax({
		type: 'POST',
		url: '/email/cert',
		dataType: 'json',
		data: {
			CEA: cerNum
		},
		success: function(result) {
			if (result.status == 'success') {
				alert(i18nconvert('register_auth_success'));
				clearTimeout(timer);
				document.getElementsByName('CEA')[0].readOnly = true;
				document.getElementById('err-msg2').innerHTML = i18nconvert('register_auth_success');
				document.getElementsByName('hideCK')[0].value = 'true';
			}
			else if (result.status == 'fail') {
				alert(i18nconvert('register_auth_fail'));
				document.getElementsByName('CEA')[0].value = null;
				document.getElementsByName('hideCK')[0].value = null;
			}
		}
	});
}

// 폼 submit 시 인증 과정 여부 확인 기능
function checkForm() {
	if(document.getElementsByName('hideCK')[0].value != 'true') {
		document.getElementById('err-msg2').innerHTML = i18nconvert('register_auth_need');
	}
	else {
	    $.ajax({
		    type: 'POST',
		    url: '/company/register',
		    dataType: 'json',
		    data: {
		        CNU: document.getElementsByName('CNU')[0].value,
		        CNA: document.getElementsByName('CNA')[0].value,
		        CK: document.getElementsByName('CK')[0].value,
		        addr1: document.getElementsByName('addr1')[0].value,
		        addr2: document.getElementsByName('addr2')[0].value,
		        PN: document.getElementsByName('PN')[0].value,
		        NA: document.getElementsByName('NA')[0].value,
		        MN: document.getElementsByName('MN')[0].value,
		        PW: document.getElementsByName('PW')[0].value,
		        EA: document.getElementsByName('EA')[0].value,
		        CEA: document.getElementsByName('CEA')[0].value,
		    },
		    success: function(result) {
		        if(result.status == 'success') {
		            alert(i18nconvert('register_success'));
		            location = '/';
		        }
		        else if(result.status == 'cerFail') {
		            alert(i18nconvert('register_mn_error'));
		        }
		        else if(result.status == 'existEA') {
		            alert(i18nconvert('register_email_error'));
		        }
		        else if(result.status == 'existCNU') {
		            alert(i18nconvert('register_cnu_error'));
		        }
		        else if(result.status == 'fail') {
		            alert(i18nconvert('register_fail'));
		        }
		    }
		});
	}
	event.preventDefault();
}