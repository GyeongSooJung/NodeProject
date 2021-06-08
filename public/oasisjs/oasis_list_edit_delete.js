	//----------------------------------------리스트 수정 기능 ----------------------------------//
	
	// 차량
	function car_editone(obj,i18nconvert) {
		var type = $(obj).data().type;
		$('.tr-edit').empty();
		$(obj).parents('tr').siblings().find('.edit-btn').text(i18nconvert("modify"));
		$(obj).parents('tr').siblings().find('.edit-btn').removeData().type;
		$(obj).parents('tr').siblings().find('.edit-btn').data('type', 'show');
		if(type == "show") {
			var car_id = $(obj).attr('name');
			if (car_id) {
				$.ajax({
					type: 'POST',
					url: '/car/ajax/car_list_edit1',
					dataType: 'json',
					data: {
						car_id: car_id
					},
					success: function(result) {
						if(result.status == 'success') {
							var carone = result.carone[0];
							var insertTr  = ""
							$(obj).text(i18nconvert("modify"));
							$(obj).removeData().type;
							$(obj).data('type', 'hide');
							insertTr += "<tr class='tr-edit'>"
							insertTr += "<td colspan='6'>"
						    insertTr += 	"<div class='panel-body'>"
							insertTr +=	"	<form id='car-edit-form' action='' method='post' data-parsley-validate='true'>"
							insertTr +=	"		<div class='form-group row m-b-15'>"
							insertTr +=	"			<label class='col-md-4 col-sm-4 col-form-label' for='CN'>"+i18nconvert("CN")+" <span class='text-danger'>*</span> :</label>"
							insertTr +=	"			<div class='col-md-8 col-sm-8'>"
							insertTr +=	"				<input class='form-control' id='CN' type='text' name = 'CN'  placeholder='"+i18nconvert("CN")+"' data-parsley-required='true' />"
							insertTr +=	"			</div>"
							insertTr +=	"		</div>"
							insertTr +=	"		<div class='form-group row m-b-15'>"
							insertTr +=	"			<label class='col-md-4 col-sm-4 col-form-label' for='CN'>"+i18nconvert("CPN")+" :</label>"
							insertTr +=	"			<div class='col-md-8 col-sm-8'>"
							insertTr +=	"				<input class='form-control' id='CPN' type='text' name = 'CPN'  placeholder='"+i18nconvert("CPN")+"' data-parsley-type='digits' data-parsley-type-message='{{__('register_digits_error')}}'  />"
							insertTr +=	"				<input class='form-control' id='car_id' type='hidden' name = 'car_id' value='"+carone._id+"'/>"
							insertTr +=	"			</div>"
							insertTr +=	"		</div>"
							insertTr +=	"		<div class='form-group row m-b-0'>"
							insertTr +=	"			<label class='col-md-4 col-sm-4 col-form-label'>&nbsp;</label>"
							insertTr +=	"			<div class='col-md-8 col-sm-8'>"
							insertTr +=	"				<a href='javascript:;' onclick='carEdit(pagingObject,i18nconvert);' class='btn btn-primary width-80'>"+i18nconvert("modify")+"</a>"
							insertTr +=	"				<button type='reset' class='btn btn-primary width-80'>"+i18nconvert("reset")+"</button>"
							insertTr +=	"			</div>"
							insertTr +=	"		</div>"
							insertTr +=	"	</form>"
							insertTr +=	"</div>"
							insertTr += "</td></tr>"
							$(obj).parents('tr').after(insertTr);
						}
						else {
							alert("{{__('modify_failed')}}");
						}
					 }
				});
			}
			else {
				alert("{{__('modify_failed')}}");
			}
		}
		else {
			$(obj).text(i18nconvert("modify"));
			$(obj).removeData().type;
			$(obj).data('type', 'show');
			// alert($('.tr-edit').html());
			$('.tr-edit').remove();
			
		}
	}
	
		function carEdit(Object,i18nconvert) {
		
		
		$.ajax({
			type: 'POST',
			url: '/car/ajax/car_list_edit2',
			dataType: 'json',
			data: {
				CN : $('#car-edit-form [name="CN"]').val(),
				CPN : $('#car-edit-form [name="CPN"]').val(),
				CID : Object.CID,
				car_id : $('#car-edit-form [name="car_id"]').val()
			},
			success: function(result) {
				if(result.status == 'success') {
					$('.tr-edit').remove();
					pagereload(Object,  i18nconvert);
					alert(i18nconvert("car_modify_success"));
					
				}
				else if(result.status == 'length') {
					alert(i18nconvert("car_length_error"));
				}
				else if(result.status == 'type') {
					alert(i18nconvert("car_type_error"));
				}
				else if(result.status == 'exist') {
					alert(i18nconvert("car_exist_error"));
				}
				else {
					alert(i18nconvert("modify_failed"));
				}
			 }
		});
		
	}
	
	// 장비
	
	function device_editone(obj,i18nconvert) {
		var type = $(obj).data().type;
		$('.tr-edit').empty();
		$(obj).parents('tr').siblings().find('.edit-btn').text(i18nconvert("modify"));
		$(obj).parents('tr').siblings().find('.edit-btn').removeData().type;
		$(obj).parents('tr').siblings().find('.edit-btn').data('type', 'show');
		if(type == "show") {
			var device_id = $(obj).attr('name');
			if (device_id) {
				$.ajax({
					type: 'POST',
					url: '/device/ajax/device_list_edit1',
					dataType: 'json',
					data: {
						device_id: device_id
					},
					success: function(result) {
						if(result.status == 'success') {
							var deviceone = result.deviceone[0];
							var insertTr  = ""
							$(obj).text(i18nconvert("modify"));
							$(obj).removeData().type;
							$(obj).data('type', 'hide');
							insertTr += "<tr class='tr-edit'>"
							insertTr += "<td colspan='9'>"
							
							insertTr += "<div class='panel-body'>"
						    insertTr += "   <form id='device-edit-form' action='' method='post' class='form-horizontal' data-parsley-validate='true' name='device-form' onsubmit='deviceEdit();'>"
						    insertTr += "      <div class='form-group row m-b-15'>"
						    insertTr += "         <label class='col-md-4 col-sm-4 col-form-label' for='VER'>"+i18nconvert("VER")+" <span class='text-danger'>*</span> :</label>"
						    insertTr += "         <div class='col-md-8 col-sm-8'>"
						    insertTr += "            <input class='form-control' id='VER' type='text' name = 'VER' placeholder='"+i18nconvert("device_edit_version_enter")+"' data-parsley-required='true' data-parsley-error-message='{{__('required_detail')}}' />"
						    insertTr += "         </div>"
						    insertTr += "      </div>"
						    insertTr += "      <div class='form-group row m-b-15'>"
						    insertTr += "         <label class='col-md-4 col-sm-4 col-form-label' for='NN'>"+i18nconvert("NN")+" :</label></label>"
						    insertTr += "         <div class='col-md-8 col-sm-8'>"
						    insertTr += "            <input class='form-control' id='NN' type='text' name = 'NN'  placeholder='"+i18nconvert("device_edit_nick_enter")+"'/>"
						    insertTr += "            <input class='form-control' id='device_id' type='hidden' name = 'device_id' value='"+deviceone._id+"'/>"
						    insertTr += "         </div>"
						    insertTr += "      </div>"
						    insertTr += "      <div class='form-group row m-b-0'>"
						    insertTr += "         <label class='col-md-4 col-sm-4 col-form-label'>&nbsp;</label>"
						    insertTr += "         <div class='col-md-8 col-sm-8'>"
						    insertTr += "            	<a href='javascript:;' onclick='deviceEdit(pagingObject,i18nconvert);' class='btn btn-primary width-80'>"+i18nconvert("modify")+"</a>"
						    insertTr += "            <button type='reset' class='btn btn-primary width-80'>"+i18nconvert("reset")+"</button>"
						    insertTr += "         </div>"
						    insertTr += "      </div>"
						    insertTr += "   </form>"
						    insertTr += "</div>"
							insertTr += "</td></tr>"
							$(obj).parents('tr').after(insertTr);
						}
						else {
							alert(i18nconvert("modify_failed"));
						}
					 }
				});
			}
			else {
				alert(i18nconvert("modify_failed"));
			}
		}
		else {
			$(obj).text(i18nconvert("modify"));
			$(obj).removeData().type;
			$(obj).data('type', 'show');
			// alert($('.tr-edit').html());
			$('.tr-edit').remove();
			
		}
	}
	
	function deviceEdit(Object,i18nconvert) {
		
		$.ajax({
			type: 'POST',
			url: '/device/ajax/device_list_edit2',
			dataType: 'json',
			data: {
				VER : $('#device-edit-form [name="VER"]').val(),
				NN : $('#device-edit-form [name="NN"]').val(),
				CID : Object.CID,
				device_id : $('#device-edit-form [name="device_id"]').val()
			},
			success: function(result) {
				if(result.status == 'success') {
					$('.tr-edit').remove();
					pagereload(Object, i18nconvert);
					alert(i18nconvert("device_modify_success"));
					
				}
				else {
					alert(i18nconvert("modify_failed"));
				}
			 }
		});
		
	}
	
	
	//----------------------------------삭제 기능------------------------------------//
	
	
		
	// 일반 삭제 기능
	function delete_one(obj,url,i18nconvert) {
		
		var answer;
	    	answer = confirm(i18nconvert('deleteconfirm'));
		if(answer == true){
			$.ajax({
    		url: url,
                    type: "POST",
                    dataType: 'json',
                    data: {
                    	select : $(obj).attr('name'),
                    }
	    	}).done(function (data) {  
	    		if(data.result == true) {
	    			alert(i18nconvert('deletesuccess'));
	    			location.reload();
	    		}
	    		else {
	    			alert(i18nconvert('choiceerror'));
	    		}
	    		
	    	});
		}
		else {
			return false;
		}
	}
	
	// 선택항목 삭제 기능
	function delete_check(url,i18nconvert) {
		var check = $("input:checkbox[name='ck']").is(":checked");
		if(!check) {
			alert(i18nconvert('choiceerror'));
		}
		else {
			var select_obj = [];
	        $('input[name="ck"]:checked').each(function (index) {
	                select_obj[index] = $(this).val() ;
	        });
			var answer;
		    	answer = confirm(i18nconvert('deleteconfirm'));
			if(answer == true){
				$.ajax({
	    		url: url,
	                    type: "POST",
	                    dataType: 'json',
	                    data: {
	                    	select : select_obj,
	                    }
		    	}).done(function (data) {  
		    		if(data.result == true) {
		    			alert(i18nconvert('deletesuccess'));
		    			location.reload();
		    		}
		    		else {
		    			alert(i18nconvert('choiceerror'));
		    		}
		    		
		    	})
	    	
	    	
			}
			else {
				$("input:checkbox[name='allck']").prop("checked", false);
				$("input:checkbox[name='ck']").prop("checked", false);
				return false;
			}
		}
	}