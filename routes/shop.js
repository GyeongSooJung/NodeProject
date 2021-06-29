const express = require('express');
const router = express.Router();
const axios = require('axios');
const imgbbUploader = require("imgbb-uploader");
const multiparty = require('multiparty');
const path = require('path');
var fs = require('fs');

const Schema = require('../schemas/schemas');
const { Order, OrderDetail, Goods, Company, GoodsOption } = Schema;

const { isNotLoggedIn, DataSet } = require('./middleware');

// 쇼핑몰 이미지등록
router.post('/goodsImg', isNotLoggedIn, DataSet, async(req, res, next) => {
    try {
        const form = new multiparty.Form({
            autoFiles: true,
        });
        form.on('file', async (name, file) => {
            const extname = path.extname(file.path); //확장자명
            const fileName = path.basename(file.path); //전체경로
            
            if (extname == "") {
                return res.send({ result : 'sendNull' });
            }
            else {
                const options = {
                    apiKey: process.env.imgBB,
                    imagePath: file.path,
                    name: fileName,
                };
                
                imgbbUploader(options)
                    .then((response) => res.send({ result : "success", imgUrl: response.url}))
                    .catch((error) => console.error(error));
            }
        });
        form.on('close', () => {});
 
        form.parse(req);
        
    } catch(err) {
        res.send({ result : "fail" });
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 상품등록
router.post('/goodsJoin', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { GN, GP, GE, GI, OT, ON, OP } = req.body;
    
    
    try {
        
        var jsonON = JSON.parse(ON);
        var jsonOP = JSON.parse(OP);
        
        const exGoods = await Goods.findOne({ "GN" : GN });
        if(exGoods) {
            return res.send({ result : "exist" });
        }
        else {
            if(OT) {
                await Goods.create({
                    GN : GN,
                    GP : GP,
                    GE : GE,
                    GI : GI,
                    GO : true
                });
                
                const newGoods = await Goods.findOne({ "GN" : GN });
                if(typeof(OT) == "string") {
                    for(var j = 0; j < jsonON[0].length; j++) {
                        await GoodsOption.create({
                            GID : newGoods._id,
                            GNA : newGoods.GN,
                            OT : OT,
                            ON : jsonON[0][j],
                            OP : jsonOP[0][j]
                        });
                    }
                }
                else {
                    for(var i = 0; i < OT.length; i++) {
                        for(var j = 0; j < jsonON[i].length; j++) {
                            await GoodsOption.create({
                                GID : newGoods._id,
                                GNA : newGoods.GN,
                                OT : OT[i],
                                ON : jsonON[i][j],
                                OP : jsonOP[i][j]
                            });
                        }
                    }
                }
            }
            else {
                await Goods.create({
                    GN : GN,
                    GP : GP,
                    GE : GE,
                    GI : GI,
                    GO : false
                });
            }
            
            return res.send({ result : 'success' });
        }
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 모달창
router.post('/modal', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { GN } = req.body;
    
    try {
        const goods = await Goods.findOne({ "GN" : GN });
        if(goods.GO == true) {
            const option = await GoodsOption.find({ "GID" : goods._id });
            const optionType = await GoodsOption.where({ "GID" : goods._id }).distinct("OT");
            
            return res.send({ result : 'option', goods : goods, option : option, optionType : optionType });
        }
        else {
            return res.send({ result : 'noOption', goods : goods });
        }
       
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 카트에 담기 위한 쿠키 생성
router.post('/addCart', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { GN, GI, GP, TT, OT, ON, OP, NUM } = req.body;
    
    try {
        var shop = [];
        var cart = {};
        
        cart["GN"] = GN;
        cart["GP"] = GP;
        cart["GI"] = GI;
        cart["TT"] = TT;
        cart["OT"] = OT;
        cart["ON"] = ON;
        cart["OP"] = OP;
        cart["NUM"] = NUM;
        
        if(req.cookies.shop) {
            var exCart = req.cookies.shop;
            var shopcheck = false;
            for (var i = 0; i < exCart.length; i ++) {
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
        
        return res.send({ result : 'success' });
        
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 쿠키 내용을 카트에 표현
router.post('/showCart', isNotLoggedIn, DataSet, async(req, res, next) => {
    var cartCookie = req.cookies.shop;
    
    try {
        res.send({ result : 'success', cart : cartCookie });
        
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
    
});

// 쇼핑몰 장바구니에서 수량 변경
router.post('/cartNum', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { MATH, GN, ON } = req.body;
    
    try {
        var cartCookie = req.cookies.shop;
        var findCookie = cartCookie.find(function(e) {
            if(e.ON) {
                if(e.GN == GN && e.ON == ON) {
                    var price = e.TT / e.NUM;
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
        res.send({ result : 'success' });
        
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 장바구니 삭제
router.post('/cartRemove', isNotLoggedIn, DataSet, async(req, res, next) => {
    const { GN, ON, amount } = req.body;
    
    try {
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
        res.send({ result : 'delete' });
        
    } catch(err) {
        res.send({ result : 'fail' });
        console.error(err);
        next(err);
    }
});

// 쇼핑몰 일반결제 진행
router.post('/complete', isNotLoggedIn, DataSet, async (req, res, next) => {
    const company = req.decoded.company;
    try {
        const { imp_uid, merchant_uid, goods, TS } = req.body;
        
        // 넘어온 goods는 string형태로 다시 json형태로 바꿔줌
        var goodsJson = [];
        
        if(typeof(goods) == "string") {
            goodsJson.push(JSON.parse(goods));
        }
        else {
            for(var i = 0; i < goods.length; i++) {
                goodsJson[i] = JSON.parse(goods[i]);
            }
        }
        
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
        // console.log("어마운드"+paymentData.amount);
        // console.log("주소"+paymentData.buyer_addr);
        // console.log("전번"+paymentData.buyer_tel);
        // console.log("이메일"+paymentData.buyer_email);
        // console.log("구매자"+paymentData.buyer_name);
        // console.log("제품"+paymentData.name);
        // console.log("방식"+paymentData.pay_method);
        // console.log("사이트"+paymentData.pg_provider);
        // console.log("상태"+paymentData.status);
        
        // DB에서 결제되어야 하는 금액 조회
        var dbGoods = [];
        var noOptionGoods = new Object();
        var yesOptionGoods = new Object();
        var addOrderDB = [];
        var noOrderDB = new Object();
        var yesOrderDB = new Object();
        var option;
        var point;
        var a = 0;
        var b = 0;
        var c = 0;
        var d = 0;
        var filter = dbGoods;
        var totalSum = 0;
        var same = 0;
        var sameSum = 0;
        var diff = 0;
        var diffSum = 0;
        
        for(var i = 0; i < goodsJson.length; i++) {
            
            if(goodsJson[i].ON == "undefined") {
                var noOptionone = await Goods.aggregate([
                    {
                        $lookup: {
                            from: "Goods_Option",
                            localField: "GN",
                            foreignField: "GNA",
                            as: "option"
                        }
                    },
                    {
                        $unwind: {
                            path: "$option",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    { $match: { "GN" : goodsJson[i].GN } },
                    { $project: { "_id" : 0, "index" : goodsJson[i].index, "GN" : 1, "GP" : 1, "option.ON" : 1, "option.OP" : 1, "NUM" : goodsJson[i].NUM } }
                ]);
                a++;
                
                noOptionGoods[a] = noOptionone;
                dbGoods.push(noOptionone);
            }
            else {
                option = goodsJson[i].ON.split(",");
                for(var j = 0; j < option.length; j++) {
                    var yesOptionone  = await Goods.aggregate([
                        {
                            $lookup: {
                                from: "Goods_Option",
                                localField: "GN",
                                foreignField: "GNA",
                                as: "option"
                            }
                        },
                        {
                            $unwind: {
                                path: "$option",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        { $match: { "GN" : goodsJson[i].GN, "option.ON" : option[j] } },
                        { $project: { "_id" : 0, "index" : goodsJson[i].index, "GN" : 1, "GP" : 1, "option.OT" : 1, "option.ON" : 1, "option.OP" : 1, "NUM" : goodsJson[i].NUM } }
                    ]);
                    b++;
                    yesOptionGoods[b] = yesOptionone;
                    dbGoods.push(yesOptionone);
                }
            }
        }
        a = 0;
        b = 0;
        
        for(var i = 0; i < dbGoods.length; i ++) {
            var a = dbGoods[i];
            if(a[0].GN == "포인트") {
                var pointName = a[0].option.ON;
                point = parseInt(pointName.substring(0, pointName.lastIndexOf(" "))) * a[0].NUM;
            }
            for(var j = i+1; j < dbGoods.length; j ++) {
                if(a[0].index == dbGoods[j][0].index) {
                    same = (parseInt(a[0].GP) + parseInt(a[0].option.OP) + parseInt(dbGoods[j][0].option.OP)) * parseInt(a[0].NUM);
                    sameSum += same;
                    filter = await filter.filter((e) => e !== a);
                    filter = await filter.filter((e) => e !== dbGoods[j]);
                    yesOrderDB[c] = { "GN" : a[0].GN, "GP" : a[0].GP, "OT" : [a[0].option.OT, dbGoods[j][0].option.OT], "ON" : [a[0].option.ON, dbGoods[j][0].option.ON], "OP" : [a[0].option.OP, dbGoods[j][0].option.OP], "SUM" : same, "NUM" : a[0].NUM }
                    addOrderDB.push(yesOrderDB[c]);
                    c++;
                }
            }
        }
        c = 0;
        
        for(var i = 0; i < filter.length; i++) {
            if(!filter[i][0].option) {
                diff = parseInt(filter[i][0].GP) * parseInt(filter[i][0].NUM);
                noOrderDB[d] = { "GN" : filter[i][0].GN, "GP" : filter[i][0].GP, "SUM" : diff, "NUM" : filter[i][0].NUM };
                addOrderDB.push(noOrderDB[d]);
            }
            else {
                diff = (parseInt(filter[i][0].GP) + parseInt(filter[i][0].option.OP)) * parseInt(filter[i][0].NUM);
                noOrderDB[d] = { "GN" : filter[i][0].GN, "GP" : filter[i][0].GP, "OT" : filter[i][0].option.OT, "ON" : filter[i][0].option.ON, "OP" : filter[i][0].option.OP, "SUM" : diff, "NUM" : filter[i][0].NUM };
                addOrderDB.push(noOrderDB[d]);
            }
            diffSum += diff;
            d++;
        }
        d = 0;
        
        totalSum = sameSum + diffSum;
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if(dbGoods) {
            const amountToBePaid = totalSum; // 결제 되어야 하는 금액
        
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
                        }); // DB에 결제 정보 저장 - 포괄적인 구매 정보(이니시스와 연동을 위해)
                        for(var i = 0; i < addOrderDB.length; i ++) {
                            if(!addOrderDB[i].ON) {
                                await OrderDetail.create({
                                    OID : merchant_uid,
                                    OGN : addOrderDB[i].GN,
                                    OGP : addOrderDB[i].GP,
                                    OTP : addOrderDB[i].SUM,
                                    ONU : addOrderDB[i].NUM,
                                });
                            }
                            else {
                                await OrderDetail.create({
                                    OID : merchant_uid,
                                    OGN : addOrderDB[i].GN,
                                    OGP : addOrderDB[i].GP,
                                    OOT : addOrderDB[i].OT,
                                    OON : addOrderDB[i].ON,
                                    OOP : addOrderDB[i].OP,
                                    OTP : addOrderDB[i].SUM,
                                    ONU : addOrderDB[i].NUM,
                                });
                            }
                        };
                        if(point) {
                            await Company.update({"_id" : company._id}, {$inc : { SPO : point }});
                        }
                        res.clearCookie('shop');
                        res.send({ result : "success", message : "일반 결제 성공" });
                        break;
                    case "cancelled": // 결제 취소
                        res.send({ result : "cancelled", message : "결제 취소" });
                        break;
                    case "failed": // 결제 실패
                        res.send({ result : "failed", message : "결제 실패" });
                        break;
                }
            } else { // 결제 금액 불일치. 위/변조 된 결제
                return res.send({ result : "forgery", message : "위조된 결제시도" });
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
            return res.send({ result : "failed", message : "결제 실패" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.post("/iamport-webhook", isNotLoggedIn, DataSet, async(req, res, next) => {
    const company = req.decoded.company;
    try {
        const { imp_uid, merchant_uid, goods, TS } = req.body;
        
        // 넘어온 goods는 string형태로 다시 json형태로 바꿔줌
        var goodsJson = [];
        
        if(typeof(goods) == "string") {
            goodsJson.push(JSON.parse(goods));
        }
        else {
            for(var i = 0; i < goods.length; i++) {
                goodsJson[i] = JSON.parse(goods[i]);
            }
        }
        
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
        // console.log("어마운드"+paymentData.amount);
        // console.log("주소"+paymentData.buyer_addr);
        // console.log("전번"+paymentData.buyer_tel);
        // console.log("이메일"+paymentData.buyer_email);
        // console.log("구매자"+paymentData.buyer_name);
        // console.log("제품"+paymentData.name);
        // console.log("방식"+paymentData.pay_method);
        // console.log("사이트"+paymentData.pg_provider);
        // console.log("상태"+paymentData.status);
        
        // DB에서 결제되어야 하는 금액 조회
        var dbGoods = [];
        var noOptionGoods = new Object();
        var yesOptionGoods = new Object();
        var addOrderDB = [];
        var noOrderDB = new Object();
        var yesOrderDB = new Object();
        var option;
        var point;
        var a = 0;
        var b = 0;
        var c = 0;
        var d = 0;
        var filter = dbGoods;
        var totalSum = 0;
        var same = 0;
        var sameSum = 0;
        var diff = 0;
        var diffSum = 0;
        
        for(var i = 0; i < goodsJson.length; i++) {
            
            if(goodsJson[i].ON == "undefined") {
                var noOptionone = await Goods.aggregate([
                    {
                        $lookup: {
                            from: "Goods_Option",
                            localField: "GN",
                            foreignField: "GNA",
                            as: "option"
                        }
                    },
                    {
                        $unwind: {
                            path: "$option",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    { $match: { "GN" : goodsJson[i].GN } },
                    { $project: { "_id" : 0, "index" : goodsJson[i].index, "GN" : 1, "GP" : 1, "option.ON" : 1, "option.OP" : 1, "NUM" : goodsJson[i].NUM } }
                ]);
                a++;
                
                noOptionGoods[a] = noOptionone;
                dbGoods.push(noOptionone);
            }
            else {
                option = goodsJson[i].ON.split(",");
                for(var j = 0; j < option.length; j++) {
                    var yesOptionone  = await Goods.aggregate([
                        {
                            $lookup: {
                                from: "Goods_Option",
                                localField: "GN",
                                foreignField: "GNA",
                                as: "option"
                            }
                        },
                        {
                            $unwind: {
                                path: "$option",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        { $match: { "GN" : goodsJson[i].GN, "option.ON" : option[j] } },
                        { $project: { "_id" : 0, "index" : goodsJson[i].index, "GN" : 1, "GP" : 1, "option.OT" : 1, "option.ON" : 1, "option.OP" : 1, "NUM" : goodsJson[i].NUM } }
                    ]);
                    b++;
                    yesOptionGoods[b] = yesOptionone;
                    dbGoods.push(yesOptionone);
                }
            }
        }
        a = 0;
        b = 0;
        
        for(var i = 0; i < dbGoods.length; i ++) {
            var a = dbGoods[i];
            if(a[0].GN == "포인트") {
                var pointName = a[0].option.ON;
                point = parseInt(pointName.substring(0, pointName.lastIndexOf(" "))) * a[0].NUM;
            }
            for(var j = i+1; j < dbGoods.length; j ++) {
                if(a[0].index == dbGoods[j][0].index) {
                    same = (parseInt(a[0].GP) + parseInt(a[0].option.OP) + parseInt(dbGoods[j][0].option.OP)) * parseInt(a[0].NUM);
                    sameSum += same;
                    filter = await filter.filter((e) => e !== a);
                    filter = await filter.filter((e) => e !== dbGoods[j]);
                    yesOrderDB[c] = { "GN" : a[0].GN, "GP" : a[0].GP, "OT" : [a[0].option.OT, dbGoods[j][0].option.OT], "ON" : [a[0].option.ON, dbGoods[j][0].option.ON], "OP" : [a[0].option.OP, dbGoods[j][0].option.OP], "SUM" : same, "NUM" : a[0].NUM }
                    addOrderDB.push(yesOrderDB[c]);
                    c++;
                }
            }
        }
        c = 0;
        
        for(var i = 0; i < filter.length; i++) {
            if(!filter[i][0].option) {
                diff = parseInt(filter[i][0].GP) * parseInt(filter[i][0].NUM);
                noOrderDB[d] = { "GN" : filter[i][0].GN, "GP" : filter[i][0].GP, "SUM" : diff, "NUM" : filter[i][0].NUM };
                addOrderDB.push(noOrderDB[d]);
            }
            else {
                diff = (parseInt(filter[i][0].GP) + parseInt(filter[i][0].option.OP)) * parseInt(filter[i][0].NUM);
                noOrderDB[d] = { "GN" : filter[i][0].GN, "GP" : filter[i][0].GP, "OT" : filter[i][0].option.OT, "ON" : filter[i][0].option.ON, "OP" : filter[i][0].option.OP, "SUM" : diff, "NUM" : filter[i][0].NUM };
                addOrderDB.push(noOrderDB[d]);
            }
            diffSum += diff;
            d++;
        }
        d = 0;
        
        totalSum = sameSum + diffSum;
        
        // 결제 검증하기
        const { amount, status } = paymentData;
        if(dbGoods) {
            const amountToBePaid = totalSum; // 결제 되어야 하는 금액
        
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
                        }); // DB에 결제 정보 저장 - 포괄적인 구매 정보(이니시스와 연동을 위해)
                        for(var i = 0; i < addOrderDB.length; i ++) {
                            if(!addOrderDB[i].ON) {
                                await OrderDetail.create({
                                    OID : merchant_uid,
                                    OGN : addOrderDB[i].GN,
                                    OGP : addOrderDB[i].GP,
                                    OTP : addOrderDB[i].SUM,
                                    ONU : addOrderDB[i].NUM,
                                });
                            }
                            else {
                                await OrderDetail.create({
                                    OID : merchant_uid,
                                    OGN : addOrderDB[i].GN,
                                    OGP : addOrderDB[i].GP,
                                    OOT : addOrderDB[i].OT,
                                    OON : addOrderDB[i].ON,
                                    OOP : addOrderDB[i].OP,
                                    OTP : addOrderDB[i].SUM,
                                    ONU : addOrderDB[i].NUM,
                                });
                            }
                        };
                        if(point) {
                            await Company.update({"_id" : company._id}, {$inc : { SPO : point }});
                        }
                        res.clearCookie('shop');
                        res.send({ result : "success", message : "일반 결제 성공" });
                        break;
                    case "cancelled": // 결제 취소
                        res.send({ result : "cancelled", message : "결제 취소" });
                        break;
                    case "failed": // 결제 실패
                        res.send({ result : "failed", message : "결제 실패" });
                        break;
                }
            } else { // 결제 금액 불일치. 위/변조 된 결제
                return res.send({ result : "forgery", message : "위조된 결제시도" });
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
            return res.send({ result : "failed", message : "결제 실패" });
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

// router.get("/complete/mobile", isNotLoggedIn, DataSet, async(req, res, next) => {
//     const company = req.decoded.company;
//     try {
//         const { imp_uid, merchant_uid, goods, TS } = req.body;
        
//         // 넘어온 goods는 string형태로 다시 json형태로 바꿔줌
//         var goodsJson = [];
        
//         if(typeof(goods) == "string") {
//             goodsJson.push(JSON.parse(goods));
//         }
//         else {
//             for(var i = 0; i < goods.length; i++) {
//                 goodsJson[i] = JSON.parse(goods[i]);
//             }
//         }
        
//         // 엑세스 토큰 발급 받기
//         const getToken = await axios({
//             url: "https://api.iamport.kr/users/getToken",
//             method: "post", // POST method
//             headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
//             data: {
//               imp_key: process.env.imp_key, // REST API키
//               imp_secret: process.env.imp_secret // REST API Secret
//             }
//         });
//         const { access_token } = getToken.data.response; // 인증 토큰
        
//         // imp_uid로 아임포트 서버에서 결제 정보 조회
//         const getPaymentData = await axios({
//             url: 'https://api.iamport.kr/payments/'+imp_uid, // imp_uid 전달
//             method: "get", // GET method
//             headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
//         });
//         const paymentData = getPaymentData.data.response; // 조회한 결제 정보
//         // console.log("어마운드"+paymentData.amount);
//         // console.log("주소"+paymentData.buyer_addr);
//         // console.log("전번"+paymentData.buyer_tel);
//         // console.log("이메일"+paymentData.buyer_email);
//         // console.log("구매자"+paymentData.buyer_name);
//         // console.log("제품"+paymentData.name);
//         // console.log("방식"+paymentData.pay_method);
//         // console.log("사이트"+paymentData.pg_provider);
//         // console.log("상태"+paymentData.status);
        
//         // DB에서 결제되어야 하는 금액 조회
//         var dbGoods = [];
//         var noOptionGoods = new Object();
//         var yesOptionGoods = new Object();
//         var addOrderDB = [];
//         var noOrderDB = new Object();
//         var yesOrderDB = new Object();
//         var option;
//         var point;
//         var a = 0;
//         var b = 0;
//         var c = 0;
//         var d = 0;
//         var filter = dbGoods;
//         var totalSum = 0;
//         var same = 0;
//         var sameSum = 0;
//         var diff = 0;
//         var diffSum = 0;
        
//         for(var i = 0; i < goodsJson.length; i++) {
            
//             if(goodsJson[i].ON == "undefined") {
//                 var noOptionone = await Goods.aggregate([
//                     {
//                         $lookup: {
//                             from: "Goods_Option",
//                             localField: "GN",
//                             foreignField: "GNA",
//                             as: "option"
//                         }
//                     },
//                     {
//                         $unwind: {
//                             path: "$option",
//                             preserveNullAndEmptyArrays: true
//                         }
//                     },
//                     { $match: { "GN" : goodsJson[i].GN } },
//                     { $project: { "_id" : 0, "index" : goodsJson[i].index, "GN" : 1, "GP" : 1, "option.ON" : 1, "option.OP" : 1, "NUM" : goodsJson[i].NUM } }
//                 ]);
//                 a++;
                
//                 noOptionGoods[a] = noOptionone;
//                 dbGoods.push(noOptionone);
//             }
//             else {
//                 option = goodsJson[i].ON.split(",");
//                 for(var j = 0; j < option.length; j++) {
//                     var yesOptionone  = await Goods.aggregate([
//                         {
//                             $lookup: {
//                                 from: "Goods_Option",
//                                 localField: "GN",
//                                 foreignField: "GNA",
//                                 as: "option"
//                             }
//                         },
//                         {
//                             $unwind: {
//                                 path: "$option",
//                                 preserveNullAndEmptyArrays: true
//                             }
//                         },
//                         { $match: { "GN" : goodsJson[i].GN, "option.ON" : option[j] } },
//                         { $project: { "_id" : 0, "index" : goodsJson[i].index, "GN" : 1, "GP" : 1, "option.OT" : 1, "option.ON" : 1, "option.OP" : 1, "NUM" : goodsJson[i].NUM } }
//                     ]);
//                     b++;
//                     yesOptionGoods[b] = yesOptionone;
//                     dbGoods.push(yesOptionone);
//                 }
//             }
//         }
//         a = 0;
//         b = 0;
        
//         for(var i = 0; i < dbGoods.length; i ++) {
//             var a = dbGoods[i];
//             if(a[0].GN == "포인트") {
//                 var pointName = a[0].option.ON;
//                 point = parseInt(pointName.substring(0, pointName.lastIndexOf(" "))) * a[0].NUM;
//             }
//             for(var j = i+1; j < dbGoods.length; j ++) {
//                 if(a[0].index == dbGoods[j][0].index) {
//                     same = (parseInt(a[0].GP) + parseInt(a[0].option.OP) + parseInt(dbGoods[j][0].option.OP)) * parseInt(a[0].NUM);
//                     sameSum += same;
//                     filter = await filter.filter((e) => e !== a);
//                     filter = await filter.filter((e) => e !== dbGoods[j]);
//                     yesOrderDB[c] = { "GN" : a[0].GN, "GP" : a[0].GP, "OT" : [a[0].option.OT, dbGoods[j][0].option.OT], "ON" : [a[0].option.ON, dbGoods[j][0].option.ON], "OP" : [a[0].option.OP, dbGoods[j][0].option.OP], "SUM" : same, "NUM" : a[0].NUM }
//                     addOrderDB.push(yesOrderDB[c]);
//                     c++;
//                 }
//             }
//         }
//         c = 0;
        
//         for(var i = 0; i < filter.length; i++) {
//             if(!filter[i][0].option) {
//                 diff = parseInt(filter[i][0].GP) * parseInt(filter[i][0].NUM);
//                 noOrderDB[d] = { "GN" : filter[i][0].GN, "GP" : filter[i][0].GP, "SUM" : diff, "NUM" : filter[i][0].NUM };
//                 addOrderDB.push(noOrderDB[d]);
//             }
//             else {
//                 diff = (parseInt(filter[i][0].GP) + parseInt(filter[i][0].option.OP)) * parseInt(filter[i][0].NUM);
//                 noOrderDB[d] = { "GN" : filter[i][0].GN, "GP" : filter[i][0].GP, "OT" : filter[i][0].option.OT, "ON" : filter[i][0].option.ON, "OP" : filter[i][0].option.OP, "SUM" : diff, "NUM" : filter[i][0].NUM };
//                 addOrderDB.push(noOrderDB[d]);
//             }
//             diffSum += diff;
//             d++;
//         }
//         d = 0;
        
//         totalSum = sameSum + diffSum;
        
//         // 결제 검증하기
//         const { amount, status } = paymentData;
//         if(dbGoods) {
//             const amountToBePaid = totalSum; // 결제 되어야 하는 금액
        
//             if ((amount === amountToBePaid)) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
//                 switch (status) {
//                     // case "ready": // 가상계좌 발급
//                     //     // DB에 가상계좌 발급 정보 저장
//                     //     const { vbank_num, vbank_date, vbank_name } = paymentData;
//                     //     await Company.findByIdAndUpdate(company._id, { $set: { vbank_num, vbank_date, vbank_name }});
//                     //     // 가상계좌 발급 안내 문자메시지 발송
//                     //     SMS.send({ text: '가상계좌 발급이 성공되었습니다. 계좌 정보'+vbank_num+vbank_date+vbank_name });
//                     //     res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
//                     //     break;
//                     case "paid": // 결제 완료
//                         await Order.create({
//                             GN : paymentData.name,
//                             AM : paymentData.amount,
//                             CID: company._id,
//                             BN : paymentData.buyer_name,
//                             BE : paymentData.buyer_email,
//                             BT : paymentData.buyer_tel,
//                             BA : paymentData.buyer_addr,
//                             MID : merchant_uid,
//                             IID : imp_uid,
//                             PAM : paymentData.pay_method,
//                             PG : paymentData.pg_provider,
//                             PS : paymentData.status,
//                         }); // DB에 결제 정보 저장 - 포괄적인 구매 정보(이니시스와 연동을 위해)
//                         for(var i = 0; i < addOrderDB.length; i ++) {
//                             if(!addOrderDB[i].ON) {
//                                 await OrderDetail.create({
//                                     OID : merchant_uid,
//                                     OGN : addOrderDB[i].GN,
//                                     OGP : addOrderDB[i].GP,
//                                     OTP : addOrderDB[i].SUM,
//                                     ONU : addOrderDB[i].NUM,
//                                 });
//                             }
//                             else {
//                                 await OrderDetail.create({
//                                     OID : merchant_uid,
//                                     OGN : addOrderDB[i].GN,
//                                     OGP : addOrderDB[i].GP,
//                                     OOT : addOrderDB[i].OT,
//                                     OON : addOrderDB[i].ON,
//                                     OOP : addOrderDB[i].OP,
//                                     OTP : addOrderDB[i].SUM,
//                                     ONU : addOrderDB[i].NUM,
//                                 });
//                             }
//                         };
//                         if(point) {
//                             await Company.update({"_id" : company._id}, {$inc : { SPO : point }});
//                         }
//                         res.clearCookie('shop');
//                         res.send({ result : "success", message : "일반 결제 성공" });
//                         break;
//                     case "cancelled": // 결제 취소
//                         res.send({ result : "cancelled", message : "결제 취소" });
//                         break;
//                     case "failed": // 결제 실패
//                         res.send({ result : "failed", message : "결제 실패" });
//                         break;
//                 }
//             } else { // 결제 금액 불일치. 위/변조 된 결제
//                 return res.send({ result : "forgery", message : "위조된 결제시도" });
//             }
//         }
//         else {
//             const reason = "결제 실패";
            
//             const getCancelData = await axios({
//                 url: "https://api.iamport.kr/payments/cancel",
//                 method: "post",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": access_token
//                 },
//                 data: {
//                     reason,
//                     imp_uid
//                 }
//             });
//             return res.send({ result : "failed", message : "결제 실패" });
//         }
//     }
//     catch(err) {
//         console.error(err);
//         next(err);
//     }
// });

module.exports = router;