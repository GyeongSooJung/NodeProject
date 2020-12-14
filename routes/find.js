const express = require('express');
//schema
const Company = require('../schemas/company');
//Router or MiddleWare
const router = express.Router();
const {isLoggedIn,TurnBackErr} = require('./middleware');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretObj2 = require("../config/jwt");



router.get('/',isLoggedIn,(req,res,next)=>{
    res.render('find');
});



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




router.post('/sendmail', async (req, res, next) => {
    const {EA, CNU} = req.body
    try{
        const exCNU = await Company.findOne({CNU});
        const exEA = await Company.findOne({EA});
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
            from: "",
            to: EA,
            subject: "MK 인증번호 관련 메일 입니다.",
            text: "인증번호는 " + authNum + " 입니다."
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

      if(Enum === authNum) {
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
    return res.redirect('/find?pwc=true')
        
    }catch(err){
        console.error(err);
    }
    }   
        
    })
module.exports = router;