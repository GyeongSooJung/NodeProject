function checkac(a) {
	console.log("@@@")
		if(a.checked){
			//Ajax POST Method TEST
			$.ajax({
				url: '/ajax/post',
				dataType: 'json',
				type: 'POST',
				data: {ac_true:a.value},
				success: function(result) {
					if (result) {
						$('#post_output').html(result.result);
					}
				}
			});
		}
		else {
			//Ajax POST Method TEST
			$.ajax({
			url: '/ajax/post',
			dataType: 'json',
			type: 'POST',
			data: {ac_false:a.value},
				success: function(result) {
					if (result) {
						$('#post_output').html(result.result);
					}
				}
			});
		}
	}
	
	function checkau(a) {
			$.ajax({
				url: '/ajax/post',
				dataType: 'json',
				type: 'POST',
				data: {au:a.value},
				success: function(result) {
					if (result) {
						$('#post_output').html(result.result);
					}
				}
			});
	}
	
	function checkau2(a) {
	    
	    var audata = a.value.split(",")
	    
	    if(a.checked){
			//Ajax POST Method TEST
			$.ajax({
				url: '/ajax/post',
				dataType: 'json',
				type: 'POST',
				data: {au:audata[0] + "," + "2"},
				success: function(result) {
					if (result) {
						$('#post_output').html(result.result);
					}
				}
			});
		}
		else {
			//Ajax POST Method TEST
			$.ajax({
			url: '/ajax/post',
			dataType: 'json',
			type: 'POST',
			data: {au:audata[0] + "," + "1"},
				success: function(result) {
					if (result) {
						$('#post_output').html(result.result);
					}
				}
			});
		}
	}