const bcrypt = require('bcrypt');

const Worker = require('../../schemas/worker');
const Company = require('../../schemas/company');
const Car = require('../../schemas/car');
const History = require('../../schemas/history');
var moment = require('moment');
const Device = require('../../schemas/device');

const UNKOWN = "UNKOWN";
const NO_SUCH_DATA = "NO_SUCH_DATA";
const FAIL = "FAIL";


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
            await Worker.where({ _id: worker._id }).update({ "UA": moment().add('9','h').format('YYYY-MM-DD hh:mm:ss') });
            return res.json({
                result: true,
                data: JSON.stringify(worker),
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
        var result = await Worker.where({ _id }).update({ WN, PN, AU, UA: moment().add('9','h').format('YYYY-MM-DD hh:mm:ss') });
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

/// 소독 공정 관련
exports.createHistory = async(req, res) => {
    try {
        console.log(req.body);
        const { WID, DID, CID, VID, ET, PD, RC, WNM, CNM, DNM, DNN, MP, FP, VER, RD } = req.body;

        var result = await History.create({ WID, DID, CID, VID, ET, PD, RC, WNM, CNM, DNM, DNN, MP, FP, VER, RD });
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
        const {_id } = req.body;

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
    res.json({
        result: "hello",
    });
};
