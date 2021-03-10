const express = require('express');
const router = express.Router();
const axios = require('axios');

const Order = require('../schemas/order');
const Service = require('../schemas/service');
const Company = require('../schemas/company');

const { isNotLoggedIn, DataSet } = require('./middleware');

// 일반 결제 진행
router.post('/complete', isNotLoggedIn, DataSet, async (req, res, next) => {
    const companyone = req.decoded;
    try {
        const { imp_uid, merchant_uid } = req.body;
        
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
        console.log("어마운드"+paymentData.amount);
        console.log("주소"+paymentData.buyer_addr);
        console.log("전번"+paymentData.buyer_tel);
        console.log("이메일"+paymentData.buyer_email);
        console.log("구매자"+paymentData.buyer_name);
        console.log("제품"+paymentData.name);
        console.log("방식"+paymentData.pay_method);
        console.log("사이트"+paymentData.pg);
        console.log("상태"+paymentData.status);
        
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
                BN : paymentData.buyer_name,
                BE : paymentData.buyer_email,
                BT : paymentData.buyer_tel,
                BA : paymentData.buyer_addr,
                MID : merchant_uid,
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
                    break;
                case "paid": // 결제 완료
                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
                case "cancelled": // 결제 취소
                    res.send({ status: "cancelled", message: "결제 취소" });
                    break;
                case "failed": // 결제 실패
                    res.send({ status: "failed", message: "결제 실패" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            return res.send({ status: "forgery", message: "위조된 결제시도" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

// 웹훅 동기화
router.post("/iamport-webhook", isNotLoggedIn, async(req, res, next) => {
    const companyone = req.decoded;
    try {
        const { imp_uid, merchant_uid } = req.body;
        
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
        console.log("어마운드"+paymentData.amount);
        console.log("주소"+paymentData.buyer_addr);
        console.log("전번"+paymentData.buyer_tel);
        console.log("이메일"+paymentData.buyer_email);
        console.log("구매자"+paymentData.buyer_name);
        console.log("제품"+paymentData.name);
        console.log("방식"+paymentData.pay_method);
        console.log("사이트"+paymentData.pg);
        console.log("상태"+paymentData.status);
        
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
                BN : paymentData.buyer_name,
                BE : paymentData.buyer_email,
                BT : paymentData.buyer_tel,
                BA : paymentData.buyer_addr,
                MID : merchant_uid,
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
                    break;
                case "paid": // 결제 완료
                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
                case "cancelled": // 결제 취소
                    res.send({ status: "cancelled", message: "결제 취소" });
                    break;
                case "failed": // 결제 실패
                    res.send({ status: "failed", message: "결제 실패" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            return res.send({ status: "forgery", message: "위조된 결제시도" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

// 모바일처리??
router.get("/paymetns/complete/mobile/", isNotLoggedIn, async(req, res, next) => {
    const companyone = req.decoded;
    try {
        const { imp_uid, merchant_uid } = req.body;
        
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
        console.log("어마운드"+paymentData.amount);
        console.log("주소"+paymentData.buyer_addr);
        console.log("전번"+paymentData.buyer_tel);
        console.log("이메일"+paymentData.buyer_email);
        console.log("구매자"+paymentData.buyer_name);
        console.log("제품"+paymentData.name);
        console.log("방식"+paymentData.pay_method);
        console.log("사이트"+paymentData.pg);
        console.log("상태"+paymentData.status);
        
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
                BN : paymentData.buyer_name,
                BE : paymentData.buyer_email,
                BT : paymentData.buyer_tel,
                BA : paymentData.buyer_addr,
                MID : merchant_uid,
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
                    break;
                case "paid": // 결제 완료
                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
                case "cancelled": // 결제 취소
                    res.send({ status: "cancelled", message: "결제 취소" });
                    break;
                case "failed": // 결제 실패
                    res.send({ status: "failed", message: "결제 실패" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            return res.send({ status: "forgery", message: "위조된 결제시도" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;