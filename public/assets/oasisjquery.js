
		        function Timefunction(time) {
		        	var cca = Date.UTC();
		        	if ( (moment(time).format('DD')) == moment().format('DD') )
		        	{
		               var cca = moment(time).format('HH:mm');
		        	}
		        	else {
		        		var cca = moment(time).format('YYYY-MM-DD');
		        	}
													document.write(cca);
		        };