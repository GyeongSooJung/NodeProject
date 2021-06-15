function _excelDown(fileName, sheetName, Object, thlist, tdkeylist){
    	
    	const excelarray = Object.array;
    	var thlist = thlist;
    	var tdkeylist = tdkeylist;
    	
    	
			var html = ''; html += '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
			html += ' <head>';
			html += ' <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
			html += ' <xml>';
			html += ' <x:ExcelWorkbook>';
			html += ' <x:ExcelWorksheets>';
			html += ' <x:ExcelWorksheet>';
			html += ' <x:Name>' + sheetName + '</x:Name>';
			html += ' <x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions>';
			html += ' </x:ExcelWorksheet>';
			html += ' </x:ExcelWorksheets>';
			html += ' </x:ExcelWorkbook>';
			html += ' </xml>';
			html += ' </head>';
			html += ' <body>';
			// ----------------- 시트 내용 부분 -----------------
			
    			html += "<table >";
    			html +=		"	<thead>";
    			html +=		"		<tr>";
    			for ( var i = 0; i < thlist.length; i ++) {
    			    html += "<th>";
        			html += thlist[i];
        			html += "</th>";
    			}
    			
    			html += "</tr>";
    			html +=		"	</thead>";
    			html +=		"	<tbody>";
    			
    			console.log(Object.array[0][tdkeylist[0]])
    			
    			for (var i = 0; i < Object.array.length; i ++) {
    				html +=		"		<tr>";
    				for(var j = 0; j < tdkeylist.length; j ++) {
    				html +=		"		<td>";
    				if(tdkeylist[j] == "CA")
    				{
    					html +=	moment(Object.array[i][tdkeylist[j]]).format('YYYY-MM-DD');
    				}
    				else 
    				{
    					html +=	Object.array[i][tdkeylist[j]];
    				}
    				html +=		"		</td>"   ;
    				}
    				html +=		"		</tr>";
    			}
    			html +=		"	</tbody>";
    			html +=		"</table>";
// 			}
			
			//시트 내용 부분 -----------------
			html += ' </body>'; html += '</html>';
			// 데이터 타입
			var data_type = 'data:application/vnd.ms-excel';
			var ua = window.navigator.userAgent; var blob = new Blob([html], {type: "application/csv;charset=utf-8;"});
			
			if ((ua.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) && window.navigator.msSaveBlob)
			{ // ie이고 msSaveBlob 기능을 지원하는 경우
				navigator.msSaveBlob(blob, fileName);
			}
			else { // ie가 아닌 경우 (바로 다운이 되지 않기 때문에 클릭 버튼을 만들어 클릭을 임의로 수행하도록 처리)
				var anchor = window.document.createElement('a');
				anchor.href = window.URL.createObjectURL(blob);
				anchor.download = fileName; document.body.appendChild(anchor); anchor.click();
				// 클릭(다운) 후 요소 제거
				document.body.removeChild(anchor);
			}
		}
		
function exceldownload(Object)
{ // 대상 테이블을 가져옴
    var table = document.getElementById("data-table-combine");
    if(table){ // CASE 대상 테이블이 존재하는 경우
    
    
        
        var thlist = []; // th 들어갈 배열
        var tdkeylist = []; // tr을 추출하기위해 배열의 식별 값을 가져옴
        
        for(var i = 0; i < $('#memDiv1 th').length; i ++) {
            if($('#memDiv1 th').eq(i).text() != "") {
                thlist.push($('#memDiv1 th').eq(i).text())
                tdkeylist.push($('#memDiv1 th').eq(i).attr('name'))
            }
        }
        
        // 엑셀다운 (엑셀파일명, 시트명, 내부데이터HTML)
        _excelDown("oasis_excel.xls", "Sheet", Object, thlist, tdkeylist)
    }
    
}