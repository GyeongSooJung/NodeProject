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
const cookieParser = require("cookie-parser");

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "mk.manager2020@gmail.com",
      pass: "showmethemoney"
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
                    from: "mk.manager2020@gmail.com",
                    to: reademailaddress,
                    subject: "OASIS 인증번호 관련 메일 입니다.",
                    text: "인증번호는 " + authNum + " 입니다.",
                    html: "<div style='font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #348fe2; margin: 100px auto; padding: 30px 0; box-sizing: border-box;'>"+
                          "  <h1 style='margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;'>"+
                          "		<span style='font-size: 15px; margin: 0 0 10px 3px;'>MK_</span><br />"+
                          "		<span style='color: #348fe2;'>임시 비밀번호</span> 안내입니다."+
                          "	</h1>"+
                          "	<p style='font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;'>"+
                          "		안녕하세요.<br />"+
                          "		요청하신 임시 비밀번호가 생성되었습니다.<br />"+
                          "		감사합니다."+
                          "	</p>"+
                          
                          "	<p style='font-size: 16px; margin: 40px 5px 20px; line-height: 28px;'>"+
                          "		임시 비밀번호: <br />"+
                          "		<span style='font-size: 24px;'>"+authNum+"</span>"+
                          "	</p>"+
                          "	<div style='border-top: 1px solid #DDD; padding: 5px;'>"+
                          "	</div>"+
                          "</div>",
                  };
                  
                   await smtpTransport.sendMail(mailOptions, (err, res) =>{
                  if(err){
                      console.log(err)
                  }else{
                      console.log('success')
                  }
                  smtpTransport.close();
                  });
                  
                      
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
          res.cookie("email", EA,{
            maxAge: 180000
          });
          res.cookie('authNum',authNum,{
            maxAge: 180000
          });
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