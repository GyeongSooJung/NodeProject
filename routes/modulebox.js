// pagination
exports.pagination = async(page, totalNum) => {
    let currentPage = page ? parseInt(page) : 0; // 현재 페이지(page가 없을 경우 page = 0)
    
    const postNum = 10; // 한 페이지에 들어갈 포스트 수
    const pageNum = 5; // 한번에 표시할 페이지 수
    
    const totalPage = Math.ceil(totalNum/postNum); // 전체 페이지 수(올림처리)
    
    if (currentPage > totalPage-1) { // next 버튼 : 현재 페이지가 전체 페이지 수보다 높을 경우 전체 페이지와 같게끔 처리
        currentPage = totalPage-1;
        page = totalPage-1;
    }
    else if(currentPage < 0) { // pre 버튼 : 현재 페이지가 0보다 작을 경우 0으로 처리
        currentPage = 0;
        page = 0;
    }
    
    let skipPost = page*postNum; // 데이터 조회 시 건너뛸 포스트 수 설정
        if(skipPost < 0) { // skip에는 음수가 포함되면 안됨. 페이지 파라미터가 0으로 받기 때문에 -1이 되는 경우가 발생. 이 때 에러를 방지하기 위해 0으로 반환
            skipPost = 0;
        }
    
    const startPage = Math.floor(((currentPage) / pageNum)) * pageNum; // 시작 페이지(ex. 1~5라면 1)
    let endPage = startPage + pageNum; // 끝 페이지(ex. 1~5라면 5)
    
    if (endPage > totalPage) { // 끝 페이지가 총 페이지 수보다 많다면 같게끔 처리
        endPage = totalPage;
    }
    
    return { currentPage, postNum, pageNum, totalPage, skipPost, startPage, endPage };
}

//TimeSet

// exports.timeset = async(CA,moment) => {
    
//     const CAtime = Date.UTC();
    
//     if ( (moment('CA').format('DD')) == moment().format('DD') )
//     {
//       CAtime = moment('CA').format('HH:mm');
//     }
//     else {
//       CAtime = moment('CA').format('YYYY-MM-DD');
//     }
    
//     return {CAtime};
// }