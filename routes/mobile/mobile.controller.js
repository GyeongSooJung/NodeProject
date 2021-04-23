const bcrypt = require('bcrypt');

const Worker = require('../../schemas/worker');
const Company = require('../../schemas/company');
const Car = require('../../schemas/car');
const History = require('../../schemas/history');
const Point = require('../../schemas/point')
var moment = require('moment');
const Device = require('../../schemas/device');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "OASIS";

const UNKOWN = "UNKOWN";
const NO_SUCH_DATA = "NO_SUCH_DATA";
const FAIL = "FAIL";
const TOKEN_ERROR = "TOKEN_ERROR";
const NO_POINT = "NO_POINT"

const { config, Group } = require('solapi')




exports.test = async(req, res, next) => {
    const token = req.body.token;
    console.log("token: " + token);

    try {
        jwt.verify(token, JWT_SECRET);
        next();
    }
    catch (error) {
        res.json({
            result: false,
            error: TOKEN_ERROR,
        });
    }

};

/// Worker 관련
exports.findWorker = async(req, res) => {
    const EM = req.body.email;
    const worker = await Worker.findOne({ EM });
    console.log(worker);
    res.json({
        result: (worker != null) ? true : false,
    });
};

// 로그인 시도
exports.signIn = async(req, res) => {
    const { type, id, email } = req.body;

    if (type == "GOOGLE") {
        var worker = await Worker.findOne({ "GID": id, "EM": email });
        if (worker != null) {
            // 토큰 생성
            const token = jwt.sign({
                id: worker._id,
            }, JWT_SECRET, {
                expiresIn: "1d",
            });

            await Worker.where({ _id: worker._id }).update({ UA: Date.now() });
            return res.json({
                result: true,
                data: JSON.stringify(worker),
                token,
            });
        }
        else {
            return res.json({
                result: false,
                error: NO_SUCH_DATA,
            });
        }
    }
    res.json({
        result: false,
        error: UNKOWN,
    });

};

// 회원 가입
exports.signUp = async(req, res) => {
    try {
        const { CID, WN, PN, GID, EM, PU } = req.body;

        var result = await Worker.create({ CID, WN, PN, GID, EM, PU });
        console.log(result);

        res.json({
            result: true,
        });
    }
    catch (exception) {
        console.log(exception);
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 회원 정보 수정
exports.updateWorkerInfo = async(req, res) => {
    try {
        const { _id, WN, PN, AU } = req.body;

        var result = await Worker.where({ _id }).updateOne({ WN, PN, AU, UA: Date.now() });
        console.log(result);

        res.json({
            result: true,
        });

    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 회원 탈퇴
exports.withdrawal = async(req, res) => {
    try {
        const { _id, EM } = req.body;

        var result = await Worker.remove({ _id, EM });
        console.log(result);

        res.json({
            result: true,
        });
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

/// 회사 정보 관련

// 회사 검색
exports.findCompanyByID = async(req, res) => {
    try {
        const { _id } = req.body;

        var company = await Company.findOne({ _id });
        if (company != null) {
            return res.json({
                result: true,
                data: JSON.stringify(company),
            });
        }
        else {

            res.json({
                result: false,
                error: NO_SUCH_DATA,
            });
        }
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};


// 회사들 검색
exports.fineCompanies = async(req, res) => {
    try {
        const { CNU, CNA } = req.body;

        var companies;
        if (CNU != null) {
            companies = await Company.find({ CNU }, {
                NA: 1,
                CNU: 1,
                CNA: 1,
                PN: 1,
                MN: 1,
            });
        }
        else if (CNA != null) {
            companies = await Company.find({ CNA: { $regex: CNA, $options: "$i" } }, {
                NA: 1,
                CNU: 1,
                CNA: 1,
                PN: 1,
                MN: 1,
            });
        }

        console.log(companies.length);
        if (companies.length >= 1) {
            return res.json({
                result: true,
                dataList: companies,
            });
        }
        else {

            res.json({
                result: false,
                error: NO_SUCH_DATA,
            });
        }
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 회사(사업주) 비밀번호 확인
exports.confirmConpanyPW = async(req, res) => {
    try {
        const { CNU, PW } = req.body;

        var company = await Company.findOne({ _id: CNU });

        if (company != null) {
            if (bcrypt.compareSync(PW, company.PW)) {
                return res.json({
                    result: true,
                });
            }

        }

        return res.json({
            result: false,
            error: FAIL,
        });


    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

/// 차량 정보 관련

// 차량 등록
exports.registerCar = async(req, res) => {
    try {
        const { CID, CC, CN, SN } = req.body;

        var result = await Car.create({ CID, CC, CN, SN });
        console.log(result);

        res.json({
            result: true,
        });
    }
    catch (exception) {
        console.log(exception);
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 회사(사업주) 소유의 차량 조회
exports.findCarByComID = async(req, res) => {
    try {
        const { CID } = req.body;

        var cars = await Car.find({ CID });
        if (cars != null) {
            return res.json({
                result: true,
                dataList: cars,
            });
        }
        else {

            res.json({
                result: false,
                error: NO_SUCH_DATA,
            });
        }
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 차량 정보 수정
exports.updateCar = async(req, res) => {
    try {
        const { _id, CC, CN, SN } = req.body;

        var result = await Car.where({ _id }).updateOne({ CC, CN, SN, UA: Date.now() });
        console.log(result);

        res.json({
            result: true,
        });

    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 소독기 삭제
exports.deleteCar = async(req, res) => {
    try {
        const { _id, CN } = req.body;

        var result = await Car.remove({ _id, CN });
        console.log(result);

        res.json({
            result: true,
        });
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

/// 소독 공정 관련
exports.createHistory = async(req, res) => {
    try {
        console.log(req.body);
        const { WID, DID, CID, VID, ET, PD, RC, WNM, CNM, DNM, DNN, MP, FP, VER, RD } = req.body;

        var result = await History.create({ WID, DID, CID, VID, ET, PD, RC, WNM, CNM, DNM, DNN, MP, FP, VER, RD });
        console.log(result);

        res.json({
            result: true,
            data: result._id,
        });
    }
    catch (exception) {
        console.log(exception);
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 히스토리 리스트 조회
exports.findHistories = async(req, res) => {
    try {
        const { CID, SP, NOP } = req.body;

        var histories = await History.find({ CID }, { PD: false }).skip(SP * NOP).limit(NOP).sort({ CA: -1 });
        if (histories != null) {
            return res.json({
                result: true,
                dataList: histories,
            });
        }
        else {

            res.json({
                result: false,
                error: NO_SUCH_DATA,
            });
        }
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 히스토리 조회
exports.findHistory = async(req, res) => {
    try {
        const { _id } = req.body;

        var history = await History.findOne({ _id });
        if (history != null) {
            return res.json({
                result: true,
                data: JSON.stringify(history),
            });
        }
        else {

            res.json({
                result: false,
                error: NO_SUCH_DATA,
            });
        }
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

/// 소독기 장비 관련

exports.registerDevice = async(req, res) => {
    try {
        const { CID, MD, MAC, NN, VER } = req.body;

        var result = await Device.create({ CID, MD, MAC, NN, VER });
        console.log(result);

        res.json({
            result: true,
        });
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};
exports.findDevices = async(req, res) => {
    try {
        const { CID } = req.body;

        var devices = await Device.find({ CID });
        if (devices != null) {
            return res.json({
                result: true,
                dataList: devices,
            });
        }
        else {
            res.json({
                result: false,
                error: NO_SUCH_DATA,
            });
        }
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 소독기 장비의 닉네임 변경
exports.updateDevice = async(req, res) => {
    try {
        const { _id, NN } = req.body;

        var result = await Device.where({ _id }).updateOne({ NN, UA: Date.now() });
        console.log(result);

        res.json({
            result: true,
        });

    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

// 소독기 삭제
exports.deleteDevice = async(req, res) => {
    try {
        const { _id, MAC } = req.body;

        var result = await Device.remove({ _id, MAC });
        console.log(result);

        res.json({
            result: true,
        });
    }
    catch (exception) {
        res.json({
            result: false,
            error: UNKOWN,
        });
    }
};

/// 히스토리 관련

exports.root = (req, res) => {
    var tz = moment.tz.guess();
    console.log(tz);
    res.json({
        result: "hello",
    });
};

// SMS 관련

exports.registerSMS = async(req, res) => {
    try {
        
            const { _id, num } = req.body;
            
            const historyid = _id;
            const number = num;
            
            let apiSecret = process.env.sol_secret;
            let apiKey = process.env.sol_key;
      
            const moment = require('moment')
            const nanoidGenerate = require('nanoid/generate')
            const generate = () => nanoidGenerate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32)
            const HmacSHA256 = require('crypto-js/hmac-sha256')
            const fs = require('fs')
            const path = require('path')
      
            const date = moment.utc().format()
            const salt = generate()
            const hmacData = date + salt
            const signature = HmacSHA256(hmacData, apiSecret).toString()
            const autori = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`
        
            var request = require('request');
           
            
            const historyone = await History.findOne({'_id' : historyid});
            const companyone = await Company.findOne({'_id' : historyone.CID})
            var companypoint = companyone.SPO;
            
            if(companypoint > 0) {
            
            var options = {
              headers: {
                Authorization:
                  autori,'Content-Type': 'application/json'
              },
              body: {
                message: {
                  to: num,
                  from: '16443486',
                  text: '안녕하세요. ' + companyone.CNA + '입니다. 소독이 완료되었습니다. 아래 링크로 확인해주세요 www.cleanoasis.net/publish?HID=' + historyid,
                  type: "SMS"
                },
              },
              method: 'POST',
              json: true,
              url: 'http://api.solapi.com/messages/v4/send'
            };
            
            
             request(options, function(error, response, body) {
              if (error) throw error;
              console.log('result :', body);
            });     
                  
              console.log(companypoint);
            //  companypoint = companypoint - 20;
              console.log(companypoint);
                  
                const companyone =  await Company.where({'_id' : historyone.CID})
                .updateMany({ "SPO" : companypoint }).setOptions({runValidators : true})
                .exec();
            }
            
            else {
                res.json({
                result: false,
                error: UNKOWN,
                });
            }
        
        
        }
        catch (exception) {
            res.json({
                result: false,
                error: UNKOWN,
            });
        }
};

exports.registerKAKAO = async(req, res) => {
    var request = require('request');
    try {
        
            const { _id, num } = req.body;
            
            const historyid = _id;
            const number = num;
            
            let apiSecret = process.env.sol_secret;
            let apiKey = process.env.sol_key;
            
            const { config, Group, msg } = require('solapi');
           
            
            const historyone = await History.findOne({'_id' : historyid});
            var companyone = await Company.findOne({'_id' : historyone.CID});
            var companypoint = companyone.SPO;
            
            
            
            if(companypoint > 0) {
                
                config.init({ apiKey, apiSecret })
                
                var fn = async function send (params = {}) {
                    try {
                      const response = await Group.sendSimpleMessage(params);
                      const pointone = await Point.insertMany({
                        "CID": companyone._id,
                        "PN": "알림톡 전송",
                        "PO": 50,
                        "MID" : response.messageId,
                        "WNM" : historyone.WNM,
                      });
                      console.log(pointone);
                    
                      console.log(companypoint);
                      companypoint = companypoint - 50;
                      console.log(companypoint);
                    
                      await Company.where({ '_id': historyone.CID })
                        .update({ "SPO": companypoint }).setOptions({ runValidators: true })
                        .exec();
                      
                    } catch (e) {
                      console.log(e);
                    }
                  }
                  
                  const params = {
                    autoTypeDetect: true,
                    text: companyone.CNA + "에서 소독이 완료되었음을 알려드립니다.자세한 사항은 아래 링크에서 확인 가능합니다 (미소)",
                    to: number, // 수신번호 (받는이)
                    from: '16443486', // 발신번호 (보내는이)
                    type: 'ATA',
                    kakaoOptions: {
                      pfId: 'KA01PF210319072804501wAicQajTRe4',
                      templateId: 'KA01TP210319074611283wL0AjgZVdog',
                            buttons: [{
                              buttonType: 'WL',
                              buttonName: '확인하기',
                              linkMo: process.env.IP + '/publish?cat=1&hid=' + historyid,
                              linkPc: process.env.IP + '/publish?cat=1&hid=' + historyid
                            }]
                    }
                  }
                  
                  fn(params)
            }
            else {
                res.json({
                result: false,
                error: NO_POINT,
                });
            }
        
        
        }
        catch (exception) {
            res.json({
                result: false,
                error: UNKOWN,
            });
        }
};