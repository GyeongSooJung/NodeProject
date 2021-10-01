window.onload = () => {
    var lang = new URL(location.href).searchParams.get('lang');
    // inflow(qr코드)
    if (new URL(location.href).searchParams.get('nodata')) {
        if(lang == 'en') {
            alert('This car has no disinfection history.');
        }
        else {
            alert('소독이력이 없는 차량입니다.');
        }
    }
};