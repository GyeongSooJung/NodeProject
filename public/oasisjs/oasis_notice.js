// window.addEventListener('load', function() {
// 	// 공지사항 rolling 기능
// 	var height =  $(".notice").height();
// 	var num = $(".rolling li").length;
// 	var max = height * num;
// 	var move = 0;
// 	function noticeRolling(){
// 		move += height;
// 		$(".rolling").animate({"top":-move},600,function(){
// 			if( move >= max ){
// 				$(this).css("top",0);
// 				move = 0;
// 			};
// 		});
// 	};
// 	noticeRollingOff = setInterval(noticeRolling,2000);
// 	$(".rolling").append($(".rolling li").first().clone());

// 	$(".rolling_stop").click(function(){
// 		clearInterval(noticeRollingOff);
// 	});
// 	$(".rolling_start").click(function(){
// 		noticeRollingOff = setInterval(noticeRolling,1000);
// 	});
// });

function noticepop(obj) {
	var noticeid = $(obj).attr('name');
	
	$(".notice-body").empty();
	$(".notice-date").empty();
	
	if (noticeid) {
		$.ajax({
			type: 'POST',
			url: '/ajax/notice_detail',
			dataType: 'json',
			data: {
				noticeid : noticeid
			}
		}).done(function(data) {
			if(data.result == true) {
				var insertTr = "";
                insertTr += "<div class='text-center h5 mt-2 mb-3'>["+data.noticedetail[0].TI+"]</div>";
        	    insertTr += "<div class='text-center'>" +data.noticedetail[0].CO + "</div>";
        	    $(".notice-body").append(insertTr);
        	    $(".notice-date").append("<h6 class='mb-0'>"+moment(data.noticedetail[0].CA).format('YYYY-MM-DD')+"</h6>");
			}
		})
	}
	else {
		alert("{{__('purchase_failed')}}");
	}
}

// 공지사항 작성
function noticewrite(noticeTitle, noticeText) {
    
    var title = $('#'+noticeTitle).val();
    var text = $('.'+noticeText).html();
    
     $.ajax({
		url: "/ajax/notice_write",
        type: "POST",
        async: false,
        dataType: 'json',
        data: {
           title : title,
           text : text
        }
    }).done(function (data) { 
        console.log(data)
        if(data.result == true) {
            alert(i18nconvert("notice_register"));
			location = '/notice_list';
        }
        
    })
}

// 공지사항 팝업 체크
function checkpop(checkbox) {
	if(checkbox.checked) {
		$.ajax({
			url: "/ajax/notice_pop_check",
			dataType: 'json',
			type: 'POST',
			data: {
				id: checkbox.value,
				ck: true
			}
		}).done(function(result) {
			if(!result) {
				alert("공지 팝업 에러");
			}
		})
	}
	else {
		$.ajax({
			url: "/ajax/notice_pop_check",
			dataType: 'json',
			type: 'POST',
			data: {
				id: checkbox.value,
				ck: false
			}
		}).done(function(result) {
			if(!result) {
				alert("공지 팝업 에러");
			}
		})
	}
}

function noticeLink() {
	var path = document.location.search.toString();
	var search = path.split('?nk=')[1];
	
	$(".notice-body").empty();
	$(".notice-date").empty();
	
	if(search) {
		$.ajax({
			type: 'POST',
			url: '/ajax/notice_detail',
			dataType: 'json',
			data: {
				noticeid : search
			}
		}).done(function(data) {
			if(data.result == true) {
				var insertTr = "";
                insertTr += "<div class='text-center h5 mt-2 mb-3'>["+data.noticedetail[0].TI+"]</div>";
        	    insertTr += "<div class='text-center'>" +data.noticedetail[0].CO + "</div>";
        	    $(".notice-body").append(insertTr);
        	    $(".notice-date").append("<h6 class='mb-0'>"+moment(data.noticedetail[0].CA).format('YYYY-MM-DD')+"</h6>");
				
				$("#notice-modal").modal();
			}
		})
	}
}