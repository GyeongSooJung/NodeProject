$(document).ready(function () {
	showCart();
});

// 상품 초기화
function shopInit(Object) {
	Object.GN = "";
	Object.GE = "";
	Object.GI = "";
	Object.GP = 0;
	Object.GO = false;
	Object.OT = [];
	Object.ON = [];
	Object.OP = [];
	Object.TT = 0;
	Object.NUM = 1;
}

// 상품등록 or 환불규정 Modal 띄우기
$(".banner").click(function() {
    var banner = $(this).data().banner;
	var insertTr = "";
	if(banner == 'join') {
		$('#banner-modal').find('.modal-title').html(i18nconvert('layout_goods_join'));
		insertTr += "<form id='goods-form' action='' method='post' class='form-horizontal' data-parsley-validate='true' name='goods-form' enctype='multipart/form-data'>";
		insertTr += "<div class='form-group row m-b-15'>";
		insertTr += "<label class='col-md-4 col-sm-4 col-form-label font-weight-bold' for='GI'>"+i18nconvert('payment_goods_img')+" :</label>";
		insertTr += "<div class='col-md-8 col-sm-8'>";
		insertTr += "<input type='file' id='GI' name='GI' accept='image/*' />";
		insertTr += "<input type='hidden' id='GIurl' name='GIurl' value='' />";
		insertTr += "</div>";
		insertTr += "</div>";
		insertTr += "<div class='form-group row m-b-15'>";
		insertTr += "<label class='col-md-4 col-sm-4 col-form-label font-weight-bold' for='GN'>"+i18nconvert('payment_name')+" <span class='text-danger'>*</span> :</label>";
		insertTr += "<div class='col-md-8 col-sm-8'>";
		insertTr += "<input class='form-control' type='String' id='GN' name='GN' placeholder='"+i18nconvert('payment_name')+"' data-parsley-required='true' data-parsley-error-message='{{__('required_detail')}}' />";
		insertTr += "</div>";
		insertTr += "</div>";
		insertTr += "<div class='form-group row m-b-15'>";
		insertTr += "<label class='col-md-4 col-sm-4 col-form-label font-weight-bold' for='GP'>"+i18nconvert('payment_goods_price')+" <span class='text-danger'>*</span> :</label>";
		insertTr += "<div class='col-md-8 col-sm-8'>";
		insertTr += "<input class='form-control' type='String' id='GP' name='GP' placeholder='"+i18nconvert('payment_goods_price')+"' data-parsley-type='digits' data-parsley-type-message='{{__('register_digits_error')}}' data-parsley-required='true' data-parsley-required-message='{{__('required_detail')}}' />";
		insertTr += "</div>";
		insertTr += "</div>";
		insertTr += "<div class='form-group row m-b-15'>";
		insertTr += "<label class='col-md-4 col-sm-4 col-form-label font-weight-bold' for='GE'>"+i18nconvert('payment_goods_explanation')+" :</label>";
		insertTr += "<div class='col-md-8 col-sm-8'>";
		insertTr += "<input class='form-control' type='String' id='GE' name='GE' placeholder='"+i18nconvert('payment_goods_explanation')+"' />";
		insertTr += "</div>";
		insertTr += "</div>";
		insertTr += "<hr>";
		insertTr += "<div class='d-flex justify-content-between align-items-center mb-3 select-option'>";
		insertTr += "<p class='mb-0'><b>* "+i18nconvert('payment_selection_option')+" *</b></p><button type='button' class='btn btn-sm btn-primary edit-option' data-edit='plus'>"+i18nconvert('payment_add_option')+"</button>";
		insertTr += "</div>";
		insertTr += "</form>";
		$('#banner-modal').find('.modal-body').html(insertTr);
		$('.goods-join').removeClass('d-none');
	}
	else {
		$('#banner-modal').find('.modal-title').html(i18nconvert('payment_refund_policy'));
		insertTr += "<p>";
		insertTr += i18nconvert('payment_regulation2')+"</br>";
		insertTr += i18nconvert('payment_regulation3')+"</br>";
		insertTr += i18nconvert('payment_regulation4')+"</br>";
		insertTr += i18nconvert('payment_regulation5');
		insertTr += "</p>";
		$('#banner-modal').find('.modal-body').html(insertTr);
		$('.goods-join').addClass('d-none');
	}
});

// 상품등록 - 옵션 추가
$(document).on('click', '.edit-option', function() {
	var edit = $(this).data().edit;
	
	if(edit == 'plus') {
		var insertTr = "";
		insertTr += "<div class='border border-gray rounded py-2 px-2 mb-2 option'>"
		insertTr += "<div class='d-flex justify-content-end mb-2'>"
		insertTr += "<button type='button' class='border-0 bg-transparent text-secondary edit-option' data-edit='minus'><i class='fas fa-lg fa-times-circle'></i></button>"
		insertTr += "</div>"
		insertTr += "<div class='form-group row m-b-15'>"
		insertTr += "<label class='col-md-4 col-sm-4 col-form-label font-weight-bold' for='OT'>"+i18nconvert('payment_option_type')+" :</label>"
		insertTr += "<div class='col-md-8 col-sm-8'>"
		insertTr += "<input class='form-control' type='String' id='OT' name='OT' placeholder='"+i18nconvert('payment_option_type')+" (ex."+i18nconvert('payment_option_type_ex')+")' />"
		insertTr += "</div>"
		insertTr += "</div>"
		insertTr += "<table class='table table-bordered table-td-valign-middle text-center table-active option-detail mb-0'>"
		insertTr += "<thead>"
		insertTr += "<tr>"
		insertTr += "<th width='55%'>"+i18nconvert('payment_option_name')+"</th>"
		insertTr += "<th width='40%'>"+i18nconvert('payment_option_price')+"</th>"
		insertTr += "<th width='5%'><button type='button' class='border-0 bg-transparent text-blue edit-option-detail' data-edit='plus'><i class='fas fa-lg fa-plus-square'></i></button></th>"
		insertTr += "</tr>"
		insertTr += "</thead>"
		insertTr += "<tbody>"
		insertTr += "<tr>"
		insertTr += "<td>"
		insertTr += "<input class='form-control' type='String' id='ON' name='ON' placeholder='"+i18nconvert('payment_option_name')+" (ex."+i18nconvert('payment_option_name_ex')+" ...)' />"
		insertTr += "</td>"
		insertTr += "<td>"
		insertTr += "<input class='form-control' type='String' id='OP' name='OP' placeholder='"+i18nconvert('payment_option_price')+"' />"
		insertTr += "</td>"
		insertTr += "<td>"
		insertTr += "</td>"
		insertTr += "</tr>"
		insertTr += "</tbody>"
		insertTr += "</table>"
		insertTr += "</div>"
		
		if($(".option").length != 0) {
			$(".option").last().after(insertTr);
		}
		else {
			$(".select-option").after(insertTr);
		}
	}
	else {
		$(this).parents('.option').remove();
	}
});

// 상품등록 - 옵션 세부사항 추가
$(document).on('click', '.edit-option-detail', function() {
	var edit = $(this).data().edit;
	var standIndex = $(".select-option").index()+1;
	var index = $(this).parents(".option").index()-standIndex;
	
	if(edit == 'plus') {
		$(".option").eq(index).find('tr').siblings().find(".edit-option-detail").remove();
		var insertTr = "";
		insertTr += "<tr>"
		insertTr += "<td>"
		insertTr += "<input class='form-control' type='String' id='ON' name='ON' placeholder='"+i18nconvert('payment_option_name')+" (ex."+i18nconvert('payment_option_name_ex')+" ...)' />"
		insertTr += "</td>"
		insertTr += "<td>"
		insertTr += "<input class='form-control' type='String' id='OP' name='OP' placeholder='"+i18nconvert('payment_option_price')+"' />"
		insertTr += "</td>"
		insertTr += "<td>"
		insertTr += "<button type='button' class='border-0 bg-transparent text-blue edit-option-detail' data-edit='minus'><i class='fas fa-lg fa-minus-square'></i></button>"
		insertTr += "</td>"
		insertTr += "</tr>"
		
		$(".option").eq(index).find("tr").last().after(insertTr);
	}
	else {
		$(".option").eq(index).find("tr").last().remove();
		if($(".option").eq(index).find("tr").length > 2) {
			$(".option").eq(index).find("tr").last().find("td").last().html("<button type='button' class='border-0 bg-transparent text-blue edit-option-detail' data-edit='minus'><i class='fas fa-lg fa-minus-square'></i></button>");
		}
	}
});

// 상품 이미지 ajax
function goodsImgAjax(formName, img) {
	var form = $('#'+formName)[0];
    var formData = new FormData(form);
    formData.append('img', $('#'+img)[0].files[0]);
    
    $.ajax({
    	type: 'post',
		url: '/shop/goodsImg',
		data: formData,
		enctype: 'multipart/form',
		processData: false,
		contentType: false
    }).done(function(data) {
    	if(data.result == "success") {
			$("input[name=GIurl").eq(0).val(data.imgUrl);
			goodsJoinAjax();
		}
		else if(data.result == "sendNull") {
			goodsJoinAjax();
		}
		else {
			alert(i18nconvert("payment_img_fail"));
		}
    });
}

// 상품 등록 ajax
function goodsJoinAjax() {
	var OT = [];
	var ON = [];
	var OP  = [];
	for(var i = 0; i < document.getElementsByName("OT").length; i++) {
		OT[i] = document.getElementsByName("OT")[i].value;
		ON[i] = [];
		OP[i] = [];
		for(var j = 0; j < $('.option').eq(i).find('input[name=ON]').length; j++) {
			ON[i][j] = $('.option').eq(i).find('input[name=ON]').eq(j).val();
			OP[i][j] = $('.option').eq(i).find('input[name=OP]').eq(j).val();
		}
	}
	
	$.ajax({
		type: 'POST',
		url: '/shop/goodsJoin',
		dataType: 'json',
		traditional: true,
		data: {
			GN : document.getElementsByName("GN")[0].value,
			GP: document.getElementsByName("GP")[0].value,
			GE: document.getElementsByName("GE")[0].value,
			GI: document.getElementsByName("GIurl")[0].value,
			OT: OT,
			ON: JSON.stringify(ON),
			OP: JSON.stringify(OP)
		}
	}).done(function(data) {
		if(data.result == "success") {
			$(".modal").modal("hide");
			location.reload();
		}
		else if(data.result == "exist") {
			alert(i18nconvert("payment_goods_exist"));
		}
		else {
			alert(i18nconvert("payment_goods_upload_fail"));
			location.reload();
		}
	});
}

// 선택 상품 Modal에 값 전달
function goodsModal(click, Object) {
	shopInit(Object);
	
	const GN = $(click).find(".title").text();
	const GE = $(click).find(".desc").text();
	const GP = $(click).find(".price").text();
	
	$.ajax({
		type: 'POST',
		url: '/shop/modal',
		dataType: 'json',
        data: {
        	GN: GN
        }
	}).done(function(data) {
		$("input[type=radio]").prop("checked", false);
		document.getElementsByName("count")[0].value = 1;
		$(".option-box").empty();
		
		Object.GN = data.goods.GN;
		Object.GP = data.goods.GP;
		Object.GI = data.goods.GI;
		Object.GE = data.goods.GE;
		Object.GO = data.goods.GO;
		Object.TT = data.goods.GP;
		
		$(".modal-title").html(Object.GN);
		$(".modal-desc").html(Object.GE);
		if(Object.GP == 0) {
			$(".modal-price").html(i18nconvert("payment_price_diff_option"));
		}
		else {
			$(".modal-price").html(Object.GP);
		}
		if(!Object.GI) {
			$(".pos-product-img").html("<div class='img' style='background-image: url(../assets/img/oasis_logo_shop.png)'></div>");
		}
		else {
			$(".pos-product-img").html("<div class='img' style='background-image: url("+Object.GI+")'></div>");
		}
		
    	if(data.result == 'option') {
    		$(".point-option").show();
    		for(var i = 0; i < data.optionType.length; i++) {
    			Object.OT[i] = data.optionType[i];
    			$(".option-box").append("\
					<div class='option-row'>\
						<div class='option-title'>"+data.optionType[i]+"</div>\
						<div id='option"+i+"' class='option-list'>\
						</div>\
					</div>\
				");
	    		for(var j = 0; j < data.option.length; j++) {
	    			var optionOP;
	    			if(data.option[j].OP) {
	    				optionOP = data.option[j].OP;
	    			}
	    			else {
	    				optionOP = 0;
	    			}
	    			if(data.option[j].OT == data.optionType[i]) {
	    				$("#option"+i).append("\
	    					<div class='option'>\
	    						<input type='radio' class='option-input' id='op"+i+j+"' name='op"+i+"' value='"+data.option[j].OP+"' onclick=checkOption(this,shopObject); onclick=checkOption(this,Object); data-num='"+i+"' data-name='"+data.option[j].ON+"' data-parsley-required-message='"+i18nconvert('payment_check_option')+"' required />\
	    						<label class='option-label' for='op"+i+j+"'>\
	    							<span class='option-text'>\
	    								"+data.option[j].ON+"\
	    							</span>\
	    							<span class='option-price'>\
	    								"+optionOP+"\
	    							</span>\
	    						</label>\
	    					</div>\
	    				");
	    			}
	    		}
    		}
    	}
    	else if(data.result == 'noOption') {
    		$(".point-option").hide();
    	}
    	else {
    		alert(i18nconvert('payment_shop_err'));
    	}
	});
}

// 선택 상품 Modal 닫힐 시 Object 초기화
$('#modalPosItem').on('hide.bs.modal', function() {
	shopInit(shopObject);
});

// 옵션 설정
async function checkOption(click, Object) {
	var i = $(click).data().num;
	var ON = $(click).data().name;
	if($(click).val() == 'undefined') {
		$(click).val(0);
	}
	Object.OP[i] = await $(click).val();
	Object.ON[i] = await ON;
	
	modalReload(Object);
}

// 모달 수량 설정
function modalNumCount(Object, math) {
	
	if(math == 'minus') {
		if(Object.NUM < 2) {
			Object.NUM = 1;
		}
		else {
    		Object.NUM = Object.NUM - 1;
		}
	}
	else {
		Object.NUM = Object.NUM + 1;
	}
	modalReload(Object);
}

// 장바구니 수량 설정
function cartNumCount(math, num) {
	$.ajax({
		type: 'POST',
		url: '/shop/cartNum',
		dataType: 'json',
		data: {
			MATH : math,
			GN : document.getElementsByName('GN')[num].value,
			ON : document.getElementsByName('ON')[num].value,
		}
	}).done(function(data) {
		if(result.status == 'success') {
			showCart();
		}
		else {
			alert(i18nconvert('payment_shop_err'));
		}
	});
}

// 옵션 및 수량에 따라 화면 변경
async function modalReload(Object) {
	Object.TT = Object.GP;
	var sum = 0;
	
	for(var i = 0; i < Object.OP.length; i ++) {
		sum += await parseInt(Object.OP[i]);
	}
	Object.TT = await (Object.TT + sum) * Object.NUM;
	
	$(".modal-price").html(Object.TT);
	$("input[name=count]").val(Object.NUM);
}

// 모달창 정보 쿠키에 담기
function addCart(formName,Object) {
	var formParsley = $('#'+formName).parsley();
	if(formParsley.isValid() == true) {
		$.ajax({
			type: 'POST',
			url: '/shop/addCart',
			traditional: true,
			dataType: 'json',
			data: {
				GN : Object.GN,
				GP : Object.GP,
				GI : Object.GI,
				TT : Object.TT,
				OT : Object.OT,
				ON : Object.ON,
				OP : Object.OP,
				NUM : Object.NUM,
			}
		}).done(function(data) {
			if(data.result == 'success') {
				showCart();
				$(".modal").modal("hide");
			}
			else {
				alert(i18nconvert('payment_shop_err'));
			}
		});
	}
	else {
		alert(i18nconvert("payment_check_option"));
	}
}

// 쿠키를 장바구니 목록에 표시
function showCart() {
	$.ajax({
		type: 'POST',
		url: '/shop/showCart',
		traditional: true,
		dataType: 'json',
		data: {}
	}).done(function(data) {
		$(".pos-table").empty();
		$(".total").empty();
		if(data.result == 'success') {
			for(var i = 0; i < data.cart.length; i ++) {
				var cartON = [];
				if(data.cart[i].ON) {
					if(typeof(data.cart[i].ON) == 'string') {
						cartON = "- "+data.cart[i].OT+" : "+data.cart[i].ON+"<br><small class='ml-2'> (+ "+data.cart[i].OP+")</small>";
					}
					else {
						for(var j = 0; j < data.cart[i].ON.length; j++) {
							cartON[j] = "- "+data.cart[i].OT[j]+" : "+data.cart[i].ON[j]+"<br><small class='ml-2'> (+ "+data.cart[i].OP[j]+")</small><br>";
						}
						cartON = cartON.toString().replace(/,/g, "");
					}
				}
				else {
					cartON = "";
				}
				var cartImg = "";
				if(!data.cart[i].GI) {
					cartImg = "<div class='img' style='background-image: url(../assets/img/oasis_logo_shop.png)'></div>"
				}
				else {
					cartImg = "<div class='img' style='background-image: url("+data.cart[i].GI+")'></div>"
				}
		    	$(".pos-table").append("\
			    	<div class='row pos-table-row'>\
						<div class='col-9'>\
							<div class='pos-product-thumb'>\
								"+cartImg+"\
								<div class='info'>\
										<input type='hidden' id='index' name='index' value='"+i+"' />\
									<div class='title'>"+data.cart[i].GN+"</div>\
										<input type='hidden' id='GN' name='GN' value='"+data.cart[i].GN+"' />\
									<div class='single-price'>"+data.cart[i].GP+"</div>\
										<input type='hidden' id='GP' name='GP' value='"+data.cart[i].GP+"' />\
									<div class='desc'>"+cartON+"</div>\
										<input type='hidden' id='OT' name='OT' value='"+data.cart[i].OT+"' />\
										<input type='hidden' id='ON' name='ON' value='"+data.cart[i].ON+"' />\
										<input type='hidden' id='OP' name='OP' value='"+data.cart[i].OP+"' />\
									<div class='input-group qty'>\
										<div class='input-group-append'>\
											<button class='btn btn-default list-count-btn' onclick=cartNumCount('minus','"+i+"');><i class='fa fa-minus'></i></button>\
										</div>\
										<input type='text' class='form-control' name='list-count' value='"+data.cart[i].NUM+"' />\
										<div class='input-group-prepend'>\
											<button class='btn btn-default list-count-btn' onclick=cartNumCount('plus','"+i+"');><i class='fa fa-plus'></i></button>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
						<div class='col-3 d-flex flex-column justify-content-between align-items-end'>\
							<div class='align-middle text-gray list-remove-btn' onclick=cartDelete(this,'one'); data-num='"+i+"' style='cursor: pointer'>\
			    				<i class='fas fa-lg fa-times m-2 p-2'></i>\
			    			</div>\
			    			<div class='total-price mb-1'>Price : <b>"+data.cart[i].TT+"</b></div>\
						</div>\
					</div>\
		    	");
			}
			var totalSum = 0;
			for(var i = 0; i < data.cart.length; i++) {
				totalSum += parseInt(data.cart[i].TT);
			}
			$(".total").append("\
				<div class='text'>Total</div>\
				<div class='price'>"+totalSum+"</div>\
					<input type='hidden' id='TS' name='TS' value='"+totalSum+"' />\
			");
			
			// 반응형 - 장바구니에 담긴 상품 개수 표시
			if(data.cart.length != 0) {
				$('.cart-goods-num').removeClass('d-none');
				$('.cart-goods-num').html(data.cart.length);
			}
			else {
				$('.cart-goods-num').addClass('d-none');
				$('.cart-goods-num').empty();
			}
		}
		else {
			alert(i18nconvert('payment_shop_err'));
		}
	});
}

// 장바구니 삭제 기능
function cartDelete(click, amount) {
	if(amount == 'one') {
		var clickNum = $(click).data().num;
		$.ajax({
			type: 'POST',
			url: '/shop/cartRemove',
			dataType: 'json',
			data: {
				GN : document.getElementsByName('GN')[clickNum].value,
				ON : document.getElementsByName('ON')[clickNum].value,
				amount : amount,
			}
		}).done(function(data) {
			if(data.result == 'delete') {
				showCart();
			}
			else {
				alert(i18nconvert('payment_shop_err'));
			}
		});
	}
	else {
		$.ajax({
			type: 'POST',
			url: '/shop/cartRemove',
			dataType: 'json',
			data: {
				amount : amount,
			}
		}).done(function(data) {
			if(data.result == 'delete') {
				showCart();
			}
			else {
				alert(i18nconvert('payment_shop_err'));
			}
		});
	}
}