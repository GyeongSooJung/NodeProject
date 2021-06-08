window.onload = () => {
    // inflow(qr코드)
    if (new URL(location.href).searchParams.get('nodata')) {
        alert('소독이력이 없는 차량입니다.');
    }
};