const Worker = require('../../schemas/worker');
const Company = require('../../schemas/company');

const UNKOWN = "UNKOWN";
const NO_SUCH_DATA = "NO_SUCH_DATA";

// Worker 관련
exports.findWorker = async(req, res) => {
    const email = req.body.email;
    const worker = await Worker.findOne({ "EM": email });
    console.log(worker);
    res.json({
        result: (worker != null) ? true : false,
    });
};

exports.signIn = async(req, res) => {
    const { type, id, email } = req.body;

    if (type == "GOOGLE") {
        var worker = await Worker.findOne({ "GID": id, "EM": email });
        if (worker != null) {
            return res.json({
                result: true,
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


exports.fineCompanies = async(req, res) => {
    try {
        const { CNU, CNA } = req.body;
        var companies;
        if (CNU != null) {
            companies = await Company.find({ CNU }, {
                _id: 0,
                NA: 1,
                CNU: 1,
                CNA: 1
            });
        }
        else if (CNA != null) {
            companies = await Company.find({ CNA }, {
                _id: 0,
                NA: 1,
                CNU: 1,
                CNA: 1
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
