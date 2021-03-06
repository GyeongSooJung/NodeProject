function agentreroad (Obj) {
	    var data = {CID : Obj.CID}
	    $.ajax({
		        type: 'POST',
		        url: '/ajax/agent_list',
		        dataType: 'json',
		        data: {
		            data : JSON.stringify(data)
		        }
		    }).done(function(data) {
		    	$("#agentlist").empty();
		    	$("input[name=ANA]").val('');
		    	$("#category2").empty();
		    	$("#category2").append(i18nconvert('agent_select'));
		    	
		    	var allist = data.al;
		    	
		    	allist.sort(function(a,b) {
		    		var first = Number(Object.values(a)[0])
		    		var twice = Number(Object.values(b)[0])
		    		return (first < twice) ?  -1 : (first > twice) ? 1 : 0;
		    	})
		    	
		    	
		    	var insertTr = "";
		    	insertTr += "<li><a href='javascript:;' class='text-black' style='cursor:default'>본사<span class='pull-right'>000</span></a></li>"
			    for (var i = 0; i < allist.length; i ++) {
			        insertTr += "<li><a href='javascript:;' onclick='agenteditview(this)' id='"+Object.keys(allist[i])[0]+"' name='"+ Object.values(allist[i])[0]+"' class ='edit-btn'> "+String(Object.keys(allist[i])[0])+" <span class='pull-right'>"+ Object.values(allist[i])[0]+"</span></a></li>"
			    }
			    
			    $("#agentlist").append(insertTr);
				    	
		    })
	    
	    
	}
	
	function agenteditview(obj) {
	    
		$('#category2').empty();
		
		var insertTr = "";
		
		insertTr += ""
		
		insertTr += "	<div class='form-group row m-b-15'>"
	    insertTr += "		<label class='col-md-4 col-sm-4 col-form-label font-weight-bold' for='GI'> "+i18nconvert('agent_name')+" :</label>"
	    insertTr += "		<div class='d-flex col-md-8 col-sm-8'>"
	    insertTr += "    			<input class='col-sm-5 form-control' type='String'  placeholder='"+$(obj).attr('id')+"' data-parsley-required='true' data-parsley-error-message='{{__('required_detail')}}' data-parsley-trim-value='true' readonly/>"
	    insertTr += "               <i class='ml-1 mr-1 mt-2 fas fa-lg fa-fw  fa-arrow-right'></i>"
	    insertTr += "    			<input class='col-sm-5 form-control' type='String' id='ANA2' name='ANA2'  placeholder='' data-parsley-required='true' data-parsley-error-message='{{__('required_detail')}}' data-parsley-trim-value='true' />"
	    insertTr += "		</div>"
		insertTr += "	</div>"
		insertTr += "	<div class='d-flex'>"
		insertTr += "<a href='javascript:;' class='ml-5 btn btn-primary width-80' onclick='agentEdit(agentObject,"+$(obj).attr('id')+")'>"+i18nconvert('modify')+"</a>";
		insertTr += "<a href='javascript:;' class='ml-5 btn btn-primary width-80' onclick='agentDelete(agentObject,"+$(obj).attr('id')+")'>"+i18nconvert('delete')+"</a>";
		insertTr += "	</div>"

		
		$('#category2').append(insertTr);
		
	}
	
	function agentEdit(Object,string) {
		var data = { ANA :$('input[name=ANA2]').val(), b_ANA : string.id, CID : Object.CID, type : "edit" };
		
		agentajax(data);
	}
	
	function agentDelete(Object,string,string2) {
		var confirm = window.confirm(i18nconvert('agent_delete_confirm'));
		if ( confirm ) {
			var data = {b_ANA : string.id, CID : Object.CID, type : "delete" };
			agentajax(data);
		}
		
		
	}
	
	function agentJoin (Object) {
	   var formParsley  = $('#agent-form').parsley();
	   
		if(formParsley.isValid() == true) {
			var data = { ANA : document.getElementsByName("ANA")[0].value, CID : Object.CID, type : "join" };
			agentajax(data);
		}
		event.preventDefault();
	    
	}
	
	function agentajax(data) {
	    $.ajax({
		        type: 'POST',
		        url: '/ajax/agent',
		        dataType: 'json',
		        data: {
		            data : JSON.stringify(data)
		        }
		    }).done(function(data) {
		    	
			    if(data.result == 'success') {
					alert(i18nconvert('agent_register_success'));
					agentreroad(agentObject);
				}
				else if(data.result == 'successedit') {
					alert(i18nconvert('agent_edit_success'));
					agentreroad(agentObject);
				}
				else if(data.result == 'successdelete') {
					alert(i18nconvert('agent_delete_success'));
					agentreroad(agentObject);
				}
				else if(data.result == 'dupleN') {
					alert(i18nconvert('agent_name_duplicated'));
				}
				else if(data.result == 'dupleC') {
					alert(i18nconvert('agent_code_duplicated'));
				}
				else if(data.result == 'overNum') {
					alert(i18nconvert('agent_code_num_over'));
				}
		    });
	    
	}