const express = require('express');
const router = express.Router();
const axios = require('axios');

const Order = require('../schemas/order');
const Service = require('../schemas/service');
const Company = require('../schemas/company');

const { isNotLoggedIn, DataSet } = require('./middleware');

router.post('/complete', isNotLoggedIn, DataSet, async (req, res, next) => {
    const companyone = req.decoded;
    try {
        const { imp_uid, merchant_uid } = req.body;
        
        console.log(imp_uid,merchant_uid);
        
        // 엑세스 토큰 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
              imp_key: process.env.imp_key, // REST API키
              imp_secret: process.env.imp_secret // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰
        
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: 'https://api.iamport.kr/payments/'+imp_uid, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        console.log("결제정보"+paymentData);
        console.log("어마운드"+paymentData.amount);
        
        // DB에서 결제되어야 하는 금액 조회
        const service = await Service.findOne({"SN" : paymentData.name});
        const amountToBePaid = service.PR; // 결제 되어야 하는 금액
        console.log("오더"+service+"오더금액"+amountToBePaid);
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            await Order.create({
                GN : paymentData.name,
                AM : paymentData.amount,
                CID: companyone._id,
                BT : companyone.PN,
                BA : companyone.ADR,
                MID : merchant_uid,
                IID : imp_uid,
                PAM : paymentData.pay_method,
                PG : paymentData.pg,
                PS : paymentData.status,
            }); // DB에 결제 정보 저장
            
            switch (status) {
              case "ready": // 가상계좌 발급
                // DB에 가상계좌 발급 정보 저장
                const { vbank_num, vbank_date, vbank_name } = paymentData;
                await Company.findByIdAndUpdate(companyone._id, { $set: { vbank_num, vbank_date, vbank_name }});
                // 가상계좌 발급 안내 문자메시지 발송
                SMS.send({ text: '가상계좌 발급이 성공되었습니다. 계좌 정보'+vbank_num+vbank_date+vbank_name });
                res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                // return res.redirect('/pay_sms?create=true');
                // break;
              case "paid": // 결제 완료
                res.send({ status: "success", message: "일반 결제 성공" });
                // return res.redirect('/pay_sms?success=true');
                // break;
            }
            res.redirect('/main');
        } else { // 결제 금액 불일치. 위/변조 된 결제
            res.send({ status: "forgery", message: "위조된 결제시도" });
            // return res.redirect('/pay_sms?bad=true');
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

// 환불하기
router.post('/cancel', isNotLoggedIn, DataSet, async (req, res, next) => {
    
    const CID = req.decoded.CID;
    const { merchant_uid, reason, cancel_request_amount } = req.body;
    
    try {
      /* 액세스 토큰(access token) 발급 */
      const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { 
          "Content-Type": "application/json" 
        },
        data: {
          imp_key: process.env.imp_key, // [아임포트 관리자] REST API키
          imp_secret: process.env.imp_secret // [아임포트 관리자] REST API Secret
        }
      });
      const { access_token } = getToken.data.response; // 엑세스 토큰
      /* 결제정보 조회 */
      
      const orderone = await Order.find({MID : merchant_uid}, async function(err, payment) {
          if (err) {
              return res.json(err);
          }
          
          const paymentData = payment[0];
          const { imp_uid } = paymentData;
          
          const getCancelData = await axios({
          url: "https://api.iamport.kr/payments/cancel",
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
          },
          data: {
            reason, // 가맹점 클라이언트로부터 받은 환불사유
            imp_uid, // imp_uid를 환불 고유번호로 입력
            amount: cancel_request_amount, // 가맹점 클라이언트로부터 받은 환불금액
          }
        });
        const { response } = getCancelData.data; // 환불 결과
        /* 환불 결과 동기화 */
          
      });
      console.log(orderone);
      
      
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  



router.post("/iamport-webhook", isNotLoggedIn, async(req, res, next) => {
    const companyone = req.decoded;
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.imp_key, // REST API키
                imp_secret: process.env.imp_secret // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: 'https://api.iamport.kr/payments/'+imp_uid, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        
        // DB에서 결제되어야 하는 금액 조회
        const order = await Order.findById(paymentData.merchant_uid);
        const amountToBePaid = order.amount; // 결제 되어야 하는 금액
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            await Order.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
            switch (status) {
                case "ready": // 가상계좌 발급
                    // DB에 가상계좌 발급 정보 저장
                    const { vbank_num, vbank_date, vbank_name } = paymentData;
                    await Company.findByIdAndUpdate(companyone._id, { $set: { vbank_num, vbank_date, vbank_name }});
                    // 가상계좌 발급 안내 문자메시지 발송
                    SMS.send({ text: '가상계좌 발급이 성공되었습니다. 계좌 정보'+vbank_num+vbank_date+vbank_name });
                    res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    break;
                case "paid": // 결제 완료
                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            throw { status: "forgery", message: "위조된 결제시도" };
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get("/complete/mobile/", isNotLoggedIn, async(req, res, next) => {
    const companyone = req.decoded;
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.imp_key, // REST API키
                imp_secret: process.env.imp_secret // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: 'https://api.iamport.kr/payments/'+imp_uid, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보
        
        // DB에서 결제되어야 하는 금액 조회
        const order = await Order.findById(paymentData.merchant_uid);
        const amountToBePaid = order.amount; // 결제 되어야 하는 금액
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            await Order.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
            switch (status) {
                case "ready": // 가상계좌 발급
                    // DB에 가상계좌 발급 정보 저장
                    const { vbank_num, vbank_date, vbank_name } = paymentData;
                    await Company.findByIdAndUpdate(companyone._id, { $set: { vbank_num, vbank_date, vbank_name }});
                    // 가상계좌 발급 안내 문자메시지 발송
                    SMS.send({ text: '가상계좌 발급이 성공되었습니다. 계좌 정보'+vbank_num+vbank_date+vbank_name });
                    res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    break;
                case "paid": // 결제 완료
                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            throw { status: "forgery", message: "위조된 결제시도" };
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});




module.exports = router;