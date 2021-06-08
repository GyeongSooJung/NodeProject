//이미지(png)로 다운로드
function downIMG(ext, div){
    if(ext == 'jpg') {
        html2canvas($("#"+div)[0], {scrollY: -window.scrollY}).then(function(canvas){
            var myImage = canvas.toDataURL();
            downloadURI(myImage, "OASIS_QR_{{company.CNA}}.jpg");
        });
    }
    else if(ext == 'png') {
        html2canvas($("#"+div)[0], {scrollY: -window.scrollY}).then(function(canvas){
            var myImage = canvas.toDataURL();
            downloadURI(myImage, "OASIS_QR_{{company.CNA}}.png");
        });
    }
    else if(ext == 'pdf') {
        html2canvas($("#"+div)[0]).then(function(canvas){
            var doc = new jsPDF('p', 'mm', 'a4'); //jspdf객체 생성
            var myImage = canvas.toDataURL('image/png'); //캔버스를 이미지로 변환
            // doc.addImage(myImage, 'PNG', 0, 0); //이미지를 기반으로 pdf생성
            // doc.save('OASIS_QR_{{company.CNA}}.pdf');
            
            var imgWidth = 210;
            var pageHeight = 295;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;
            var position = 30;
            doc.addImage(myImage, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= 0) { position = heightLeft - imgHeight; doc.addPage();
            doc.addImage(myImage, 'PNG', 0, position, imgWidth, imgHeight); heightLeft -= pageHeight; }
            doc.save('OASIS_QR_{{company.CNA}}.pdf');
        });
    }
}

function downloadURI(uri, name){
    var link = document.createElement("a")
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
}