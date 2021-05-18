const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const xml2js = require('xml2js') // xml 파싱 모듈
//const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const Company = require('../schemas/company');
const axios = require('axios');
const request = require('request');

router.post('/register', async (req, res, next) => {
  const { CNU, CNA, CK, addr1, addr2, PN, NA, MN, PW, EA, CEA } = req.body;
  const ADR = addr1+addr2;
  const hashAuth = req.cookies.hashAuth;
  
  try {
    const companyEA = await Company.findOne({ "EA" : EA });
    const companyCNU = await Company.findOne({ "CNU" : CNU });
    
    if(!companyEA && !companyCNU) {
      if(bcrypt.compareSync(CEA, hashAuth)) {
        const hashPW = await bcrypt.hash(PW, 12);
          await Company.create({
            CNU,
            CNA,
            CK,
            ADR,
            PN,
            NA,
            MN,
            PW : hashPW,
            EA
          });
          return res.redirect('/');
      }
      else {
        return res.redirect('/register?diffCEA=true');
      }
    }
    else if(companyEA) {
      return res.redirect('/register?existEA=true');
    }
    else if(companyCNU) {
      return res.redirect('/register?existCNU=true');
    }
    else {
      return res.redirect('/register?fail=true');
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
});


router.post('/checkCNU', async (req, res, next) => {
  const CNU = req.body.CNU;
  const CNU_CK = await postCRN(CNU);
  
  // Company Number check
  async function postCRN(crn){
    const postUrl = "https://teht.hometax.go.kr/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId=";
    const xmlRaw = "<map id=\"ATTABZAA001R08\"><pubcUserNo/><mobYn>N</mobYn><inqrTrgtClCd>1</inqrTrgtClCd><txprDscmNo>{CRN}</txprDscmNo><dongCode>15</dongCode><psbSearch>Y</psbSearch><map id=\"userReqInfoVO\"/></map>";
      try{
          const result  = await axios.post(postUrl,xmlRaw.replace(/\{CRN\}/, crn),
            { headers: { 'Content-Type': 'text/xml' } });
          let CRNumber = await getCRNresultFromXml(result.data);
          console.log(CRNumber);
          
          if (CRNumber ==='부가가치세 일반과세자 입니다.') {
            CRNumber = true;
          } else {
            CRNumber = false;
          }
          
          return res.send({ CRNumber: CRNumber });
          
      } catch(err){
        console.error(err);
      }
          
  }
  
  function getCRNresultFromXml(dataString) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(dataString, // API 응답의 'data' 에 지정된 xml 값 추출, 파싱
          (err, res) => {
            if (err) reject(err);
            else resolve(res.map.trtCntn[0]); // trtCntn 이라는 TAG 의 값을 get
          });
    });
  }
});

router.post('/infoCNU', async (req, res, next) => {
  const CNU = req.body.CNU;
  
  try {
      const searchname= ['상호', '사업장소재지(도로명)', '대표 전화번호', '대표자명'];
      // 통신판매번호
      // 신고현황
      // 상호
      // 대표자명
      // 판매방식
      // 전자우편(E-mail)
      // 사업장소재지
      // 사업장소재지(도로명)
      // 인터넷도메인
      // 통신판매업 신고기관명
      // 사업자등록번호
      // 법인여부
      // 대표 전화번호
      // 취급품목
      // 신고일자
      console.log("길이파악"+searchname.length);
      
      var bizUrl =  'https://www.ftc.go.kr/bizCommPop.do?wrkr_no='+CNU;
      
      await request(bizUrl, function(error, response, body) {
        if (error) throw error;
          var searchResult = [];
          
          for (var i = 0; i < searchname.length; i ++){
            var start = body.indexOf(searchname[i]+'</th>');
            var end = body.indexOf('</td>',start+1);
            
            var searchText = "";
            for ( var j = start; j < end; j ++) {
              searchText += body[j];
            }
            
            var searchText2 = "";
            var start2 = searchText.indexOf('>',20);
            for ( var h = start2; h < searchText.length-1; h ++) {
              searchText2 += searchText[h+1];
            }
            
            searchText2 = searchText2.trim().replace(/-/g, "");
            // console.log("써테텍"+searchText2);
            
            searchResult[i] = searchText2;
            console.log(searchText2);
          }
          console.log("써치"+searchResult);
          
          return res.send({ searchResult: searchResult });
      });
  } catch(err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;