// MAC주소 콜론 기능
function setComma(str){
	if((Number(str.length) % 3) ==2) {
		if(Number(str.length) == 17) {
			return str;
		}
		return str+":";
	}
	return str;
}