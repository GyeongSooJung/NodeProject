const express = require('express');
//schema
const Company = require('../schemas/company');
//Router or MiddleWare
const router = express.Router();
//const {isLoggedIn,TurnBackErr} = require('./middleware');
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




router.post('/sendmail', async (req, res, next) => {
    const {EA, CNU} = req.body
    try{
        const exCNU = await Company.findOne({CNU});
        const exEA = await Company.where({"CNU" : CNU}).findOne({EA});
        if(!exCNU){
            return    res.render('find',{errmsg : "등록되지 않은 사업자 번호입니다."});
        }
        else if(!exEA){
            return    res.render('find',{errmsg : "등록되지 않은 E-mail 입니다."});
        }
        //인증번호 생성
        let authNum = Math.random().toString().substr(2,6);
        console.log("authNum: " + authNum);
        //메일 Sending을 위한 Msg
        const mailOptions = {
            from: "mk.manager2020@gmail.com",
            to: EA,
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
                  "		아래 <b style='color: #348fe2;'>'생성 확인'</b> 버튼을 클릭한 뒤, 인증해주세요.<br />"+
                  "		감사합니다."+
                  "	</p>"+
                  
                  "	<p style='font-size: 16px; margin: 40px 5px 20px; line-height: 28px;'>"+
                  "		임시 비밀번호: <br />"+
                  "		<span style='font-size: 24px;'>"+authNum+"</span>"+
                  "	</p>"+
                  "	<a style='color: #FFF; text-decoration: none; text-align: center;' href='#' target='_blank'><p style='display: inline-block; width: 210px; height: 45px; margin: 30px 5px 40px; background: #348fe2; line-height: 45px; vertical-align: middle; font-size: 16px;'>생성 확인</p></a>"+
                  
                  "	<div style='border-top: 1px solid #DDD; padding: 5px;'>"+
                  "	</div>"+
                  "</div>",
                  };
      // Mail Sending
       await smtpTransport.sendMail(mailOptions, (err, res) =>{
      if(err){
          console.log(err);
      }else{
        console.log('success')
      }
      smtpTransport.close();
      });
      
    return res.render('find', {authNum, CNU, EA});
    }catch(err){
    console.error(err);
    }
    });






router.post('/email_cert' ,async (req, res, next) => {
  try {
      
      const Enum = req.body.Enum;
      const authNum = req.body.authNum;
      const CNU = req.body.CNU
      const EA = req.body.EA
      
      console.log(Enum);
      console.log(authNum);

      if(Enum === authNum) {
          res.cookie("email", EA,{
            maxAge: 180000
          });
          res.cookie('authNum',authNum,{
            maxAge: 180000
          });
          return res.render('find',{CNU , Change : true, })
      }
      else {
           return res.redirect('/find?false=true');
      }
      
      
      
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.post('/change',async function(req,res){
    const {PW1,PW2,CNU} = req.body;
    
    if(PW1 ==! PW2){
        return res.render('find?pwe=true',{CNU,Change : true, }) 
    }
    else{
    try{
    const hash = await bcrypt.hash(PW1, 12);
    await console.log(CNU);
    await Company.update({CNU},{PW : hash, UA : Date.now()});
    return res.redirect('/login?pwc=true')
        
    }catch(err){
        console.error(err);
    }
    }   
        
    })
module.exports = router;