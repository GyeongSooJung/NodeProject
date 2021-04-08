const express = require('express');
const router = express.Router();
const axios = require('axios');

const Order = require('../schemas/order');
const Service = require('../schemas/service');
const Company = require('../schemas/company');

const { isNotLoggedIn, DataSet } = require('./middleware');

// 일반 결제 진행
router.post('/complete', isNotLoggedIn, DataSet, async (req, res, next) => {
    const company = req.decoded.company;
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
        console.log("어마운드"+paymentData.amount);
        console.log("주소"+paymentData.buyer_addr);
        console.log("전번"+paymentData.buyer_tel);
        console.log("이메일"+paymentData.buyer_email);
        console.log("구매자"+paymentData.buyer_name);
        console.log("제품"+paymentData.name);
        console.log("방식"+paymentData.pay_method);
        console.log("사이트"+paymentData.pg_provider);
        console.log("상태"+paymentData.status);
        
        // DB에서 결제되어야 하는 금액 조회
        const service = await Service.findOne({"SN" : paymentData.name});
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if(service) {
            const amountToBePaid = service.PR; // 결제 되어야 하는 금액
            console.log("오더"+service+"오더금액"+amountToBePaid);
        
            if ((amount === amountToBePaid)) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
                switch (status) {
                    // case "ready": // 가상계좌 발급
                    //     // DB에 가상계좌 발급 정보 저장
                    //     const { vbank_num, vbank_date, vbank_name } = paymentData;
                    //     await Company.findByIdAndUpdate(company._id, { $set: { vbank_num, vbank_date, vbank_name }});
                    //     // 가상계좌 발급 안내 문자메시지 발송
                    //     SMS.send({ text: '가상계좌 발급이 성공되었습니다. 계좌 정보'+vbank_num+vbank_date+vbank_name });
                    //     res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    //     break;
                    case "paid": // 결제 완료
                        await Order.create({
                            GN : paymentData.name,
                            AM : paymentData.amount,
                            CID: company._id,
                            BN : paymentData.buyer_name,
                            BE : paymentData.buyer_email,
                            BT : paymentData.buyer_tel,
                            BA : paymentData.buyer_addr,
                            MID : merchant_uid,
                            IID : imp_uid,
                            PAM : paymentData.pay_method,
                            PG : paymentData.pg_provider,
                            PS : paymentData.status,
                        }); // DB에 결제 정보 저장
                        await Company.update({"_id" : company._id}, {$inc : { SPO : service.PO }});
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
        else {
            const reason = "결제 실패";
            
            const getCancelData = await axios({
                url: "https://api.iamport.kr/payments/cancel",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": access_token
                },
                data: {
                    reason,
                    imp_uid
                }
            });
            return res.send({ status: "failed", message: "결제 실패" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

// // 환불하기
// router.post('/cancel', isNotLoggedIn, DataSet, async (req, res, next) => {
    
//     const CID = req.decoded.CID;
//     const { merchant_uid, reason, cancel_request_amount } = req.body;
    
//     try {
//       /* 액세스 토큰(access token) 발급 */
//       const getToken = await axios({
//         url: "https://api.iamport.kr/users/getToken",
//         method: "post", // POST method
//         headers: { 
//           "Content-Type": "application/json" 
//         },
//         data: {
//           imp_key: process.env.imp_key, // [아임포트 관리자] REST API키
//           imp_secret: process.env.imp_secret // [아임포트 관리자] REST API Secret
//         }
//       });
//       const { access_token } = getToken.data.response; // 엑세스 토큰
//       /* 결제정보 조회 */
      
//       const orderone = await Order.find({MID : merchant_uid}, async function(err, payment) {
//           if (err) {
//               return res.json(err);
//           }
          
//           const paymentData = payment[0];
//           const { imp_uid } = paymentData;
          
//           const getCancelData = await axios({
//           url: "https://api.iamport.kr/payments/cancel",
//           method: "post",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
//           },
//           data: {
//             reason, // 가맹점 클라이언트로부터 받은 환불사유
//             imp_uid, // imp_uid를 환불 고유번호로 입력
//             amount: cancel_request_amount, // 가맹점 클라이언트로부터 받은 환불금액
//           }
//         });
//         const { response } = getCancelData.data; // 환불 결과
//         /* 환불 결과 동기화 */
          
//       });
//       console.log(orderone);
      
      
//     } catch (error) {
//       res.status(400).send(error);
//     }
//   });
  
router.post("/iamport-webhook", isNotLoggedIn, DataSet, async(req, res, next) => {
    const company = req.decoded.company;
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
        console.log("어마운드"+paymentData.amount);
        console.log("주소"+paymentData.buyer_addr);
        console.log("전번"+paymentData.buyer_tel);
        console.log("이메일"+paymentData.buyer_email);
        console.log("구매자"+paymentData.buyer_name);
        console.log("제품"+paymentData.name);
        console.log("방식"+paymentData.pay_method);
        console.log("사이트"+paymentData.pg_provider);
        console.log("상태"+paymentData.status);
        
        // DB에서 결제되어야 하는 금액 조회
        const service = await Service.findOne({"SN" : paymentData.name});
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if(service) {
            const amountToBePaid = service.PR; // 결제 되어야 하는 금액
            console.log("오더"+service+"오더금액"+amountToBePaid);
        
            if ((amount === amountToBePaid)) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
                switch (status) {
                    // case "ready": // 가상계좌 발급
                    //     // DB에 가상계좌 발급 정보 저장
                    //     const { vbank_num, vbank_date, vbank_name } = paymentData;
                    //     await Company.findByIdAndUpdate(company._id, { $set: { vbank_num, vbank_date, vbank_name }});
                    //     // 가상계좌 발급 안내 문자메시지 발송
                    //     SMS.send({ text: '가상계좌 발급이 성공되었습니다. 계좌 정보'+vbank_num+vbank_date+vbank_name });
                    //     res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    //     break;
                    case "paid": // 결제 완료
                        await Order.create({
                            GN : paymentData.name,
                            AM : paymentData.amount,
                            CID: company._id,
                            BN : paymentData.buyer_name,
                            BE : paymentData.buyer_email,
                            BT : paymentData.buyer_tel,
                            BA : paymentData.buyer_addr,
                            MID : merchant_uid,
                            IID : imp_uid,
                            PAM : paymentData.pay_method,
                            PG : paymentData.pg_provider,
                            PS : paymentData.status,
                        }); // DB에 결제 정보 저장
                        await Company.update({"_id" : company._id}, {$inc : { SPO : service.PO }});
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
        else {
            const reason = "결제 실패";
            
            const getCancelData = await axios({
                url: "https://api.iamport.kr/payments/cancel",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": access_token
                },
                data: {
                    reason,
                    imp_uid
                }
            });
            return res.send({ status: "failed", message: "결제 실패" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.get("/complete/mobile", isNotLoggedIn, DataSet, async(req, res, next) => {
    const company = req.decoded.company;
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
        console.log("어마운드"+paymentData.amount);
        console.log("주소"+paymentData.buyer_addr);
        console.log("전번"+paymentData.buyer_tel);
        console.log("이메일"+paymentData.buyer_email);
        console.log("구매자"+paymentData.buyer_name);
        console.log("제품"+paymentData.name);
        console.log("방식"+paymentData.pay_method);
        console.log("사이트"+paymentData.pg_provider);
        console.log("상태"+paymentData.status);
        
        // DB에서 결제되어야 하는 금액 조회
        const service = await Service.findOne({"SN" : paymentData.name});
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if(service) {
            const amountToBePaid = service.PR; // 결제 되어야 하는 금액
            console.log("오더"+service+"오더금액"+amountToBePaid);
        
            if ((amount === amountToBePaid)) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
                switch (status) {
                    // case "ready": // 가상계좌 발급
                    //     // DB에 가상계좌 발급 정보 저장
                    //     const { vbank_num, vbank_date, vbank_name } = paymentData;
                    //     await Company.findByIdAndUpdate(company._id, { $set: { vbank_num, vbank_date, vbank_name }});
                    //     // 가상계좌 발급 안내 문자메시지 발송
                    //     SMS.send({ text: '가상계좌 발급이 성공되었습니다. 계좌 정보'+vbank_num+vbank_date+vbank_name });
                    //     res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    //     break;
                    case "paid": // 결제 완료
                        await Order.create({
                            GN : paymentData.name,
                            AM : paymentData.amount,
                            CID: company._id,
                            BN : paymentData.buyer_name,
                            BE : paymentData.buyer_email,
                            BT : paymentData.buyer_tel,
                            BA : paymentData.buyer_addr,
                            MID : merchant_uid,
                            IID : imp_uid,
                            PAM : paymentData.pay_method,
                            PG : paymentData.pg_provider,
                            PS : paymentData.status,
                        }); // DB에 결제 정보 저장
                        await Company.update({"_id" : company._id}, {$inc : { SPO : service.PO }});
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
        else {
            const reason = "결제 실패";
            
            const getCancelData = await axios({
                url: "https://api.iamport.kr/payments/cancel",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": access_token
                },
                data: {
                    reason,
                    imp_uid
                }
            });
            return res.send({ status: "failed", message: "결제 실패" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});



router.get("/regular", isNotLoggedIn, DataSet, async(req, res, next) => {
    
    
});



module.exports = router;