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
      pass: process.env.gmail
  },
  tls: {
      rejectUnauthorized: false
  }
});

// 사업자 번호 검증
router.post('/checkCNU', async(req, res, next) => {
    const CNU = req.body.CNU;
    
    try {
        const exCNU = await Company.findOne({ "CNU" : CNU });
        const exEmail = exCNU.EA;
        console.log("이엑스이메일"+exEmail);
        
        function maskingName(email) {
            var maskingEmail = "";
            var idx = email.indexOf('@');
            var email1 = email.substring(0, idx);
            var email2 = email.substring(idx+1);
            // console.log("이메일1"+email1);
            // console.log("이메일2"+email2);
            
            var mask1 = email1.replace(/(?<=.{2})./gi, "*");
            var mask2 = email2.replace(/(?<=.{2})./gi, "*");
            // console.log("마스킹1"+mask1);
            // console.log("마스킹2"+mask2);
            
            maskingEmail = mask1+"@"+mask2;
            
            return maskingEmail;
        }
        
        const mask = maskingName(exEmail);

        if(!exCNU) {
            return res.send({ status: 'fail' });
        }
        else {
            return res.send({ status: 'success', mask: mask });
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 이메일 전송
router.post('/send', async(req, res, next) => {
    const { EA, CNU } = req.body;
    var cookie = res.cookie();
  console.log(cookie);
    
    try {
        const exEA = await Company.where({ "CNU" : CNU }).findOne({ "EA" : EA });
        
        if(!exEA) {
            return res.send({ status: 'wrong' });
        }
        else {
            let authNum = Math.random().toString().substr(2,6);
            const hashAuth = await bcrypt.hash(authNum, 12);
            console.log('어쓰넘'+authNum);
            res.cookie('hashAuth', hashAuth,{
                maxAge: 300000
            });
            const mailOptions = {
                from: "mk.manager2020@gmail.com",
                to: EA,
                subject: "OASIS 인증번호 관련 메일 입니다.",
                text: "인증번호는 " + authNum + " 입니다.",
                html: "<div style='font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #348fe2; margin: 100px auto; padding: 30px 0; box-sizing: border-box;'>"+
                      "  <h1 style='margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;'>"+
                      "		<span style='font-size: 15px; margin: 0 0 10px 3px;'>MK_</span><br />"+
                      "		<span style='color: #348fe2;'>인증번호</span> 안내입니다."+
                      "	</h1>"+
                      "	<p style='font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;'>"+
                      "		안녕하세요.<br />"+
                      "		요청하신 인증번호가 생성되었습니다.<br />"+
                      "		감사합니다."+
                      "	</p>"+
                      
                      "	<p style='font-size: 16px; margin: 40px 5px 20px; line-height: 28px;'>"+
                      "		인증번호: <br />"+
                      "		<span style='font-size: 24px;'>"+authNum+"</span>"+
                      "	</p>"+
                      "	<div style='border-top: 1px solid #DDD; padding: 5px;'>"+
                      "	</div>"+
                      "</div>",
            };
            
            await smtpTransport.sendMail(mailOptions, (err, res) => {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('success');
                }
                smtpTransport.close();
            });
            return res.send({ status: 'send' });
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 이메일 인증번호 검사 및 임시 비밀번호 생성
router.post('/cert', async (req, res, next) => {
    const CEA = req.body.CEA;
    const hashAuth = req.cookies.hashAuth;
    
    try {
        if(bcrypt.compareSync(CEA, hashAuth)) {
            return res.send({ status: 'success' });
        }
        else {
            return res.send({ status: 'fail' });
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/findPW', async(req, res, next) => {
    const { CNU, EA } = req.body;

    try {
        function createCode(arr, length) {
            var randomStr = "";
            
            for (var i = 0; i < length; i++) {
                randomStr += arr[Math.floor(Math.random()*arr.length)];
            }
            
            return randomStr;
        }
        
        var arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var randomPW = createCode(arr, 12);
        console.log("임시비번"+randomPW);
        const mailOptions = {
            from: "mk.manager2020@gmail.com",
            to: EA,
            subject: "OASIS 임시 비밀번호 관련 메일 입니다.",
            text: "임시 비밀번호는 " + randomPW + " 입니다.",
            html: "<div style='font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #348fe2; margin: 100px auto; padding: 30px 0; box-sizing: border-box;'>"+
                  "  <h1 style='margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;'>"+
                  "		<span style='font-size: 15px; margin: 0 0 10px 3px;'>MK_</span><br />"+
                  "		<span style='color: #348fe2;'>임시 비밀번호</span> 안내입니다."+
                  "	</h1>"+
                  "	<p style='font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;'>"+
                  "		안녕하세요.<br />"+
                  "		요청하신 임시 비밀번호가 생성되었습니다.<br />"+
                  "     비밀번호는 보안을 위해 추후 재설정해주시길 바랍니다.<br />"+
                  "		감사합니다."+
                  "	</p>"+
                  
                  "	<p style='font-size: 16px; margin: 40px 5px 20px; line-height: 28px;'>"+
                  "		임시 비밀번호: <br />"+
                  "		<span style='font-size: 24px;'>"+randomPW+"</span>"+
                  "	</p>"+
                  "	<div style='border-top: 1px solid #DDD; padding: 5px;'>"+
                  "	</div>"+
                  "</div>",
        };
        
        await smtpTransport.sendMail(mailOptions, (err, res) => {
            if(err) {
                console.log(err);
            }
            else {
                console.log('success');
            }
            smtpTransport.close();
        });
        
        const hashPW = await bcrypt.hash(randomPW, 12);
        await Company.update({ "CNU" : CNU, "EA" : EA }, { $set: { "PW" : hashPW }});
        return res.redirect('/login?findPW=true');
        
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;