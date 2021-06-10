$(function(){
	// 현재 페이지 찾기
	var path = document.location.pathname.toString();
	var cut =  path.split('/');
	
	// register(회원가입) - 비밀번호 입력 시 notice
	if(cut[1] == 'register') {
		console.log('hi');
	    $('#PW').keyup(function() {
	    	if($('#PW').val() == "") {
	    		$('#pwNotice').hide();
	    	}
			else if($('#PW').val().length < 8 || $('#PW').val().length > 16 ) {
				$('#pwNotice').show();
				$('#pwNotice').html('<i class="fas fa-2x fa-unlock"></i>');
				$('#pwNotice').attr('color', '#ff100b');
			}
			else {
				$('#pwNotice').show();
				$('#pwNotice').html('<i class="fas fa-2x fa-lock"></i>');
				$('#pwNotice').attr('color', '#23cf23');
			}
	    });
	
	    $('#CPW').keyup(function() {
	    	if($('#CPW').val() == "") {
	    		$('#pwNotice2').hide();
	    	}
			else if($('#PW').val() == $('#CPW').val()) {
				$('#pwNotice2').show();
				$('#pwNotice2').html('<i class="far fa-2x fa-check-circle"></i>');
				$('#pwNotice2').attr('color', '#23cf23');
			}
			else {
				$('#pwNotice2').show();
				$('#pwNotice2').html('<i class="fas fa-2x fa-times-circle"></i>');
				$('#pwNotice2').attr('color', '#ff100b');
			}
	    });
	}
	// profile(프로필 수정) - 비밀번호 입력 시 notice
	else if(cut[1] == 'profile') {
		$('#CPW').keyup(function() {
	    	if($('#CPW').val() == "") {
	    		$('#pwNotice').hide();
	    	}
			else if($('#CPW').val().length < 8 || $('#CPW').val().length > 16 || $('#CPW').val() == $('#PW2').val()) {
				$('#pwNotice').show();
				$('#pwNotice').html('<i class="fas fa-lg fa-unlock"></i>');
				$('#pwNotice').attr('color', '#ff100b');
			}
			else {
				$('#pwNotice').show();
				$('#pwNotice').html('<i class="fas fa-lg fa-lock"></i>');
				$('#pwNotice').attr('color', '#23cf23');
			}
	    });
	
	    $('#RPW').keyup(function() {
	    	if($('#RPW').val() == "") {
	    		$('#pwNotice2').hide();
	    	}
			else if($('#CPW').val() == $('#RPW').val()) {
				$('#pwNotice2').show();
				$('#pwNotice2').html('<i class="far fa-lg fa-check-circle"></i>');
				$('#pwNotice2').attr('color', '#23cf23');
			}
			else {
				$('#pwNotice2').show();
				$('#pwNotice2').html('<i class="fas fa-lg fa-times-circle"></i>');
				$('#pwNotice2').attr('color', '#ff100b');
			}
	    });
	}
});

// 폼 enter키 submit 막기
document.addEventListener('keydown', function(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
	}
}, true);