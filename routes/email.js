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
      user: "",
      pass: ""
  },
  tls: {
      rejectUnauthorized: false
  }
});



router.get('/',(req,res,next)=>{
    res.render('email');
});

router.post('/email_send', async (req, res, next) => {
    const reademailaddress = req.body.EA;
    
    const exEA = await Company.findOne({"EA" : reademailaddress});
    // 이메일이 중복됐을 때
        if(exEA) {
            return  res.render('email',{ErrMsg : "가입된 이메일입니다."});
        }
        else{
              try {
                  let authNum = Math.random().toString().substr(2,6);
                  console.log("authNum: " + authNum);
                  const mailOptions = {
                    from: "?????@gmail.com",
                    to: reademailaddress,
                        subject: "MK 인증번호 관련 메일 입니다.",
                        text: "인증번호는 " + authNum + " 입니다."
                  };
                  
                   await smtpTransport.sendMail(mailOptions, (error, responses) =>{
                  if(error){
                      res.json({msg:'err'});
                  }else{
                      res.json({msg:'sucess'});
                  }
                  smtpTransport.close();
                  });
                  
                  const etoken = jwt.sign({ EA : reademailaddress },// 토큰의 내용(payload)
                      secretObj2.secret ,   // 비밀 키
                      {expiresIn: '1m'});
                      // 유효 시간은 1분 설정
                      
                      
                      res.cookie("etoken", etoken); // 쿠키에 etoken 등록  
                     console.log("etoken : " + etoken);
                      
                  console.log(authNum);
                  console.log(reademailaddress);
                      
                  res.render('email', {authNum, reademailaddress});
                  
                  
              } catch (err) {
                console.error(err);
                next(err);
              }
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