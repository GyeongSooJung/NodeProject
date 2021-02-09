			
			
			$(document).ready(function() {
				// 검색기능
				
		            $("#keyword").keyup(function() {
		                var k = $(this).val();
		                $("#data-table-combine > tbody > tr").hide();
		                var temp = $("#data-table-combine > tbody > tr > td:contains('" + k + "')");
		
		                $(temp).parent().show();
		            })
		            
		            $("#CopyBTN").click(function() {
		                var aux = document.createElement("input");
		                copyText = document.getElementById("data-table-combine");
		                
		                aux.setAttribute("value", copyText);
		                
		                document.body.appendChild(aux);
		                
		                aux.select();
		                
		                document.execCommand("copy");
		                
		                document.body.removeChild(aux);
		                
		                alert("복사가 완료되었습니다.");
		            })
		            
		            $(".cloneBTN").on("click", function() {
                        $(".listBody tbody").append($(".listTemplate tr").clone(true));
                    });
		            
		        })