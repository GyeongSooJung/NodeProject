const express = require('express');
//schema
const Company = require('../schemas/company');
//Router or MiddleWare
const router = express.Router();
const {emailcontrol} = require('./middleware');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretObj2 = require("../config/jwt");



const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "사용 할 이메일 주소",
      pass: "보낼 비밀번호"
  },
  tls: {
      rejectUnauthorized: false
  }
});




router.post('/pwfind', async (req, res, next) => {
    const {EA, CNU} = req.body
    try{
        const exCNU = await Company.findOne({CNU});
        const exEA = await Company.findOne({EA});
        
        if(exCNU){
            res.render('pwfind.html',{errmsg : "등록되지 않은 사업자 번호입니다."});
        }
        else if(exEA){
            res.render('pwfind.html',{errmsg : "등록되지 않은 E-mail 입니다."});
        }
        //인증번호 생성
        let authNum = Math.random().toString().substr(2,6);
        console.log("authNum: " + authNum);
        //메일 Sending을 위한 Msg
        const mailOptions = {
            from: "gsjung006@gmail.com",
            to: EA,
            subject: "MK 인증번호 관련 메일 입니다.",
            text: "인증번호는 " + authNum + " 입니다."
      };
      // Mail Sending
       await smtpTransport.sendMail(mailOptions, (error, responses) =>{
      if(error){
          res.json({msg:'err'});
      }else{
          res.json({msg:'sucess'});
      }
      smtpTransport.close();
      });
      
      res.render('pwfind', {authNum, CNU, EA});
}catch(err){
console.error(err);
}


                  
});

router.post('/email_cert', async (req, res, next) => {
  try {
      
      const Enum = req.body.Enum;
      const authNum = req.body.authNum;
      const EA = req.body.reademailaddress;
      
      console.log(Enum);
      console.log(authNum);
      
      if(Enum === authNum) {
          
          const etoken = jwt.sign({ authNum2 : authNum, EA2 : EA },// 토큰의 내용(payload)
          secretObj2.secret ,   // 비밀 키
          {expiresIn: '1m'});
          // 유효 시간은 1분 설정
          
          console.log(etoken);
          res.cookie("etoken", etoken); // 쿠키에 etoken 등록  
          return res.redirect('/email?success2=true');
      }
      else {
           return res.redirect('/email?false=true');
      }
      
      
      
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;