const express = require('express');
const router = express.Router();

const Order = require('../schemas/order');
const Service = require('../schemas/service');
const Goods = require('../schemas/goods');
const GoodsOption = require('../schemas/goods_option');

const { isNotLoggedIn, DataSet } = require('./middleware');

// 쇼핑몰 모달창
router.post('/modal', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { GN } = req.body;
    
    try {
        // console.log("빠라라밤"+JSON.stringify(req.cookies));
        // const kk = req.cookies.shop;
        // console.log("케이케이"+JSON.stringify(kk));
        const goods = await Goods.findOne({ "GN" : GN });
        if(goods.GO == true) {
            const option = await GoodsOption.find({ "GID" : goods._id });
            const optionType = await GoodsOption.where({ "GID" : goods._id }).distinct("OT");
            // console.log(optionType);
            // console.log(option);
            return res.send({ status: 'option', goods: goods, option: option, optionType: optionType });
        }
        else {
            return res.send({ status: 'noOption', goods: goods });
        }
       
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 카트에 담기 위한 쿠키 생성
router.post('/addCart', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { GN, GP, TT, OT, ON, OP, NUM } = req.body;
    
    try {
        var shop = [];
        var cart = {};
        
        cart["GN"] = GN;
        cart["GP"] = GP;
        cart["TT"] = TT;
        cart["OT"] = OT;
        cart["ON"] = ON;
        cart["OP"] = OP;
        cart["NUM"] = NUM;
        
        if(req.cookies.shop) {
            var exCart = req.cookies.shop;
            var shopcheck = false;
            for (var i = 0; i < exCart.length; i ++) {
                console.log(typeof(exCart[i].ON),typeof(cart.ON));
                if ((exCart[i].GN === cart.GN) && (JSON.stringify(exCart[i].ON) === JSON.stringify(cart.ON))) {
                    exCart[i].NUM = parseInt(exCart[i].NUM) + parseInt(cart.NUM);
                    exCart[i].TT = parseInt(exCart[i].TT) * parseInt(exCart[i].NUM);
                    shopcheck = true;
                }
            }
            if(!shopcheck) {
                exCart.push(cart);
            }
            res.cookie("shop", exCart);
        }
        else {
            shop.push(cart);
            res.cookie("shop", shop);
        }
        
        return res.send({ status: "success" });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 쿠키 내용을 카트에 표현
router.post('/showCart', isNotLoggedIn, DataSet, async(req, res, next) => {
    var cartCookie = req.cookies.shop;
    
    res.send({ status: "success", cart : cartCookie });
    
});

// 쇼핑몰 장바구니에서 수량 변경
router.post('/cartNum', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { MATH, GN, ON } = req.body;
    
    var cartCookie = req.cookies.shop;
        // if(cartCookie[i].GN == GN) {
        //     if(MATH == 'minus') {
        //         if(cartCookie[i].NUM < 2) {
        //             cartCookie[i].NUM = 1;
        //         }
        //         else {
        //             cartCookie[i].NUM = cartCookie[i].NUM - 1
        //         }
        //     }
        //     else {
        //         cartCookie[i].NUM = cartCookie[i].NUM + 1
        //     }
        // }
    var findCookie = cartCookie.find(function(e) {
        if(e.ON) {
            if(e.GN == GN && e.ON == ON) {
                var price = e.TT / e.NUM;
                console.log(price);
                if(MATH == 'minus') {
                    if(e.NUM < 2) {
                        e.NUM = "1";
                    }
                    else {
                        e.NUM = (parseInt(e.NUM) - 1).toString();
                    }
                }
                else {
                    e.NUM = (parseInt(e.NUM) + 1).toString();
                }
                e.TT = price * e.NUM;
                return true;
            }
        }
        else {
            if(e.GN == GN) {
                var price = e.TT / e.NUM;
                console.log(price);
                if(MATH == 'minus') {
                    if(e.NUM < 2) {
                        e.NUM = "1";
                    }
                    else {
                        e.NUM = (parseInt(e.NUM) - 1).toString();
                    }
                }
                else {
                    e.NUM = (parseInt(e.NUM) + 1).toString();
                }
                e.TT = price * e.NUM;
                return true;
            }
        }
    });
    
    res.cookie("shop", cartCookie);
    res.send({ status: "success" });
});

// 쇼핑몰 장바구니 삭제
router.post('/cartRemove', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { GN, ON, amount } = req.body;
    
    if(amount == 'one') {
        var cartCookie = req.cookies.shop;
        var findCookie = cartCookie.find(function(e) {
            if(e.ON) {
                if(e.GN == GN && e.ON == ON) {
                    return true;
                }
            }
            else {
                if(e.GN == GN) {
                    return true;
                }
            }
        });
        var idx = cartCookie.indexOf(findCookie);
        cartCookie.splice(idx, 1);
    }
    else {
        var cartCookie = req.cookies.shop;
        cartCookie.length = 0;
    }
    
    res.cookie("shop", cartCookie);
    res.send({ status: "delete" });
});

// 쇼핑몰 일반결제 진행
router.post('/complete', isNotLoggedIn, DataSet, async (req, res, next) => {
    const company = req.decoded.company;
    try {
        const { imp_uid, merchant_uid, goods } = req.body;
        
        console.log("확인"+imp_uid, merchant_uid, goods);
        
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
        var goodsDB = [];
        for(var i = 0; i < goods.length; ) {
            
        }
        // const service = await Service.findOne({"SN" : paymentData.name});
        // const 
        
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

module.exports = router;