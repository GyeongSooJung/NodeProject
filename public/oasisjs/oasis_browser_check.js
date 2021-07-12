$(document).ready(function() {
    var browser = window.navigator.userAgent.toLowerCase();
    if(browser.indexOf('chrome') > -1) {
        
    }
    else {
      $('body').append("\
        <div style='position: fixed; bottom: 15px; left: 15px; width: 500px; height: 350px;\
          border-radius: 10px; z-index: 9999; background-color: #2f3337; color: white;'\
          class='d-flex justify-content-center align-items-center'>\
          <div>\
            <i class='fab fa-6x fa-chrome mb-3'></i>\
            <h3>브라우저 알림</h3>\
            <h6 style='line-height: 1.5;'>현재 브라우저는 원활한 작동이 안이루어질 수도 있습니다.<br>\
            <span class='text-primary'>크롬</span> 혹은 <span class='text-primary'>마이크로소프트 엣지</span>를 이용해주세요.</h6>\
            <h6 style='line-height: 1.5;'>The current browser may not work smoothly.<br>\
            Please use <span class='text-primary'>Chrome</span> or <span class='text-primary'>Microsoft Edge</span> browser to access.</h6>\
          </div>\
        </div>\
      ")
    }
});