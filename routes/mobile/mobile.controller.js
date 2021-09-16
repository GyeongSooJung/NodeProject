const bcrypt = require('bcrypt');

const Schema = require('../../schemas/schemas');
const { History, Device, Worker, Company, Car, Point } = Schema;
const { modelQuery } = require('../../schemas/query');
const { COLLECTION_NAME, QUERY } = require('../../const/consts');

const jwt = require('jsonwebtoken');
const JWT_SECRET = "OASIS";
const { config, Group } = require('solapi');

const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;

const ERR_CODE = {
   UNKNOWN: "UNKNOWN",
   NO_SUCH_DATA: "NO_SUCH_DATA",
   FAIL: "FAIL",
   TOKEN_ERROR: "TOKEN_ERROR",
   NO_POINT: "NO_POINT",
};

// const COLLECTION_NAME = {
//    "History": "History",
//    "Worker": "Worker",
// };
// const COLLECTIONS = {
//    "History": History,
//    "Worker": Worker,
// };



const HISTORY = {
   "workerID": "WID",
   "deviceID": "DID",
   "companyID": "CID",
   "vehicleID": "VID",
   "workerName": "WNM",
   "carNumber": "CNM",
   "deviceName": "DNM",
   "deviceNickname": "DNN",
   "fwVersion": "VER",
   "endTime": "ET",
   "processData": "PD",
   "maximumPPM": "MP",
   "finishPPM": "FP",
   "resultCode": "RC",
   "resultDetail": "RD",
   "course": "COS",
   "createAt": "CA"
};

const CMD = {
   // "create": "/create",
   "insertOne": "/insertone",
   "findOne": "/findone",
   "find": "/find",
   "updateOne": "/updateone",
   "updateMany": "/updatemany",
   "deleteOne": "/deleteone",
   "deleteMany": "/deletemany"
};



exports.tokenVerification = async(req, res, next) => {
   if (req.method != "POST") {
      console.log("Wrong request method");
      throw new Error("The method is not support");
   }

   // 향후 바디에서 토큰을 제거하고 해더 토큰을 사용
   var token = req.body.token;
   if (token == null) {
      token = req.headers.token;
   }

   try {
      jwt.verify(token, JWT_SECRET);
      delete req.body.token;
      next();
   }
   catch (error) {
      res.json({
         result: false,
         error: ERR_CODE.TOKEN_ERROR,
      });
   }
};

async function insertOneDocument(req, res, next, collection) {
   console.log("[insertOneDocument]");
   var Collection = collection.prototype.schema.options.collection;
   var doc = req.body;
   doc.CA = Date.now();
   delete doc._id;
   var postJob; // 추가 작업용 함수포인터


   switch (collection) {
      case History:
         // 장비의 사용횟수 증가
         postJob = async function() {
            await Device.where({ _id: doc[HISTORY.deviceID] }).updateOne({ $inc: { UN: 1 } });
         };
         break;
      case Car:
         break;
      case Device:
         break;
      default:
         throw new Error("Wrong request");
   }

   const resResult = (result) => {
      if (postJob != null) {
         postJob();
      }
      res.json({
         result: true,
         data: result._id,
      });
   };

   await modelQuery(QUERY.Create, Collection, doc, {}).then(resResult).catch(next);


   // 기존코드
   // switch (collection) {
   //    case COLLECTIONS.History:
   //       // 장비의 사용횟수 증가
   //       postJob = async function() {
   //          await Device.where({ _id: doc[HISTORY.deviceID] }).updateOne({ $inc: { UN: 1 } });
   //       };
   //       break;
   //    default:
   //       throw new Error("Wrong request");
   // }

   // const resResult = (result) => {
   //    if (postJob != null) {
   //       postJob();
   //    }
   //    res.json({
   //       result: true,
   //       data: result._id,
   //    });
   // };

   // await Collection.create(doc).then(resResult).catch(next);

}

async function findOneDecument(req, res, next, collection) {
   console.log("[findOneDecument]");
   var Collection = collection.prototype.schema.options.collection;
   var doc = req.body;

   switch (collection) {
      case History:
         break;
      default:
         throw new Error("Wrong request");
   }

   const resResult = (document) => {
      res.json({
         result: true,
         data: JSON.stringify(document),
      });
   };

   await modelQuery(QUERY.Findone, Collection, doc, {}).then(resResult).catch(next);
}

async function findDecuments(req, res, next, collection) {
   console.log("[findDecuments]");

   var postJob; // 추가 작업용 함수포인터
   var searchOption = {};
   var projectOption = {};
   var startPage = (req.body.SP == null) ? 0 : req.body.SP;
   var nowPage = (req.body.NOP == null) ? 0 : req.body.NOP;
   var Collection = collection.prototype.schema.options.collection;
   switch (collection) {
      case History:
         searchOption.CNU = req.body.CNU;
         projectOption.PD = false;
         break;
      case Worker:
         searchOption.CID = req.body.CID;
         break;
      case Car:
         searchOption.CNU = req.body.CNU;
         break;
      default:
         throw new Error("Wrong request");
   }

   const resResult = (documents) => {
      res.json({
         result: true,
         dataList: documents,
      });
   };

   await modelQuery(QUERY.Find, Collection, { searchOption: searchOption, projectOption: projectOption }, { skip: startPage * nowPage, limit: nowPage, sort: { CA: -1 } })
      .then(resResult).catch(next);

   // 기존코드
   // const resResult = (documents) => {
   //    if (postJob != null) {
   //       postJob();
   //    }
   //    res.json({
   //       result: true,
   //       dataList: documents,
   //    });
   // };


   // await Collection.find(searchOption, projectOption).skip(startPage * nowPage).limit(nowPage).sort({ CA: -1 }).then(resResult).catch(next);


}

async function updateOneDecument(req, res, next, collection) {
   console.log("[updateOneDecument]");
   // var Collection = collection;
   var Collection = collection.prototype.schema.options.collection;
   console.log(Collection);
   var doc = req.body;
   console.log(doc);
   var postJob; // 추가 작업용 함수포인터
   var _id = doc._id;
   doc.UA = Date.now();
   delete doc._id;
   console.log(doc);

   const resResult = (document) => {
      if (postJob != null) {
         postJob();
      }
      res.json({
         result: true,
         data: JSON.stringify(document),
      });
   };

   await modelQuery(QUERY.Updateone, Collection, { where: { _id }, update: doc }, {}).catch(next);
   await modelQuery(QUERY.Findone, Collection, { _id }, {}).then(resResult).catch(next);
}

async function deleteOneDecument(req, res, next, collection) {
   console.log("[deleteOneDecument]");
   var Collection = collection.prototype.schema.options.collection;
   console.log(Collection);

   var doc = req.body;
   console.log(doc);
   var postJob; // 추가 작업용 함수포인터


   const resResult = (document) => {
      if (postJob != null) {
         postJob();
      }
      res.json({
         result: true,
         data: JSON.stringify(document),
      });
   };
   await modelQuery(QUERY.Remove, Collection, doc, {}).then(resResult).catch(next);
}

exports.historyRoot = (req, res, next) => {
   console.log("historyRoot");
   switch (req.path) {
      case CMD.create:
         insertOneDocument(req, res, next, History);
         break;
      case CMD.insertOne:
         insertOneDocument(req, res, next, History);
         break;
      case CMD.findOne:
         findOneDecument(req, res, next, History);
         break;
      case CMD.find:
         findDecuments(req, res, next, History);
         break;
         // 임시 라우팅, 향후 삭제
      case "/findOne": // 향후 삭제
         findOneDecument(req, res, next, History);
         break;
      default:
         next();
   }
};

exports.workerRoot = (req, res, next) => {
   console.log("[workerRoot]");
   switch (req.path) {
      case CMD.findOne:
         findOneDecument(req, res, next, Worker);
         break;
      case CMD.find:
         findDecuments(req, res, next, Worker);
         break;
      case CMD.updateOne:
         updateOneDecument(req, res, next, Worker);
         break;
      case CMD.deleteOne:
         deleteOneDecument(req, res, next, Worker);
         break;
      default:
         next();
   }
};

exports.deviceRoot = (req, res, next) => {
   console.log("[deviceRoot]");
   switch (req.path) {
      // case CMD.findOne:
      //    findOneDecument(req, res, next, Device);
      //    break;
      // case CMD.find:
      //    findDecuments(req, res, next, Device);
      //    break;
      case CMD.insertOne:
         insertOneDocument(req, res, next, Device);
         break;
      case CMD.updateOne:
         updateOneDecument(req, res, next, Device);
         break;
      case CMD.deleteOne:
         deleteOneDecument(req, res, next, Device);
         break;
      default:
         next();
   }
};

exports.carRoot = (req, res, next) => {
   console.log("[carRoot]");
   switch (req.path) {
      // case CMD.findOne:
      //    findOneDecument(req, res, next, Device);
      //    break;
      // case CMD.find:
      //    findDecuments(req, res, next, Device);
      //    break;

      case CMD.insertOne:
         insertOneDocument(req, res, next, Car);
         break;
      case CMD.find:
         findDecuments(req, res, next, Car);
         break;
      case CMD.updateOne:
         updateOneDecument(req, res, next, Car);
         break;
      case CMD.deleteOne:
         deleteOneDecument(req, res, next, Car);
         break;
      default:
         next();
   }
};

exports.errorHandler = (err, req, res, next) => {
   console.log("\n\nError Handler: " + err.message);
   res.json({
      result: false,
      error: ERR_CODE.UNKNOWN,
      data: err.message,
   });
};



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

      var worker = await Worker.findOneAndUpdate({ "GID": id, "EM": email }, { UA: Date.now() }, { new: true });


      if (worker == null) {
         return res.json({
            result: false,
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }



      var resource = await Worker.aggregate([{
            $match: {
               "_id": worker._id
               // "CNU":worker.CNU
            }
         },
         // { "$addFields": { "comObjId": { "$toObjectId": "$CID" } } },
         {
            $lookup: {
               from: COLLECTION_NAME.Worker,
               localField: "_id",
               foreignField: "_id",
               as: "worker"
            }
         },
         { "$unwind": "$worker" },
         {
            $lookup: {
               from: COLLECTION_NAME.Company,
               localField: "CNU",
               foreignField: "CNU",
               as: "company"
            }
         },
         { "$unwind": "$company" },
         {
            $lookup: {
               from: COLLECTION_NAME.Car,
               localField: "CNU",
               foreignField: "CNU",
               as: "cars"
            }
         },
         {
            $lookup: {
               from: COLLECTION_NAME.Device,
               localField: "CNU",
               foreignField: "CNU",
               as: "devices"
            }
         },
      ]);

      if (worker != null) {
         // 토큰 생성
         const token = jwt.sign({
            id: worker._id,
         }, JWT_SECRET, {
            expiresIn: "1d",
         });


         return res.json({
            result: true,
            data: JSON.stringify(resource[0]),
            // data:resource[0],
            token,
            // carUA
         });


      }
      else {
         return res.json({
            result: false,
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }
   }
   res.json({
      result: false,
      error: ERR_CODE.UNKNOWN,
   });

};

// 회원 가입
exports.signUp = async(req, res) => {
   try {
      const { CNU, WN, PN, GID, EM, PU } = req.body;

      var result = await Worker.create({ CNU, WN, PN, GID, EM, PU });
      console.log(result);

      res.json({
         result: true,
      });
   }
   catch (exception) {
      console.log(exception);
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
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
         error: ERR_CODE.UNKNOWN,
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
         error: ERR_CODE.UNKNOWN,
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
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};


// 회사들 검색
exports.fineCompanies = async(req, res) => {
   try {
      const { CNU, CNA } = req.body;

      var companies;
      if (CNU != null) {
         companies = await Company.find({ CNU: { $regex: CNU, $options: "$i" } }, {
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
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
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
         error: ERR_CODE.FAIL,
      });


   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
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
      var ObjectId = Mongoose.Types.ObjectId;
      // console.log(ObjectId(CID));
      await Company.where({ "_id": ObjectId(CID) })
         .updateOne({ "CUA": Date.now() }).setOptions({ runValidators: true })
         .exec();
      res.json({
         result: true,
      });
   }
   catch (exception) {
      console.log(exception);
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
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
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};

// 차량 정보 수정
exports.updateCar = async(req, res) => {
   try {
      const { _id, CC, CN, SN } = req.body;
      var result = await Car.where({ _id }).updateOne({ CC, CN, SN, UA: Date.now() });
      console.log("result : " + result);
      var ObjectId = Mongoose.Types.ObjectId;
      var car = await Car.findOne({ "_id": ObjectId(_id) });
      await Company.where({ "_id": ObjectId(car.CID) })
         .updateOne({ "CUA": Date.now() }).setOptions({ runValidators: true })
         .exec();

      res.json({
         result: true,
      });

   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};

// 차량 삭제
exports.deleteCar = async(req, res) => {
   try {
      const { _id, CN } = req.body;


      var ObjectId = Mongoose.Types.ObjectId;
      var car = await Car.findOne({ "_id": ObjectId(_id) });
      await Company.where({ "_id": car.CID })
         .updateOne({ "CUA": Date.now() }).setOptions({ runValidators: true })
         .exec();

      var result = await Car.remove({ _id, CN });
      console.log("result : " + result);

      res.json({
         result: true,
      });
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};


/*************************************
 * 공정 히스토리 관련
 *************************************/





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
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};

// 히스토리 조회
exports.findHistory = async(req, res) => {
   console.log("[findHistory]");
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
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};

/// 소독기 장비 관련

exports.registerDevice = async(req, res) => {
   try {
      const { CID, MD, MAC, NN, VER } = req.body;
      const UN = 0;

      var result = await Device.create({ CID, MD, MAC, NN, VER, UN });
      console.log(result);

      res.json({
         result: true,
      });
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
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
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }
   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
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
         error: ERR_CODE.UNKNOWN,
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
         error: ERR_CODE.UNKNOWN,
      });
   }
};

// 소독기 검색
exports.findOneDevice = async(req, res) => {
   try {
      const { MAC, _id } = req.body;
      var query = new Object();
      if (MAC != null) query.MAC = MAC;
      if (_id != null) query._id = _id;
      console.log(query);

      const device = await Device.findOne(query);
      if (device) {
         res.send({
            result: true,
            data: JSON.stringify(device),
         });
      }
      else {
         res.send({
            result: false,
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }

   }
   catch (exception) {
      console.log(exception);
      res.send({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};



// 소독기 검색
exports.findOneDevice = async(req, res) => {
   try {
      const { MAC, _id } = req.body;
      var query = new Object();
      if (MAC != null) query.MAC = MAC;
      if (_id != null) query._id = _id;
      console.log(query);

      const device = await Device.findOne(query);
      if (device) {
         res.send({
            result: true,
            data: JSON.stringify(device),
         });
      }
      else {
         res.send({
            result: false,
            error: ERR_CODE.NO_SUCH_DATA,
         });
      }

   }
   catch (exception) {
      console.log(exception);
      res.send({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
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


      const historyone = await History.findOne({ '_id': historyid });
      const companyone = await Company.findOne({ '_id': historyone.CID })
      var companypoint = companyone.SPO;

      if (companypoint > 0) {

         var options = {
            headers: {
               Authorization: autori,
               'Content-Type': 'application/json'
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

         const companyone = await Company.where({ '_id': historyone.CID })
            .updateMany({ "SPO": companypoint }).setOptions({ runValidators: true })
            .exec();
      }

      else {
         res.json({
            result: false,
            error: ERR_CODE.UNKNOWN,
         });
      }


   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
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


      const historyone = await History.findOne({ '_id': historyid });
      var companyone = await Company.findOne({ 'CNU': historyone.CNU });
      var companypoint = companyone.SPO;



      if (companypoint > 0) {

         config.init({ apiKey, apiSecret })

         var fn = async function send(params = {}) {
            try {
               const response = await Group.sendSimpleMessage(params);
               const pointone = await Point.insertMany({
                  "CNU": companyone.CNU,
                  "PN": "알림톡 전송",
                  "PO": 50,
                  "MID": response.messageId,
                  "WNM": historyone.WNM,
               });
               console.log(pointone);

               console.log(companypoint);
               companypoint = companypoint - 50;
               console.log(companypoint);

               await Company.where({ 'CNU': historyone.CNU })
                  .update({ "SPO": companypoint }).setOptions({ runValidators: true })
                  .exec();

            }
            catch (e) {
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
            error: ERR_CODE.NO_POINT,
         });
      }


   }
   catch (exception) {
      res.json({
         result: false,
         error: ERR_CODE.UNKNOWN,
      });
   }
};
