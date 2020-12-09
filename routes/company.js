const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
//const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const Company = require('../schemas/company');


router.post('/register', async (req, res, next) => {
  //req. Body for Insert Data.
  const {NA, CNU, CNA, PN, MN, PW, PW2} = req.body;
  console.log(req.body);
  try {
    const exCNU = await Company.findOne({"CNU" : parseInt(CNU)});
    //const exPN = await Company.findOne({"PN" : parseInt(PN)});
    //const exMN = await Company.findOne({"MN" : parseInt(MN)});
    if (exCNU) {
     return  res.render('register',{NA,CNA,PN,MN, CNU ,ErrMsg : "가입된 아이디입니다."});
    }
    if (PW.length <8){
      return res.render('register',{NA,CNU,CNA,PN,MN,message : "8자리 이상 입력하세요."});
      //return res.redirect( '/register?pwlength=e');
    }
      if(PW ===! PW2 ){
      return res.render('register',{NA,CNU,CNA,PN,MN,message : "비밀번호가 다릅니다."});
    }

    //중복값 생성시 에러 반환
    //암호화 부분
    const hash = await bcrypt.hash(PW, 12);

    await Company.create({NA, CNU, CNA, PN, MN,
    PW : hash
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});





module.exports = router;
