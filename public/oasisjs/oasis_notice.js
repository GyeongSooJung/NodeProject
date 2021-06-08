window.addEventListener('load', function() {
	// 공지사항 rolling 기능
	var height =  $(".notice").height();
	var num = $(".rolling li").length;
	var max = height * num;
	var move = 0;
	function noticeRolling(){
		move += height;
		$(".rolling").animate({"top":-move},600,function(){
			if( move >= max ){
				$(this).css("top",0);
				move = 0;
			};
		});
	};
	noticeRollingOff = setInterval(noticeRolling,2000);
	$(".rolling").append($(".rolling li").first().clone());

	$(".rolling_stop").click(function(){
		clearInterval(noticeRollingOff);
	});
	$(".rolling_start").click(function(){
		noticeRollingOff = setInterval(noticeRolling,1000);
	});
});

// 공지사항 팝업
function noticepop(obj) {
   var noticeid = $(obj).attr('name');
    if (noticeid)
    window.open("/notice_pop?noticeid="+noticeid,"pop","width=620, height=700, scrollbars=yes, resizable=yes"); 
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