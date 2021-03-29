const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const xml2js = require('xml2js') // xml 파싱 모듈
//const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const Company = require('../schemas/company');
const axios = require('axios');
const {emailcontrol} = require('./middleware');
var moment = require('moment');



//Register for Client
router.post('/register',emailcontrol,async (req, res, next) => {
  const Ctime = req.body.Ctime;
  console.log("현재 시간은? " +Ctime);
  //req. Body for Insert Data.
  const {NA, CNU, CNA, PN, MN, PW, PW2, CK, EA} = req.body;
  console.log("주소상세"+req.body.addrDtail);
  const ADR = req.body.roadAddrPart1+req.body.roadAddrPart2+req.body.addrDetail;
  res.cookie('ADR',null);
  //email
  var EC = false;
  console.log(CNU);
  console.log("EA :"+EA);
  console.log("EC :"+EC);
  console.log("addr = "+req.body.addrDetail);
  
  //이메일이 존재하면 EC를 true로 변경
  if(EA) {EC = true;}
  
  console.log("EC :"+EC);

  if(!EC) {
      return res.render('register',{NA,CNU,CNA,PN,MN,ADR,CK,EAMsg : "메일 인증을 받으세요"});
  }
    const CNU_CK  = await postCRN(CNU);
  if(CNU_CK == false){
    return  res.render('register',{NA,CNA,PN,MN, CNU,ADR,CK ,ErrMsg : "잘못된 사업자 등록번호 입니다!"});
  } 
  else{
    try {
      const exPN = await Company.findOne({"PN" : PN});
      if(exPN) {
        return  res.render('register',{NA,CNA,PN,MN, CNU,ADR,CK ,PNMsg : "가입된 전화번호입니다."});
      }
      
      
      const exCNU = await Company.findOne({"CNU" : parseInt(CNU)});
      console.log(exCNU);
      if (exCNU) {
       return  res.render('register',{NA,CNA,PN,MN, CNU,ADR,CK ,ErrMsg : "가입된 사업자입니다."});
      }
        if(PW ===! PW2 ){
        return res.render('register',{NA,CNU,CNA,PN,MN,ADR,CK,message : "비밀번호가 다릅니다."});
      }
  
      //중복값 생성시 에러 반환
      //암호화 부분
      const hash = await bcrypt.hash(PW, 12);
  
      await Company.create({NA, CNU, CNA, PN, MN, EA,ADR,CK,
      PW : hash
      });
      res.cookie('email',null);
      res.cookie('authNum',null);
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
});



// Company Number check


async function postCRN(crn){
  const postUrl = "https://teht.hometax.go.kr/wqAction.do?actionId=ATTABZAA001R08&screenId=UTEABAAA13&popupYn=false&realScreenId=";
  const xmlRaw = "<map id=\"ATTABZAA001R08\"><pubcUserNo/><mobYn>N</mobYn><inqrTrgtClCd>1</inqrTrgtClCd><txprDscmNo>{CRN}</txprDscmNo><dongCode>15</dongCode><psbSearch>Y</psbSearch><map id=\"userReqInfoVO\"/></map>";
    try{
        const result  = await axios.post(postUrl,xmlRaw.replace(/\{CRN\}/, crn),
        { headers: { 'Content-Type': 'text/xml' } });
       let CRNumber = await getCRNresultFromXml(result.data);
       console.log(CRNumber);
       if(CRNumber ==='부가가치세 일반과세자 입니다.'){
         CRNumber = true;
         
       }else{
         CRNumber = false;
       }
        console.log(CRNumber);
        return(CRNumber);
    }catch(err){
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







module.exports = router;
