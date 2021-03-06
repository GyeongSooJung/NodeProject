// 본사, 지점 표시 ajax
function agentAjax(companyNumber) {
    $.ajax({
        type: 'POST',
        url: '/find/agent',
        dataType: 'json',
        data: {
            CNU: companyNumber
        }
    }).done(function(data) {
        var insertTr = "";
        
        if(data.result == 'yesAgents') {
			$('.agent-box').removeClass('d-none');
			
			insertTr += "<option value =''>"+i18nconvert('register_branch_agent_guide')+"</option>";
			insertTr += "<option value = '000/본사'>본사</option>";
			for(var i = 0; i < data.nameList.length; i ++) {
				insertTr += "<option value ='"+ data.codeList[i] +"/"+ data.nameList[i] +"'>"+ data.nameList[i] +"</option>";
			}
			
			$('#ANA').append(insertTr);
			$('#CNU').attr('readonly', true);
			$('#CNU').removeClass('w-70 mr-2');
			$('.cnu-btn').addClass('d-none');
		}
		else if(data.result == 'noAgents') {
			$('.agent-box').removeClass('d-none');
			
			insertTr += "<option value =''>"+i18nconvert('register_branch_agent_guide')+"</option>";
			insertTr += "<option value = '000/본사'>본사</option>";
			
			$('#ANA').append(insertTr);
			$('#CNU').attr('readonly', true);
			$('#CNU').removeClass('w-70 mr-2');
			$('.cnu-btn').addClass('d-none');
		}
		else {
			alert(i18nconvert('find_no_register'));
			location.reload();
		}
    });
}

// 비밀번호 찾기 ajax
function checkAjax(companyNumber) {
    $.ajax({
        type: 'POST',
        url: '/find/checkCNU',
        dataType: 'json',
        data: {
            CNU: companyNumber
        }
    }).done(function(data) {
        if (data.result == 'success') {
            document.getElementById('emailbox').classList.remove('d-none');
            document.getElementsByName('CNU')[0].readOnly = true;
            document.getElementById('exEmail').innerHTML = "Your Email : " + "<span class='h5'>" + data.mask + "</span>";
            
            $("#ANA").not(":selected").attr("disabled", "disabled");
            $('#ANA').removeClass('w-70 mr-2');
            $('.agent-btn').addClass('d-none');
        }
        else {
            alert(i18nconvert("find_no_register"));
        }
    });
}

// 타이머 기능
var timer;
var sec = '';

function stopWatch(TimeSet) {
	timer = setInterval(function(){
		sec = (TimeSet)%60;
		document.getElementById('err-msg2').innerHTML = i18nconvert('register_auth_time')+ parseInt(TimeSet/60) + i18nconvert('register_auth_minute') + sec + i18nconvert('register_auth_second') + "<br><a href='javascript:;' id='resend' class='text-white' onclick=emailSend('CNU','EA');><u>"+i18nconvert('register_auth_resend')+"</u></a>";
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

// 이메일 전송 ajax
function emailSendAjax(companyNumber, email) {
    $.ajax({
		type: 'POST',
		url: '/find/send',
		dataType: 'json',
		data: {
		    CNU: companyNumber,
			EA: email
		}
	}).done(function(data) {
	    if (data.result == 'wrong') {
			alert(i18nconvert('find_email_error'));
		}
		else if (data.result == 'send') {
			alert(i18nconvert('register_auth_com_msg'));
			document.getElementsByName('EA')[0].readOnly = true;
			document.getElementById('CEA').classList.remove('d-none');
			document.getElementById('cerBtn').classList.remove('d-none');
			document.getElementById('sendBtn').classList.add('d-none');
			
		clearTimeout(timer);
		stopWatch(300);
		}
		else {
		    alert(i18nconvert('register_email_send_fail'));
		}
	});
}

// 이메일 인증 ajax
function emailCerAjax(companyNumber, email, cerNum) {
    $.ajax({
    	type: 'POST',
    	url: '/find/cert',
    	dataType: 'json',
    	data: {
    	    CNU: companyNumber,
    	    EA: email,
    		CEA: cerNum
    	}
    }).done(function(data) {
        if (data.result == 'success') {
			alert(i18nconvert('register_auth_success'));
			clearTimeout(timer);
			document.getElementsByName('CEA')[0].readOnly = true;
			document.getElementById('err-msg2').innerHTML = i18nconvert('register_auth_success');
			document.getElementsByName('hideCK')[0].value = 'true';
			document.getElementById('findBtn').classList.remove('d-none');
		}
		else {
			alert(i18nconvert('register_auth_fail'));
			document.getElementsByName('CEA')[0].value = null;
			document.getElementsByName('hideCK')[0].value = null;
		}
    });
}

// 임시 비밀번호 생성 ajax
function tempPw(companyNumber, agentNumber, email) {
    var CNU = document.getElementsByName(companyNumber)[0].value + document.getElementById(agentNumber).value.split("/")[0];
    var EA = document.getElementsByName(email)[0].value;
    
    $.ajax({
        type: 'POST',
        url: '/find/findPW',
        dataType: 'json',
        data: {
            CNU: CNU,
            EA: EA
        }
    }).done(function(data) {
        if (data.result == 'success') {
            alert(i18nconvert('login_findpw')+"\n"+i18nconvert('login_again')+"\n"+i18nconvert('login_findpw2'));
            location = '/login';
        }
        else {
            alert(i18nconvert('find_pw_fail'));
            location.reload();
        }
    });
    event.preventDefault();
}