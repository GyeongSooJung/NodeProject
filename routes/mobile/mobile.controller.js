console.log("우헤해ㅔ");

const bcrypt = require('bcrypt');

const Worker = require('../../schemas/worker');
const Company = require('../../schemas/company');
const Car = require('../../schemas/car');
const History = require('../../schemas/history');
var moment = require('moment');

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
        const { WID, DID, CID, VID, ET, PD, RC } = req.body;

        var result = await History.create({ WID, DID, CID, VID, ET, PD, RC });
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

exports.root = (req, res) => {
    res.json({
        result: "hello",
    });
};
