const Worker = require('../../schemas/worker');
const Company = require('../../schemas/company');

const UNKOWN = "UNKOWN";
const NO_SUCH_DATA = "NO_SUCH_DATA";

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


}

// 회사 검색
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

exports.root = (req, res) => {
    res.json({
        result: "hello",
    });
};
